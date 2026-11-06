/* Scoring engine. Pure functions; usable in the browser (window.Engine) and in Node. */
(function (root) {
  const AXES = ["e", "a", "c"];
  const clamp = (x, lo, hi) => Math.max(lo, Math.min(hi, x));

  /* answers: { [id]: -2..2 | null }  (null = not sure, undefined = unanswered) */
  function axisScore(questions, answers, axis) {
    let num = 0, den = 0;
    for (const q of questions) {
      const v = answers[q.id];
      const w = q[axis];
      if (v === null || v === undefined || !w) continue;
      num += v * w;
      den += 2 * Math.abs(w);
    }
    return den ? (num / den) * 10 : 0;
  }

  /* Spread of item-level implied positions on an axis (weighted SD, 0..10). */
  function axisSpread(questions, answers, axis) {
    let sw = 0, sx = 0, sxx = 0;
    for (const q of questions) {
      const v = answers[q.id];
      const w = q[axis];
      if (v === null || v === undefined || Math.abs(w) < 0.3) continue;
      const p = (v / 2) * Math.sign(w) * 10;
      const k = Math.abs(w);
      sw += k; sx += k * p; sxx += k * p * p;
    }
    if (sw === 0) return 0;
    const m = sx / sw;
    return Math.sqrt(Math.max(0, sxx / sw - m * m));
  }

  function band(x, t) { return x > t ? "+" : x < -t ? "-" : "0"; }

  function score(Q, answers) {
    const qs = Q.questions;
    const s = {};
    for (const ax of AXES) s[ax] = axisScore(qs, answers, ax);
    const spread = { e: axisSpread(qs, answers, "e"), a: axisSpread(qs, answers, "a"), c: axisSpread(qs, answers, "c") };

    let strong = 0, answered = 0, unsure = 0;
    for (const q of qs) {
      const v = answers[q.id];
      if (v === undefined) continue;
      if (v === null) { unsure++; continue; }
      answered++;
      if (Math.abs(v) === 2) strong++;
    }
    const conviction = answered ? strong / answered : 0;
    const meanSpread = (spread.e + spread.a) / 2;
    const consistency = meanSpread < 4.5 ? "Consistent" : meanSpread < 6.5 ? "Mixed" : "Cross-pressured";

    const typeKey = "a" + band(s.a, 10 / 3) + "e" + band(s.e, 10 / 3);
    const cBand = band(s.c, 3);
    const culture = cBand === "+" ? "Traditional" : cBand === "-" ? "Progressive" : "Culturally moderate";

    /* Issue profile: each group scored on its reporting axis. */
    const groups = [];
    for (const [key, g] of Object.entries(Q.issues)) {
      const items = qs.filter(q => q.issue === key);
      const has = items.some(q => answers[q.id] !== null && answers[q.id] !== undefined && q[g.axis]);
      const val = has ? axisScore(items, answers, g.axis) : null;
      groups.push({ key, label: g.label, axis: g.axis, value: val, diff: val === null ? 0 : val - s[g.axis] });
    }
    const outliers = groups
      .filter(g => g.value !== null && Math.abs(g.diff) >= 6)
      .sort((x, y) => Math.abs(y.diff) - Math.abs(x.diff))
      .slice(0, 3);

    return {
      e: s.e, a: s.a, c: s.c, spread, conviction, consistency,
      answered, unsure, typeKey, culture, groups, outliers
    };
  }

  function shuffle(arr, rnd = Math.random) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rnd() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  /* Share code: one character per question in id order. A..E = +2..-2, N = not sure. */
  const CODE = { 2: "A", 1: "B", 0: "C", "-1": "D", "-2": "E" };
  function encode(Q, answers) {
    return Q.questions.slice().sort((x, y) => x.id - y.id)
      .map(q => { const v = answers[q.id]; return v === null || v === undefined ? "N" : CODE[v]; }).join("");
  }
  function decode(Q, str) {
    const ids = Q.questions.map(q => q.id).sort((x, y) => x - y);
    if (!str || str.length !== ids.length || !/^[A-EN]+$/.test(str)) return null;
    const out = {};
    ids.forEach((id, i) => { const ch = str[i]; out[id] = ch === "N" ? null : 2 - (ch.charCodeAt(0) - 65); });
    return out;
  }

  const Engine = { score, axisScore, axisSpread, shuffle, encode, decode, clamp };
  if (typeof module !== "undefined" && module.exports) module.exports = Engine;
  else root.Engine = Engine;
})(typeof window !== "undefined" ? window : globalThis);
