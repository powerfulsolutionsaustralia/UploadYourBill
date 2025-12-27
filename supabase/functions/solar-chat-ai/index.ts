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
        const { messages, lead_id } = await req.json();

        const supabaseUrl = Deno.env.get("SUPABASE_URL");
        const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
        const supabase = createClient(supabaseUrl!, supabaseKey!);

        // Fetch lead context
        const { data: lead } = await supabase
            .from('leads')
            .select('*')
            .eq('id', lead_id)
            .single();

        const systemContext = lead?.analysis
            ? `User's Analysis: ${JSON.stringify(lead.analysis)}. Name: ${lead.name}.`
            : "User has uploaded a bill but analysis is pending.";

        const prompt = `
      You are an expert Solar Sales Consultant for "Upload Your Bill".
      Your goal is to explain the benefits of the proposed system and ULTIMATELY GET THE USER TO BOOK AN APPOINTMENT.
      
      Context: ${systemContext}
      
      Current Conversation:
      ${messages.map((m: any) => `${m.role}: ${m.content}`).join('\n')}
      
      Reply as the consultant. Be helpful, professional, but persuasive. 
      If they ask about technical details, explain simply.
      Always try to steer towards booking a call to finalize the design.
    `;

        if (!GEMINI_API_KEY) {
            return new Response(JSON.stringify({ content: "I'm sorry, I can't connect to my brain right now (Missing API Key)." }), {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const result = await response.json();
        const reply = result.candidates[0].content.parts[0].text;

        return new Response(JSON.stringify({ content: reply }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
});
