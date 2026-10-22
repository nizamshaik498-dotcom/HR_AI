const all = require('../data/questions.json');
const byId = new Map(all.map((q) => [q.id, q]));

function pick(round, count) {
  const pool = all.filter((q) => q.round === round);
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, count);
}

module.exports = {
  pick,
  getById: (id) => byId.get(id),
  ROUNDS: ['hr', 'technical', 'communication'],
};