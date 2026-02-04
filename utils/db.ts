// This file handles talking to your Cloudflare Backend

export const saveNoteToCloud = async (code: string, fieldId: string, content: string) => {
  try {
    await fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, fieldId, content })
    });
    console.log("Saved:", fieldId);
  } catch (error) {
    console.error("Failed to save note", error);
  }
};

export const loadNotesFromCloud = async (code: string) => {
  try {
    const response = await fetch(`/api/sync?code=${code}`);
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error("Failed to load notes", error);
    return [];
  }
};
