import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") || "";
const NOTIFY_EMAIL = Deno.env.get("NOTIFY_EMAIL") || "";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    if (!RESEND_API_KEY || !NOTIFY_EMAIL) {
      return new Response(
        JSON.stringify({ error: "Email service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = await req.json();
    const { name, company_name, email, phone, sms_opt_in, monthly_volume, notes } = body;

    const htmlContent = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #1a1a2e; border-bottom: 2px solid #6c63ff; padding-bottom: 12px;">New Member Application</h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 12px 8px; font-weight: 600; color: #555; width: 160px;">Name</td>
            <td style="padding: 12px 8px; color: #1a1a2e;">${name}</td>
          </tr>
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 12px 8px; font-weight: 600; color: #555;">Company</td>
            <td style="padding: 12px 8px; color: #1a1a2e;">${company_name}</td>
          </tr>
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 12px 8px; font-weight: 600; color: #555;">Email</td>
            <td style="padding: 12px 8px; color: #1a1a2e;"><a href="mailto:${email}">${email}</a></td>
          </tr>
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 12px 8px; font-weight: 600; color: #555;">Phone</td>
            <td style="padding: 12px 8px; color: #1a1a2e;">${phone}</td>
          </tr>
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 12px 8px; font-weight: 600; color: #555;">SMS Opt-in</td>
            <td style="padding: 12px 8px; color: #1a1a2e;">${sms_opt_in ? "Yes" : "No"}</td>
          </tr>
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 12px 8px; font-weight: 600; color: #555;">Monthly Volume</td>
            <td style="padding: 12px 8px; color: #1a1a2e;">${monthly_volume}</td>
          </tr>
          ${notes ? `<tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 12px 8px; font-weight: 600; color: #555;">Notes</td>
            <td style="padding: 12px 8px; color: #1a1a2e;">${notes}</td>
          </tr>` : ""}
        </table>
        <p style="margin-top: 24px; font-size: 12px; color: #999;">This is an automated notification from the SPS membership application form.</p>
      </div>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "SPS Applications <onboarding@resend.dev>",
        to: [NOTIFY_EMAIL],
        subject: `New Member Application: ${company_name} — ${name}`,
        html: htmlContent,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return new Response(
        JSON.stringify({ error: "Failed to send email", detail: errText }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const result = await res.json();
    return new Response(
      JSON.stringify({ success: true, id: result.id }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
