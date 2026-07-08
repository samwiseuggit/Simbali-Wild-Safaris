import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const GEMINI_MODEL = "gemini-2.0-flash-lite";

const SAFARI_KNOWLEDGE = `
SIMBALI WILD SAFARIS - COMPANY INFORMATION:
- Simbali Wild Safaris is a luxury African safari tour company based in Nairobi, Kenya
- Founded by Sheila and Violet, two avid travelers passionate about Africa
- They specialize in creating exclusive, unforgettable vacation experiences across East Africa
- Countries covered: Kenya, Uganda, Tanzania, Rwanda, Burundi
- Services: Tailored Safari Packages, Luxury Beach Getaways, Cultural Immersion Tours, Adventure Activities
- Contact: Phone +254 713 855 818, Email info@simbaliwildlisafaris.com
- Website: www.simbaliwildsafaris.com
- Blog posts cover: Great Rift Valley Kenya, East Africa Birding Guide, Wildebeest Migration
- The name "Simba" means lion in Swahili
- Over 12 years of experience, 920+ happy customers, 98% customer satisfaction

SAFARI KNOWLEDGE:
- Best time for safari: June-October (dry season), January-February (calving season)
- Kenya: Maasai Mara, Amboseli, Lake Nakuru, Samburu
- Tanzania: Serengeti, Ngorongoro Crater, Zanzibar
- Uganda: Bwindi Impenetrable Forest (gorillas), Queen Elizabeth, Murchison Falls
- Rwanda: Volcanoes National Park (gorillas), Nyungwe Forest, Kigali
- Big Five: Lion, Leopard, Elephant, Rhino, Buffalo
- Great Wildebeest Migration: 1.5+ million animals crossing Serengeti-Maasai Mara
- Safari types: Game drives, walking safaris, hot air balloon, gorilla trekking, bird watching
- Packing: Neutral colors, hat, sunscreen, binoculars, camera, comfortable shoes
- Health: Yellow fever certificate required, malaria prophylaxis recommended
`;

async function callGemini(message: string): Promise<string> {
  if (!GEMINI_API_KEY) {
    return "I'm sorry, the AI service is not configured yet. Please contact us directly at info@simbaliwildlisafaris.com for assistance with your safari planning.";
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `You are Simba, a warm, knowledgeable safari concierge for Simbali Wild Safaris. Use the following company knowledge to answer questions. If the answer is not in the knowledge, use your general safari knowledge. Always be helpful, warm, and professional. Never invent pricing or availability.

COMPANY KNOWLEDGE:
${SAFARI_KNOWLEDGE}

User question: ${message}`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 800,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't process that. Please try again or contact us directly.";
  } catch {
    return "I'm having trouble connecting to my knowledge base right now. Please try again later, or contact us at info@simbaliwildlisafaris.com for immediate assistance.";
  }
}

export const chatRouter = createRouter({
  sendMessage: publicQuery
    .input(z.object({ message: z.string().min(1).max(2000) }))
    .mutation(async ({ input }) => {
      const reply = await callGemini(input.message);
      return { reply };
    }),
});
