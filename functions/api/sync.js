export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  // 1. SAFETY CHECK: Does the database binding exist?
  if (!env.DB) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: "Database binding 'DB' is missing. Please check Cloudflare Settings > Functions > D1 Database Bindings." 
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }

  try {
    // GET: Load notes
    if (request.method === "GET") {
      const code = url.searchParams.get("code");
      const results = await env.DB.prepare(
        "SELECT field_id, content FROM notes WHERE access_code = ?"
      ).bind(code).all();
      
      return new Response(JSON.stringify(results.results), { 
        headers: { 'Content-Type': 'application/json' } 
      });
    }

    // POST: Save a specific note
    if (request.method === "POST") {
      const body = await request.json();
      const { code, fieldId, content } = body;

      if (!code || !fieldId) {
        return new Response(JSON.stringify({ error: "Missing required fields (code or fieldId)" }), { status: 400 });
      }

      // Upsert: Insert new note OR update if it already exists
      const result = await env.DB.prepare(`
        INSERT INTO notes (access_code, field_id, content, updated_at) VALUES (?, ?, ?, ?)
        ON CONFLICT(access_code, field_id) DO UPDATE SET 
        content = excluded.content,
        updated_at = excluded.updated_at
      `).bind(code, fieldId, content, Date.now()).run();

      return new Response(JSON.stringify({ success: true, meta: result.meta }), { 
        headers: { 'Content-Type': 'application/json' } 
      });
    }

    return new Response("Method not allowed", { status: 405 });

  } catch (err) {
    // 2. ERROR CATCHER: If SQL fails, tell us why
    return new Response(JSON.stringify({ 
      success: false, 
      error: err.message, 
      stack: err.stack 
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}