import { exportJSON, exportTXT, generateReportData } from '../utils/export.js';
import { storage } from '../utils/storage.js';

export class ResultsView {
  constructor(onRetry, onHome, onExportJSON, onExportTXT) {
    this.onRetry = typeof onRetry === 'function' ? onRetry : () => {};
    this.onHome = typeof onHome === 'function' ? onHome : () => {};
    this.onExportJSON = typeof onExportJSON === 'function' ? onExportJSON : () => {};
    this.onExportTXT = typeof onExportTXT === 'function' ? onExportTXT : () => {};
    this.bindEvents();
  }

  bindEvents() {
    const retryBtn = document.getElementById('btn-retry');
    const homeBtn = document.getElementById('btn-home');
    const exportJsonBtn = document.getElementById('btn-export-json');
    const exportTxtBtn = document.getElementById('btn-export-txt');

    if (retryBtn) retryBtn.addEventListener('click', () => this.onRetry());
    if (homeBtn) homeBtn.addEventListener('click', () => this.onHome());
    if (exportJsonBtn) exportJsonBtn.addEventListener('click', () => this.onExportJSON());
    if (exportTxtBtn) exportTxtBtn.addEventListener('click', () => this.onExportTXT());
  }

  show(session) {
    const view = document.getElementById('view-results');
    if (view) view.hidden = false;

    const categoryNames = {
      'behavioral': 'Behavioral',
      'system-design': 'System Design',
      'coding': 'Coding',
      'leadership': 'Leadership',
      'domain': 'Domain Expertise'
    };

    const categoryEl = document.getElementById('results-category');
    if (categoryEl) categoryEl.textContent = categoryNames[session?.category] || session?.category || 'Unknown';

    const answers = session?.answers || [];
    const scores = answers.map(a => a.score || 0);
    const finalScore = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    const bestScore = scores.length ? Math.max(...scores) : 0;
    const totalTime = answers.reduce((sum, a) => sum + (a.timeSpent || 0), 0);
    const avgTime = answers.length ? Math.round(totalTime / answers.length) : 0;

    this.animateScoreCircle('final-score-progress', finalScore, 72);

    const finalScoreValue = document.getElementById('final-score-value');
    if (finalScoreValue) finalScoreValue.textContent = `${finalScore}%`;

    const statTotalQuestions = document.getElementById('stat-total-questions');
    const statAvgTime = document.getElementById('stat-avg-time');
    const statBestScore = document.getElementById('stat-best-score');
    if (statTotalQuestions) statTotalQuestions.textContent = answers.length;
    if (statAvgTime) statAvgTime.textContent = `${avgTime}s`;
    if (statBestScore) statBestScore.textContent = `${bestScore}%`;

    this.renderBreakdown(answers);
    this.renderInsights(answers);
  }

  animateScoreCircle(progressId, score, radius) {
    const progressEl = document.getElementById(progressId);
    const scoreValue = document.getElementById('final-score-value');
    if (!progressEl) return;

    const circumference = 2 * Math.PI * radius;
    progressEl.style.strokeDasharray = `${circumference}`;
    progressEl.style.strokeDashoffset = `${circumference}`;

    requestAnimationFrame(() => {
      progressEl.style.transition = 'stroke-dashoffset 1.2s ease-out';
      progressEl.style.strokeDashoffset = `${circumference * (1 - Math.max(0, Math.min(100, score)) / 100)}`;
    });

    if (scoreValue) {
      let current = 0;
      const target = Math.max(0, Math.min(100, score));
      const duration = 1200;
      const start = performance.now();
      const animate = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        scoreValue.textContent = `${Math.round(eased * target)}%`;
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }
  }

  renderBreakdown(answers) {
    const container = document.getElementById('breakdown-list');
    if (!container) return;

    container.innerHTML = answers.map((a, i) => {
      const grade = this.getGradeClass(a.score || 0);
      const questionText = (a.question || '').replace(/"/g, '"');
      return `
        <div class="breakdown-item" role="listitem">
          <span class="breakdown-num">${i + 1}.</span>
          <span class="breakdown-question" title="${questionText}">${questionText}</span>
          <span class="breakdown-score ${grade}">${a.score || 0}%</span>
        </div>
      `;
    }).join('');
  }

  renderInsights(answers) {
    const strengthsList = document.getElementById('insight-strengths-list');
    const improvementsList = document.getElementById('insight-improvements-list');
    if (!strengthsList || !improvementsList) return;

    const allMissed = answers.flatMap(a => a.missed || []);
    const missedCount = {};
    allMissed.forEach(m => { missedCount[m] = (missedCount[m] || 0) + 1; });
    const topMissed = Object.entries(missedCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([point]) => point);

    const allMatched = answers.flatMap(a => a.matchedKeywords || a.matched || []);
    const matchedCount = {};
    allMatched.forEach(m => { matchedCount[m] = (matchedCount[m] || 0) + 1; });
    const topMatched = Object.entries(matchedCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([point]) => point);

    strengthsList.innerHTML = topMatched.length
      ? topMatched.map(p => `<li>${p}</li>`).join('')
      : '<li>Complete more interviews to identify strengths</li>';

    improvementsList.innerHTML = topMissed.length
      ? topMissed.map(p => `<li>${p}</li>`).join('')
      : '<li>No significant gaps identified</li>';
  }

  getGradeClass(score) {
    if (score >= 85) return 'excellent';
    if (score >= 70) return 'good';
    if (score >= 50) return 'fair';
    return 'poor';
  }

  hide() {
    const view = document.getElementById('view-results');
    if (view) view.hidden = true;
  }
}