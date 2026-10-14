import { storage } from '../utils/storage.js';

export class ConfigModal {
  constructor(onStart, onCancel) {
    this.onStart = typeof onStart === 'function' ? onStart : () => {};
    this.onCancel = typeof onCancel === 'function' ? onCancel : () => {};
    this.settings = storage.getSettings();
    this.isVisible = false;
    this.bindEvents();
    this.applySettings();
  }

  bindEvents() {
    const closeBtn = document.getElementById('btn-close-modal');
    const cancelBtn = document.getElementById('btn-cancel-config');
    const startBtn = document.getElementById('btn-start-interview');
    const timerInput = document.getElementById('config-timer');
    const countSelect = document.getElementById('config-question-count');
    const shuffleCheckbox = document.getElementById('config-shuffle');
    const modalOverlay = document.getElementById('modal-overlay');
    const viewConfig = document.getElementById('view-config');

    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.hide());
    }

    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => this.hide());
    }

    if (startBtn) {
      startBtn.addEventListener('click', () => this.start());
    }

    if (timerInput) {
      timerInput.addEventListener('change', (e) => {
        const val = parseInt(e.target.value, 10);
        this.settings.timer = Number.isNaN(val) ? 3 : Math.max(1, Math.min(10, val));
        this.updateHint();
      });
    }

    if (countSelect) {
      countSelect.addEventListener('change', (e) => {
        this.settings.questionCount = e.target.value;
      });
    }

    if (shuffleCheckbox) {
      shuffleCheckbox.addEventListener('change', (e) => {
        this.settings.shuffle = e.target.checked;
      });
    }

    if (modalOverlay) {
      modalOverlay.addEventListener('click', (e) => {
        if (e.target === e.currentTarget) this.hide();
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && viewConfig && !viewConfig.hidden) this.hide();
    });
  }

  applySettings() {
    const timerInput = document.getElementById('config-timer');
    const countSelect = document.getElementById('config-question-count');
    const shuffleCheckbox = document.getElementById('config-shuffle');

    if (timerInput) timerInput.value = this.settings.timer;
    if (countSelect) countSelect.value = this.settings.questionCount;
    if (shuffleCheckbox) shuffleCheckbox.checked = this.settings.shuffle;
    this.updateHint();
  }

  updateHint() {
    const hintEl = document.getElementById('config-hint');
    if (!hintEl) return;
    const timer = this.settings.timer;
    const count = this.settings.questionCount;
    const total = count === 'all' ? 'all' : parseInt(count, 10);
    const estMinutes = count === 'all' ? '~45' : `${total * timer}`;
    hintEl.textContent = `Estimated time: ${estMinutes} minutes`;
  }

  start() {
    storage.saveSettings(this.settings);
    this.onStart({ ...this.settings });
  }

  show() {
    const viewConfig = document.getElementById('view-config');
    const timerInput = document.getElementById('config-timer');
    if (viewConfig) {
      viewConfig.hidden = false;
      this.isVisible = true;
    }
    if (timerInput) timerInput.focus();
    this.applySettings();
  }

  hide() {
    const viewConfig = document.getElementById('view-config');
    if (viewConfig) {
      viewConfig.hidden = true;
      this.isVisible = false;
    }
    this.onCancel();
  }
}