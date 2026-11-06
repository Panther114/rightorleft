/* Question bank, issue groups, reference profiles and type definitions.
   Weights: e = economic (+ market, - state), a = authority (+ authoritarian, - libertarian),
   c = culture (+ traditional, - progressive). Weights describe the effect of answering "yes". */

window.QUIZ = {
  questions: [
    { id: 1,  issue: "immigration", q: "Should we deport undocumented immigrants who have lived here for 10+ years and never committed a crime?", e: 0, a: 0.6, c: 0.6 },
    { id: 2,  issue: "taxes", q: "Should we cut taxes for top earners and corporations to juice economic growth?", e: 0.8, a: 0, c: 0.1 },
    { id: 3,  issue: "abortion", q: "Should abortion be legal in every state up to fetal viability (around 24 weeks)?", e: 0, a: -0.5, c: -0.8 },
    { id: 4,  issue: "speech", q: "Should the government lean on social media companies to take down false health and election posts?", e: 0, a: 0.7, c: -0.3 },
    { id: 5,  issue: "health", q: "Should we scrap private health insurance and put everyone on one government plan?", e: -0.9, a: 0.2, c: -0.2 },
    { id: 6,  issue: "guns", q: "Should any law-abiding adult be able to buy an AR-15 without a federal license?", e: 0, a: -0.8, c: 0.4 },
    { id: 7,  issue: "federal", q: "Should the president send the National Guard into high-crime cities, even if the mayor says no?", e: 0, a: 0.9, c: 0.3 },
    { id: 8,  issue: "gender", q: "Should doctors be allowed to prescribe puberty blockers to trans teens when parents consent?", e: 0, a: -0.5, c: -0.8 },
    { id: 9,  issue: "labor", q: "Should Uber and DoorDash be allowed to keep treating drivers as contractors instead of employees?", e: 0.7, a: -0.1, c: 0 },
    { id: 10, issue: "education", q: "Should school libraries pull books with sexual content when parents object, even award winners?", e: 0, a: 0.5, c: 0.7 },
    { id: 11, issue: "drugs", q: "Should getting caught with a small amount of any drug mean a ticket to treatment instead of jail?", e: 0, a: -0.8, c: -0.4 },
    { id: 12, issue: "trade", q: "Should we slap big tariffs on imports to bring factories home, even if prices go up?", e: -0.3, a: 0.3, c: 0.5 },
    { id: 13, issue: "vaccines", q: "Should parents be able to skip school vaccine requirements for religious or personal reasons?", e: 0, a: -0.6, c: 0.4 },
    { id: 14, issue: "taxes", q: "Should we raise the federal minimum wage to $17 an hour?", e: -0.8, a: 0, c: -0.1 },
    { id: 15, issue: "dei", q: "Should Washington cut funding to universities that run race-conscious diversity programs?", e: 0, a: 0.6, c: 0.6 },
    { id: 16, issue: "education", q: "Should families get to spend public school money on private or religious schools?", e: 0.6, a: -0.3, c: 0.4 },
    { id: 17, issue: "gender", q: "Should trans women be able to compete in women's sports?", e: 0, a: 0, c: -0.9 },
    { id: 18, issue: "climate", q: "Should we ban sales of new gas-powered cars by 2035, even if cars get pricier?", e: -0.5, a: 0.6, c: -0.4 },
    { id: 19, issue: "federal", q: "Should the Fed and other independent agencies be shielded from a president firing their leaders?", e: 0, a: -0.5, c: -0.2 },
    { id: 20, issue: "health", q: "Should people on Medicaid or food stamps have to work or job-hunt to keep their benefits?", e: 0.6, a: 0.2, c: 0.3 },
    { id: 21, issue: "housing", q: "Should we scrap zoning rules that ban apartment buildings in single-family neighborhoods?", e: 0.3, a: -0.5, c: -0.3 },
    { id: 22, issue: "speech", q: "Should AI labs need a federal license before releasing their most powerful models?", e: -0.3, a: 0.5, c: 0 },
    { id: 23, issue: "immigration", q: "Should we let in more legal immigrants and refugees every year?", e: 0.1, a: 0, c: -0.7 },
    { id: 24, issue: "labor", q: "Should big companies have to publish what they pay workers by race and gender?", e: -0.4, a: 0.4, c: -0.5 }
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
    { v: 2,    label: "Absolutely", stamp: "ABSOLUTELY" },
    { v: 1,    label: "Yeah", stamp: "YEAH" },
    { v: null, label: "Not sure", stamp: "HMM" },
    { v: -1,   label: "Nah", stamp: "NAH" },
    { v: -2,   label: "No way", stamp: "NO WAY" }
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
