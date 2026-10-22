async function callLLM(system, user) {
  const provider = (process.env.LLM_PROVIDER || 'mock').toLowerCase();
  let text = null;

  if (provider === 'gemini') {
    const model = process.env.GEMINI_MODEL || 'gemini-3.8-flash';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`;
    
    const payload = {
      systemInstruction: { parts: [{ text: system }] },
      contents: [{ role: 'user', parts: [{ text: user }] }],
      generationConfig: { responseMimeType: 'application/json', temperature: 0.2 },
    };

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const r = await fetch(url, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(payload),
          signal: AbortSignal.timeout(30000),
        });
        if (!r.ok) {
          const errText = await r.text().catch(() => '');
          throw new Error(`Gemini HTTP ${r.status}: ${errText}`);
        }
        const d = await r.json();
        text = d.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) break;
      } catch (e) {
        console.warn(`LLM attempt ${attempt} failed:`, e.message);
        if (attempt === 3) throw e;
        await new Promise(r => setTimeout(r, 1000 * attempt));
      }
    }
  }

  if (!text) return null;
  const m = text.match(/\{[\s\S]*\}/);
  if (!m) return null;
  try {
    return JSON.parse(m[0]);
  } catch {
    return null;
  }
}

module.exports = { callLLM };