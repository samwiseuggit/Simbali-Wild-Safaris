import { z } from 'zod';
import { initTRPC } from '@trpc/server';
import superjson from 'superjson';

const t = initTRPC.create({ transformer: superjson });

// ===== IP BLOCKING & RATE LIMITING =====
const blockedIPs = new Set<string>();
const ipRequestCounts = new Map<string, { count: number; resetTime: number }>();
const ipHourlyCounts = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT_PER_MINUTE = 10;
const RATE_LIMIT_PER_HOUR = 50;
const BLOCK_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

function checkRateLimit(ip: string): { allowed: boolean; reason?: string } {
  if (blockedIPs.has(ip)) {
    return { allowed: false, reason: 'Your IP has been blocked due to abuse. Please try again later.' };
  }

  const now = Date.now();

  // Per-minute check
  const minuteEntry = ipRequestCounts.get(ip);
  if (!minuteEntry || now > minuteEntry.resetTime) {
    ipRequestCounts.set(ip, { count: 1, resetTime: now + 60000 });
  } else {
    minuteEntry.count++;
    if (minuteEntry.count > RATE_LIMIT_PER_MINUTE) {
      blockedIPs.add(ip);
      setTimeout(() => blockedIPs.delete(ip), BLOCK_DURATION_MS);
      return { allowed: false, reason: 'Rate limit exceeded. Your IP has been temporarily blocked.' };
    }
  }

  // Per-hour check
  const hourEntry = ipHourlyCounts.get(ip);
  if (!hourEntry || now > hourEntry.resetTime) {
    ipHourlyCounts.set(ip, { count: 1, resetTime: now + 3600000 });
  } else {
    hourEntry.count++;
    if (hourEntry.count > RATE_LIMIT_PER_HOUR) {
      blockedIPs.add(ip);
      setTimeout(() => blockedIPs.delete(ip), BLOCK_DURATION_MS);
      return { allowed: false, reason: 'Hourly rate limit exceeded. Your IP has been temporarily blocked.' };
    }
  }

  return { allowed: true };
}

// ===== GEMINI API =====
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

const SYSTEM_PROMPT = `You are Simba, the friendly AI safari planner for Simbali Wild Safaris, a luxury African safari tour company based in Nairobi, Kenya.

YOUR ROLE:
- Help users plan safari adventures across East Africa (Kenya, Tanzania, Uganda, Rwanda, Burundi)
- Provide helpful, warm, and professional responses about safaris, wildlife, destinations, and travel tips
- Guide users toward booking by suggesting they contact info@simbaliwildlisafaris.com or call +254 713 855 818

IMPORTANT RULES:
- NEVER invent specific pricing, availability, or booking confirmations
- For exact quotes, itineraries, or date-specific requests, direct users to the contact form
- Do NOT make promises about animal sightings or guarantee specific experiences
- Keep responses concise (under 150 words)
- Be warm, enthusiastic, and knowledgeable about African safaris
- If asked about non-safari topics, gently redirect to safari planning
- Available itineraries: Kenya (8-day honeymoon, 8-day family, 11-day Kenya-Tanzania family), Tanzania (8-day family, 8-day honeymoon)
- Uganda, Rwanda, Burundi itineraries are coming soon

RESPOND IN A CONCIERGE-LIKE, PROFESSIONAL BUT FRIENDLY TONE.`;

// ===== tRPC ROUTER =====
export const chatRouter = t.router({
  sendMessage: t.procedure
    .input(z.object({
      message: z.string().min(1).max(500),
    }))
    .mutation(async ({ input, ctx }) => {
      const ip = (ctx as any).req?.headers?.get('x-forwarded-for') || 'unknown';

      // Check rate limit
      const rateCheck = checkRateLimit(ip);
      if (!rateCheck.allowed) {
        return { reply: `⚠️ ${rateCheck.reason}` };
      }

      // Input sanitization
      const userMessage = input.message.trim();
      if (userMessage.length > 500) {
        return { reply: 'Your message is too long. Please keep it under 500 characters.' };
      }

      // Check for abusive content patterns
      const abusivePatterns = [
        /\b(hack|exploit|inject|sql|xss|script|ddos|spam|botnet)\b/i,
        /\b(fuck|shit|damn|bitch|asshole|cunt)\b/i,
      ];
      for (const pattern of abusivePatterns) {
        if (pattern.test(userMessage)) {
          blockedIPs.add(ip);
          setTimeout(() => blockedIPs.delete(ip), BLOCK_DURATION_MS);
          return { reply: '⚠️ Inappropriate content detected. Your IP has been temporarily blocked.' };
        }
      }

      try {
        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              { role: 'user', parts: [{ text: SYSTEM_PROMPT }] },
              { role: 'model', parts: [{ text: 'Understood. I am Simba, the AI safari planner for Simbali Wild Safaris. I will help users plan their African safari adventures.' }] },
              { role: 'user', parts: [{ text: userMessage }] },
            ],
            generationConfig: {
              maxOutputTokens: 256,
              temperature: 0.7,
            },
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('Gemini API error:', errorData);
          return { reply: "I'm sorry, I'm experiencing technical difficulties. Please contact us at info@simbaliwildlisafaris.com or call +254 713 855 818 for assistance." };
        }

        const data = await response.json();
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text ||
          "I'm sorry, I couldn't process that. Please try again or contact us at info@simbaliwildlisafaris.com";

        return { reply };
      } catch (error) {
        console.error('Chat error:', error);
        return { reply: "I'm having trouble connecting right now. Please try again later or contact us directly at info@simbaliwildlisafaris.com" };
      }
    }),
});

export type ChatRouter = typeof chatRouter;
