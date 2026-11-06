/* Question bank, issue groups, reference profiles and type definitions.
   Weights: e = economic (+ market, - state), a = authority (+ authoritarian, - libertarian),
   c = culture (+ traditional, - progressive). Weights describe the effect of answering "yes". */

window.QUIZ = {
  questions: [
    { id: 1,  issue: "immigration", q: "Should immigrants who have lived here illegally for 10+ years and have no criminal record be deported?", e: 0, a: 0.6, c: 0.6 },
    { id: 2,  issue: "taxes", q: "Should taxes be cut for the richest people and big corporations to help the economy grow?", e: 0.8, a: 0, c: 0.1 },
    { id: 3,  issue: "abortion", q: "Should abortion be legal in every state until the baby could survive outside the womb (about 24 weeks)?", e: 0, a: -0.5, c: -0.8 },
    { id: 4,  issue: "speech", q: "Should the government pressure social media companies to remove false posts about health or elections?", e: 0, a: 0.7, c: -0.3 },
    { id: 5,  issue: "health", q: "Should private health insurance be replaced by one government health plan for everyone?", e: -0.9, a: 0.2, c: -0.2 },
    { id: 6,  issue: "guns", q: "Should any adult without a criminal record be able to buy an AR-15 rifle without a federal license?", e: 0, a: -0.8, c: 0.4 },
    { id: 7,  issue: "federal", q: "Should the president be able to send the National Guard into high-crime cities even if the mayor objects?", e: 0, a: 0.9, c: 0.3 },
    { id: 8,  issue: "gender", q: "Should doctors be allowed to give puberty-blocking drugs to transgender teens if their parents agree?", e: 0, a: -0.5, c: -0.8 },
    { id: 9,  issue: "labor", q: "Should Uber and DoorDash be allowed to treat drivers as independent contractors instead of employees?", e: 0.7, a: -0.1, c: 0 },
    { id: 10, issue: "education", q: "Should school libraries remove books with sexual content when parents complain, even award-winning ones?", e: 0, a: 0.5, c: 0.7 },
    { id: 11, issue: "drugs", q: "Should people caught with a small amount of any drug get treatment instead of jail?", e: 0, a: -0.8, c: -0.4 },
    { id: 12, issue: "trade", q: "Should the US put high taxes on imported goods to bring factories back, even if prices go up?", e: -0.3, a: 0.3, c: 0.5 },
    { id: 13, issue: "vaccines", q: "Should parents be allowed to skip required school vaccines for religious or personal reasons?", e: 0, a: -0.6, c: 0.4 },
    { id: 14, issue: "taxes", q: "Should the federal minimum wage be raised to $17 an hour?", e: -0.8, a: 0, c: -0.1 },
    { id: 15, issue: "dei", q: "Should the federal government cut funding to colleges that run race-based diversity programs?", e: 0, a: 0.6, c: 0.6 },
    { id: 16, issue: "education", q: "Should parents be able to use public school funding to pay for private or religious schools?", e: 0.6, a: -0.3, c: 0.4 },
    { id: 17, issue: "gender", q: "Should transgender women be allowed to compete in women's sports?", e: 0, a: 0, c: -0.9 },
    { id: 18, issue: "climate", q: "Should selling new gas-powered cars be banned after 2035, even if cars cost more?", e: -0.5, a: 0.6, c: -0.4 },
    { id: 19, issue: "federal", q: "Should the president be barred from firing the heads of the Federal Reserve (which sets interest rates) and other independent agencies?", e: 0, a: -0.5, c: -0.2 },
    { id: 20, issue: "health", q: "Should people on Medicaid or food stamps be required to work or look for a job to keep their benefits?", e: 0.6, a: 0.2, c: 0.3 },
    { id: 21, issue: "housing", q: "Should cities end rules that only allow single-family homes in some neighborhoods, so apartments can be built there?", e: 0.3, a: -0.5, c: -0.3 },
    { id: 22, issue: "speech", q: "Should AI companies need a federal license before releasing their most powerful AI systems?", e: -0.3, a: 0.5, c: 0 },
    { id: 23, issue: "immigration", q: "Should the US allow more legal immigrants and refugees each year?", e: 0.1, a: 0, c: -0.7 },
    { id: 24, issue: "labor", q: "Should large companies be required to publicly report what they pay workers by race and gender?", e: -0.4, a: 0.4, c: -0.5 }
  ],

  /* Issue groups. axis = the dimension on which the group is reported in the issue profile. */
  issues: {
    immigration: { label: "Immigration", axis: "c" },
    taxes:       { label: "Taxes & wages", axis: "e" },
    health:      { label: "Healthcare & welfare", axis: "e" },
    labor:       { label: "Labor & workplace", axis: "e" },
    trade:       { label: "Trade", axis: "e" },
    guns:        { label: "Guns", axis: "a" },
    federal:     { label: "Federal power", axis: "a" },
    speech:      { label: "Speech & tech", axis: "a" },
    drugs:       { label: "Drugs", axis: "a" },
    vaccines:    { label: "Vaccines", axis: "a" },
    housing:     { label: "Housing", axis: "a" },
    climate:     { label: "Climate", axis: "a" },
    abortion:    { label: "Abortion", axis: "c" },
    gender:      { label: "Gender", axis: "c" },
    education:   { label: "Education", axis: "c" },
    dei:         { label: "Diversity programs", axis: "c" }
  },

  axes: {
    e: { name: "Economic", neg: "State", pos: "Market" },
    a: { name: "Authority", neg: "Libertarian", pos: "Authoritarian" },
    c: { name: "Culture", neg: "Progressive", pos: "Traditional" }
  },

  answers: [
    { v: -2,   label: "Fuck no", stamp: "FUCK NO" },
    { v: -1,   label: "Nah", stamp: "NAH" },
    { v: null, label: "Not sure", stamp: "HMM" },
    { v: 1,    label: "Yeah", stamp: "YEAH" },
    { v: 2,    label: "Fuck yes", stamp: "FUCK YES" }
  ],

  /* Illustrative reference profiles built from majority positions in public polling.
     They are approximations, not survey medians. Keyed by question id. */
  references: {
    dem: { label: "Typical Democrat", answers: { 1: -2, 2: -2, 3: 2, 4: 1, 5: 1, 6: -2, 7: -2, 8: 1, 9: -1, 10: -1, 11: 0, 12: -2, 13: -2, 14: 2, 15: -2, 16: -1, 17: 0, 18: 1, 19: 2, 20: -1, 21: 1, 22: 1, 23: 1, 24: 2 } },
    rep: { label: "Typical Republican", answers: { 1: 1, 2: 2, 3: -2, 4: -2, 5: -2, 6: 2, 7: 2, 8: -2, 9: 1, 10: 2, 11: -1, 12: 1, 13: 1, 14: -1, 15: 2, 16: 2, 17: -2, 18: -2, 19: -1, 20: 2, 21: 0, 22: 0, 23: -1, 24: -1 } }
  },

  /* 3 x 3 classification. Row: authority (top = authoritarian). Column: economic. */
  types: {
    "a+e-": { name: "The Architect", label: "Statist Left", text: "Favors an active state that both manages the economy and sets firm rules for society. Public programs, regulation and mandates are treated as the main tools for fixing problems." },
    "a+e0": { name: "The Guardian", label: "Statist Centre", text: "Prioritizes order, security and strong institutions, with a pragmatic, case-by-case approach to economics." },
    "a+e+": { name: "The Sentinel", label: "Statist Right", text: "Pairs market economics with a strong state on borders, policing and social standards. Government power is welcome when it enforces order." },
    "a0e-": { name: "The Reformer", label: "Moderate Left", text: "Supports a larger safety net and more regulation of business, without strong views on expanding or shrinking state power over personal life." },
    "a0e0": { name: "The Pragmatist", label: "Centrist", text: "Takes positions issue by issue and does not sit firmly in any ideological camp. Views on the economy and state power are balanced or mixed." },
    "a0e+": { name: "The Steward", label: "Moderate Right", text: "Prefers lower taxes, lighter regulation and personal responsibility, with moderate views on state power over personal life." },
    "a-e-": { name: "The Free Spirit", label: "Libertarian Left", text: "Wants a fairer economy through public programs while keeping government out of personal choices about bodies, speech and lifestyle." },
    "a-e0": { name: "The Independent", label: "Libertarian Centre", text: "Is skeptical of government power in nearly every form and evaluates economic questions pragmatically." },
    "a-e+": { name: "The Pioneer", label: "Libertarian Right", text: "Wants minimal government in both the market and personal life. Free enterprise, gun rights and individual liberty come first." }
  }
};
