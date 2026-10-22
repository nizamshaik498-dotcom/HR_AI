const FILLERS = ['um', 'uh', 'you know', 'basically', 'actually', 'i mean', 'kind of', 'sort of', 'literally', 'so yeah'];

function analyze(text, durationSec = 0) {
  const lower = String(text || '').toLowerCase();
  const words = lower.match(/\b[\w']+\b/g) || [];
  const sentenceCount = String(text || '').split(/[.!?]+/).filter((s) => s.trim()).length || 1;

  let fillerCount = 0;
  for (const f of FILLERS) {
    fillerCount += (lower.match(new RegExp('\\b' + f + '\\b', 'g')) || []).length;
  }

  const wordCount = words.length;
  return {
    wordCount,
    sentenceCount,
    avgSentenceLen: Math.round(wordCount / sentenceCount),
    fillerCount,
    fillerRatio: wordCount ? fillerCount / wordCount : 0,
    wpm: null,
    uniqueRatio: wordCount ? +(new Set(words).size / wordCount).toFixed(2) : 0,
    hasVoice: false,
  };
}

module.exports = { analyze };