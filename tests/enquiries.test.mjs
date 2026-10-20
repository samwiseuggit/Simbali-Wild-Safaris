import test from 'node:test';
import assert from 'node:assert/strict';
import { createEnquiryHandler } from '../src/lib/enquiries.mjs';

const recipient = 'info@simbaliwildsafaris.com';
const config = { SMTP_HOST: 'smtp.example.com', SMTP_PORT: '587', SMTP_USER: 'website@example.com', SMTP_PASS: 'test-only-password', SMTP_FROM: 'website@example.com' };
function request(fields = {}, origin = 'https://simbaliwildsafaris.com') {
  return new Request('https://simbaliwildsafaris.com/api/enquiry', {
    method: 'POST', headers: { Origin: origin },
    body: new URLSearchParams({ formType: 'journey', name: 'Website Test', email: 'visitor@example.com', destination: 'Kenya', travelers: '2', extraordinary: 'A private wildlife safari.', ...fields }),
  });
}
function setup(sendMail = async () => ({ accepted: [recipient] }), env = config) {
  const messages = [];
  const handler = createEnquiryHandler({ env, sendMail: async (mail, settings) => { messages.push({mail, settings}); return sendMail(mail, settings); }, logger: { error() {} } });
  return { handler, messages };
}

test('journey enquiry goes only to the fixed recipient, with visitor in Reply-To', async () => {
  const {handler, messages} = setup();
  const response = await handler(request({to:'attacker@example.com', dates:'July 2027', investment:'$15,000–$25,000'}), 'client-a');
  assert.equal(response.status, 200);
  assert.equal((await response.json()).ok, true);
  assert.equal(messages[0].mail.to, recipient);
  assert.equal(messages[0].mail.replyTo, 'visitor@example.com');
  assert.equal(messages[0].mail.from.address, config.SMTP_FROM);
  assert.match(messages[0].mail.text, /July 2027/);
  assert.match(messages[0].mail.text, /\$15,000/);
  assert.match(messages[0].mail.text, /A private wildlife safari/);
});

test('legacy contact form includes the full name and message', async () => {
  const {handler, messages} = setup();
  const response = await handler(request({formType:'contact', name:'', firstName:'Sam', lastName:'Test', message:'This is a contact form test.'}), 'client-a');
  assert.equal(response.status, 200);
  assert.match(messages[0].mail.text, /Sam Test/);
  assert.match(messages[0].mail.text, /contact form test/);
});

for (const [label, fields] of [
  ['invalid email', {email:'not-an-email'}],
  ['injected address', {email:'visitor@example.com\r\nBcc: attacker@example.com'}],
  ['missing name', {name:''}],
  ['invalid traveler count', {travelers:'-1'}],
  ['oversized message', {extraordinary:'x'.repeat(5001)}],
  ['honeypot', {website:'spam.example.com'}],
]) test(`${label} is rejected before sending`, async () => {
  const {handler,messages}=setup();
  assert.equal((await handler(request(fields), 'client-a')).status, 400);
  assert.equal(messages.length, 0);
});

test('foreign origins and oversized request bodies are rejected', async () => {
  const {handler,messages}=setup();
  assert.equal((await handler(request({}, 'https://unrelated.example'), 'client-a')).status, 403);
  assert.equal((await handler(request({extraordinary:'x'.repeat(30000)}), 'client-a')).status, 413);
  assert.equal(messages.length, 0);
});

test('missing SMTP configuration reports failure rather than a false thank-you', async () => {
  const {handler,messages}=setup(undefined, {});
  const response=await handler(request(),'client-a');
  assert.equal(response.status,503);
  assert.equal((await response.json()).ok,false);
  assert.equal(messages.length,0);
});

test('SMTP rejection and network failure never report success or expose credentials', async () => {
  for(const sender of [async()=>({accepted:[],rejected:[recipient]}), async()=>{throw new Error('private password '+config.SMTP_PASS);}]) {
    const {handler}=setup(sender);
    const response=await handler(request(),'client-a');
    assert.equal(response.status,502);
    const text=await response.text();
    assert.equal(JSON.parse(text).ok,false);
    assert.ok(!text.includes(config.SMTP_PASS));
  }
});

test('rapid repeat submissions are limited', async () => {
  const {handler,messages}=setup();
  for(let i=0;i<5;i++) assert.equal((await handler(request(),'client-a')).status,200);
  assert.equal((await handler(request(),'client-a')).status,429);
  assert.equal(messages.length,5);
});
