import { TEACHERS } from '../teacherData.js';

export async function onRequestPost(context) {
  try {
    const { request } = context;
    const body = await request.json();
    const { passcode } = body;

    if (!passcode) {
      return new Response(JSON.stringify({ error: "Passcode required" }), { status: 400 });
    }

    // Secure Lookup (Case Insensitive)
    const teacherKey = Object.keys(TEACHERS).find(k => k.toLowerCase() === passcode.trim().toLowerCase());
    
    if (teacherKey) {
      const teacherProfile = TEACHERS[teacherKey];
      
      return new Response(JSON.stringify({ success: true, teacher: teacherProfile }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      return new Response(JSON.stringify({ success: false, error: "Invalid Access Code" }), { status: 401 });
    }

  } catch (err) {
    return new Response(JSON.stringify({ error: "Server Error" }), { status: 500 });
  }
}