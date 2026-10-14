export class FeedbackView {
  constructor(onNext) {
    this.onNext = typeof onNext === 'function' ? onNext : () => {};
    this.bindEvents();
  }

  bindEvents() {
    const nextBtn = document.getElementById('btn-next-question');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.onNext());
    }
  }

  show(result) {
    const view = document.getElementById('view-feedback');
    if (view) view.hidden = false;

    const circumference = 2 * Math.PI * 54;
    const score = Math.max(0, Math.min(100, result.score || 0));
    const offset = circumference * (1 - score / 100);

    const scoreProgress = document.getElementById('score-progress');
    const scoreValue = document.getElementById('score-value');
    const scoreGrade = document.getElementById('score-grade');
    const matchedPoints = document.getElementById('matched-points');
    const missedPoints = document.getElementById('missed-points');
    const feedbackText = document.getElementById('feedback-text');

    if (scoreProgress) scoreProgress.style.strokeDashoffset = offset;
    if (scoreValue) scoreValue.textContent = `${score}%`;

    const grade = result.grade || { label: 'Needs Improvement', class: 'poor' };
    if (scoreGrade) {
      scoreGrade.textContent = grade.label || 'Needs Improvement';
      scoreGrade.className = `score-grade ${grade.class || 'poor'}`;
    }

    const matched = result.matchedKeywords || result.matched || [];
    const missed = result.missed || [];

    if (matchedPoints) {
      matchedPoints.innerHTML = matched.length
        ? matched.map(p => `<li>${p}</li>`).join('')
        : '<li class="empty">No key points matched</li>';
    }

    if (missedPoints) {
      missedPoints.innerHTML = missed.length
        ? missed.map(p => `<li>${p}</li>`).join('')
        : '<li class="empty">All key points covered!</li>';
    }

    if (feedbackText) feedbackText.textContent = result.feedback || '';
  }

  hide() {
    const view = document.getElementById('view-feedback');
    if (view) view.hidden = true;
  }
}