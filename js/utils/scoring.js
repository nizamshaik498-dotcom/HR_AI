const STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
  'from', 'as', 'is', 'was', 'are', 'were', 'been', 'be', 'have', 'has', 'had', 'do', 'does',
  'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that',
  'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them',
  'my', 'your', 'his', 'her', 'its', 'our', 'their', 'mine', 'yours', 'hers', 'ours', 'theirs'
]);

export function extractKeywords(text, minLength = 3) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length >= minLength && !STOP_WORDS.has(w))
    .filter((w, i, arr) => arr.indexOf(w) === i);
}

export function computeTFIDF(keywords, allAnswersKeywords) {
  const docCount = allAnswersKeywords.length + 1;
  const termFreq = {};
  keywords.forEach(k => { termFreq[k] = (termFreq[k] || 0) + 1; });

  const scores = {};
  Object.keys(termFreq).forEach(term => {
    const tf = termFreq[term] / keywords.length;
    const df = 1 + allAnswersKeywords.filter(kws => kws.includes(term)).length;
    const idf = Math.log(docCount / df);
    scores[term] = tf * idf;
  });
  return scores;
}

export function scoreAnswer(userAnswer, expectedKeywords, allAnswersKeywords = []) {
  const userKeywords = extractKeywords(userAnswer);
  const expectedLower = expectedKeywords.map(k => k.toLowerCase());
  const expectedSet = new Set(expectedLower);

  let matched = 0;
  let partial = 0;
  const matchedKeywords = [];

  userKeywords.forEach(kw => {
    if (expectedSet.has(kw)) {
      matched++;
      matchedKeywords.push(kw);
    } else {
      for (const exp of expectedLower) {
        if (exp.includes(kw) || kw.includes(exp)) {
          partial++;
          break;
        }
      }
    }
  });

  const totalExpected = expectedKeywords.length;
  const coverage = totalExpected > 0 ? (matched + partial * 0.5) / totalExpected : 0;
  const lengthBonus = Math.min(userAnswer.length / 500, 0.2);
  const rawScore = Math.min(coverage + lengthBonus, 1);

  return {
    score: Math.round(rawScore * 100),
    matched: matched,
    matchedKeywords,
    partial: partial,
    missed: expectedKeywords.filter((k, i) => !userKeywords.includes(expectedLower[i])),
    userKeywords
  };
}

export function getGrade(score) {
  if (score >= 85) return { label: 'Excellent', class: 'excellent' };
  if (score >= 70) return { label: 'Good', class: 'good' };
  if (score >= 50) return { label: 'Fair', class: 'fair' };
  return { label: 'Needs Improvement', class: 'poor' };
}

export function generateFeedback(result, question, userAnswer = '') {
  const { score } = result;
  const grade = getGrade(score);

  let feedback = '';
  if (score >= 85) {
    feedback = 'Outstanding answer! You covered the key points clearly and demonstrated strong understanding.';
  } else if (score >= 70) {
    feedback = 'Good response. You addressed most critical aspects. Consider expanding on the missed areas for a more complete answer.';
  } else if (score >= 50) {
    feedback = 'Decent start, but significant gaps remain. Review the missed key points and structure your answer using STAR method.';
  } else {
    feedback = 'Answer needs substantial improvement. Focus on the core concepts and practice structuring responses with specific examples.';
  }

  const isBehavioral = question?.tags?.includes('teamwork') || question?.tags?.includes('conflict-resolution') ||
                       question?.tags?.includes('learning') || question?.tags?.includes('adaptability') ||
                       question?.tags?.includes('ownership') || question?.tags?.includes('growth') ||
                       question?.tags?.includes('influence') || question?.tags?.includes('leadership') ||
                       question?.tags?.includes('communication') || question?.tags?.includes('disagreement') ||
                       question?.tags?.includes('stakeholder-management') || question?.tags?.includes('initiative') ||
                       question?.tags?.includes('optimization') || question?.tags?.includes('mentorship') ||
                       question?.tags?.includes('team-growth') || question?.tags?.includes('failure') ||
                       question?.tags?.includes('prioritization') || question?.tags?.includes('time-management') ||
                       question?.tags?.includes('feedback') || question?.tags?.includes('customer-obsession') ||
                       question?.tags?.includes('advocacy');

  if (isBehavioral && !userAnswer.toLowerCase().includes('situation') && 
      !userAnswer.toLowerCase().includes('task') && 
      !userAnswer.toLowerCase().includes('action') && 
      !userAnswer.toLowerCase().includes('result')) {
    feedback += ' Tip: Use the STAR framework (Situation, Task, Action, Result) for behavioral questions.';
  }

  return { feedback, grade: grade.label, gradeClass: grade.class };
}