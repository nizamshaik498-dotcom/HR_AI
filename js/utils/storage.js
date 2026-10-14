const STORAGE_KEYS = {
  SESSION: 'hr_ai_session',
  SETTINGS: 'hr_ai_settings',
  HISTORY: 'hr_ai_history'
};

const DEFAULT_SETTINGS = { timer: 3, questionCount: 'all', shuffle: true };

function validateSession(session) {
  return session &&
         typeof session === 'object' &&
         typeof session.category === 'string' &&
         Array.isArray(session.answers) &&
         typeof session.startTime === 'number';
}

function validateSettings(settings) {
  return settings &&
         typeof settings === 'object' &&
         typeof settings.timer === 'number' &&
         settings.timer >= 1 &&
         settings.timer <= 10 &&
         (settings.questionCount === 'all' || typeof settings.questionCount === 'string') &&
         typeof settings.shuffle === 'boolean';
}

export const storage = {
  getSession() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SESSION);
      if (!data) return null;
      const parsed = JSON.parse(data);
      return validateSession(parsed) ? parsed : null;
    } catch {
      return null;
    }
  },

  saveSession(session) {
    try {
      if (!validateSession(session)) return false;
      localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
      return true;
    } catch {
      return false;
    }
  },

  clearSession() {
    try {
      localStorage.removeItem(STORAGE_KEYS.SESSION);
    } catch {
      // Ignore errors
    }
  },

  getSettings() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (!data) return DEFAULT_SETTINGS;
      const parsed = JSON.parse(data);
      return validateSettings(parsed) ? parsed : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings(settings) {
    try {
      if (!validateSettings(settings)) return false;
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
      return true;
    } catch {
      return false;
    }
  },

  getHistory() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
      if (!data) return [];
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed.slice(0, 50) : [];
    } catch {
      return [];
    }
  },

  addToHistory(result) {
    try {
      if (!result || typeof result !== 'object') return false;
      const history = this.getHistory();
      history.unshift({ ...result, timestamp: Date.now() });
      if (history.length > 50) history.pop();
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
      return true;
    } catch {
      return false;
    }
  },

  clearHistory() {
    try {
      localStorage.removeItem(STORAGE_KEYS.HISTORY);
    } catch {
      // Ignore errors
    }
  }
};