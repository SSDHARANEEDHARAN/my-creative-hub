import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";
import { z } from "npm:zod@3";

const Body = z.object({
  kind: z.enum(["project", "blog"]),
  title: z.string().max(300).optional().default(""),
  description: z.string().max(6000).optional().default(""),
  draft: z.string().max(12000).optional().default(""),
});

const json = (body: unknown, status = 200, extra: HeadersInit = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, ...extra, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const auth = req.headers.get("Authorization") ?? "";
    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: auth } },
    });
    const { data: userData } = await supabase.auth.getUser(auth.replace("Bearer ", ""));
    if (!userData.user) return json({ error: "Please sign in." }, 401);
    const { data: isAdmin } = await supabase.rpc("has_role", { _user_id: userData.user.id, _role: "admin" });
    if (!isAdmin) return json({ error: "Admins only." }, 403);

    const parsed = Body.safeParse(await req.json());
    if (!parsed.success) return json({ error: parsed.error.flatten().fieldErrors }, 400);
    const { kind, title, description, draft } = parsed.data;

    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) return json({ error: "AI is not configured." }, 500);

    const prompt = `You are an editor for a mechatronics engineer's portfolio site. Improve this ${kind === "project" ? "project" : "blog post"} draft.
Current title: ${title || "(none)"}
Current ${kind === "project" ? "description" : "excerpt"}: ${description || "(none)"}
Draft / notes: ${draft || "(none)"}

Return 3 clearer alternative titles (max 70 chars), one improved description (max 60 words, specific, plain English), and 3-6 missing details the author should add (e.g. specs, tools, results, metrics).`;
    const upstream = await fetch("https://ai.gateway.lovable.dev/v1/responses", {
      method: "POST",
      signal: req.signal,
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": apiKey,
        "X-Lovable-AIG-SDK": "fetch",
      },
      body: JSON.stringify({
        model: "openai/gpt-6-astra",
        input: prompt,
        stream: true,
        store: false,
        reasoning: { effort: "low", summary: "auto" },
        include: ["reasoning.encrypted_content"],
        text: {
          format: {
            type: "json_schema",
            name: "suggestions",
            strict: true,
            schema: {
              type: "object",
              additionalProperties: false,
              required: ["titles", "description", "missing"],
              properties: {
                titles: { type: "array", items: { type: "string" } },
                description: { type: "string" },
                missing: { type: "array", items: { type: "string" } },
              },
            },
          },
        },
      }),
    });
    const runId = upstream.headers.get("X-Lovable-AIG-Run-ID");
    const extra: Record<string, string> = runId ? { "X-Lovable-AIG-Run-ID": runId } : {};

    if (!upstream.ok || !upstream.body) {
      let message = "AI request failed.";
      try {
        const e = await upstream.json();
        message = e?.error?.message ?? e?.message ?? message;
      } catch { /* ignore */ }
      return json({ error: message }, upstream.status, extra);
    }

    // Consume SSE stream, collecting output text deltas.
    const reader = upstream.body.getReader();
    const decoder = new TextDecoder();
    let buf = "";
    let text = "";
    let failed: string | null = null;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });
      const lines = buf.split("\n");
      buf = lines.pop() ?? "";
      for (const line of lines) {
        if (!line.startsWith("data:")) continue;
        const data = line.slice(5).trim();
        if (!data || data === "[DONE]") continue;
        try {
          const evt = JSON.parse(data);
          if (evt.type === "response.output_text.delta") text += evt.delta ?? "";
          if (evt.type === "response.failed" || evt.type === "error")
            failed = evt?.response?.error?.message ?? evt?.message ?? "AI request failed.";
        } catch { /* ignore */ }
      }
    }
    if (failed) return json({ error: failed }, 502, extra);

    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return json({ error: "The AI didn't return a result. Please try again." }, 502, extra);
    const out = JSON.parse(match[0]);
    return json({
      titles: (out.titles ?? []).map(String).slice(0, 5),
      description: String(out.description ?? ""),
      missing: (out.missing ?? []).map(String).slice(0, 8),
    }, 200, extra);
  } catch (e) {
    if (req.signal.aborted) return new Response(null, { status: 499, headers: corsHeaders });
    return json({ error: e instanceof Error ? e.message : "Unexpected error" }, 500);
  }
});
