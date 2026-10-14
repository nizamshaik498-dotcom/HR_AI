export class Timer {
  constructor({ duration = 180, onTick, onEnd, onWarning, onDanger } = {}) {
    this.duration = Math.max(1, Math.floor(duration));
    this.remaining = this.duration;
    this.onTick = typeof onTick === 'function' ? onTick : () => {};
    this.onEnd = typeof onEnd === 'function' ? onEnd : () => {};
    this.onWarning = typeof onWarning === 'function' ? onWarning : () => {};
    this.onDanger = typeof onDanger === 'function' ? onDanger : () => {};
    this.running = false;
    this.paused = false;
    this.animationId = null;
    this.lastTimestamp = 0;
    this.warningThreshold = 60;
    this.dangerThreshold = 15;
    this.warningTriggered = false;
    this.dangerTriggered = false;
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.paused = false;
    this.lastTimestamp = performance.now();
    this.tick();
  }

  pause() {
    this.paused = true;
    this.running = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  resume() {
    if (!this.paused || this.running) return;
    this.running = true;
    this.paused = false;
    this.lastTimestamp = performance.now();
    this.tick();
  }

  reset(newDuration) {
    this.pause();
    this.duration = Math.max(1, Math.floor(newDuration ?? this.duration));
    this.remaining = this.duration;
    this.warningTriggered = false;
    this.dangerTriggered = false;
    this.emitTick();
  }

  setDuration(seconds) {
    const secs = Math.max(1, Math.floor(seconds));
    this.duration = secs;
    if (!this.running) {
      this.remaining = secs;
      this.emitTick();
    }
  }

  tick(timestamp) {
    if (!this.running) return;

    const delta = Math.max(0, (timestamp - this.lastTimestamp) / 1000);
    this.lastTimestamp = timestamp;
    this.remaining = Math.max(0, this.remaining - delta);

    this.checkThresholds();
    this.emitTick();

    if (this.remaining <= 0) {
      this.running = false;
      this.onEnd();
    } else {
      this.animationId = requestAnimationFrame(this.tick.bind(this));
    }
  }

  checkThresholds() {
    if (!this.warningTriggered && this.remaining <= this.warningThreshold) {
      this.warningTriggered = true;
      this.onWarning();
    }
    if (!this.dangerTriggered && this.remaining <= this.dangerThreshold) {
      this.dangerTriggered = true;
      this.onDanger();
    }
  }

  emitTick() {
    this.onTick(this.remaining, this.duration);
  }

  getProgress() {
    return this.duration > 0 ? 1 - this.remaining / this.duration : 0;
  }

  getRemaining() {
    return Math.ceil(this.remaining);
  }

  formatTime(seconds) {
    const secs = Math.max(0, Math.floor(seconds));
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  destroy() {
    this.pause();
    this.onTick = this.onEnd = this.onWarning = this.onDanger = () => {};
  }
}

export function createTimer(options) {
  return new Timer(options);
}