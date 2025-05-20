
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RECAPTCHA_SECRET_KEY = Deno.env.get("RECAPTCHA_SECRET_KEY");

// CORS headers for browser access
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface VerifyRequest {
  token: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { token } = await req.json() as VerifyRequest;
    
    if (!token) {
      return new Response(
        JSON.stringify({ success: false, error: "Token is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Make request to Google's reCAPTCHA verification API
    const verificationUrl = "https://www.google.com/recaptcha/api/siteverify";
    const formData = new URLSearchParams({
      secret: RECAPTCHA_SECRET_KEY!,
      response: token,
    });

    const response = await fetch(verificationUrl, {
      method: "POST",
      body: formData.toString(),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const verification = await response.json();
    console.log("reCAPTCHA verification response:", verification);

    // For v3 reCAPTCHA, you can also check the score
    const isHuman = verification.success && verification.score >= 0.5;

    return new Response(
      JSON.stringify({ success: isHuman, data: verification }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error) {
    console.error("Error verifying reCAPTCHA:", error);
    
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
