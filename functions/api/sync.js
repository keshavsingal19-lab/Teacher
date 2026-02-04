export async function onRequest(context) {
 const { request, env } = context;
 const url = new URL(request.url);
 
 // GET: Load notes for a specific teacher
 if (request.method === "GET") {
   const code = url.searchParams.get("code");
   // Select all notes associated with this teacher code
   const results = await env.DB.prepare(
     "SELECT field_id, content FROM notes WHERE access_code = ?"
   ).bind(code).all();
   return new Response(JSON.stringify(results.results));
 }

 // POST: Save a specific note
 if (request.method === "POST") {
   const body = await request.json();
   const { code, fieldId, content } = body;

   if (!code || !fieldId) {
     return new Response("Missing Data", { status: 400 });
   }

   // Upsert: Insert new note OR update if it already exists
   await env.DB.prepare(`
     INSERT INTO notes (access_code, field_id, content, updated_at) VALUES (?, ?, ?, ?)
     ON CONFLICT(access_code, field_id) DO UPDATE SET 
     content = excluded.content,
     updated_at = excluded.updated_at
   `).bind(code, fieldId, content, Date.now()).run();

   return new Response(JSON.stringify({ success: true }));
 }

 return new Response("Method not allowed", { status: 405 });
}