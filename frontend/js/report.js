const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&', '<': '<', '>': '>', '"': '"', "'": ''' }[c]));
const cls = (s) => (s >= 7 ? 'good' : s >= 4 ? 'warn' : 'bad');
const list = (a) => (a && a.length ? '<ul class="feedback-list">' + a.map((x) => `<li>${esc(x)}</li>`).join('') + '</ul>' : '<p class="muted">—</p>');
const badgeClass = (tier) => {
  if (tier === 'Interview Ready') return 'badge-ready';
  if (tier === 'Good – needs polish') return 'badge-good';
  if (tier === 'Developing') return 'badge-developing';
  return 'badge-foundation';
};

let currentReport = null;

function getScoreColor(score) {
  if (score >= 7) return 'var(--ok)';
  if (score >= 4) return 'var(--warn)';
  return 'var(--bad)';
}

function getScoreBg(score) {
  if (score >= 7) return 'rgba(16,185,129,0.2)';
  if (score >= 4) return 'rgba(245,158,11,0.2)';
  return 'rgba(239,68,68,0.2)';
}

function buildReportHtml(r) {
  const roundLabels = { hr: 'HR', technical: 'Technical', communication: 'Communication' };
  const roundIcons = { hr: '🧑‍💼', technical: '💻', communication: '🎯' };
  const methodTagClass = (m) => `tag-method-${m === 'ai' ? 'ai' : m === 'rules' ? 'rules' : 'auto'}`;

  let html = `
    <div class="report-header">
      <div class="report-score">
        <div class="score-ring" style="--progress: ${r.score}; --size: 140px;">
          <span>${r.score}</span>
        </div>
      </div>
      <div class="report-title">
        <h2>${esc(roundLabels[r.round])} Round ${roundIcons[r.round]} <span class="badge ${badgeClass(r.tier)}">${esc(r.tier)}</span></h2>
        <div class="report-meta">
          ${r.delivery ? `
            <span>Delivery: <strong>${r.delivery.score}/100</strong></span>
            <span>Avg Fillers: <strong>${r.delivery.avgFillers}</strong></span>
          ` : ''}
        </div>
      </div>
    </div>

    <div class="report-section">
      <h3>🎯 Improvement Plan</h3>
      ${list(r.plan)}
    </div>

    <div style="display:grid; gap:16px; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));">
      <div class="report-section">
        <h3>✅ Strengths</h3>
        ${list(r.strengths.map(s => `<span class="strength">${s}</span>`).join(''))}
      </div>
      <div class="report-section">
        <h3>⚠️ Areas to Improve</h3>
        ${list(r.weakAreas.map(w => `<span class="missed">${w}</span>`).join(''))}
      </div>
    </div>

    <div class="report-section">
      <h3>Question-by-Question Feedback</h3>
  `;

  r.items.forEach((it, i) => {
    const scoreClass = cls(it.score);
    const methodClass = methodTagClass(it.method);
    const correctHtml = it.correctAnswer
      ? `<p style="margin:12px 0; padding:12px; background:rgba(16,185,129,0.1); border:1px solid rgba(16,185,129,0.2); border-radius:var(--radius-md);"><em>Correct answer:</em> <span class="good">${esc(it.correctAnswer)}</span></p>`
      : '';

    const idealHtml = (it.ideal && it.ideal.length)
      ? `<div class="ideal-outline"><h4>Ideal Answer Outline</h4><ul>${it.ideal.map(p => `<li>${esc(p)}</li>`).join('')}</ul></div>`
      : '';

    const metricsHtml = it.metrics
      ? `<div class="metrics-row">
          <span class="metric">Words: ${it.metrics.wordCount}</span>
          <span class="metric">Fillers: ${it.metrics.fillerCount}</span>
        </div>`
      : '';

    html += `
      <div class="feedback-item">
        <div class="feedback-header">
          <span class="tag">Q${i + 1}</span>
          <span class="tag ${methodClass}">${esc(it.method)}</span>
          <span class="feedback-score" style="background:${getScoreBg(it.score)}; color:${getScoreColor(it.score)};">
            ${it.score}/10
          </span>
        </div>
        <h4 class="feedback-question">${esc(it.question)}</h4>

        <div style="margin-bottom:16px;">
          <strong style="color:var(--text-secondary);">Your Answer</strong>
          <div class="answer-display">${esc(it.answer || 'No answer provided')}</div>
        </div>

        ${correctHtml}

        ${it.strengths && it.strengths.length ? `
          <div style="margin:16px 0;">
            <strong style="color:var(--ok);">✓ What you did well</strong>
            <ul class="feedback-list">${it.strengths.map(s => `<li class="strength">${esc(s)}</li>`).join('')}</ul>
          </div>
        ` : ''}

        ${it.missed && it.missed.length ? `
          <div style="margin:16px 0;">
            <strong style="color:var(--bad);">✗ What you missed</strong>
            <ul class="feedback-list">${it.missed.map(m => `<li class="missed">${esc(m)}</li>`).join('')}</ul>
          </div>
        ` : ''}

        <div style="margin:16px 0;">
          <strong style="color:var(--brand);">💡 How to improve</strong>
          <p style="margin:8px 0 0; color:var(--text-secondary);">${esc(it.suggestion)}</p>
        </div>

        ${idealHtml}

        ${metricsHtml}
      </div>
    `;
  });

  html += `</div>`;
  return html;
}

async function downloadAsPNG() {
  const { html2canvas } = await import('https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/+esm');
  const element = document.getElementById('report');
  const btn = document.getElementById('downloadPngBtn');
  const originalText = btn.innerHTML;
  btn.innerHTML = '<span class="spinner" style="width:16px;height:16px;border-width:2px;margin-right:8px;"></span> Generating...';
  btn.disabled = true;

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#0a0f1a',
      onclone: (clonedDoc) => {
        clonedDoc.querySelectorAll('.download-btns, .btn').forEach(el => el.style.display = 'none');
      }
    });

    const link = document.createElement('a');
    link.download = `HR_AI_Report_${currentReport.round}_${currentReport.score}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  } catch (e) {
    console.error('PNG download failed:', e);
    alert('Failed to generate PNG. Please try again.');
  } finally {
    btn.innerHTML = originalText;
    btn.disabled = false;
  }
}

async function downloadAsPDF() {
  const { jsPDF } = await import('https://cdn.jsdelivr.net/npm/jspdf@2.5.1/+esm');
  const { html2canvas } = await import('https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/+esm');
  const element = document.getElementById('report');
  const btn = document.getElementById('downloadPdfBtn');
  const originalText = btn.innerHTML;
  btn.innerHTML = '<span class="spinner" style="width:16px;height:16px;border-width:2px;margin-right:8px;"></span> Generating...';
  btn.disabled = true;

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#0a0f1a',
      onclone: (clonedDoc) => {
        clonedDoc.querySelectorAll('.download-btns, .btn').forEach(el => el.style.display = 'none');
      }
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: [canvas.width, canvas.height]
    });
    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save(`HR_AI_Report_${currentReport.round}_${currentReport.score}.pdf`);
  } catch (e) {
    console.error('PDF download failed:', e);
    alert('Failed to generate PDF. Please try again.');
  } finally {
    btn.innerHTML = originalText;
    btn.disabled = false;
  }
}

function downloadAsJSON() {
  const data = JSON.stringify(currentReport, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = `HR_AI_Report_${currentReport.round}_${currentReport.score}.json`;
  link.href = url;
  link.click();
  URL.revokeObjectURL(url);
}

function printReport() {
  const printWindow = window.open('', '_blank');
  const roundLabels = { hr: 'HR', technical: 'Technical', communication: 'Communication' };
  const roundIcons = { hr: '🧑‍💼', technical: '💻', communication: '🎯' };

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>HR_AI Report - ${roundLabels[currentReport.round]} Round</title>
      <style>
        @page { margin: 20px; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1f2937; line-height: 1.6; }
        .print-header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #6366f1; padding-bottom: 20px; }
        .print-header h1 { margin: 0 0 10px; color: #111827; }
        .print-score { font-size: 48px; font-weight: 700; color: #6366f1; }
        .print-badge { display: inline-block; padding: 6px 16px; border-radius: 9999px; font-weight: 600; font-size: 14px; margin-top: 10px; }
        .badge-ready { background: #d1fae5; color: #065f46; }
        .badge-good { background: #fef3c7; color: #92400e; }
        .badge-developing { background: #dbeafe; color: #1e40af; }
        .badge-foundation { background: #fee2e2; color: #991b1b; }
        .section { margin: 30px 0; }
        .section h2 { color: #6366f1; border-left: 4px solid #6366f1; padding-left: 12px; margin-bottom: 16px; }
        .question { margin: 20px 0; padding: 16px; border: 1px solid #e5e7eb; border-radius: 8px; background: #fafafa; }
        .question-header { display: flex; gap: 12px; margin-bottom: 12px; flex-wrap: wrap; }
        .tag { padding: 4px 10px; border-radius: 9999px; font-size: 12px; font-weight: 600; }
        .tag-method-ai { background: #e0e7ff; color: #3730a3; }
        .tag-method-rules { background: #d1fae5; color: #065f46; }
        .tag-method-auto { background: #fef3c7; color: #92400e; }
        .feedback-score { font-weight: 700; padding: 4px 12px; border-radius: 8px; }
        .score-good { background: #d1fae5; color: #065f46; }
        .score-warn { background: #fef3c7; color: #92400e; }
        .score-bad { background: #fee2e2; color: #991b1b; }
        .answer-display { background: #f3f4f6; padding: 12px; border-radius: 8px; margin: 12px 0; white-space: pre-wrap; font-family: monospace; font-size: 13px; }
        .ideal-outline { background: #eef2ff; border: 1px solid #c7d2fe; border-radius: 8px; padding: 12px; margin-top: 12px; }
        .ideal-outline h4 { margin: 0 0 8px; color: #3730a3; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; }
        .metrics { color: #6b7280; font-size: 13px; margin-top: 12px; padding-top: 12px; border-top: 1px solid #e5e7eb; }
        .btn { display: none; }
        @media print { .no-print { display: none !important; } }
      </style>
    </head>
    <body>
      <div class="print-header">
        <h1>${esc(roundLabels[currentReport.round])} Round ${roundIcons[currentReport.round]}</h1>
        <div class="print-score">${currentReport.score} / 100</div>
        <span class="print-badge ${badgeClass(currentReport.tier)}">${esc(currentReport.tier)}</span>
        ${currentReport.delivery ? `<p style="margin-top:10px; color:#6b7280;">Delivery: ${currentReport.delivery.score}/100 · Avg Fillers: ${currentReport.delivery.avgFillers}</p>` : ''}
      </div>

      <div class="section">
        <h2>🎯 Improvement Plan</h2>
        <ul>${currentReport.plan.map(p => `<li>${esc(p)}</li>`).join('')}</ul>
      </div>

      <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 20px;">
        <div class="section">
          <h2>✅ Strengths</h2>
          <ul>${currentReport.strengths.map(s => `<li>${esc(s)}</li>`).join('')}</ul>
        </div>
        <div class="section">
          <h2>⚠️ Areas to Improve</h2>
          <ul>${currentReport.weakAreas.map(w => `<li>${esc(w)}</li>`).join('')}</ul>
        </div>
      </div>

      <div class="section">
        <h2>Question-by-Question Feedback</h2>
        ${currentReport.items.map((it, i) => {
          const scoreClass = cls(it.score);
          const methodClass = `tag-method-${it.method === 'ai' ? 'ai' : it.method === 'rules' ? 'rules' : 'auto'}`;
          return `
            <div class="question">
              <div class="question-header">
                <span class="tag">Q${i + 1}</span>
                <span class="tag ${methodClass}">${esc(it.method)}</span>
                <span class="feedback-score score-${scoreClass}">${it.score}/10</span>
              </div>
              <h3 style="margin: 8px 0;">${esc(it.question)}</h3>
              <div style="margin-bottom:12px;">
                <strong>Your Answer:</strong>
                <div class="answer-display">${esc(it.answer || 'No answer provided')}</div>
              </div>
              ${it.correctAnswer ? `<p><strong>Correct Answer:</strong> <span style="color:#059669;">${esc(it.correctAnswer)}</span></p>` : ''}
              ${it.strengths && it.strengths.length ? `<div><strong style="color:#059669;">✓ What you did well</strong><ul>${it.strengths.map(s => `<li>${esc(s)}</li>`).join('')}</ul></div>` : ''}
              ${it.missed && it.missed.length ? `<div><strong style="color:#dc2626;">✗ What you missed</strong><ul>${it.missed.map(m => `<li>${esc(m)}</li>`).join('')}</ul></div>` : ''}
              <div><strong style="color:#6366f1;">💡 How to improve:</strong> ${esc(it.suggestion)}</div>
              ${it.ideal && it.ideal.length ? `<div class="ideal-outline"><h4>Ideal Answer Outline</h4><ul>${it.ideal.map(p => `<li>${esc(p)}</li>`).join('')}</ul></div>` : ''}
              ${it.metrics ? `<div class="metrics">Words: ${it.metrics.wordCount} · Fillers: ${it.metrics.fillerCount}</div>` : ''}
            </div>
          `;
        }).join('')}
      </div>
    </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => printWindow.print(), 500);
}

(async () => {
  if (!API.token()) return (location.href = '/login.html');
  const id = new URLSearchParams(location.search).get('id');
  let d;
  try { d = await API.req('/interview/' + id); }
  catch (e) {
    $('report').innerHTML = `<div class="empty-state"><h3>Error</h3><p>${esc(e.message)}</p><a href="dashboard.html" class="btn btn-primary" style="margin-top:16px;">Back to Dashboard</a></div>`;
    return;
  }

  currentReport = d.report;
  const reportHtml = buildReportHtml(currentReport);

  const downloadBtns = `
    <div class="download-btns" style="display:flex; gap:12px; flex-wrap:wrap; margin-bottom:24px; padding:16px; background:var(--card); border:1px solid var(--border); border-radius:var(--radius-lg);">
      <button class="btn btn-primary" id="downloadPngBtn" onclick="downloadAsPNG()">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:6px;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        Download PNG
      </button>
      <button class="btn btn-secondary" id="downloadPdfBtn" onclick="downloadAsPDF()">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:6px;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
        Download PDF
      </button>
      <button class="btn btn-secondary" onclick="downloadAsJSON()">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:6px;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
        Download JSON
      </button>
      <button class="btn btn-ghost" onclick="printReport()">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:6px;"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5"/><path d="M18 18h2a2 2 0 0 0 2-2v-5"/><line x1="6" y1="14" x2="18" y2="14"/><path d="M10 9v5"/><path d="M14 9v5"/></svg>
        Print / Save as PDF
      </button>
      <a class="btn btn-primary" href="interview.html?round=${encodeURIComponent(currentReport.round)}" style="margin-left:auto;">Retry This Round</a>
    </div>
  `;

  $('report').innerHTML = downloadBtns + reportHtml;
})();