// Helper functions to communicate with the Cloudflare D1 Backend

export const saveNoteToCloud = async (code: string, fieldId: string, content: string) => {
 try {
   await fetch('/api/sync', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ code, fieldId, content })
   });
   // Optional: console.log(`Saved note for ${fieldId}`);
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