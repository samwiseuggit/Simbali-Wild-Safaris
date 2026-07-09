import { useState, useRef, useEffect, useCallback } from 'react';

// ===== INTENT CLASSIFICATION: GEMINI INTENTS =====
// These patterns detect GENERAL TRAVEL / SAFARI INTELLIGENCE questions
// that should go to Gemini, NOT local KB.
const geminiIntentPatterns = [
  // Distance / travel time
  /\bhow far\b/i,
  /\bdistance\b/i,
  /\bhow long\s+(?:is|does)/i,
  /\bdrive time\b/i,
  /\btravel time\b/i,
  /\bflight time\b/i,
  /\bflying time\b/i,
  /\bdriving distance\b/i,
  /\bhow many\s+(?:hours|km|kilometers|miles)\b/i,
  /\bhow many\s+days\s+(?:to|from)/i,
  // Location / geography
  /\bwhere\s+is\b/i,
  /\bwhere\s+are\b/i,
  /\blocated\b/i,
  /\blocation\s+of\b/i,
  /\bmap\b/i,
  /\bcoordinates\b/i,
  /\bregion\b/i,
  /\bprovince\b/i,
  /\bwhich\s+country\s+is\b/i,
  // Best time / seasons / weather
  /\bbest time\b/i,
  /\bwhen should\b/i,
  /\bwhen is\s+(?:the\s+)?best\b/i,
  /\bwhen\s+(?:to|can|should)\s+(?:go|visit|travel|see)\b/i,
  /\bweather\b/i,
  /\bclimate\b/i,
  /\btemperature\b/i,
  /\braining\b/i,
  /\brainy season\b/i,
  /\bdry season\b/i,
  /\bwet season\b/i,
  /\bmonth\s+(?:to|for)\b/i,
  /\bwhat\s+(?:month|season)\b/i,
  // Wildlife / animals (intelligence, not package)
  /\bwhat\s+wildlife\b/i,
  /\bwhat\s+animals\b/i,
  /\bwhich\s+animals\b/i,
  /\bwildlife\s+(?:can|will|do)\b/i,
  /\banimals\s+(?:can|will|do)\b/i,
  /\bexpect\s+to\s+see\b/i,
  /\bsee\s+(?:any|the)\s+animals\b/i,
  /\bkind\s+of\s+animals\b/i,
  /\btypes?\s+of\s+animals\b/i,
  /\bfamous for\b/i,
  /\bknown for\b/i,
  // Migration timing
  /\bmigration\s+(?:time|season|when|where|pattern|route)\b/i,
  /\bgreat migration\b/i,
  /\bwildebeest migration\b/i,
  /\bcalving\s+season\b/i,
  /\briver crossing\b/i,
  // Visa / entry requirements
  /\bvisa\b/i,
  /\bentry requirements?\b/i,
  /\bpassport\b/i,
  /\bvaccination\b/i,
  /\byellow fever\b/i,
  /\bcovid\b/i,
  /\bimmigration\b/i,
  /\bcustoms\b/i,
  /\border\b/i,
  // Currency / money practical
  /\bcurrency\b/i,
  /\bexchange rate\b/i,
  /\btipping\b/i,
  /\boutlet\s+type\b/i,
  /\belectricity\b/i,
  /\bplugs?\s+(?:work|use|type)\b/i,
  /\bsafety\b/i,
  /\bdangerous\b/i,
  /\bwhat\s+language\b/i,
  /\bspeak\s+english\b/i,
  /\btime zone\b/i,
  /\bwhat\s+to\s+pack\b/i,
  /\bwhat\s+to\s+bring\b/i,
  /\bpacking\s+list\b/i,
  // Park facts / general knowledge
  /\bhow\s+big\s+is\b/i,
  /\bsize\s+of\b/i,
  /\barea\s+of\b/i,
  /\bhow\s+old\s+is\b/i,
  /\bwhen\s+was\b/i,
  /\bhistory\s+of\b/i,
  /\bformed\b/i,
  /\beruption\b/i,
  /\bcrater\b/i,
  /\bunesco\b/i,
  /\bworld heritage\b/i,
  /\belevation\b/i,
  /\baltitude\b/i,
  /\bhow\s+high\b/i,
  // Comparison / ranking questions
  /\bbetter\s+(?:than|for)\b/i,
  /\bdifference\s+between\b/i,
  /\bcompare\b/i,
  /\bwhich\s+(?:park|place|destination)\s+(?:is|has)\b/i,
  /\btop\s+\d*\s+(?:park|destination|reserve)\b/i,
  // Food / cuisine / cultural
  /\bfood\b/i,
  /\bcuisine\b/i,
  /\bdish\b/i,
  /\btraditional\s+food\b/i,
  /\bculture\b/i,
  /\btribe\b/i,
  /\bmaasai\s+(?:people|culture|tribe|village)\b/i,
  /\bwhat\s+language\b/i,
  /\bswahili\b/i,
];

function isGeminiIntent(message) {
  return geminiIntentPatterns.some((pattern) => pattern.test(message));
}

// ===== LOCAL KNOWLEDGE BASE =====
// LOCAL KB should ONLY answer SITE-COMMERCE questions:
// itineraries, packages, prices, booking, contact, what Simbali offers
const KB = {
  greetings: {
    patterns: [/\b(hello|hi|hey|good morning|good afternoon|good evening|howdy|what'?s up|hola|greetings|morning|afternoon|evening)\b/i],
    responses: [
      "Hello there! I'm **Simba**, your AI safari planning assistant. How can I help you explore Africa today?",
      "Hi! Welcome to Simbali Wild Safaris. I'm here to help you plan the perfect African safari adventure. What would you like to know?",
    ],
    exactIntent: true,
  },
  // itineraries: exact commerce intent
  itineraries: {
    patterns: [
      /\b(itineraries?|packages?|trips?|tours?|plans?|schedules?)\b/i,
      /\bwhat\s+(?:itineraries?|packages?|trips?)\s+do\s+you\s+(?:have|offer)\b/i,
      /\bshow\s+me\s+(?:your|the)\s+(?:itineraries?|packages?)\b/i,
      /\blist\s+(?:your|the)\s+(?:itineraries?|packages?)\b/i,
    ],
    responses: [
      "We have 5 curated itineraries: **Kenya** — 8-Day Honeymoon ($4,500), 8-Day Family ($4,287), 11-Day Kenya-Tanzania Family ($6,730). **Tanzania** — 8-Day Family ($4,440), 8-Day Honeymoon ($5,620). View all details on our [Itineraries page](/itineraries).",
    ],
    exactIntent: true,
  },
  // pricing: exact commerce intent
  pricing: {
    patterns: [
      /\b(price|pricing|cost|how much|budget|rate|fee|charge|usd|\$)\b/i,
      /\bwhat\s+(?:is|does)\s+(?:the|a|your)\s+(?:price|cost)\b/i,
      /\bhow\s+expensive\b/i,
    ],
    responses: [
      "Our safaris range from **$4,287 to $6,730 per person** depending on the itinerary, season, and group size. Prices include accommodation, meals, park fees, game drives, and transfers. For a personalized quote, please [contact us](/contact) or call **+254 713 855 818**.",
    ],
    exactIntent: true,
  },
  // contact: exact commerce intent
  contact: {
    patterns: [
      /\b(contact|reach|email|phone|call|whatsapp|number)\b/i,
      /\bhow\s+(?:can|do)\s+I\s+(?:contact|reach)\b/i,
      /\bhow\s+to\s+(?:contact|reach)\b/i,
    ],
    responses: [
      "You can reach us at **info@simbaliwildlisafaris.com** or call **+254 713 855 818**. You can also fill out the [Contact form](/contact) or message us on WhatsApp.",
    ],
    exactIntent: true,
  },
  // booking: exact commerce intent
  booking: {
    patterns: [
      /\b(book|booking|reserve|reservation)\b/i,
      /\bhow\s+(?:can|do)\s+I\s+(?:book|reserve)\b/i,
      /\bcan\s+I\s+(?:book|reserve)\b/i,
      /\bmake\s+a\s+(?:booking|reservation)\b/i,
      /\bsign\s+up\b/i,
    ],
    responses: [
      "To book a safari, fill out our [Contact form](/contact) with your preferred dates and itinerary. Our team will get back to you within 24 hours with availability and a detailed quote. You can also call us at **+254 713 855 818**.",
    ],
    exactIntent: true,
  },
  // destinations offered by Simbali
  destinations: {
    patterns: [
      /\bwhat\s+(?:destinations?|places?|countries?)\s+do\s+you\s+(?:offer|have|go\s+to)\b/i,
      /\bwhere\s+do\s+you\s+(?:offer|go|send)\b/i,
      /\bdo\s+you\s+(?:offer|have)\s+(?:safaris?|trips?)\s+in\b/i,
      /\bwhich\s+(?:countries?|destinations?)\s+do\s+you\s+cover\b/i,
    ],
    responses: [
      "We offer safaris in **Kenya** and **Tanzania**, with Uganda, Rwanda, and Burundi coming soon. Key destinations include: Maasai Mara, Amboseli, Lake Naivasha, Samburu in Kenya; Serengeti, Ngorongoro Crater, Tarangire in Tanzania. You can explore all our [Itineraries](/itineraries) for details.",
    ],
    exactIntent: true,
  },
  // family safari options
  family: {
    patterns: [
      /\bfamily[\s\-]?(?:friendly|safari|trip|package)?\b/i,
      /\bkids?\b/i,
      /\bchildren\b/i,
      /\bchild[\s\-]?friendly\b/i,
      /\bsafari\s+(?:with|for)\s+kids\b/i,
    ],
    responses: [
      "We have **family-friendly safaris** in both Kenya and Tanzania! Our 8-Day Kenya Family Safari and 8-Day Tanzania Family Safari are designed with families in mind — shorter drives between parks, family-friendly lodges with pools, and activities that kids love. Contact us for family-specific recommendations.",
    ],
    exactIntent: true,
  },
  // honeymoon safari options
  honeymoon: {
    patterns: [
      /\bhoneymoon\b/i,
      /\bromantic\b/i,
      /\bcouple\b/i,
      /\banniversary\b/i,
      /\bwedding\b/i,
    ],
    responses: [
      "Our **honeymoon safaris** are truly magical! Choose from the 8-Day Kenya Honeymoon Safari (Maasai Mara, Naivasha, Samburu) or the 8-Day Tanzania Honeymoon Safari (Serengeti, Ngorongoro, Tarangire with a scenic flight back). We can arrange romantic touches like private dinners and hot air balloon rides.",
    ],
    exactIntent: true,
  },
  // services / company questions
  services: {
    patterns: [
      /\bwhat\s+(?:services?|do\s+you\s+do|is\s+simbali)\b/i,
      /\babout\s+simbali\b/i,
      /\bwho\s+are\s+you\b/i,
      /\btell\s+me\s+about\s+(?:yourself|simbali)\b/i,
      /\bwhat\s+(?:do|can)\s+you\s+(?:do|offer|help)\b/i,
    ],
    responses: [
      "**Simbali Wild Safaris** specializes in luxury African safari adventures across Kenya and Tanzania. We offer curated itineraries, expert-guided game drives, premium lodge accommodations, and personalized safari planning. Explore our [Services](/services) or [Itineraries](/itineraries) to learn more!",
    ],
    exactIntent: true,
  },
  // what's included
  inclusions: {
    patterns: [
      /\bwhat\s+(?:is|do)\s+(?:it|the\s+price|the\s+package)\s+include\b/i,
      /\bwhat\s+is\s+included\b/i,
      /\bincluded\s+in\s+(?:the|your)\b/i,
      /\bdo\s+you\s+include\b/i,
      /\bwhat\s+is\s+not\s+included\b/i,
      /\bexclude\w*\b/i,
      /\bmeals\b/i,
      /\baccommodation\b/i,
      /\btransport\b/i,
      /\bpark\s+fees?\b/i,
    ],
    responses: [
      "Our safari packages typically include accommodation, meals, park entrance fees, game drives in 4x4 vehicles, and airport transfers. Flights to/from East Africa, travel insurance, and personal expenses are usually not included. Each itinerary has specific inclusions — check the [Itineraries page](/itineraries) for full details, or [contact us](/contact) for a personalized quote.",
    ],
    exactIntent: true,
  },
  // custom / tailored safaris
  custom: {
    patterns: [
      /\bcustom\b/i,
      /\btailored\b/i,
      /\bpersonalized\b/i,
      /\bbespoke\b/i,
      /\bprivate\s+safari\b/i,
      /\bcan\s+you\s+plan\b/i,
      /\bdesign\s+a\s+safari\b/i,
    ],
    responses: [
      "Absolutely! We can design a **custom safari** tailored to your preferences, dates, and budget. Whether you want a private honeymoon, a multi-generational family trip, or a photography-focused safari, our team will craft the perfect itinerary. [Contact us](/contact) to start planning!",
    ],
    exactIntent: true,
  },
};

// ===== OFF-TOPIC DETECTION =====
const SAFARI_KEYWORDS = /\b(safari|africa|kenya|tanzania|uganda|rwanda|burundi|wildlife|animal|lion|elephant|leopard|buffalo|rhino|cheetah|giraffe|zebra|wildebeest|migration|masai mara|serengeti|ngorongoro|amboseli|samburu|naivasha|tarangire|zanzibar|travel|trip|tour|vacation|holiday|booking|itinerary|package|destination|park|reserve|camp|lodge|hotel|flight|airport|nairobi|arusha|daressalaam|mombasa|beach|mountain|kilimanjaro|gorilla|chimpanzee|bird|birding|nature|adventure|explore|guide|driver|vehicle|jeep|land cruiser|game drive|hot air balloon|price|cost|budget|contact|email|phone|whatsapp|mombasa)\b/i;

function isOffTopic(message) {
  return !SAFARI_KEYWORDS.test(message);
}

// ===== LOCAL KB MATCHER (returns match with metadata) =====
function matchLocalKB(message) {
  const lowerMsg = message.toLowerCase();
  for (const [key, entry] of Object.entries(KB)) {
    for (const pattern of entry.patterns) {
      if (pattern.test(lowerMsg)) {
        const responses = entry.responses;
        return {
          key,
          response: responses[Math.floor(Math.random() * responses.length)],
          exactIntent: entry.exactIntent || false,
          onlyEntityOverlap: false,
        };
      }
    }
  }
  return null;
}

// ===== CONFIDENCE SCORING =====
function getLocalKbConfidence(message, kbMatch) {
  let score = 0;
  const text = message.toLowerCase();

  // Strong local-commerce signals (+3 each)
  if (/\bprice|cost|how much|budget|usd|\$\b/.test(text)) score += 3;
  if (/\bitinerary|package|trip\b/.test(text)) score += 3;
  if (/\bbook|booking|reserve|reservation\b/.test(text)) score += 3;
  if (/\bcontact|email|phone|whatsapp|reach\b/.test(text)) score += 3;
  if (/\binclude\b/.test(text)) score += 3;
  if (/\bfamily|honeymoon|kids|children|romantic|couple\b/.test(text)) score += 3;
  if (/\bwhat\s+(?:do you|can you)\s+(?:offer|have|do|include)\b/.test(text)) score += 3;
  if (/\bhow\s+(?:can|do)\s+I\b/.test(text)) score += 3;
  if (/\bdo\s+you\s+(?:offer|have|do|provide)\b/.test(text)) score += 3;
  if (/\bwhich\s+(?:countries|destinations|parks)\s+do\s+you\b/.test(text)) score += 3;
  if (/\bcustom|tailored|private\b/.test(text)) score += 3;
  if (/\bservice\b/.test(text)) score += 2;
  if (/\bsimbali\b/.test(text)) score += 2;

  // KB match quality
  if (kbMatch) {
    if (kbMatch.exactIntent) score += 3;
    if (kbMatch.key === 'greetings') score += 5;
    if (kbMatch.key === 'destinations') score += 2;
  }

  // Penalties for intelligence-question signals
  if (isGeminiIntent(text)) score -= 5;
  if (/\bhow far|distance|how long|drive time|travel time|flight time\b/.test(text)) score -= 4;
  if (/\bwhere is|located|location\b/.test(text)) score -= 4;
  if (/\bweather|climate|temperature|season|best time\b/.test(text)) score -= 4;
  if (/\bwhat animals|what wildlife|famous for|known for\b/.test(text)) score -= 3;
  if (/\bvisa|passport|vaccination|yellow fever\b/.test(text)) score -= 4;

  return score;
}

// ===== RATE LIMITING =====
const RATE_LIMIT = {
  maxPerMinute: 8,
  maxPerSession: 20,
  cooldownMs: 4000,
  timestamps: [],
  sessionCount: 0,
};

function canCallGemini() {
  const now = Date.now();
  RATE_LIMIT.timestamps = RATE_LIMIT.timestamps.filter(t => now - t < 60000);
  if (RATE_LIMIT.sessionCount >= RATE_LIMIT.maxPerSession) {
    return { allowed: false, reason: 'session_limit' };
  }
  if (RATE_LIMIT.timestamps.length >= RATE_LIMIT.maxPerMinute) {
    return { allowed: false, reason: 'rate_limit' };
  }
  const lastCall = RATE_LIMIT.timestamps[RATE_LIMIT.timestamps.length - 1];
  if (lastCall && now - lastCall < RATE_LIMIT.cooldownMs) {
    return { allowed: false, reason: 'cooldown' };
  }
  return { allowed: true };
}

function recordGeminiCall() {
  RATE_LIMIT.timestamps.push(Date.now());
  RATE_LIMIT.sessionCount++;
}

// ===== SYSTEM PROMPT =====
const SYSTEM_PROMPT = `You are Simba, the AI safari planning assistant for Simbali Wild Safaris.

Your job:
1. Answer general safari and African travel questions when they are not directly answered by the local website knowledge base.
2. Stay strictly on-topic: African safaris, East Africa travel, wildlife, destinations, seasons, travel planning, park geography, and related visitor guidance.
3. If a question is unrelated to safari or travel, politely decline.
4. Keep answers short, useful, and natural: 2 to 4 sentences.
5. Do not invent Simbali-specific package details, prices, or policies beyond the local website data passed to you.
6. When relevant, gently guide the user back to Simbali itineraries or booking contact.

Known local website facts:
- Simbali offers Kenya and Tanzania itineraries.
- Kenya itineraries include 8-day honeymoon, 8-day family, and 11-day Kenya-Tanzania family safari.
- Tanzania itineraries include 8-day family and 8-day honeymoon safari.
- Price examples on site range from $4,287 to $6,730 depending on itinerary.
- Featured destinations include Maasai Mara, Amboseli, Lake Naivasha, Samburu, Serengeti, Ngorongoro Crater, and Tarangire.
- Uganda, Rwanda, and Burundi itineraries are marked as coming soon.`;

// ===== QUICK ACTIONS =====
const quickActions = [
  { label: "Plan dream safari", message: "I'd like to plan a dream safari. Can you help me?" },
  { label: "Explore safari experiences", message: "What safari experiences do you offer?" },
  { label: "Contact Simbali", message: "How can I contact Simbali Wild Safaris?" },
];

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hello! I'm **Simba**, your friendly **AI Agent** for safari planning. How may I assist you?" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Conversation history for context
  const conversationHistoryRef = useRef([
    { role: 'user', parts: [{ text: SYSTEM_PROMPT }] },
    { role: 'model', parts: [{ text: 'Understood. I am Simba, the AI safari planner for Simbali Wild Safaris. I will help users plan their African safari adventures, staying focused on safari-related topics only.' }] },
  ]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ===== INTENT-FIRST ROUTER =====
  const generateReply = useCallback(async (userMsg) => {
    const lowerMsg = userMsg.toLowerCase().trim();

    // --- STEP A: Greeting / small talk check ---
    const greetingMatch = KB.greetings.patterns.some(p => p.test(lowerMsg));
    if (greetingMatch) {
      const greetingResponse = KB.greetings.responses[Math.floor(Math.random() * KB.greetings.responses.length)];
      console.log('[Simba Router]', { message: userMsg, intent: 'greeting', route: 'local_kb', matchedKey: 'greetings' });
      return { source: 'local', text: greetingResponse };
    }

    // --- STEP B: Check for Gemini intelligence intents FIRST ---
    const geminiIntent = isGeminiIntent(userMsg);
    if (geminiIntent) {
      // Intelligence question → Gemini (even if it mentions a destination name)
      const rateCheck = canCallGemini();
      if (!rateCheck.allowed) {
        const reasons = {
          session_limit: "I've reached my conversation limit for this session. Please [contact us directly](/contact) or call +254 713 855 818 for more detailed assistance!",
          rate_limit: "I'm receiving a lot of questions right now — please wait a moment before asking again, or contact us directly via [WhatsApp](https://api.whatsapp.com/send?phone=254713855818).",
          cooldown: "Please give me a few seconds between questions — I'll be right with you!",
        };
        console.log('[Simba Router]', { message: userMsg, intent: 'gemini_intelligence', route: 'rate_limited', reason: rateCheck.reason });
        return { source: 'rate_limited', text: reasons[rateCheck.reason] || "Please wait a moment before asking again." };
      }

      // Check off-topic BEFORE calling Gemini
      if (isOffTopic(userMsg)) {
        console.log('[Simba Router]', { message: userMsg, intent: 'off_topic', route: 'refusal', geminiIntent });
        return {
          source: 'refusal',
          text: "I'm Simba, your safari planning assistant! I can only help with questions about African safaris, destinations, itineraries, and bookings. For anything else, feel free to [contact our team](/contact) directly.",
        };
      }

      console.log('[Simba Router]', { message: userMsg, intent: 'gemini_intelligence', route: 'gemini_api', matchedGeminiPattern: true });
      return await callGemini(userMsg);
    }

    // --- STEP C: Try local KB with confidence scoring ---
    const localMatch = matchLocalKB(userMsg);
    const confidence = getLocalKbConfidence(userMsg, localMatch);
    const CONFIDENCE_THRESHOLD = 2;

    if (localMatch && confidence >= CONFIDENCE_THRESHOLD) {
      console.log('[Simba Router]', { message: userMsg, intent: 'local_commerce', route: 'local_kb', matchedKey: localMatch.key, confidence, threshold: CONFIDENCE_THRESHOLD });
      return { source: 'local', text: localMatch.response };
    }

    // --- STEP D: Check off-topic ---
    if (isOffTopic(userMsg)) {
      console.log('[Simba Router]', { message: userMsg, intent: 'off_topic', route: 'refusal', localMatch: localMatch?.key || null, confidence });
      return {
        source: 'refusal',
        text: "I'm Simba, your safari planning assistant! I can only help with questions about African safaris, destinations, itineraries, and bookings. For anything else, feel free to [contact our team](/contact) directly.",
      };
    }

    // --- STEP E: Fall through to Gemini for safari-related but non-local questions ---
    const rateCheck = canCallGemini();
    if (!rateCheck.allowed) {
      const reasons = {
        session_limit: "I've reached my conversation limit for this session. Please [contact us directly](/contact) or call +254 713 855 818 for more detailed assistance!",
        rate_limit: "I'm receiving a lot of questions right now — please wait a moment before asking again, or contact us directly via [WhatsApp](https://api.whatsapp.com/send?phone=254713855818).",
        cooldown: "Please give me a few seconds between questions — I'll be right with you!",
      };
      console.log('[Simba Router]', { message: userMsg, intent: 'safari_general', route: 'rate_limited', reason: rateCheck.reason, localMatch: localMatch?.key || null, confidence });
      return { source: 'rate_limited', text: reasons[rateCheck.reason] || "Please wait a moment before asking again." };
    }

    console.log('[Simba Router]', { message: userMsg, intent: 'safari_general', route: 'gemini_api', localMatch: localMatch?.key || null, confidence, geminiIntent });
    return await callGemini(userMsg);
  }, []);

  // ===== GEMINI API CALL =====
  async function callGemini(userMsg) {
    const history = conversationHistoryRef.current;
    const contents = [
      ...history,
      { role: 'user', parts: [{ text: userMsg }] },
    ];

    try {
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyBcW7oNLw7YfQ0UUR7dT-roU6jOeIoE6U0', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          generationConfig: {
            maxOutputTokens: 256,
            temperature: 0.7,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('[Simba Gemini] API error:', errorData);
        return {
          source: 'gemini_error',
          text: "I'm having trouble connecting right now. Please try again shortly or contact us directly at [info@simbaliwildlisafaris.com](mailto:info@simbaliwildlisafaris.com).",
        };
      }

      const data = await response.json();
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (reply) {
        recordGeminiCall();
        // Update conversation history (keep last 6 turns = 12 messages)
        conversationHistoryRef.current = [
          ...history,
          { role: 'user', parts: [{ text: userMsg }] },
          { role: 'model', parts: [{ text: reply }] },
        ].slice(-12);
        console.log('[Simba Gemini] Success, tokens used:', data.usageMetadata?.totalTokenCount || 'unknown');
        return { source: 'gemini', text: reply };
      }
    } catch (err) {
      console.error('[Simba Gemini] Fetch error:', err);
    }

    // Gemini failed — safe fallback (never replace with local itinerary)
    console.log('[Simba Router]', { message: userMsg, route: 'gemini_fallback', reason: 'api_failure_or_empty' });
    return {
      source: 'gemini_fallback',
      text: "That's a great safari question! I'd love to help you explore that. For the most detailed and up-to-date information, please [contact our safari experts](/contact) or call **+254 713 855 818**. You can also browse our [Itineraries](/itineraries) to see what's available.",
    };
  }

  // ===== MESSAGE HANDLER =====
  const handleSend = async (text) => {
    if (!text.trim() || isLoading) return;
    const userMsg = text.trim();

    // Input sanitization
    if (userMsg.length > 500) {
      setMessages(prev => [...prev, { role: "user", text: userMsg }, { role: "assistant", text: "Your message is too long. Please keep it under 500 characters." }]);
      setInput("");
      return;
    }

    // Check for abusive content
    const abusivePatterns = [
      /\b(hack|exploit|inject|sql|xss|script|ddos|spam|botnet|attack|breach)\b/i,
    ];
    for (const pattern of abusivePatterns) {
      if (pattern.test(userMsg)) {
        setMessages(prev => [...prev, { role: "user", text: userMsg }, { role: "assistant", text: "⚠️ I can't assist with that. I'm here to help with safari planning only." }]);
        setInput("");
        return;
      }
    }

    setMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setInput("");
    setIsLoading(true);

    const result = await generateReply(userMsg);
    setMessages(prev => [...prev, { role: "assistant", text: result.text }]);
    setIsLoading(false);
  };

  // ===== TEXT RENDERER (markdown-lite) =====
  const renderText = (text) => {
    const splitRe = new RegExp('(\\*\\*.*?\\*\\*|\\[.*?\\]\\(.*?\\))', 'g');
    const parts = text.split(splitRe);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={i} className="font-semibold text-[#1a1a1a]">{part.slice(2, -2)}</strong>;
      }
      const linkMatch = part.match(/\[(.*?)\]\((.*?)\)/);
      if (linkMatch) {
        return <a key={i} href={linkMatch[2]} className="text-olive underline">{linkMatch[1]}</a>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <>
      {/* Launcher */}
      {!open && (
        <button onClick={() => setOpen(true)} className="fixed bottom-5 right-5 z-50 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow flex items-center gap-2 pl-1.5 pr-4 py-1.5 border border-gray-100" aria-label="Open chat">
          <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0">
            <img src="/images/simbali-ai-avatar.png" alt="Simba" className="w-full h-full object-cover" />
          </div>
          <span className="text-sm text-[#444] font-medium">Ask AI</span>
          <span className="text-gray-300 mx-0.5">|</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4a5c2a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
            <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" /><path d="M19 10v2a7 7 0 01-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" />
          </svg>
          <span className="text-sm text-olive font-medium">Talk</span>
        </button>
      )}

      {/* Chat Panel */}
      {open && (
        <div className="fixed bottom-5 right-5 z-50 w-[380px] max-w-[calc(100vw-40px)] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-gray-100" style={{ maxHeight: "540px" }}>
          {/* Header */}
          <div className="bg-olive px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full overflow-hidden bg-white/20 flex-shrink-0">
                <img src="/images/simbali-ai-avatar.png" alt="Simba" className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="text-white text-sm font-semibold leading-tight">Simba</div>
                <div className="text-white/60 text-[11px] leading-tight">AI Safari Planner</div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white w-8 h-8 flex items-center justify-center transition-colors text-lg">&times;</button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[200px]">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "assistant" && (
                  <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0 mr-2 mt-1 self-start">
                    <img src="/images/simbali-ai-avatar.png" alt="Simba" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed ${msg.role === "user" ? "bg-olive text-white rounded-br-sm" : "bg-[#f5f7f3] text-[#333] rounded-bl-sm"}`}>
                  {renderText(msg.text)}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0 mr-2 self-start">
                  <img src="/images/simbali-ai-avatar.png" alt="Simba" className="w-full h-full object-cover" />
                </div>
                <div className="bg-[#f5f7f3] px-4 py-2.5 rounded-2xl rounded-bl-sm">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-[#999] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 bg-[#999] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 bg-[#999] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Actions */}
          {messages.length === 1 && (
            <div className="px-4 pb-2 space-y-2">
              {quickActions.map((action) => (
                <button key={action.label} onClick={() => handleSend(action.message)} className="w-full text-[13px] text-[#444] bg-white hover:bg-[#f5f7f3] border border-gray-200 rounded-xl py-2.5 px-4 text-left transition-colors flex items-center gap-3">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4a5c2a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" /><path d="M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z" />
                  </svg>
                  {action.label}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="border-t border-gray-100 p-3">
            <div className="flex items-center gap-2 bg-[#f5f7f3] rounded-full px-4 py-2">
              <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSend(input)} placeholder="Ask me anything..." className="flex-1 text-[13px] bg-transparent outline-none text-[#333] placeholder:text-[#999]" />
              <button onClick={() => handleSend(input)} disabled={isLoading || !input.trim()} className="bg-olive text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-olive-dark transition-colors disabled:opacity-40 flex-shrink-0">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
              </button>
            </div>
            <div className="flex flex-col items-center mt-2 gap-1">
              <button className="flex items-center gap-1.5 text-[11px] text-[#777] hover:text-olive transition-colors">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" /><path d="M19 10v2a7 7 0 01-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" />
                </svg>
                Talk
              </button>
              <div className="text-[9px] text-[#bbb] text-center">This chat is recorded. By chatting, you agree to the <a href="#" className="underline hover:text-olive">AI Terms</a></div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
