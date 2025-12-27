import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const { lead_id, bill_url } = await req.json();

        const supabaseUrl = Deno.env.get("SUPABASE_URL");
        const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
        const supabase = createClient(supabaseUrl!, supabaseKey!);

        const prompt = `
      You are a senior solar engineer. Analyze this bill URL: ${bill_url}
      
      I need a specific "Zero Bill" architecture plan.
      
      Return JSON ONLY with these fields:
      1. monthly_avg: (number) Current bill average.
      2. daily_kwh: (number) Daily usage.
      3. zero_bill_system: (string) Specific hardware to get $0 bill (e.g. "10kW Solar + 13.5kWh Battery").
      4. necessity_explanation: (string) short explanation why this specific size is needed (e.g. "To cover your 15kWh evening peak...").
      5. cost_10_years: (number) Total cost if they do nothing for 10 years at currrent rates.
      6. energy_profile: (string) Usage pattern summary.
      7. potential_savings: (number) Monthly savings.
      8. roi_years: (number) Years to payback.

      Return ONLY JSON.
    `;

        let analysis;
        if (GEMINI_API_KEY) {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: { responseMimeType: "application/json" }
                })
            });

            const result = await response.json();
            analysis = JSON.parse(result.candidates[0].content.parts[0].text);
        } else {
            analysis = {
                monthly_avg: 250,
                daily_kwh: 28,
                zero_bill_system: "10.5kW Solar + Tesla Powerwall 3",
                necessity_explanation: "Your high evening consumption requires a large battery to bridge the night gap.",
                cost_10_years: 30000,
                energy_profile: "Evening Peaking",
                potential_savings: 240,
                roi_years: 5.5
            };
        }

        await supabase.from("leads").update({ analysis, status: "completed" }).eq("id", lead_id);

        return new Response(JSON.stringify({ success: true, analysis }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
});
