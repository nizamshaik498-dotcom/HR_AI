(async () => {
  if (!API.token()) return (location.href = '/login.html');

  const name = localStorage.getItem('name') || '';
  $('who').textContent = name ? `${name}` : '';

  try {
    const d = await API.req('/interview/stats/summary');

    const roundLabels = { hr: 'HR', technical: 'Technical', communication: 'Communication' };

    for (const [r, s] of Object.entries(d.latest)) {
      const el = $('s-' + r);
      if (el) el.innerHTML = `<span style="font-weight:600; color:var(--text);">${Math.round(s)}</span> / 100`;
    }

    const overallEl = $('overall');
    if (overallEl) {
      if (d.overall === null) {
        overallEl.textContent = '–';
      } else {
        overallEl.innerHTML = `${d.overall} <span style="font-size:0.9rem; font-weight:400; color:var(--text-secondary);">/ 100</span>`;
      }
    }

    const statEls = { hr: 'stat-hr', technical: 'stat-technical', communication: 'stat-communication' };
    for (const [r, id] of Object.entries(statEls)) {
      const el = $(id);
      if (el) {
        const score = d.latest[r];
        el.innerHTML = score !== undefined
          ? `<span style="font-weight:700;">${Math.round(score)}</span><span style="font-size:0.9rem; color:var(--text-secondary);"> / 100</span>`
          : '–';
      }
    }

    const historyContainer = $('history');
    if (d.history.length) {
      historyContainer.innerHTML = d.history
        .slice()
        .reverse()
        .map((h) => `
          <div class="history-item">
            <div class="history-info">
              <span class="history-round ${h.round}">${roundLabels[h.round]}</span>
              <div class="history-details">
                <span class="history-score">${Math.round(h.score)} / 100</span>
                <span class="history-date">${new Date(h.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
            <a href="report.html?id=${h.id}" class="history-action">View Report</a>
          </div>
        `).join('');
    }

    if (d.history.length && window.Chart) {
      const ctx = $('chart').getContext('2d');
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: d.history.map((h, i) => `#${i + 1} ${roundLabels[h.round]}`),
          datasets: [{
            label: 'Score',
            data: d.history.map((h) => h.score),
            borderColor: '#6366f1',
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.35,
            pointRadius: 5,
            pointHoverRadius: 7,
            pointBackgroundColor: '#6366f1',
            pointBorderColor: '#fff',
            pointBorderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: { intersect: false, mode: 'index' },
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: 'rgba(17, 24, 39, 0.95)',
              titleColor: '#f1f5f9',
              bodyColor: '#94a3b8',
              borderColor: '#2a3548',
              borderWidth: 1,
              padding: 12,
              displayColors: false,
              callbacks: {
                label: (ctx) => `Score: ${ctx.raw} / 100`
              }
            }
          },
          scales: {
            y: { min: 0, max: 100, grid: { color: 'rgba(148, 163, 184, 0.1)' }, ticks: { color: '#64748b', font: { size: 11 } } },
            x: { grid: { display: false }, ticks: { color: '#64748b', font: { size: 11 } } }
          }
        }
      });
    }
  } catch (e) {
    console.error('Dashboard load failed:', e);
  }
})();