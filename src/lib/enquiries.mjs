import { randomUUID } from 'node:crypto';

const RECIPIENT = 'info@simbaliwildsafaris.com';
const MAX_BODY = 24 * 1024;
const EMAIL = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;
const fields = {
  destination: ['Destination', 200], dates: ['Travel dates', 200],
  travelers: ['Travelers', 10], party: ['Travel party', 200],
  occasion: ['Occasion', 500], experiences: ['Interests', 1000],
  style: ['Travel style', 200], investment: ['Investment per traveler', 200],
  extraordinary: ['What would make the journey extraordinary', 5000],
  message: ['Message', 5000],
};

class InputError extends Error {
  constructor(message, status = 400) { super(message); this.status = status; }
}

async function readForm(request) {
  const type = request.headers.get('content-type') || '';
  if (!/^(multipart\/form-data|application\/x-www-form-urlencoded)\b/i.test(type)) {
    throw new InputError('Please submit the enquiry form.', 415);
  }
  if (Number(request.headers.get('content-length')) > MAX_BODY) throw new InputError('Your enquiry is too long.', 413);
  const reader = request.body?.getReader();
  if (!reader) throw new InputError('Please complete the enquiry form.');
  const chunks = [];
  let length = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    length += value.byteLength;
    if (length > MAX_BODY) { await reader.cancel(); throw new InputError('Your enquiry is too long.', 413); }
    chunks.push(value);
  }
  const bytes = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
  try {
    return await new Request(request.url, { method: 'POST', headers: { 'Content-Type': type }, body: bytes }).formData();
  } catch { throw new InputError('Please check the enquiry form and try again.'); }
}

function value(form, key, limit) {
  const raw = form.get(key);
  if (raw != null && typeof raw !== 'string') throw new InputError('File attachments are not supported.');
  const text = (raw || '').trim();
  if (text.length > limit || /[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/.test(text)) throw new InputError('Please shorten your enquiry and check its contents.');
  return text;
}

function validate(form) {
  if (value(form, 'website', 200)) throw new InputError('Unable to accept this enquiry. Please contact us by email.');
  const type = value(form, 'formType', 20);
  if (!['journey', 'contact'].includes(type)) throw new InputError('Please use the enquiry form on our website.');
  const name = value(form, 'name', 120) || `${value(form, 'firstName', 60)} ${value(form, 'lastName', 60)}`.trim();
  const email = value(form, 'email', 254);
  if (!name || /[\r\n]/.test(name)) throw new InputError('Please enter your name.');
  if (!EMAIL.test(email)) throw new InputError('Please enter a valid email address.');
  const details = {};
  for (const [key, [, limit]] of Object.entries(fields)) details[key] = value(form, key, limit);
  if (details.travelers && (!/^\d+$/.test(details.travelers) || Number(details.travelers) < 1 || Number(details.travelers) > 100)) throw new InputError('Please enter a traveler count between 1 and 100.');
  if (type === 'contact' && !details.message) throw new InputError('Please enter your message.');
  return { type, name, email, details };
}

export function createEnquiryHandler({ sendMail, env = process.env, logger = console, now = Date.now }) {
  const attempts = new Map();
  const reply = (ok, message, status = 200, reference) => new Response(JSON.stringify({ok, message, ...(reference ? {reference} : {})}), {
    status, headers: {'Content-Type':'application/json', 'Cache-Control':'no-store', ...(status === 429 ? {'Retry-After':'900'} : {})},
  });
  return async (request, clientKey) => {
    const origin = request.headers.get('origin');
    const allowed = new Set([new URL(request.url).origin, 'https://simbaliwildsafaris.com', 'https://www.simbaliwildsafaris.com']);
    if (origin && !allowed.has(origin)) return reply(false, 'Please submit your enquiry from our website.', 403);
    let enquiry;
    try { enquiry = validate(await readForm(request)); }
    catch (error) { return reply(false, error instanceof InputError ? error.message : 'Please check your enquiry and try again.', error instanceof InputError ? error.status : 400); }

    const port = Number(env.SMTP_PORT || 587);
    const from = env.SMTP_FROM || env.SMTP_USER || '';
    if (!env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASS || !EMAIL.test(from) || !Number.isInteger(port) || port < 1 || port > 65535) {
      return reply(false, `Online enquiries are temporarily unavailable. Please email ${RECIPIENT} or call +254 713 855 818.`, 503);
    }
    const time = now();
    for (const [key, record] of attempts) if (record.until <= time) attempts.delete(key);
    const key = clientKey || enquiry.email.toLowerCase();
    const record = attempts.get(key) || {count:0, until:time + 15 * 60 * 1000};
    if (record.count >= 5 || (!attempts.has(key) && attempts.size >= 5000)) return reply(false, 'Too many enquiries. Please try again later or email us directly.', 429);
    record.count++;
    attempts.set(key, record);

    const reference = randomUUID();
    const lines = [
      `New ${enquiry.type === 'journey' ? 'safari consultation request' : 'contact enquiry'}`,
      `Reference: ${reference}`, `Name: ${enquiry.name}`, `Email: ${enquiry.email}`, '',
      ...Object.entries(fields).filter(([key]) => enquiry.details[key]).map(([key, [label]]) => `${label}: ${enquiry.details[key]}`),
    ];
    try {
      const result = await sendMail({
        from: { name: 'Simbali Wild Safaris', address: from }, to: RECIPIENT,
        replyTo: enquiry.email, subject: 'Simbali website - new safari enquiry', text: lines.join('\n'),
        disableFileAccess: true, disableUrlAccess: true,
      }, {
        host: env.SMTP_HOST, port, secure: port === 465 || env.SMTP_SECURE === 'true',
        requireTLS: !(port === 465 || env.SMTP_SECURE === 'true'),
        auth: {user:env.SMTP_USER, pass:env.SMTP_PASS},
        connectionTimeout:10000, greetingTimeout:10000, socketTimeout:20000,
        logger:false, debug:false,
      });
      if (!result?.accepted?.some(address => typeof address === 'string' && address.toLowerCase() === RECIPIENT)) throw new Error('Recipient rejected');
      return reply(true, 'Thank you. Your enquiry has been submitted to Simbali. Our team will be in touch.', 200, reference);
    } catch (error) {
      logger.error('[simbali-enquiry] delivery failed', {reference, code: /^[A-Z0-9_]{1,30}$/.test(error?.code || '') ? error.code : 'DELIVERY_FAILED'});
      return reply(false, `We could not submit your enquiry. Please try again or email ${RECIPIENT}.`, 502);
    }
  };
}
