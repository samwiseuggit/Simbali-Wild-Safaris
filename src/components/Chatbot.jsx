import { useEffect, useMemo, useRef, useState } from 'react';

const CONTACT = {
  email: 'info@simbaliwildsafaris.com',
  phone: '+254 713 855 818',
  location: 'Kindaruma Road, P.O. Box 5109 - 00506, Nairobi, Kenya',
};

const quickActions = [
  { label: 'Design a safari', message: 'I want to design a private East Africa safari.' },
  { label: 'Where should I go?', message: 'Which East Africa destination is right for me?' },
  { label: 'Journey levels', message: 'What are the Simbali journey levels?' },
];

const linkMap = {
  destinations: { label: 'Explore destinations', href: '/destinations/' },
  journeys: { label: 'Compare journeys', href: '/journeys/' },
  experience: { label: 'View experiences', href: '/experience/' },
  planning: { label: 'Plan your safari', href: '/plan-your-safari/' },
  design: { label: 'Design your journey', href: '/design-your-journey/' },
  about: { label: 'About Simbali', href: '/about/' },
  circle: { label: 'Simbali Circle', href: '/simbali-circle/' },
};

const verifiedAnswers = [
  {
    id: 'greeting',
    patterns: [/\b(hi|hello|hey|good morning|good afternoon|good evening)\b/i],
    reply:
      "Hello, I'm Simba. I can help you choose where to go, understand Simbali's journey levels, and start a private East Africa safari consultation.",
    links: ['destinations', 'design'],
  },
  {
    id: 'location',
    patterns: [
      /\b(where\s+are\s+you\s+(located|based)|where\s+is\s+simbali|your\s+(office|location|address)|office\s+address|based\s+in|located\s+in)\b/i,
      /\b(nairobi\s+office|kenya\s+office|physical\s+address)\b/i,
    ],
    reply: `Simbali Wild Safaris is based in Nairobi, Kenya. Office details: ${CONTACT.location}. You can also email ${CONTACT.email} or call ${CONTACT.phone}.`,
    links: ['about', 'design'],
  },
  {
    id: 'destinations',
    patterns: [
      /\b(destination|destinations|country|countries|kenya|tanzania|rwanda|uganda|zanzibar|indian ocean)\b/i,
      /\b(where\s+(should|can|could)\s+(i|we)\s+(go|travel|visit)|where\s+to\s+go|which\s+destination)\b/i,
    ],
    reply:
      'Simbali focuses on East Africa: Kenya, Tanzania, Rwanda, Uganda, and Zanzibar or the Indian Ocean. Kenya is strong for first safaris and private conservancies; Tanzania suits Serengeti scale and bush-to-beach pairings; Rwanda and Uganda are powerful for primate and forest journeys.',
    links: ['destinations', 'design'],
  },
  {
    id: 'journeys',
    patterns: [/\b(signature|reserve|private|bespoke|journey levels?|package|tier|exclusive|luxury)\b/i],
    reply:
      'The redesigned site presents four starting points: Simbali Signature, Simbali Reserve, Simbali Private, and Simbali Bespoke. They help frame the level of privacy, access, and service; the final itinerary is still built around your dates, party, pace, and interests.',
    links: ['journeys', 'design'],
  },
  {
    id: 'experience',
    patterns: [
      /\b(family|honeymoon|couple|anniversary|birthday|group|wedding|retreat|culture|helicopter|conservanc|beach)\b/i,
    ],
    reply:
      'Simbali designs around why you are travelling: legacy family safaris, milestone trips, honeymoons, private groups, cultural immersion, conservancies, scenic flights, retreats, and bush-and-beach combinations.',
    links: ['experience', 'design'],
  },
  {
    id: 'planning',
    patterns: [/\b(plan|planning|first safari|kenya vs tanzania|migration|when to go|zanzibar|process|how.*work)\b/i],
    reply:
      'Planning starts with discovery, then curation, refinement, and travel support. For many first East Africa trips, 9 to 12 nights gives enough depth for safari, logistics, and optional rest at the coast.',
    links: ['planning', 'design'],
  },
  {
    id: 'price',
    patterns: [/\b(price|cost|budget|investment|how much|quote|rate)\b/i],
    reply:
      'The new journey pages frame investment by travel style, from Simbali Signature through fully bespoke private travel. Final pricing depends on season, camps, routing, party size, and service level, so the best next step is a private consultation.',
    links: ['journeys', 'design'],
  },
  {
    id: 'contact',
    patterns: [/\b(contact|email|phone|call|whatsapp|reach|consultation|enquiry|inquiry)\b/i],
    reply: `You can start with the Design Your Journey form, email ${CONTACT.email}, or call ${CONTACT.phone}. Share your preferred destinations, dates, number of travellers, travel style, and what would make the journey extraordinary.`,
    links: ['design', 'about'],
  },
  {
    id: 'circle',
    patterns: [/\b(circle|return|member|community|priority|event|benefit)\b/i],
    reply:
      'Simbali Circle is the private community for guests who want to stay close to East Africa after their first journey, with priority planning, early access to special opportunities, private travel evenings, and return-trip inspiration.',
    links: ['circle', 'design'],
  },
  {
    id: 'name-meaning',
    patterns: [
      /\b(meaning|mean|means|word|name|called|why\s+simbali|simbali\s+mean|meaning\s+of\s+(the\s+)?word\s+simbali)\b/i,
    ],
    reply:
      'Simbali is inspired by the Swahili word Simba, meaning lion. The name carries a sense of strength, closeness, and African identity, which fits the brand promise of personal East Africa journeys shaped with care and trusted local relationships.',
    links: ['about', 'design'],
  },
  {
    id: 'about',
    patterns: [/\b(about|founder|founders|sheila|violet|company|who are you|who is simbali)\b/i],
    reply:
      'Simbali Wild Safaris is a Nairobi-based luxury safari planning company led by Sheila and Violet. The brand is built around authenticity, bespoke planning, care, and trusted East Africa relationships.',
    links: ['about', 'design'],
  },
];

const safariWords =
  /\b(safari|africa|east africa|travel|trip|holiday|vacation|wildlife|lion|elephant|rhino|giraffe|zebra|wildebeest|gorilla|chimpanzee|migration|mara|maasai mara|masai mara|serengeti|ngorongoro|amboseli|tarangire|samburu|laikipia|nairobi|arusha|camp|lodge|guide|vehicle|game park|park|reserve|conservancy|beach|zanzibar|kenya|tanzania|rwanda|uganda)\b/i;

const aiEscalationPatterns = [
  /\b(which|what|where|how|when|why)\b.{0,120}\b(game park|park|reserve|conservancy|migration|wildlife|animal|animals|see|find|common|different|difference|compare|better|best|distance|drive|flight|weather|month|season)\b/i,
  /\b(game park|park|reserve|conservancy|migration|wildlife|animal|animals|see|find|common|different|difference|compare|better|best|distance|drive|flight|weather|month|season)\b.{0,120}\b(which|what|where|how|when|why)\b/i,
  /\b(great migration|wildebeest migration|river crossing|calving season|samburu|serengeti|maasai mara|masai mara|ngorongoro|amboseli|laikipia|tarangire)\b/i,
];

const generalSafariAnswers = [
  {
    id: 'packing',
    patterns: [/\b(pack|packing|luggage|bag|wear|clothes|clothing|shoes|boots|camera|binoculars)\b/i],
    reply:
      'For safari packing, think soft-sided luggage, neutral layers, comfortable closed shoes, sun protection, a light rain layer, binoculars or camera kit, and personal medication. Exact packing depends on season, routing, camp style, and whether your journey includes gorilla trekking or beach time.',
    links: ['planning', 'design'],
  },
  {
    id: 'gorilla-trekking',
    patterns: [/\b(gorilla|chimpanzee|primate|trek|trekking|volcanoes|bwindi|nyungwe|kibale)\b/i],
    reply:
      'Rwanda and Uganda are the main Simbali-region choices for gorilla and primate-focused journeys. The right fit depends on permit availability, fitness level, season, preferred lodge style, and how you want to combine forest time with classic safari.',
    links: ['destinations', 'design'],
  },
  {
    id: 'health-entry',
    patterns: [/\b(visa|passport|vaccin|yellow fever|malaria|health|entry requirement|covid|insurance)\b/i],
    reply:
      'Entry, health, vaccination, and insurance requirements can change by nationality, routing, and date. Simbali can help you plan the travel flow, but final requirements should be checked with official government guidance and a qualified travel-health professional before departure.',
    links: ['planning', 'design'],
  },
  {
    id: 'safari-safety',
    patterns: [/\b(safe|safety|dangerous|children|kids|solo|medical|emergency)\b/i],
    reply:
      'A well-designed private safari can be very comfortable for families, couples, solo travellers, and older guests when routing, camp choice, transfers, and pace are planned carefully. Simbali shapes those details around the travellers, then confirms practical needs during consultation.',
    links: ['experience', 'design'],
  },
  {
    id: 'timing-wildlife',
    patterns: [/\b(best time|season|rain|dry season|weather|calving|river crossing|migration)\b/i],
    reply:
      'East Africa works year-round when the route is matched to the season. Dry months often suit classic wildlife visibility, green seasons can be beautiful and quieter, and migration timing is a cycle rather than one fixed event.',
    links: ['planning', 'destinations'],
  },
];

const blockedInputPatterns = [
  /\b(hack|exploit|inject|sql|xss|script|ddos|spam|botnet|attack|breach|malware|phishing|credential|password|api\s*key|secret|token|exfiltrate|bypass|jailbreak)\b/i,
  /\b(ignore|forget|override|disregard)\b.{0,50}\b(instruction|rules|guardrail|system|developer|policy)\b/i,
  /\b(show|reveal|print|dump|leak|repeat)\b.{0,50}\b(prompt|instruction|system|developer|secret|key|token)\b/i,
  /\b(act as|pretend to be|roleplay as)\b.{0,60}\b(unrestricted|uncensored|developer|admin|system)\b/i,
  /\b(write|generate|create)\b.{0,50}\b(malicious|phishing|scam|spam|exploit|payload)\b/i,
];

function normalizeSecurityText(message) {
  return message
    .toLowerCase()
    .replace(/[0@]/g, 'o')
    .replace(/[1!|]/g, 'i')
    .replace(/[3]/g, 'e')
    .replace(/[4]/g, 'a')
    .replace(/[5$]/g, 's')
    .replace(/[7]/g, 't')
    .replace(/\s+/g, ' ')
    .trim();
}

function getSafetyResponse(message) {
  const normalizedMessage = normalizeSecurityText(message);
  if (
    !blockedInputPatterns.some(
      (pattern) => pattern.test(message) || pattern.test(normalizedMessage)
    )
  ) {
    return null;
  }
  return {
    reply:
      "I can't help with requests to bypass instructions, expose private details, or create harmful content. I can help with verified Simbali safari planning: destinations, journey styles, timing, experiences, and how to start a consultation.",
    links: pickLinks(['destinations', 'design']),
    source: 'blocked',
  };
}

function cleanReply(text) {
  if (/^\s*(analysis|thinking process|reasoning|here is my reasoning)\s*:/i.test(text)) {
    return "I can help with verified Simbali safari planning details. Tell me where you are thinking of going, who is travelling, and when you would like to travel.";
  }
  return text;
}

function pickLinks(ids) {
  return ids.map((id) => linkMap[id]).filter(Boolean).slice(0, 2);
}

function shouldUseAi(message) {
  return safariWords.test(message) && aiEscalationPatterns.some((pattern) => pattern.test(message));
}

function matchAnswer(message) {
  const text = message.trim();
  const safetyResponse = getSafetyResponse(text);

  if (safetyResponse) {
    return safetyResponse;
  }

  if (shouldUseAi(text)) {
    return {
      reply: '',
      links: pickLinks(['planning', 'design']),
      source: 'ai',
    };
  }

  const matched = verifiedAnswers.find((entry) => entry.patterns.some((pattern) => pattern.test(text)));

  if (matched) {
    return {
      reply: cleanReply(matched.reply),
      links: pickLinks(matched.links),
      source: 'verified',
    };
  }

  const generalMatched = generalSafariAnswers.find((entry) =>
    entry.patterns.some((pattern) => pattern.test(text))
  );

  if (generalMatched) {
    return {
      reply: cleanReply(generalMatched.reply),
      links: pickLinks(generalMatched.links),
      source: 'general-safari',
    };
  }

  if (!safariWords.test(text)) {
    return {
      reply:
        "I'm focused on Simbali safari planning: East Africa destinations, journey styles, private experiences, timing, and how to start a consultation.",
      links: pickLinks(['destinations', 'design']),
      source: 'guardrail',
    };
  }

  return {
    reply:
      'That is a good safari-planning question. Based on the Simbali site, the best next step is to shape the route around your destination interests, travel window, group, comfort level, and whether you want safari only or bush plus beach.',
    links: pickLinks(['planning', 'design']),
    source: 'fallback',
  };
}

function LinkList({ links }) {
  if (!links?.length) return null;
  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className="rounded-full border border-[#d7c4a7] bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#62604A] transition-colors hover:bg-[#f5f0e7]"
        >
          {link.label}
        </a>
      ))}
    </div>
  );
}

function ResponseNote({ source }) {
  if (!['ai', 'knowledge-fallback', 'ai-fallback', 'fallback', 'no-ai-provider', 'ai-unavailable'].includes(source)) return null;

  return (
    <p className="mt-2 border-t border-[#eee5d7] pt-2 text-[10px] leading-snug text-[#8a8378]">
      Simbali will confirm route details, timing, availability, permits, and final quotes during consultation.
    </p>
  );
}

function MessageText({ text }) {
  return (
    <>
      {text.split('\n').map((line, index, lines) => (
        <span key={index}>
          {line}
          {index < lines.length - 1 && <br />}
        </span>
      ))}
    </>
  );
}

async function askAiFallback(message) {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  });

  if (!response.ok && response.status !== 429) {
    throw new Error('Chat endpoint unavailable');
  }

  const data = await response.json();

  return {
    reply: cleanReply(data.reply || ''),
    links: Array.isArray(data.links) ? data.links : pickLinks(['planning', 'design']),
    source: data.source || 'ai',
  };
}

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: "Hello, I'm Simba. I can help you plan a private East Africa safari with Simbali.",
      links: pickLinks(['destinations', 'design']),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  const suggestedActions = useMemo(() => quickActions, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    if (open) {
      window.setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [open]);

  const handleSend = async (text) => {
    const userMsg = text.trim();
    if (!userMsg || isLoading) return;

    if (userMsg.length > 500) {
      setMessages((prev) => [
        ...prev,
        { role: 'user', text: userMsg },
        { role: 'assistant', text: 'Please keep your message under 500 characters.', links: [] },
      ]);
      setInput('');
      return;
    }

    const safetyResponse = getSafetyResponse(userMsg);
    if (safetyResponse) {
      setMessages((prev) => [
        ...prev,
        { role: 'user', text: userMsg },
        { role: 'assistant', text: safetyResponse.reply, links: safetyResponse.links, source: safetyResponse.source },
      ]);
      setInput('');
      return;
    }

    setMessages((prev) => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsLoading(true);

    window.setTimeout(async () => {
      const answer = matchAnswer(userMsg);

      if (answer.source !== 'fallback' && answer.source !== 'ai') {
        setMessages((prev) => [...prev, { role: 'assistant', text: answer.reply, links: answer.links, source: answer.source }]);
        setIsLoading(false);
        return;
      }

      try {
        const aiAnswer = await askAiFallback(userMsg);
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', text: aiAnswer.reply || answer.reply, links: aiAnswer.links, source: aiAnswer.source },
        ]);
      } catch {
        setMessages((prev) => [...prev, { role: 'assistant', text: answer.reply, links: answer.links, source: answer.source }]);
      }

      setIsLoading(false);
    }, 240);
  };

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full border border-[#eadfce] bg-white py-1.5 pl-1.5 pr-4 shadow-lg transition-shadow hover:shadow-xl"
          aria-label="Open Simba safari chat"
        >
          <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#f5f0e7]">
            <img src="/images/simbali-lion-only.png" alt="" className="h-full w-full object-cover" />
          </span>
          <span className="text-sm font-medium text-[#444]">Ask Simba</span>
        </button>
      )}

      {open && (
        <section
          className="fixed bottom-5 right-5 z-50 flex max-h-[min(620px,calc(100dvh-32px))] w-[400px] max-w-[calc(100vw-24px)] flex-col overflow-hidden rounded-2xl border border-[#d9c9b1] bg-white shadow-2xl"
          role="dialog"
          aria-label="Simba safari planning assistant"
        >
          <div className="flex items-center justify-between bg-[#171814] px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="h-10 w-10 overflow-hidden rounded-full bg-[#f5f0e7]">
                <img src="/images/simbali-lion-only.png" alt="" className="h-full w-full object-cover" />
              </span>
              <div>
                <div className="text-sm font-semibold leading-tight text-white">Simba</div>
                <div className="text-[11px] leading-tight text-white/65">Simbali safari concierge</div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="flex h-9 w-9 items-center justify-center rounded-full text-xl text-white/70 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Close chat"
            >
              &times;
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto bg-[#f8f5ef] p-4" aria-live="polite">
            {messages.map((msg, index) => (
              <div key={`${msg.role}-${index}`} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[86%] rounded-2xl px-4 py-3 text-[13px] leading-relaxed ${
                    msg.role === 'user'
                      ? 'rounded-br-sm bg-[#62604A] text-white'
                      : 'rounded-bl-sm border border-[#ece1d1] bg-white text-[#282823]'
                  }`}
                >
                  <MessageText text={msg.text} />
                  {msg.role === 'assistant' && <LinkList links={msg.links} />}
                  {msg.role === 'assistant' && <ResponseNote source={msg.source} />}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-sm border border-[#ece1d1] bg-white px-4 py-3">
                  <div className="flex gap-1" aria-label="Simba is typing">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#B18A52]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#B18A52]" style={{ animationDelay: '120ms' }} />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#B18A52]" style={{ animationDelay: '240ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {messages.length === 1 && (
            <div className="space-y-2 border-t border-[#eadfce] bg-white px-4 py-3">
              {suggestedActions.map((action) => (
                <button
                  key={action.label}
                  onClick={() => handleSend(action.message)}
                  className="w-full rounded-xl border border-[#eadfce] bg-white px-4 py-2.5 text-left text-[13px] text-[#282823] transition-colors hover:bg-[#f8f5ef]"
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}

          <form
            className="border-t border-[#eadfce] bg-white p-3"
            onSubmit={(event) => {
              event.preventDefault();
              handleSend(input);
            }}
          >
            <div className="flex items-center gap-2 rounded-full bg-[#f8f5ef] px-4 py-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask about safari planning..."
                className="min-w-0 flex-1 bg-transparent text-[13px] text-[#282823] outline-none placeholder:text-[#8a8378]"
                aria-label="Ask Simba a safari planning question"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#B18A52] text-white transition-colors hover:bg-[#9f7946] disabled:opacity-45"
                aria-label="Send message"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
            <p className="mt-2 text-center text-[10px] text-[#8a8378]">
              Verified Simbali guidance with AI support when connected. For final quotes, use the journey form.
            </p>
          </form>
        </section>
      )}
    </>
  );
}
