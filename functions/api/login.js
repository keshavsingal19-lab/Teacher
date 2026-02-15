import { TEACHERS } from '../teacherData.js';

export async function onRequestPost(context) {
  const { request, env } = context;
  
  if (!env.DB) {
    return new Response(JSON.stringify({ error: "Database not connected" }), { status: 500 });
  }

  try {
    const body = await request.json();
    const { passcode } = body;
    
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    const LOCKOUT_TIME = 30 * 60 * 1000;
    const MAX_ATTEMPTS = 6;

    const record = await env.DB.prepare("SELECT * FROM login_attempts WHERE ip_address = ?").bind(ip).first();
    
    if (record) {
      const timePassed = Date.now() - record.last_attempt;
      if (record.attempts >= MAX_ATTEMPTS && timePassed < LOCKOUT_TIME) {
        const minutesLeft = Math.ceil((LOCKOUT_TIME - timePassed) / 60000);
        return new Response(JSON.stringify({ success: false, error: `Too many failed attempts. Try again in ${minutesLeft} minutes.` }), { status: 429 }); 
      }
    }

    if (!passcode) return new Response(JSON.stringify({ error: "Passcode required" }), { status: 400 });

    if (env.ADMIN_PASSWORD && passcode === env.ADMIN_PASSWORD) {
        await env.DB.prepare("DELETE FROM login_attempts WHERE ip_address = ?").bind(ip).run();
        return new Response(JSON.stringify({ success: true, teacher: { id: 'ADMIN', name: 'Administrator', department: 'Admin Console' }, isAdmin: true, token: passcode }), { headers: { 'Content-Type': 'application/json' } });
    }

    // A1. Check ACTIVE Passwords (If successful, clear any pending ones)
    const dbMatchActive = await env.DB.prepare("SELECT teacher_id FROM teacher_credentials WHERE password = ?").bind(passcode).first();
    if (dbMatchActive) {
        const profile = TEACHERS[dbMatchActive.teacher_id];
        if (profile) {
             await env.DB.prepare("UPDATE teacher_credentials SET pending_password = NULL WHERE teacher_id = ?").bind(dbMatchActive.teacher_id).run();
             await env.DB.prepare("DELETE FROM login_attempts WHERE ip_address = ?").bind(ip).run();
             return new Response(JSON.stringify({ success: true, teacher: profile }), { headers: { 'Content-Type': 'application/json' } });
        }
    }

    // A2. Check PENDING Passwords (SWITCHEROO: make active, clear pending)
    const dbMatchPending = await env.DB.prepare("SELECT teacher_id FROM teacher_credentials WHERE pending_password = ?").bind(passcode).first();
    if (dbMatchPending) {
        const profile = TEACHERS[dbMatchPending.teacher_id];
        if (profile) {
             await env.DB.prepare("UPDATE teacher_credentials SET password = ?, pending_password = NULL WHERE teacher_id = ?").bind(passcode, dbMatchPending.teacher_id).run();
             await env.DB.prepare("DELETE FROM login_attempts WHERE ip_address = ?").bind(ip).run();
             return new Response(JSON.stringify({ success: true, teacher: profile }), { headers: { 'Content-Type': 'application/json' } });
        }
    }

    // B. Check Default Keys
    const teacherKey = Object.keys(TEACHERS).find(k => k.toLowerCase() === passcode.trim().toLowerCase());
    if (teacherKey) {
        const hasCustomPass = await env.DB.prepare("SELECT password FROM teacher_credentials WHERE teacher_id = ?").bind(teacherKey).first();
        if (hasCustomPass && hasCustomPass.password !== teacherKey.toLowerCase()) {
             return new Response(JSON.stringify({ success: false, error: "Invalid Access Code (Custom password active)" }), { status: 401 });
        }
        await env.DB.prepare("DELETE FROM login_attempts WHERE ip_address = ?").bind(ip).run();
        return new Response(JSON.stringify({ success: true, teacher: TEACHERS[teacherKey] }), { headers: { 'Content-Type': 'application/json' } });
    }

    let newCount = 1;
    if (record && (Date.now() - record.last_attempt < LOCKOUT_TIME)) newCount = record.attempts + 1;
    await env.DB.prepare(`INSERT INTO login_attempts (ip_address, attempts, last_attempt) VALUES (?, ?, ?) ON CONFLICT(ip_address) DO UPDATE SET attempts = ?, last_attempt = ?`).bind(ip, newCount, Date.now(), newCount, Date.now()).run();

    return new Response(JSON.stringify({ success: false, error: "Invalid Access Code" }), { status: 401 });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Server Error", details: err.message }), { status: 500 });
  }
}