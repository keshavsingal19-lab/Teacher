import { TEACHERS } from '../teacherData.js';

export async function onRequestPost(context) {
  const { request, env } = context;

  if (!env.DB) {
    return new Response(JSON.stringify({ error: "Database not connected" }), { status: 500 });
  }

  try {
    const body = await request.json();
    const { teacherId, email } = body;

    if (!teacherId || !email) {
      return new Response(JSON.stringify({ error: "Missing information" }), { status: 400 });
    }

    // SRCC Domain bouncer
    if (!email.trim().toLowerCase().endsWith('@srcc.du.ac.in')) {
       return new Response(JSON.stringify({ error: "Must use an official @srcc.du.ac.in email address" }), { status: 400 });
    }

    const profile = TEACHERS[teacherId];
    if (!profile) {
        return new Response(JSON.stringify({ error: "Teacher not found" }), { status: 404 });
    }

    // Generate 8-character temporary password
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
    let tempPassword = '';
    for (let i = 0; i < 8; i++) {
        tempPassword += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    // Update database with the pending password
    const existing = await env.DB.prepare("SELECT teacher_id FROM teacher_credentials WHERE teacher_id = ?").bind(teacherId).first();
    if (existing) {
        await env.DB.prepare("UPDATE teacher_credentials SET pending_password = ? WHERE teacher_id = ?").bind(tempPassword, teacherId).run();
    } else {
        await env.DB.prepare("INSERT INTO teacher_credentials (teacher_id, password, pending_password) VALUES (?, ?, ?)").bind(teacherId, teacherId.toLowerCase(), tempPassword).run();
    }

    // PASTE YOUR GOOGLE SCRIPT URL HERE
    const scriptUrl = "https://script.google.com/macros/s/AKfycbykXnY4veSJRzXZShbdv6hIM0m7xHKOHYXo80QSBGwYztstsslamRRV_SgZhUvCxFsc/exec"; 

    await fetch(scriptUrl, {
        method: 'POST',
        body: JSON.stringify({
            email: email.trim(),
            name: profile.name,
            tempPassword: tempPassword,
            secretKey: "SRCC_TEACHER_ASSIST_SECRET_2026"
        })
    });

    return new Response(JSON.stringify({ success: true, message: "Password sent to your email" }), { headers: { 'Content-Type': 'application/json' } });

  } catch (err) {
    return new Response(JSON.stringify({ error: "Server Error", details: err.message }), { status: 500 });
  }
}