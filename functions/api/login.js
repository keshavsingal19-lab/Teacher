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
    
    // Get the user's IP Address
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    const LOCKOUT_TIME = 30 * 60 * 1000; // 30 Minutes
    const MAX_ATTEMPTS = 6;

    // 2. CHECK JAIL: Is this IP locked out?
    const record = await env.DB.prepare("SELECT * FROM login_attempts WHERE ip_address = ?").bind(ip).first();
    
    if (record) {
      const timePassed = Date.now() - record.last_attempt;
      if (record.attempts >= MAX_ATTEMPTS && timePassed < LOCKOUT_TIME) {
        const minutesLeft = Math.ceil((LOCKOUT_TIME - timePassed) / 60000);
        return new Response(JSON.stringify({ 
          success: false, 
          error: `Too many failed attempts. Try again in ${minutesLeft} minutes.` 
        }), { status: 429 }); 
      }
    }

    // 3. VALIDATE PASSWORD
    if (!passcode) {
        return new Response(JSON.stringify({ error: "Passcode required" }), { status: 400 });
    }

    // --- A. CHECK DATABASE FOR CUSTOM PASSWORD ---
    const dbMatch = await env.DB.prepare("SELECT teacher_id FROM teacher_credentials WHERE password = ?").bind(passcode).first();

    if (dbMatch) {
        const profile = TEACHERS[dbMatch.teacher_id];
        if (profile) {
             await env.DB.prepare("DELETE FROM login_attempts WHERE ip_address = ?").bind(ip).run();
             return new Response(JSON.stringify({ success: true, teacher: profile }), {
                 headers: { 'Content-Type': 'application/json' }
             });
        }
    }

    // --- B. CHECK DEFAULT KEYS (FALLBACK) ---
    const teacherKey = Object.keys(TEACHERS).find(k => k.toLowerCase() === passcode.trim().toLowerCase());

    if (teacherKey) {
        // SECURITY: If a custom password exists, BLOCK the old default code
        const hasCustomPass = await env.DB.prepare("SELECT 1 FROM teacher_credentials WHERE teacher_id = ?").bind(teacherKey).first();

        if (hasCustomPass) {
             return new Response(JSON.stringify({ success: false, error: "Invalid Access Code (Custom password active)" }), { status: 401 });
        }

        await env.DB.prepare("DELETE FROM login_attempts WHERE ip_address = ?").bind(ip).run();
        return new Response(JSON.stringify({ success: true, teacher: TEACHERS[teacherKey] }), {
            headers: { 'Content-Type': 'application/json' }
        });
    }

    // --- FAILURE ---
    let newCount = 1;
    if (record && (Date.now() - record.last_attempt < LOCKOUT_TIME)) {
       newCount = record.attempts + 1;
    }

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

  } catch (err) {
    return new Response(JSON.stringify({ error: "Server Error", details: err.message }), { status: 500 });
  }
}