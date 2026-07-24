// ============================================================
// BILIC - Skin Analysis Edge Function (Supabase Deno Runtime)
// Securely proxies requests to Gemini Vision API
// ============================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// ── Somali Skin Analysis Prompt ────────────────────────────
const SKIN_ANALYSIS_PROMPT = `
You are an expert dermatologist AI specializing in African and Somali melanin-rich skin.
Carefully examine the face in the image and detect all visible skin conditions.

Focus on detecting:
- Skin type: oily, dry, combination, normal, or sensitive
- Acne/pimples severity
- Dark spots / hyperpigmentation (very common in Somali skin)
- Excess oiliness / shine
- Dehydration / dryness patches
- Enlarged pores
- Redness / sensitivity
- General skin health

Return ONLY a valid JSON object. No markdown, no explanation. Use this EXACT structure:
{
  "noocaMaqaarka": "Maqaar Dufanka leh",
  "darajo": "Dhexdhexaad",
  "astaamaha": {
    "finan": 6,
    "dufan": 7,
    "qoyaan": 4,
    "xasaasiyad": 3
  },
  "dhibaatooyinka": [
    "Finan firfircoon oo ku jira dhabannada",
    "Dufan badan oo T-zone (sanka iyo gadhi)"
  ],
  "sababaha": "Dufanka badan iyo isbeddelka hoormoonada ayaa ah sababaha ugu weyn...",
  "talooyinkaSomaalida": [
    "Dhaq wejigaaga laba jeer maalintii oo keliya, haddaad si badan u dhaqdo waxay soo saartaa dufan dheeraad ah",
    "Ha isticmaalin saliid dabiici ah ama cream dufan leh ee wejiga",
    "Cab biyo ugu yaraan 8 koob maalintii si maqaarka loo qoysiiyo gudaha",
    "Ha taaban wejigaaga gacanta ay nadiifna ahayn",
    "Bedel shaashaddaada ama masarkiisa inta badan si uusan bakteriga ugu beddelin maqaarka",
    "Cunto kaydso midho iyo khudaar badan, ka fogow cuntada xoogsanaanta saliidda leh"
  ],
  "qanjiyadaLaGaliyaa": [
    "Niacinamide 10% - yarayaa daloolada iyo dufanka",
    "Salicylic Acid 2% (BHA) - nadiifiya daloolaha xirantay",
    "Zinc PCA - xukuma dufanka",
    "Hyaluronic Acid - qoysii laakiin aan dufanka kordhinin",
    "Sunscreen SPF 50+ - MUHIIM maqaarka madow ee African/Somali"
  ],
  "kiriimadaLaGaliyaa": [
    "Gel-based facial cleanser (aan dufan lahayn)",
    "BHA/Salicylic toner",
    "Serum Niacinamide 10%",
    "Oil-free moisturizer (gel)",
    "Broad spectrum SPF 50 sunscreen"
  ],
  "jadwalkaSubaxda": [
    "1️⃣ Dhaqida Jilicsan — Gel cleanser (1-2 daqiiqo)",
    "2️⃣ Toner BHA — Ku rid cotton pad, ka tag 30 secon",
    "3️⃣ Serum Niacinamide — 3-4 dhibic, si fiican u masax",
    "4️⃣ Moisturizer Fudud — Oil-free, gaar meel walba",
    "5️⃣ Sunscreen SPF 50 — Tallaabadan ha marnaba ka reebina!"
  ],
  "jadwalkaHabeenka": [
    "1️⃣ Micellar Water — Ka saar makeup iyo qoobka",
    "2️⃣ Gel Cleanser — Dhaq si fiican oo jilicsan",
    "3️⃣ BHA Exfoliant — Salicylic Acid, isticmaal 3 jeer usbuuc",
    "4️⃣ Spot Treatment — Benzoyl Peroxide 2.5% xabadaha",
    "5️⃣ Moisturizer Fudud — Gel-based, qoysii laakiin fudud"
  ],
  "faallo": "Maqaarkaagu wuxuu u baahan yahay nidaam joogto ah. Samee jadwalka 4-8 toddobaad si aad natiijada fiican u aragto."
}

CRITICAL RULES:
- All text values MUST be written in Somali language (Af-Soomaali)
- astaamaha scores must be integers 0-10
- If no face is clearly visible, set noocaMaqaarka to "Ma cadda" and reduce scores to 0
- Focus especially on hyperpigmentation and dark spots — very common in Somali/African skin
- Recommend SPF always — UV protection is crucial for melanin-rich skin
`;

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Get API key from Supabase secrets
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

    if (!GEMINI_API_KEY) {
      return new Response(
        JSON.stringify({ error: "API key not configured. Add GEMINI_API_KEY to Supabase secrets." }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }

    const body = await req.json();
    const { imageBase64, textPrompt, mode } = body;

    // Build Gemini API parts
    const parts: Array<Record<string, unknown>> = [];

    // Add image if provided (camera scan mode)
    if (mode === "image" && imageBase64) {
      parts.push({
        inline_data: {
          mime_type: "image/jpeg",
          data: imageBase64,
        },
      });
    }

    // Add the analysis prompt (+ optional text description)
    const fullPrompt = textPrompt
      ? `${SKIN_ANALYSIS_PROMPT}\n\nUser also describes: "${textPrompt}". Factor this into your analysis.`
      : SKIN_ANALYSIS_PROMPT;

    parts.push({ text: fullPrompt });

    // Call Gemini Vision API
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts }],
          generationConfig: {
            temperature: 0.15,
            maxOutputTokens: 2048,
          },
        }),
      }
    );

    const geminiData = await geminiRes.json();

    if (!geminiRes.ok) {
      const errMsg = geminiData?.error?.message || "Gemini API error";
      console.error("Gemini error:", errMsg);
      return new Response(
        JSON.stringify({ error: errMsg }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 502 }
      );
    }

    // Parse response
    const rawText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const cleaned = rawText
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    const result = JSON.parse(cleaned);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("Edge function error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
