
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const WHATSAPP_SERVER_URL = "http://localhost:3001"; // Altere para URL de produção quando estiver pronto

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestUrl = new URL(req.url);
    const path = requestUrl.pathname.replace('/whatsapp', '');
    
    // Redirecionar a requisição para o servidor Node.js
    const response = await fetch(`${WHATSAPP_SERVER_URL}${path}`, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: req.method !== 'GET' ? await req.text() : undefined,
    });
    
    const data = await response.json();
    
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Erro ao redirecionar para servidor WhatsApp:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message || 'Erro ao se comunicar com o servidor WhatsApp'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
