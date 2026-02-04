import { TEACHERS } from '../teacherData.js';

export async function onRequestPost(context) {
  const { request, env } = context;
  
  // 1. SAFETY CHECK: Ensure Database is connected
  if (!env.DB) {
    return new Response(JSON.stringify({ error: "Database not connected" }), { status: 500 });
  }

  try {
    const body = await request.json();
    const { passcode } = body;
    
    // Get the user's IP Address (The "Fingerprint")
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    const LOCKOUT_TIME = 30 * 60 * 1000; // 30 Minutes in milliseconds
    const MAX_ATTEMPTS = 6;

    // 2. CHECK JAIL: Is this IP locked out?
    const record = await env.DB.prepare("SELECT * FROM login_attempts WHERE ip_address = ?").bind(ip).first();
    
    if (record) {
      const timePassed = Date.now() - record.last_attempt;
      
      // If they are over the limit AND it hasn't been 30 minutes yet
      if (record.attempts >= MAX_ATTEMPTS && timePassed < LOCKOUT_TIME) {
        const minutesLeft = Math.ceil((LOCKOUT_TIME - timePassed) / 60000);
        return new Response(JSON.stringify({ 
          success: false, 
          error: `Too many failed attempts. Try again in ${minutesLeft} minutes.` 
        }), { status: 429 }); // 429 = Too Many Requests
      }

      // If 30 minutes have passed, we reset their count implicitly below
      if (timePassed > LOCKOUT_TIME) {
        // Optional: You could delete the record here, but we will handle it in the update logic
      }
    }

    // 3. VALIDATE PASSWORD
    if (!passcode) {
        return new Response(JSON.stringify({ error: "Passcode required" }), { status: 400 });
    }

    const teacherKey = Object.keys(TEACHERS).find(k => k.toLowerCase() === passcode.trim().toLowerCase());

    if (teacherKey) {
      // --- SUCCESS ---
      // Clear their criminal record so they don't get locked out later
      await env.DB.prepare("DELETE FROM login_attempts WHERE ip_address = ?").bind(ip).run();

      const teacherProfile = TEACHERS[teacherKey];
      return new Response(JSON.stringify({ success: true, teacher: teacherProfile }), {
        headers: { 'Content-Type': 'application/json' }
      });

    } else {
      // --- FAILURE ---
      // Add a strike to their record
      let newCount = 1;
      if (record && (Date.now() - record.last_attempt < LOCKOUT_TIME)) {
         newCount = record.attempts + 1;
      }

      // Save the new count to the database
      await env.DB.prepare(`
        INSERT INTO login_attempts (ip_address, attempts, last_attempt) VALUES (?, ?, ?)
        ON CONFLICT(ip_address) DO UPDATE SET 
        attempts = ?,
        last_attempt = ?
      `).bind(ip, newCount, Date.now(), newCount, Date.now()).run();

      const attemptsLeft = MAX_ATTEMPTS - newCount;
      const errorMsg = attemptsLeft > 0 
        ? `Invalid Access Code. ${attemptsLeft} attempts remaining.` 
        : "Invalid Access Code. You are now locked out for 30 minutes.";

      return new Response(JSON.stringify({ success: false, error: errorMsg }), { status: 401 });
    }

  } catch (err) {
    return new Response(JSON.stringify({ error: "Server Error", details: err.message }), { status: 500 });
  }
}