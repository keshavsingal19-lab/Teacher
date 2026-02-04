export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  
  // 1. LOADING DATA (GET)
  if (request.method === "GET") {
    const code = url.searchParams.get("code"); // Get "SIS" or others
    
    // Get all notes for this specific teacher code
    const results = await env.DB.prepare(
      "SELECT field_id, content FROM notes WHERE access_code = ?"
    ).bind(code).all();
    
    return new Response(JSON.stringify(results.results));
  }

  // 2. SAVING DATA (POST)
  if (request.method === "POST") {
    const body = await request.json();
    const { code, fieldId, content } = body;

    // Save or Update the note for that specific box
    await env.DB.prepare(`
      INSERT INTO notes (access_code, field_id, content) VALUES (?, ?, ?)
      ON CONFLICT(access_code, field_id) DO UPDATE SET content = excluded.content
    `).bind(code, fieldId, content).run();

    return new Response(JSON.stringify({ success: true }));
  }
}
