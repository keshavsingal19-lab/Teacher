import { ClassNote } from '../types';

// Configuration for Cloud Sync
// To enable cross-device sync, you need a simple backend that supports GET and POST JSON data.
// For example, you could use a service like simplejsonbin.com or your own server.
const CLOUD_SYNC_ENABLED = false; // Set to true after configuring API_URL
const API_URL = 'https://api.your-backend.com/notes'; //placeholder

const STORAGE_KEY_PREFIX = 'notes_v2_';

export const NotesService = {
  /**
   * Fetches notes from the cloud (if enabled) or local storage.
   */
  async getNotes(teacherId: string): Promise<ClassNote[]> {
    // 1. Try Cloud Fetch
    if (CLOUD_SYNC_ENABLED) {
        try {
            const response = await fetch(`${API_URL}/${teacherId}`);
            if (response.ok) {
                const data = await response.json();
                // Update local cache
                localStorage.setItem(`${STORAGE_KEY_PREFIX}${teacherId}`, JSON.stringify(data));
                return data;
            }
        } catch (error) {
            console.warn('Cloud sync failed, falling back to local storage', error);
        }
    }

    // 2. Fallback to Local Storage (Offline or No Backend)
    // We simulate a small network delay for better UX feel during development
    if (CLOUD_SYNC_ENABLED) {
        // If we tried cloud and failed, return local immediately
        const local = localStorage.getItem(`${STORAGE_KEY_PREFIX}${teacherId}`);
        return local ? JSON.parse(local) : [];
    } else {
        // If cloud is disabled, simulate async load
        return new Promise((resolve) => {
            setTimeout(() => {
                const local = localStorage.getItem(`${STORAGE_KEY_PREFIX}${teacherId}`);
                resolve(local ? JSON.parse(local) : []);
            }, 600);
        });
    }
  },

  /**
   * Saves notes to local storage immediately and tries to push to cloud.
   */
  async saveNotes(teacherId: string, notes: ClassNote[]): Promise<boolean> {
    // 1. Optimistic Local Save
    localStorage.setItem(`${STORAGE_KEY_PREFIX}${teacherId}`, JSON.stringify(notes));

    // 2. Cloud Push
    if (CLOUD_SYNC_ENABLED) {
        try {
            await fetch(`${API_URL}/${teacherId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(notes) // Sending array directly or wrap in { notes: ... } depending on API
            });
            return true;
        } catch (error) {
            console.error('Cloud save failed', error);
            return false;
        }
    }
    
    // Simulate network delay
    await new Promise(r => setTimeout(r, 400));
    return true;
  }
};