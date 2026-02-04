// utils/db.ts

export const saveNoteToCloud = async (code: string, fieldId: string, content: string) => {
  // 1. ALWAYS save to Local Storage first (Backup)
  try {
    const localKey = `notes_backup_${code}`;
    const existing = localStorage.getItem(localKey);
    let notes = existing ? JSON.parse(existing) : [];
    
    // Check if we are "deleting" (content has isDeleted) or updating
    const noteObj = JSON.parse(content);
    
    // Remove existing version of this note
    notes = notes.filter((n: any) => n.id !== fieldId);
    
    if (!noteObj.isDeleted) {
        notes.push(noteObj);
    }
    
    localStorage.setItem(localKey, JSON.stringify(notes));
  } catch (e) {
    console.warn("Local backup failed", e);
  }

  // 2. Then try Cloud Sync
  try {
    const response = await fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, fieldId, content })
    });
    if (!response.ok) throw new Error('Cloud save failed');
  } catch (error) {
    console.error("Failed to save note to cloud", error);
    // We don't throw here so the UI doesn't crash; we rely on the local backup
  }
};

export const loadNotesFromCloud = async (code: string) => {
  // 1. Try Cloud Load
  try {
    const response = await fetch(`/api/sync?code=${code}`);
    if (response.ok) {
      const cloudData = await response.json();
      // Update local backup with fresh cloud data
      const processedNotes = cloudData.map((row: any) => JSON.parse(row.content));
      localStorage.setItem(`notes_backup_${code}`, JSON.stringify(processedNotes));
      return cloudData;
    }
  } catch (error) {
    console.error("Cloud load failed, switching to offline backup", error);
  }

  // 2. Fallback to Local Storage if Cloud fails
  const local = localStorage.getItem(`notes_backup_${code}`);
  if (local) {
      // We need to format it to match the structure the Dashboard expects from the API
      // The API returns [{ field_id: '...', content: '{...}' }]
      const parsedLocal = JSON.parse(local);
      return parsedLocal.map((note: any) => ({
          field_id: note.id,
          content: JSON.stringify(note)
      }));
  }
  
  return [];
};