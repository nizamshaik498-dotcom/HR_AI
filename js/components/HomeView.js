import { storage } from '../utils/storage.js';

export class HomeView {
  constructor(onCategorySelect, onResumeSession) {
    this.onCategorySelect = typeof onCategorySelect === 'function' ? onCategorySelect : () => {};
    this.onResumeSession = typeof onResumeSession === 'function' ? onResumeSession : () => {};
    this.categories = [
      { id: 'behavioral', name: 'Behavioral', icon: '💬', desc: 'STAR method questions on teamwork, conflict, leadership', count: 15, color: '#3b82f6' },
      { id: 'system-design', name: 'System Design', icon: '🏗️', desc: 'Scalability, architecture, trade-offs, CAP theorem', count: 12, color: '#8b5cf6' },
      { id: 'coding', name: 'Coding', icon: '💻', desc: 'Data structures, algorithms, LeetCode-style problems', count: 20, color: '#10b981' },
      { id: 'leadership', name: 'Leadership', icon: '👑', desc: 'Amazon LPs, people management, decision making', count: 10, color: '#f59e0b' },
      { id: 'domain', name: 'Domain Expertise', icon: '🎯', desc: 'Frontend, Backend, DevOps, ML, Security specifics', count: 18, color: '#ec4899' }
    ];
    this.render();
    this.bindEvents();
    this.checkResumeSession();
  }

  render() {
    const grid = document.getElementById('category-grid');
    if (!grid) return;
    grid.innerHTML = this.categories.map(cat => `
      <article class="category-card" data-category="${cat.id}" tabindex="0" role="listitem">
        <span class="category-icon" style="color: ${cat.color}">${cat.icon}</span>
        <h3 class="category-name">${cat.name}</h3>
        <p class="category-desc">${cat.desc}</p>
        <div class="category-meta">
          <span>📝 ${cat.count} questions</span>
          <span>⏱️ ~${cat.count * 3} min</span>
        </div>
      </article>
    `).join('');
  }

  bindEvents() {
    const grid = document.getElementById('category-grid');
    if (!grid) return;

    grid.addEventListener('click', (e) => {
      const card = e.target.closest('.category-card');
      if (card) this.onCategorySelect(card.dataset.category);
    });

    grid.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        const card = e.target.closest('.category-card');
        if (card) { e.preventDefault(); this.onCategorySelect(card.dataset.category); }
      }
    });

    const resumeBtn = document.getElementById('btn-resume-session');
    if (resumeBtn) {
      resumeBtn.addEventListener('click', () => {
        this.onResumeSession();
      });
    }

    const clearBtn = document.getElementById('btn-clear-session');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        storage.clearSession();
        this.hideResumeSection();
      });
    }
  }

  checkResumeSession() {
    const session = storage.getSession();
    if (session && session.answers?.length > 0) {
      this.showResumeSection(session);
    }
  }

  showResumeSection(session) {
    const container = document.getElementById('session-resume');
    if (!container) return;
    const category = this.categories.find(c => c.id === session.category);
    const avgScore = session.answers.length > 0
      ? Math.round(session.answers.reduce((s, a) => s + (a.score || 0), 0) / session.answers.length)
      : 0;
    container.innerHTML = `
      <div class="resume-info">
        <strong>Previous Session:</strong> ${category?.name || session.category || 'Unknown'}
        <span>${session.answers.length} answers • ${avgScore}% avg</span>
      </div>
    `;
    container.hidden = false;
  }

  hideResumeSection() {
    const container = document.getElementById('session-resume');
    if (container) container.hidden = true;
  }

  show() {
    const view = document.getElementById('view-home');
    if (view) view.hidden = false;
  }

  hide() {
    const view = document.getElementById('view-home');
    if (view) view.hidden = true;
  }
}