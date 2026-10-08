import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";
import { z } from "npm:zod@3";

const Shot = z.object({
  viewport: z.enum(["desktop", "tablet", "mobile"]),
  dataUrl: z.string().regex(/^data:image\/(png|jpeg|webp);base64,/, "Must be a PNG, JPEG or WEBP image").max(4_000_000),
});
const Body = z.object({
  page: z.string().max(300).optional().default(""),
  notes: z.string().max(2000).optional().default(""),
  shots: z.array(Shot).min(1).max(3),
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
    const { page, notes, shots } = parsed.data;

    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) return json({ error: "AI is not configured." }, 500);

    const prompt = `You are a senior front-end QA reviewer. The images are screenshots of the same page${page ? ` (${page})` : ""} on a minimal black-and-white portfolio site with square corners. Screenshots in order: ${shots.map((s, i) => `#${i + 1} = ${s.viewport}`).join(", ")}.
Admin notes: ${notes || "(none)"}
Find real responsive layout problems you can SEE: overflow/cut-off content, horizontal scroll, overlapping elements, text too small or too long, cramped spacing, broken image ratios, tap targets too small, misaligned grids, hidden navigation. Do not invent problems. For each, give a concrete fix (e.g. Tailwind classes like "flex-col sm:flex-row", "text-sm md:text-base", "min-w-0 truncate"). Severity: high, medium or low. Also give a one-sentence overall summary.`;
    const content: unknown[] = [{ type: "input_text", text: prompt }];
    for (const s of shots) {
      content.push({ type: "input_text", text: `Screenshot: ${s.viewport}` });
      content.push({ type: "input_image", image_url: s.dataUrl });
    }
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
        input: [{ role: "user", content }],
        stream: true,
        store: false,
        reasoning: { effort: "medium", summary: "auto" },
        include: ["reasoning.encrypted_content"],
        text: {
          format: {
            type: "json_schema",
            name: "layout_review",
            strict: true,
            schema: {
              type: "object",
              additionalProperties: false,
              required: ["summary", "issues"],
              properties: {
                summary: { type: "string" },
                issues: {
                  type: "array",
                  items: {
                    type: "object",
                    additionalProperties: false,
                    required: ["viewport", "severity", "problem", "fix"],
                    properties: {
                      viewport: { type: "string", enum: ["desktop", "tablet", "mobile", "all"] },
                      severity: { type: "string", enum: ["high", "medium", "low"] },
                      problem: { type: "string" },
                      fix: { type: "string" },
                    },
                  },
                },
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
    return json({ summary: String(out.summary ?? ""), issues: Array.isArray(out.issues) ? out.issues.slice(0, 20) : [] }, 200, extra);
  } catch (e) {
    if (req.signal.aborted) return new Response(null, { status: 499, headers: corsHeaders });
    return json({ error: e instanceof Error ? e.message : "Unexpected error" }, 500);
  }
});
