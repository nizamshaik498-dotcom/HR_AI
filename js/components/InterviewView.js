import { Timer } from '../utils/timer.js';

export class InterviewView {
  constructor(onSubmit, onNext, onQuit) {
    this.onSubmit = typeof onSubmit === 'function' ? onSubmit : () => {};
    this.onNext = typeof onNext === 'function' ? onNext : () => {};
    this.onQuit = typeof onQuit === 'function' ? onQuit : () => {};
    this.timer = null;
    this.currentQuestion = null;
    this.bindEvents();
  }

  bindEvents() {
    const textarea = document.getElementById('answer-input');
    const submitBtn = document.getElementById('btn-submit-answer');
    const charCount = document.getElementById('char-count');

    if (textarea && charCount && submitBtn) {
      textarea.addEventListener('input', () => {
        const len = textarea.value.length;
        charCount.textContent = `${len} characters`;
        submitBtn.disabled = len < 10;
      });

      textarea.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey) {
          e.preventDefault();
          if (!submitBtn.disabled) this.submit();
        }
      });

      submitBtn.addEventListener('click', () => this.submit());
    }
  }

  show(question, index, total, settings) {
    if (!question) return;
    this.currentQuestion = question;

    const view = document.getElementById('view-interview');
    if (view) view.hidden = false;

    const progressText = document.getElementById('progress-text');
    const progressFill = document.getElementById('progress-fill');
    const questionNumber = document.getElementById('question-number');
    const difficultyBadge = document.getElementById('difficulty-badge');
    const questionText = document.getElementById('question-text');
    const tagsContainer = document.getElementById('question-tags');
    const answerInput = document.getElementById('answer-input');
    const charCount = document.getElementById('char-count');
    const submitBtn = document.getElementById('btn-submit-answer');

    if (progressText) progressText.textContent = `Question ${index} of ${total}`;
    if (progressFill) progressFill.style.width = `${total > 0 ? ((index - 1) / total) * 100 : 0}%`;
    if (questionNumber) questionNumber.textContent = `Question ${index}`;
    if (difficultyBadge) {
      difficultyBadge.textContent = question.difficulty || 'Medium';
      difficultyBadge.className = `difficulty-badge ${(question.difficulty || 'medium').toLowerCase()}`;
    }
    if (questionText) questionText.textContent = question.text || '';
    if (tagsContainer) tagsContainer.innerHTML = (question.tags || []).map(t => `<span class="tag">${t}</span>`).join('');
    if (answerInput) answerInput.value = '';
    if (charCount) charCount.textContent = '0 characters';
    if (submitBtn) submitBtn.disabled = true;

    const timerSeconds = (settings?.timer || 3) * 60;
    this.startTimer(timerSeconds);
  }

  startTimer(seconds) {
    const timerDisplay = document.getElementById('timer-display');
    const timerProgress = document.getElementById('timer-progress');

    this.timer = new Timer({
      duration: seconds,
      onTick: (remaining) => {
        if (timerDisplay) timerDisplay.textContent = this.timer.formatTime(remaining);
        const progress = this.timer.getProgress();
        const circumference = 2 * Math.PI * 45;
        if (timerProgress) timerProgress.style.strokeDashoffset = circumference * (1 - progress);
        if (timerProgress) {
          timerProgress.classList.toggle('warning', remaining <= 60 && remaining > 15);
          timerProgress.classList.toggle('danger', remaining <= 15);
        }
      },
      onEnd: () => this.submit(),
      onWarning: () => {
        if (timerProgress) timerProgress.classList.add('warning');
      },
      onDanger: () => {
        if (timerProgress) timerProgress.classList.add('danger');
      }
    });
    this.timer.start();
  }

  submit() {
    const answerInput = document.getElementById('answer-input');
    const answer = answerInput?.value?.trim() || '';
    if (answer.length < 10) return;
    if (this.timer) {
      const remaining = this.timer.getRemaining();
      this.timer.destroy();
      this.onSubmit(answer, remaining);
    }
  }

  hide() {
    const view = document.getElementById('view-interview');
    if (view) view.hidden = true;
    if (this.timer) {
      this.timer.destroy();
      this.timer = null;
    }
  }
}