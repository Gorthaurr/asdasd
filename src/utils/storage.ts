// Безопасная работа с localStorage (JSON)
export const getJSON = <T>(key: string, def: T): T => {
    try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) as T : def; } catch { return def; }
};
export const setJSON = (key: string, val: unknown) => {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
};