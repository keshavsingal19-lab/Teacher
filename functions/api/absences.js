export async function onRequest(context) {
  const { request, env } = context;
  
  // Use IST Timezone
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }); 

  if (!env.DB) {
    return new Response(JSON.stringify({ success: false, error: "Database not configured" }), { status: 500 });
  }

  // --- GET: Publicly Accessible (Read Only) ---
  if (request.method === "GET") {
    try {
      const { results } = await env.DB.prepare(
        "SELECT teacher_id FROM daily_absences WHERE date = ?"
      ).bind(today).all();
      
      const ids = results.map(r => r.teacher_id);
      return new Response(JSON.stringify({ success: true, absentIds: ids }), { 
          headers: { "Content-Type": "application/json" } 
      });
    } catch (e) {
      return new Response(JSON.stringify({ success: false, error: e.message }), { status: 500 });
    }
  }

  // --- POST: Protected (Admin Only) ---
  if (request.method === "POST") {
    try {
      // SECURITY CHECK: Verify the Admin Token Header
      const adminToken = request.headers.get('X-Admin-Token');
      
      if (!env.ADMIN_PASSWORD || adminToken !== env.ADMIN_PASSWORD) {
          return new Response(JSON.stringify({ success: false, error: "Unauthorized" }), { status: 401 });
      }

      const { teacherId, action } = await request.json(); 
      
      if (action === 'MARK') {
        await env.DB.prepare(
          "INSERT OR IGNORE INTO daily_absences (date, teacher_id) VALUES (?, ?)"
        ).bind(today, teacherId).run();
      } else {
        await env.DB.prepare(
          "DELETE FROM daily_absences WHERE date = ? AND teacher_id = ?"
        ).bind(today, teacherId).run();
      }
      return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });
    } catch (e) {
      return new Response(JSON.stringify({ success: false, error: e.message }), { status: 500 });
    }
  }

  return new Response("Method not allowed", { status: 405 });
}