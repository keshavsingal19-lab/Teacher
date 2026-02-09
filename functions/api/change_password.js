// functions/api/change_password.js
import { TEACHERS } from '../teacherData.js';

export async function onRequestPost(context) {
  const { request, env } = context;
  
  if (!env.DB) {
    return new Response(JSON.stringify({ error: "Database not connected" }), { status: 500 });
  }

  try {
    const { teacherId, currentPasscode, newPasscode } = await request.json();

    if (!newPasscode || newPasscode.length < 4) {
      return new Response(JSON.stringify({ success: false, error: "New password must be at least 4 characters." }), { status: 400 });
    }

    // 1. Verify the Current Password works (Auth Check)
    const dbRecord = await env.DB.prepare("SELECT * FROM teacher_credentials WHERE teacher_id = ?").bind(teacherId).first();
    
    let isAuthenticated = false;

    if (dbRecord) {
        // If DB has a custom password, INPUT MUST MATCH IT
        if (dbRecord.password === currentPasscode) {
            isAuthenticated = true;
        }
    } else {
        // If no DB record, INPUT MUST MATCH DEFAULT HARDCODED KEY
        if (teacherId === currentPasscode) {
            isAuthenticated = true;
        }
    }

    if (!isAuthenticated) {
        return new Response(JSON.stringify({ success: false, error: "Current password is incorrect." }), { status: 401 });
    }

    // 2. Save the NEW password
    await env.DB.prepare(`
      INSERT INTO teacher_credentials (teacher_id, password, updated_at) VALUES (?, ?, ?)
      ON CONFLICT(teacher_id) DO UPDATE SET 
      password = excluded.password,
      updated_at = excluded.updated_at
    `).bind(teacherId, newPasscode, Date.now()).run();

    return new Response(JSON.stringify({ success: true }), { headers: { 'Content-Type': 'application/json' } });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}