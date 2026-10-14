import { HomeView } from './components/HomeView.js';
import { ConfigModal } from './components/ConfigModal.js';
import { InterviewView } from './components/InterviewView.js';
import { FeedbackView } from './components/FeedbackView.js';
import { ResultsView } from './components/ResultsView.js';
import { storage } from './utils/storage.js';
import { scoreAnswer, generateFeedback } from './utils/scoring.js';
import { exportJSON, exportTXT, generateReportData } from './utils/export.js';
import { questions } from './data/questions.js';

const VIEWS = {
  home: 'view-home',
  config: 'view-config',
  interview: 'view-interview',
  feedback: 'view-feedback',
  results: 'view-results'
};

class App {
  constructor() {
    this.state = {
      currentView: 'home',
      category: null,
      settings: null,
      questions: [],
      currentIndex: 0,
      answers: [],
      startTime: null
    };

    this.initViews();
    this.bindGlobalEvents();
    this.showView('home');
  }

  initViews() {
    this.homeView = new HomeView(
      (category) => this.openConfig(category),
      () => this.resumeSession()
    );

    this.configModal = new ConfigModal(
      (settings) => this.startInterview(settings),
      () => this.showView('home')
    );

    this.interviewView = new InterviewView(
      (answer, timeRemaining) => this.submitAnswer(answer, timeRemaining),
      () => this.nextQuestion(),
      () => this.quitInterview()
    );

    this.feedbackView = new FeedbackView(
      () => this.nextQuestion()
    );

    this.resultsView = new ResultsView(
      () => this.retryCategory(),
      () => this.showView('home'),
      () => this.exportJSON(),
      () => this.exportTXT()
    );
  }

  bindGlobalEvents() {
    window.addEventListener('hashchange', () => this.handleHashChange());
    this.handleHashChange();
  }

  handleHashChange() {
    const hash = window.location.hash.slice(1) || 'home';
    if (hash !== this.state.currentView && VIEWS[hash]) {
      this.showView(hash);
    }
  }

  showView(viewName) {
    Object.values(VIEWS).forEach(v => {
      const el = document.getElementById(v);
      if (el) el.hidden = true;
    });
    this.state.currentView = viewName;
    window.location.hash = viewName;
  }

  openConfig(category) {
    if (!category || !questions[category]) return;
    this.state.category = category;
    this.configModal.show();
  }

  startInterview(settings) {
    if (!settings || !this.state.category) return;
    this.state.settings = { ...settings };
    this.state.questions = this.getQuestionsForCategory(this.state.category, this.state.settings);
    this.state.currentIndex = 0;
    this.state.answers = [];
    this.state.startTime = Date.now();

    this.configModal.hide();
    this.showView('interview');
    this.showCurrentQuestion();
  }

  getQuestionsForCategory(category, settings) {
    let qs = questions[category] || [];
    if (settings.shuffle) qs = [...qs].sort(() => Math.random() - 0.5);
    if (settings.questionCount !== 'all') {
      const count = parseInt(settings.questionCount, 10);
      if (!Number.isNaN(count) && count > 0) {
        qs = qs.slice(0, count);
      }
    }
    return qs;
  }

  showCurrentQuestion() {
    const q = this.state.questions[this.state.currentIndex];
    if (!q) {
      this.finishInterview();
      return;
    }
    this.interviewView.show(q, this.state.currentIndex + 1, this.state.questions.length, this.state.settings);
  }

  submitAnswer(answer, timeRemaining) {
    const question = this.state.questions[this.state.currentIndex];
    if (!question) return;

    const timeSpent = Math.max(0, (this.state.settings?.timer || 3) * 60 - timeRemaining);

    const scoringResult = scoreAnswer(answer, question.keywords, this.state.answers.map(a => a.userKeywords || []));
    const feedback = generateFeedback(scoringResult, question, answer);

    const matchedKeywords = question.keywords.filter((k, i) => scoringResult.userKeywords.includes(k.toLowerCase()));

    const answerData = {
      question: question.text,
      answer,
      score: scoringResult.score,
      grade: feedback.grade,
      timeSpent,
      matched: matchedKeywords,
      missed: scoringResult.missed || [],
      userKeywords: scoringResult.userKeywords,
      feedback: feedback.feedback
    };

    this.state.answers.push(answerData);
    this.saveSession();

    this.interviewView.hide();
    this.feedbackView.show({ ...scoringResult, ...feedback, grade: feedback });
    this.showView('feedback');
  }

  nextQuestion() {
    this.feedbackView.hide();
    this.state.currentIndex++;

    if (this.state.currentIndex >= this.state.questions.length) {
      this.finishInterview();
    } else {
      this.showView('interview');
      this.showCurrentQuestion();
    }
  }

  finishInterview() {
    const insights = this.generateInsights();
    const session = {
      category: this.state.category,
      settings: this.state.settings,
      answers: this.state.answers,
      startTime: this.state.startTime,
      endTime: Date.now(),
      insights
    };

    storage.saveSession(session);
    storage.addToHistory(generateReportData(session));

    this.resultsView.show(session);
    this.showView('results');
  }

  generateInsights() {
    const allMissed = this.state.answers.flatMap(a => a.missed || []);
    const missedCount = {};
    allMissed.forEach(m => { missedCount[m] = (missedCount[m] || 0) + 1; });
    const improvements = Object.entries(missedCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([point]) => point);

    const allMatched = this.state.answers.flatMap(a => a.matched || []);
    const matchedCount = {};
    allMatched.forEach(m => { matchedCount[m] = (matchedCount[m] || 0) + 1; });
    const strengths = Object.entries(matchedCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([point]) => point);

    return { strengths, improvements };
  }

  saveSession() {
    const session = {
      category: this.state.category,
      settings: this.state.settings,
      answers: this.state.answers,
      currentIndex: this.state.currentIndex,
      startTime: this.state.startTime
    };
    storage.saveSession(session);
  }

  resumeSession() {
    const session = storage.getSession();
    if (!session || !session.answers?.length || !session.category) return;

    this.state.category = session.category;
    this.state.settings = session.settings;
    this.state.questions = this.getQuestionsForCategory(session.category, session.settings);
    this.state.currentIndex = Math.min(session.currentIndex || 0, this.state.questions.length - 1);
    this.state.answers = session.answers || [];
    this.state.startTime = session.startTime || Date.now();

    this.homeView.hide();
    this.showView('interview');
    this.showCurrentQuestion();
  }

  retryCategory() {
    this.resultsView.hide();
    if (this.state.settings) {
      this.startInterview(this.state.settings);
    }
  }

  quitInterview() {
    this.interviewView.hide();
    this.showView('home');
  }

  exportJSON() {
    const session = storage.getSession();
    if (session) exportJSON(generateReportData(session));
  }

  exportTXT() {
    const session = storage.getSession();
    if (session) exportTXT(generateReportData(session));
  }

  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
});