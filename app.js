/* Right or Left: interface logic. */
(function () {
  const Q = window.QUIZ;
  const E = window.Engine;
  const $ = (s, el = document) => el.querySelector(s);
  const TOTAL = Q.questions.length;
  const byId = Object.fromEntries(Q.questions.map(q => [q.id, q]));
  const AX_COLOR = { e: "var(--blue)", a: "var(--pink)", c: "var(--yellow)" };

  const state = { order: [], idx: 0, answers: {}, busy: false };

  /* ---------- helpers ---------- */
  const fmt = v => (v > 0.05 ? "+" : v < -0.05 ? "−" : "") + Math.abs(v).toFixed(1);
  const pad = n => String(n).padStart(2, "0");
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const answerLabel = v => v === undefined ? "Unanswered" : (Q.answers.find(a => a.v === v) || {}).label;

  function verdict(axis, v) {
    const ax = Q.axes[axis];
    const pole = v >= 0 ? ax.pos : ax.neg;
    const m = Math.abs(v);
    if (m < 1.5) return "Centred";
    if (m < 10 / 3) return "Leans " + pole.toLowerCase();
    if (m < 20 / 3) return "Moderately " + pole.toLowerCase();
    return "Strongly " + pole.toLowerCase();
  }

  function showScreen(id) {
    document.querySelectorAll(".screen").forEach(s => s.classList.remove("is-active"));
    const el = document.getElementById(id);
    void el.offsetWidth;
    el.classList.add("is-active");
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  }

  let toastTimer;
  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 2200);
  }

  /* ---------- tooltip ---------- */
  const tip = $("#tooltip");
  function showTip(html, x, y) {
    tip.innerHTML = html;
    tip.hidden = false;
    const r = tip.getBoundingClientRect();
    let left = x + 14, top = y + 14;
    if (left + r.width > window.innerWidth - 8) left = x - r.width - 14;
    if (top + r.height > window.innerHeight - 8) top = y - r.height - 14;
    tip.style.left = Math.max(8, left) + "px";
    tip.style.top = Math.max(8, top) + "px";
  }
  function hideTip() { tip.hidden = true; }
  function bindTip(el, html) {
    el.addEventListener("pointermove", e => showTip(html(), e.clientX, e.clientY));
    el.addEventListener("pointerleave", hideTip);
    el.addEventListener("click", e => { e.stopPropagation(); showTip(html(), e.clientX, e.clientY); });
  }
  document.addEventListener("click", hideTip);
  window.addEventListener("scroll", hideTip, { passive: true });

  /* ---------- theme ---------- */
  $("#themeBtn").addEventListener("click", () => {
    const root = document.documentElement;
    const cur = root.getAttribute("data-theme") || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    const next = cur === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("rol-theme", next); } catch (e) {}
  });

  /* ---------- quiz ---------- */
  const answersEl = $("#answers");
  const GLYPH = ["g-yes2", "g-yes1", "g-mid", "g-no1", "g-no2"];
  Q.answers.forEach((a, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "ans";
    b.dataset.i = i;
    b.innerHTML = `<span class="glyph ${GLYPH[i]}" aria-hidden="true"><i></i></span><span>${a.label}</span><span class="key" aria-hidden="true">${i + 1}</span>`;
    b.addEventListener("click", () => choose(i));
    answersEl.appendChild(b);
  });

  const progressEl = $("#progress");
  for (let i = 0; i < TOTAL; i++) progressEl.appendChild(document.createElement("i"));

  function start() {
    state.order = E.shuffle(Q.questions.map(q => q.id));
    state.idx = 0;
    state.answers = {};
    history.replaceState(null, "", location.pathname + location.search);
    showScreen("quiz");
    renderQuestion("enter");
  }

  function renderQuestion(anim) {
    const q = byId[state.order[state.idx]];
    const issue = Q.issues[q.issue];
    $("#qNum").textContent = pad(state.idx + 1);
    $("#qIssue").textContent = issue.label;
    $("#qText").textContent = q.q;
    const card = $("#qcard");
    card.style.setProperty("--card-accent", AX_COLOR[issue.axis]);
    const stamp = $("#stamp");
    stamp.className = "stamp";
    card.className = "qcard";
    void card.offsetWidth;
    card.classList.add(anim);

    const cur = state.answers[q.id];
    answersEl.querySelectorAll(".ans").forEach((b, i) => {
      b.classList.toggle("selected", cur !== undefined && Q.answers[i].v === cur);
    });
    $("#backBtn").disabled = state.idx === 0;
    [...progressEl.children].forEach((t, i) => {
      const v = state.answers[state.order[i]];
      t.className = i === state.idx ? "current" : v === null ? "unsure" : v !== undefined ? "done" : "";
    });
  }

  function choose(i) {
    if (state.busy || !$("#quiz").classList.contains("is-active")) return;
    state.busy = true;
    const a = Q.answers[i];
    const id = state.order[state.idx];
    state.answers[id] = a.v;
    answersEl.querySelectorAll(".ans").forEach((b, j) => b.classList.toggle("selected", j === i));
    const stamp = $("#stamp");
    stamp.textContent = a.stamp;
    stamp.style.setProperty("--stamp-color", a.v === null ? "var(--ink-2)" : a.v > 0 ? "var(--blue)" : "var(--pink)");
    stamp.className = "stamp";
    void stamp.offsetWidth;
    stamp.classList.add("hit");
    setTimeout(() => { $("#qcard").className = "qcard leave"; }, 360);
    setTimeout(() => {
      state.busy = false;
      if (state.idx < TOTAL - 1) { state.idx++; renderQuestion("enter"); }
      else finish();
    }, 760);
  }

  function back() {
    if (state.busy || state.idx === 0) return;
    state.idx--;
    renderQuestion("enter-back");
  }

  function finish() {
    showScreen("calc");
    const code = E.encode(Q, state.answers);
    history.replaceState(null, "", "#r=" + code);
    setTimeout(() => showResults(state.answers, false), 1500);
  }

  $("#startBtn").addEventListener("click", start);
  $("#backBtn").addEventListener("click", back);
  $("#quitBtn").addEventListener("click", () => {
    if (Object.keys(state.answers).length && !confirm("Restart the quiz? Current answers will be cleared.")) return;
    start();
  });
  $("#retakeBtn").addEventListener("click", start);

  document.addEventListener("keydown", e => {
    if (!$("#quiz").classList.contains("is-active") || e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key >= "1" && e.key <= "5") { e.preventDefault(); choose(+e.key - 1); }
    else if (e.key === "Backspace" || e.key === "ArrowLeft") { e.preventDefault(); back(); }
  });

  /* ---------- results ---------- */
  const refScores = Object.fromEntries(Object.entries(Q.references).map(([k, r]) => [k, { label: r.label, s: E.score(Q, r.answers) }]));

  function showResults(answers, shared) {
    const s = E.score(Q, answers);
    const type = Q.types[s.typeKey];
    showScreen("results");

    $("#resKicker").textContent = shared ? "Shared result" : "Your result";
    $("#typeName").textContent = type.name;
    $("#typeSub").textContent = `${type.label} · ${s.culture}`;
    $("#typeText").textContent = type.text;
    $("#retakeBtn").textContent = shared ? "Take the quiz" : "Retake the quiz";

    const lowData = s.answered < 8;
    const chips = [
      ["Consistency", lowData ? "Insufficient data" : s.consistency],
      ["Conviction", Math.round(s.conviction * 100) + "% strong answers"],
      ["Not sure", s.unsure + " of " + TOTAL]
    ];
    $("#chips").innerHTML = chips.map(([k, v]) => `<span class="chip"><b>${k}:</b> ${v}</span>`).join("");

    renderCompass(s);
    renderGauges(s);
    renderIssues(s, answers);
    renderOutliers(s);
    renderTable(answers);

    const panels = document.querySelectorAll("#results .result-hero, #results .panel");
    panels.forEach((p, i) => {
      p.classList.add("reveal");
      p.classList.remove("in");
      setTimeout(() => p.classList.add("in"), 80 + i * 110);
    });
  }

  function countUp(el, target, ms = 1100) {
    const t0 = performance.now();
    function tick(t) {
      const k = Math.min(1, (t - t0) / ms);
      const eased = 1 - Math.pow(1 - k, 3);
      el.textContent = fmt(target * eased);
      if (k < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function renderCompass(s) {
    const S = 420, M = 50, P = S - 2 * M, u = P / 20;
    const X = e => M + (e + 10) * u;
    const Y = a => M + (10 - a) * u;
    const third = 10 / 3;
    const cols = [[-10, -third], [-third, third], [third, 10]];
    const rows = [[third, 10], [-third, third], [-10, -third]];
    const rowKey = ["+", "0", "-"], colKey = ["-", "0", "+"];
    const colTint = ["var(--blue-soft)", "transparent", "var(--pink-soft)"];
    const rowPat = ["url(#patDense)", "url(#patLight)", "none"];

    let zones = "", labels = "", hits = "";
    rows.forEach((r, ri) => cols.forEach((c, ci) => {
      const key = "a" + rowKey[ri] + "e" + colKey[ci];
      const t = Q.types[key];
      const x = X(c[0]), y = Y(r[1]), w = (c[1] - c[0]) * u, h = (r[1] - r[0]) * u;
      const on = key === s.typeKey;
      zones += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${colTint[ci]}"/>`;
      if (rowPat[ri] !== "none") zones += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${rowPat[ri]}"/>`;
      if (on) zones += `<rect x="${x + 1.5}" y="${y + 1.5}" width="${w - 3}" height="${h - 3}" fill="none" stroke="var(--ink)" stroke-width="2" rx="3"/>`;
      labels += `<text class="cz-label${on ? " on" : ""}" x="${x + 7}" y="${y + 14}">${t.name.replace("The ", "").toUpperCase()}</text>`;
      hits += `<rect class="hit zone-hit" data-key="${key}" x="${x}" y="${y}" width="${w}" height="${h}"/>`;
    }));

    let grid = "";
    [-third, third].forEach(v => {
      grid += `<line class="c-grid" x1="${X(v)}" y1="${M}" x2="${X(v)}" y2="${S - M}"/>`;
      grid += `<line class="c-grid" x1="${M}" y1="${Y(v)}" x2="${S - M}" y2="${Y(v)}"/>`;
    });
    let ticks = "";
    [-10, -5, 5, 10].forEach(v => {
      ticks += `<line class="c-axis" x1="${X(v)}" y1="${Y(0) - 3}" x2="${X(v)}" y2="${Y(0) + 3}"/>`;
      ticks += `<line class="c-axis" x1="${X(0) - 3}" y1="${Y(v)}" x2="${X(0) + 3}" y2="${Y(v)}"/>`;
      ticks += `<text class="c-tick" x="${X(v)}" y="${Y(0) + 13}" text-anchor="middle">${v > 0 ? "+" + v : "−" + -v}</text>`;
    });

    let refs = "";
    Object.entries(refScores).forEach(([k, r]) => {
      const cx = X(r.s.e), cy = Y(r.s.a);
      refs += `<g class="ref-g" style="opacity:0;transition:opacity .6s ease 1.1s"><rect class="c-ref" x="${cx - 5}" y="${cy - 5}" width="10" height="10" transform="rotate(45 ${cx} ${cy})"/>
        <text class="c-ref-label" x="${cx}" y="${cy + 19}" text-anchor="middle">${r.label}*</text></g>
        <circle class="hit ref-hit" data-ref="${k}" cx="${cx}" cy="${cy}" r="14"/>`;
    });

    const rx = E.clamp(s.spread.e * 0.5, 0.6, 6) * u;
    const ry = E.clamp(s.spread.a * 0.5, 0.6, 6) * u;
    const ux = X(s.e), uy = Y(s.a);
    const labelAbove = uy > M + 40;

    $("#compassWrap").innerHTML = `
    <svg viewBox="0 0 ${S} ${S}" role="img" aria-label="Political map. Economic score ${fmt(s.e)}, authority score ${fmt(s.a)}.">
      <defs>
        <pattern id="patDense" width="6" height="6" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="1.05" fill="var(--ink)" fill-opacity=".16"/></pattern>
        <pattern id="patLight" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="4.5" cy="4.5" r=".8" fill="var(--ink)" fill-opacity=".11"/></pattern>
      </defs>
      <rect x="${M}" y="${M}" width="${P}" height="${P}" fill="var(--paper)" rx="4"/>
      ${zones}${grid}
      <line class="c-axis" x1="${M}" y1="${Y(0)}" x2="${S - M}" y2="${Y(0)}"/>
      <line class="c-axis" x1="${X(0)}" y1="${M}" x2="${X(0)}" y2="${S - M}"/>
      ${ticks}${labels}
      <rect x="${M}" y="${M}" width="${P}" height="${P}" fill="none" stroke="var(--ink)" stroke-width="2" rx="4"/>
      <text class="c-pole" x="${X(0)}" y="${M - 14}" text-anchor="middle" fill="var(--pink)">AUTHORITARIAN</text>
      <text class="c-pole" x="${X(0)}" y="${S - M + 24}" text-anchor="middle" fill="var(--blue)">LIBERTARIAN</text>
      <text class="c-pole" transform="translate(${M - 16} ${Y(0)}) rotate(-90)" text-anchor="middle" fill="var(--blue)">STATE</text>
      <text class="c-pole" transform="translate(${S - M + 16} ${Y(0)}) rotate(90)" text-anchor="middle" fill="var(--pink)">MARKET</text>
      ${hits}
      <g class="c-you" style="transform: translate(${X(0)}px, ${Y(0)}px)">
        <ellipse class="c-ell" cx="0" cy="0" rx="${rx}" ry="${ry}" style="transform: scale(0); transition: transform 1s cubic-bezier(.2,1.2,.4,1) .9s"/>
      </g>
      ${refs}
      <g class="c-you" style="transform: translate(${X(0)}px, ${Y(0)}px)">
        <circle class="c-you-ring" r="11"/>
        <circle class="c-you-dot" r="9"/>
        <text class="c-you-label" x="0" y="${labelAbove ? -17 : 28}" text-anchor="middle">You</text>
        <circle class="hit you-hit" r="18"/>
      </g>
    </svg>`;

    const svg = $("#compassWrap svg");
    requestAnimationFrame(() => requestAnimationFrame(() => {
      svg.querySelectorAll(".c-you").forEach(g => (g.style.transform = `translate(${ux}px, ${uy}px)`));
      $(".c-ell", svg).style.transform = "scale(1)";
      svg.querySelectorAll(".ref-g").forEach(g => (g.style.opacity = 1));
    }));

    svg.querySelectorAll(".zone-hit").forEach(el => bindTip(el, () => {
      const t = Q.types[el.dataset.key];
      return `<b>${t.name}</b><div class="tt-a">${t.label}</div><div class="tt-q">${t.text}</div>`;
    }));
    svg.querySelectorAll(".ref-hit").forEach(el => bindTip(el, () => {
      const r = refScores[el.dataset.ref];
      return `<b>${r.label}</b> <span class="tt-a">illustrative</span>
        <div class="tt-row"><span>Economic</span><span>${fmt(r.s.e)}</span></div>
        <div class="tt-row"><span>Authority</span><span>${fmt(r.s.a)}</span></div>
        <div class="tt-row"><span>Culture</span><span>${fmt(r.s.c)}</span></div>`;
    }));
    bindTip($(".you-hit", svg), () => `<b>You · ${Q.types[s.typeKey].name}</b>
        <div class="tt-row"><span>Economic</span><span>${fmt(s.e)}</span></div>
        <div class="tt-row"><span>Authority</span><span>${fmt(s.a)}</span></div>
        <div class="tt-row"><span>Culture</span><span>${fmt(s.c)}</span></div>
        <div class="tt-row"><span>Spread (E / A)</span><span>${s.spread.e.toFixed(1)} / ${s.spread.a.toFixed(1)}</span></div>`);

    $("#compassLegend").innerHTML = `<span><i class="lg-you"></i>Your position</span><span><i class="lg-ell"></i>Spread of answers</span><span><i class="lg-ref"></i>Reference profile (illustrative)</span>`;
  }

  function trackHTML(axis, v) {
    const ax = Q.axes[axis];
    const refs = Object.entries(refScores).map(([k, r]) =>
      `<span class="ref" style="left:${50 + r.s[axis] * 5}%"></span><span class="ref-l" style="left:${50 + r.s[axis] * 5}%">${k === "dem" ? "D" : "R"}</span>`).join("");
    return `<div class="track">
        <span class="fill ${v >= 0 ? "pos" : "neg"}" style="left:50%;width:0"></span>
        ${refs}
        <span class="knob" style="left:50%"></span>
      </div>
      <div class="poles-row"><span class="neg">◀ ${ax.neg}</span><span class="pos">${ax.pos} ▶</span></div>`;
  }

  function renderGauges(s) {
    const wrap = $("#gauges");
    wrap.innerHTML = ["e", "a", "c"].map(axis => `
      <div class="gauge" data-axis="${axis}">
        <div class="gauge-top"><span class="gauge-name">${Q.axes[axis].name}${axis === "c" ? " <span class='meta'>(not plotted)</span>" : ""}</span><span class="gauge-val">0.0</span></div>
        <p class="gauge-verdict">${verdict(axis, s[axis])}</p>
        ${trackHTML(axis, s[axis])}
      </div>`).join("") +
      `<p class="gauge-note">D and R diamonds mark the illustrative Typical Democrat and Typical Republican profiles.</p>`;

    setTimeout(() => {
      wrap.querySelectorAll(".gauge").forEach(g => {
        const v = s[g.dataset.axis];
        const fill = $(".fill", g);
        if (v >= 0) { fill.style.left = "50%"; fill.style.width = v * 5 + "%"; }
        else { fill.style.left = 50 + v * 5 + "%"; fill.style.width = -v * 5 + "%"; }
        $(".knob", g).style.left = 50 + v * 5 + "%";
        countUp($(".gauge-val", g), v);
      });
    }, 350);
  }

  function renderIssues(s, answers) {
    const wrap = $("#issueBars");
    let html = "";
    ["e", "a", "c"].forEach(axis => {
      const ax = Q.axes[axis];
      const groups = s.groups.filter(g => g.axis === axis);
      html += `<div class="ib-group">
        <div class="ib-head"><h4>${ax.name} issues</h4><div class="poles-row"><span class="neg">◀ ${ax.neg}</span><span class="pos">${ax.pos} ▶</span></div><span></span></div>`;
      groups.forEach(g => {
        html += `<div class="ib-row" data-key="${g.key}">
          <span class="ib-label">${g.label}</span>
          ${g.value === null
            ? `<span class="ib-none">Not sure on all questions</span><span class="ib-val">–</span>`
            : `<div class="ib-track"><span class="ib-bar ${g.value >= 0 ? "pos" : "neg"}" data-v="${g.value}" style="left:50%;width:0"></span><span class="ib-overall" style="left:calc(${50 + s[axis] * 5}% - 1px)"></span></div>
               <span class="ib-val">${fmt(g.value)}</span>`}
        </div>`;
      });
      html += `</div>`;
    });
    html += `<p class="gauge-note">Bars show the issue position. The vertical tick marks the overall score on the same axis.</p>`;
    wrap.innerHTML = html;

    wrap.querySelectorAll(".ib-row").forEach(row => {
      const key = row.dataset.key;
      const g = s.groups.find(x => x.key === key);
      bindTip(row, () => {
        const items = Q.questions.filter(q => q.issue === key);
        return `<b>${g.label}</b> <span class="tt-a">${g.value === null ? "no position" : fmt(g.value) + " " + Q.axes[g.axis].name.toLowerCase()}</span>` +
          items.map(q => `<div class="tt-q">${esc(q.q)}</div><div class="tt-a">→ ${answerLabel(answers[q.id])}</div>`).join("");
      });
    });

    setTimeout(() => {
      wrap.querySelectorAll(".ib-bar").forEach(b => {
        const v = +b.dataset.v;
        if (v >= 0) { b.style.left = "50%"; b.style.width = v * 5 + "%"; }
        else { b.style.left = 50 + v * 5 + "%"; b.style.width = -v * 5 + "%"; }
      });
    }, 500);
  }

  function renderOutliers(s) {
    const el = $("#outliers");
    if (!s.outliers.length) {
      el.innerHTML = `<p class="empty">No issue departs from the overall profile by 6 points or more. Positions are internally consistent across issues.</p>`;
      return;
    }
    el.innerHTML = s.outliers.map(g => {
      const ax = Q.axes[g.axis];
      const dir = g.diff > 0 ? ax.pos : ax.neg;
      return `<article class="outlier">
        <h4>${g.label}</h4>
        <p>Positions on this issue are more ${dir.toLowerCase()} than the overall ${ax.name.toLowerCase()} score.</p>
        <p class="nums">Issue ${fmt(g.value)} · Overall ${fmt(s[g.axis])} · Gap ${fmt(g.diff)}</p>
      </article>`;
    }).join("");
  }

  function renderTable(answers) {
    const w = v => (v === 0 ? "0" : (v > 0 ? "+" : "−") + Math.abs(v).toFixed(1));
    const rows = Q.questions.map(q => `<tr><td>${esc(q.q)}</td><td>${Q.issues[q.issue].label}</td><td>${answerLabel(answers[q.id])}</td><td class="num">${w(q.e)}</td><td class="num">${w(q.a)}</td><td class="num">${w(q.c)}</td></tr>`).join("");
    $("#answerTable").innerHTML = `<thead><tr><th>Question</th><th>Issue</th><th>Answer</th><th>E</th><th>A</th><th>C</th></tr></thead><tbody>${rows}</tbody>`;
  }

  /* ---------- share ---------- */
  $("#shareBtn").addEventListener("click", async () => {
    const url = location.href;
    try {
      await navigator.clipboard.writeText(url);
      toast("Result link copied");
    } catch (e) {
      const ta = document.createElement("textarea");
      ta.value = url; document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); toast("Result link copied"); } catch (e2) { toast("Copy failed. Use the address bar link."); }
      ta.remove();
    }
  });

  /* ---------- boot ---------- */
  function boot() {
    const m = location.hash.match(/^#r=([A-EN]+)$/);
    const decoded = m && E.decode(Q, m[1]);
    if (decoded) showResults(decoded, true);
  }
  window.addEventListener("hashchange", boot);
  boot();
})();
