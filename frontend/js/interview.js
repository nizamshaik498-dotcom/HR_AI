(async function () {
  if (!API.token()) return (location.href = '/login.html');

  const round = new URLSearchParams(location.search).get('round') || 'hr';
  const roundLabels = { hr: 'HR Round', technical: 'Technical Round', communication: 'Communication Round' };
  const roundIcons = { hr: '🧑‍💼', technical: '💻', communication: '🎯' };

  $('roundBadge').innerHTML = `<span style="font-size:1.2em;">${roundIcons[round]}</span> ${roundLabels[round]}`;

  let session;
  try {
    session = await API.req('/interview/start', { method: 'POST', body: { round, count: 5 } });
  } catch (e) {
    alert(e.message);
    return (location.href = '/dashboard.html');
  }

  const qs = session.questions;
  const answers = {};
  let idx = 0, qStart = Date.now();

  const progressEl = $('progress');
  const progressBar = $('progressBar');
  const qTypeEl = $('qType');
  const qTextEl = $('qText');
  const answerArea = $('answerArea');
  const prevBtn = $('prevBtn');
  const nextBtn = $('nextBtn');

  function saveCurrent() {
    const q = qs[idx];
    let value = '';
    if (q.type === 'mcq') {
      const sel = document.querySelector('input[name="opt"]:checked');
      value = sel ? sel.value : '';
    } else {
      value = ($('answerText') || {}).value || '';
    }
    const prev = answers[q.id]?.durationSec || 0;
    const elapsed = Math.round((Date.now() - qStart) / 1000);
    answers[q.id] = { answer: value, durationSec: prev + elapsed };
  }

  function render() {
    const q = qs[idx];
    const saved = answers[q.id];

    progressEl.textContent = `Question ${idx + 1} of ${qs.length}`;
    progressBar.style.width = ((idx + 1) / qs.length) * 100 + '%';

    qTypeEl.textContent = q.type === 'mcq' ? 'Multiple Choice' : 'Open Answer';
    qTypeEl.className = 'question-type ' + (q.type === 'mcq' ? 'mcq' : 'open');

    qTextEl.textContent = q.question;

    answerArea.innerHTML = '';

    if (q.type === 'mcq') {
      const container = document.createElement('div');
      q.options.forEach((opt, i) => {
        const label = document.createElement('label');
        label.className = 'option';
        const input = document.createElement('input');
        input.type = 'radio'; input.name = 'opt'; input.value = String(i);
        if (saved && saved.answer === String(i)) input.checked = true;
        label.append(input, document.createTextNode(opt));
        container.append(label);
      });
      answerArea.append(container);
    } else {
      const ta = document.createElement('textarea');
      ta.id = 'answerText';
      ta.placeholder = 'Type your answer here…';
      if (saved) ta.value = saved.answer;
      answerArea.append(ta);
      ta.focus();
    }

    prevBtn.style.display = idx > 0 ? 'inline-flex' : 'none';
    nextBtn.textContent = idx === qs.length - 1 ? 'Submit & Get Report' : 'Next';

    qStart = Date.now();
  }

  prevBtn.onclick = () => {
    saveCurrent();
    if (idx > 0) { idx--; render(); }
  };

  nextBtn.onclick = async () => {
    saveCurrent();
    if (idx < qs.length - 1) { idx++; return render(); }

    nextBtn.disabled = true;
    nextBtn.textContent = 'Evaluating…';
    nextBtn.innerHTML = '<span class="spinner" style="width:16px;height:16px;border-width:2px;margin-right:8px;"></span> Evaluating…';

    try {
      const payload = qs.map((q) => ({ questionId: q.id, ...(answers[q.id] || { answer: '', durationSec: 0 }) }));
      await API.req(`/interview/${session.sessionId}/submit`, { method: 'POST', body: { answers: payload } });
      location.href = '/report.html?id=' + session.sessionId;
    } catch (e) {
      alert(e.message);
      nextBtn.disabled = false;
      nextBtn.textContent = 'Submit & Get Report';
    }
  };

  render();
})();