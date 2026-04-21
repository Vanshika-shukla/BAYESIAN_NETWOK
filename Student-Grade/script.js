// ====== Student Grade Bayesian Network ======
// Variables:
//   PreviousPerformance: poor, average, good
//   StudyHours:          low, medium, high
//   Attendance:          poor, average, good
//   Understanding:       low, medium, high
//   Grade:               C, B, A
// vanshika

// ============================================================
// BAYESIAN NETWORK DEFINITION
// Each node: { values, parents, cpt }
// CPT key = comma-separated parent values (in parents order)
// CPT value = { nodeValue: probability }
// ============================================================
const bn = {
  PreviousPerformance: {
    values: ["poor", "average", "good"],
    parents: [],
    cpt: {
      "": { poor: 0.25, average: 0.45, good: 0.30 }
    }
  },

  StudyHours: {
    values: ["low", "medium", "high"],
    parents: [],
    cpt: {
      "": { low: 0.30, medium: 0.40, high: 0.30 }
    }
  },

  Attendance: {
    values: ["poor", "average", "good"],
    parents: [],
    cpt: {
      "": { poor: 0.20, average: 0.50, good: 0.30 }
    }
  },

  // Understanding | PreviousPerformance, StudyHours, Attendance
  Understanding: {
    values: ["low", "medium", "high"],
    parents: ["PreviousPerformance", "StudyHours", "Attendance"],
    cpt: {
      "poor,low,poor":     { low: 0.70, medium: 0.20, high: 0.10 },
      "poor,low,average":  { low: 0.55, medium: 0.30, high: 0.15 },
      "poor,low,good":     { low: 0.45, medium: 0.35, high: 0.20 },
      "poor,medium,poor":  { low: 0.50, medium: 0.35, high: 0.15 },
      "poor,medium,average":{ low: 0.35, medium: 0.40, high: 0.25 },
      "poor,medium,good":  { low: 0.25, medium: 0.45, high: 0.30 },
      "poor,high,poor":    { low: 0.35, medium: 0.40, high: 0.25 },
      "poor,high,average": { low: 0.20, medium: 0.45, high: 0.35 },
      "poor,high,good":    { low: 0.15, medium: 0.40, high: 0.45 },
      "average,low,poor":  { low: 0.50, medium: 0.35, high: 0.15 },
      "average,low,average":{ low: 0.35, medium: 0.40, high: 0.25 },
      "average,low,good":  { low: 0.25, medium: 0.45, high: 0.30 },
      "average,medium,poor":{ low: 0.30, medium: 0.45, high: 0.25 },
      "average,medium,average":{ low: 0.20, medium: 0.45, high: 0.35 },
      "average,medium,good":{ low: 0.15, medium: 0.40, high: 0.45 },
      "average,high,poor": { low: 0.20, medium: 0.45, high: 0.35 },
      "average,high,average":{ low: 0.10, medium: 0.40, high: 0.50 },
      "average,high,good": { low: 0.05, medium: 0.30, high: 0.65 },
      "good,low,poor":     { low: 0.30, medium: 0.45, high: 0.25 },
      "good,low,average":  { low: 0.20, medium: 0.45, high: 0.35 },
      "good,low,good":     { low: 0.10, medium: 0.45, high: 0.45 },
      "good,medium,poor":  { low: 0.15, medium: 0.45, high: 0.40 },
      "good,medium,average":{ low: 0.08, medium: 0.37, high: 0.55 },
      "good,medium,good":  { low: 0.05, medium: 0.25, high: 0.70 },
      "good,high,poor":    { low: 0.08, medium: 0.37, high: 0.55 },
      "good,high,average": { low: 0.03, medium: 0.22, high: 0.75 },
      "good,high,good":    { low: 0.02, medium: 0.13, high: 0.85 }
    }
  },

  // Grade | Understanding, Attendance
  Grade: {
    values: ["C", "B", "A"],
    parents: ["Understanding", "Attendance"],
    cpt: {
      "low,poor":    { C: 0.75, B: 0.20, A: 0.05 },
      "low,average": { C: 0.60, B: 0.30, A: 0.10 },
      "low,good":    { C: 0.45, B: 0.40, A: 0.15 },
      "medium,poor": { C: 0.35, B: 0.45, A: 0.20 },
      "medium,average":{ C: 0.20, B: 0.50, A: 0.30 },
      "medium,good": { C: 0.10, B: 0.50, A: 0.40 },
      "high,poor":   { C: 0.15, B: 0.45, A: 0.40 },
      "high,average":{ C: 0.05, B: 0.35, A: 0.60 },
      "high,good":   { C: 0.02, B: 0.18, A: 0.80 }
    }
  }
};

// Topological order for sampling / enumeration
const BN_ORDER = ["PreviousPerformance", "StudyHours", "Attendance", "Understanding", "Grade"];

// ============================================================
// HELPER: getProbability(variable, value, evidence, bn)
// Returns P(variable=value | parents from evidence)
// ============================================================
function getProbability(variable, value, evidence, bn) {
  const node = bn[variable];
  // Build CPT key from parent values in evidence
  const key = node.parents.map(p => evidence[p]).join(",");
  const row = node.cpt[key];
  if (!row) return 0;
  return row[value] || 0;
}

// ============================================================
// HELPER: normalize(dist)
// Normalizes a { value: count } distribution so values sum to 1
// ============================================================
function normalize(dist) {
  const total = Object.values(dist).reduce((s, v) => s + v, 0);
  if (total === 0) return dist;
  const result = {};
  for (const k in dist) result[k] = dist[k] / total;
  return result;
}

// ============================================================
// EXACT INFERENCE — Enumeration Ask
// P(queryVar | evidence) via variable elimination by enumeration
// ============================================================

/**
 * enumerationAsk(queryVar, evidence, bn)
 * Returns normalized distribution over queryVar values given evidence.
 */
function enumerationAsk(queryVar, evidence, bn) {
  const dist = {};
  const node = bn[queryVar];

  for (const val of node.values) {
    // Extend evidence with this query assignment
    const extEvidence = Object.assign({}, evidence, { [queryVar]: val });
    // Sum over all hidden variables
    const hidden = BN_ORDER.filter(v => v !== queryVar && !(v in evidence));
    dist[val] = enumerateAll(hidden, extEvidence, bn);
  }

  return normalize(dist);
}

/**
 * enumerateAll(vars, evidence, bn)
 * Recursively sums over all combinations of unassigned variables.
 */
function enumerateAll(vars, evidence, bn) {
  if (vars.length === 0) {
    // Base case: compute joint probability of all assigned variables
    let p = 1;
    for (const v of BN_ORDER) {
      if (v in evidence) {
        p *= getProbability(v, evidence[v], evidence, bn);
      }
    }
    return p;
  }

  const [first, ...rest] = vars;
  const node = bn[first];
  let total = 0;

  for (const val of node.values) {
    // Only enumerate if all parents are already in evidence
    const parentsKnown = node.parents.every(p => p in evidence);
    if (!parentsKnown) {
      // Skip — parent not yet assigned; handled by ordering
    }
    const extEvidence = Object.assign({}, evidence, { [first]: val });
    total += enumerateAll(rest, extEvidence, bn);
  }

  return total;
}

// ============================================================
// APPROXIMATE INFERENCE — Sampling Helpers
// ============================================================

/**
 * priorSample(bn)
 * Generates one complete sample from the prior distribution.
 * Returns { variable: sampledValue, ... }
 */
function priorSample(bn) {
  const sample = {};
  for (const variable of BN_ORDER) {
    const node = bn[variable];
    const key = node.parents.map(p => sample[p]).join(",");
    const row = node.cpt[key];
    // Sample from the distribution using a random number
    const r = Math.random();
    let cumulative = 0;
    for (const val of node.values) {
      cumulative += row[val];
      if (r <= cumulative) {
        sample[variable] = val;
        break;
      }
    }
    // Fallback in case of floating point edge
    if (!sample[variable]) sample[variable] = node.values[node.values.length - 1];
  }
  return sample;
}

/**
 * weightedSample(bn, evidence)
 * Generates one sample; evidence variables are fixed (not sampled).
 * Returns { sample, weight } where weight = product of P(e_i | parents).
 */
function weightedSample(bn, evidence) {
  const sample = {};
  let weight = 1;

  for (const variable of BN_ORDER) {
    const node = bn[variable];

    if (variable in evidence) {
      // Fix evidence variable, multiply weight by its probability
      sample[variable] = evidence[variable];
      weight *= getProbability(variable, evidence[variable], sample, bn);
    } else {
      // Sample freely from prior
      const key = node.parents.map(p => sample[p]).join(",");
      const row = node.cpt[key];
      const r = Math.random();
      let cumulative = 0;
      for (const val of node.values) {
        cumulative += row[val];
        if (r <= cumulative) {
          sample[variable] = val;
          break;
        }
      }
      if (!sample[variable]) sample[variable] = node.values[node.values.length - 1];
    }
  }

  return { sample, weight };
}

// ============================================================
// APPROXIMATE INFERENCE — Rejection Sampling
// ============================================================

/**
 * rejectionSampling(queryVar, evidence, bn, N)
 * Generates N prior samples, rejects those inconsistent with evidence,
 * counts query variable values in accepted samples.
 */
function rejectionSampling(queryVar, evidence, bn, N) {
  const counts = {};
  for (const val of bn[queryVar].values) counts[val] = 0;

  for (let i = 0; i < N; i++) {
    const sample = priorSample(bn);

    // Check if sample is consistent with all evidence
    const consistent = Object.entries(evidence).every(
      ([eVar, eVal]) => sample[eVar] === eVal
    );

    if (consistent) {
      counts[sample[queryVar]]++;
    }
  }

  return normalize(counts);
}

// ============================================================
// APPROXIMATE INFERENCE — Likelihood Weighting
// ============================================================

/**
 * likelihoodWeighting(queryVar, evidence, bn, N)
 * Generates N weighted samples; accumulates weighted counts
 * for the query variable. No samples are rejected.
 */
function likelihoodWeighting(queryVar, evidence, bn, N) {
  const weightedCounts = {};
  for (const val of bn[queryVar].values) weightedCounts[val] = 0;

  for (let i = 0; i < N; i++) {
    const { sample, weight } = weightedSample(bn, evidence);
    weightedCounts[sample[queryVar]] += weight;
  }

  return normalize(weightedCounts);
}

// ============================================================
// LEGACY: Joint / Marginal / Conditional (kept for Tab 1)
// Now powered by the BN structure above
// ============================================================

const Prev_vals  = bn.PreviousPerformance.values;
const Study_vals = bn.StudyHours.values;
const Att_vals   = bn.Attendance.values;
const Und_vals   = bn.Understanding.values;
const Grade_vals = bn.Grade.values;

/** Enumerate all full assignments and return joint probability */
function fullJoint(assignment) {
  let p = 1;
  for (const v of BN_ORDER) {
    p *= getProbability(v, assignment[v], assignment, bn);
  }
  return p;
}

/** Iterate over all full assignments, calling cb(assignment, jp) */
function forAllAssignments(cb) {
  for (const P of Prev_vals)
    for (const S of Study_vals)
      for (const A of Att_vals)
        for (const U of Und_vals)
          for (const G of Grade_vals) {
            const asgn = {
              PreviousPerformance: P,
              StudyHours: S,
              Attendance: A,
              Understanding: U,
              Grade: G
            };
            cb(asgn, fullJoint(asgn));
          }
}

function assignmentMatches(asgn, varName, val) {
  return asgn[varName] === val;
}

function calculateMarginalProbability(variable, value) {
  let prob = 0;
  forAllAssignments((asgn, jp) => {
    if (assignmentMatches(asgn, variable, value)) prob += jp;
  });
  return prob;
}

function calculateJointProbability3(var1, val1, var2, val2, var3, val3) {
  let result = 0;
  forAllAssignments((asgn, jp) => {
    if (asgn[var1] === val1 && asgn[var2] === val2 && asgn[var3] === val3)
      result += jp;
  });
  return result;
}

function conditionalProbability3(var1, val1, var2, val2, condVar1, condVal1) {
  let numerator = 0, denominator = 0;
  forAllAssignments((asgn, jp) => {
    if (asgn[condVar1] === condVal1) {
      denominator += jp;
      if (asgn[var1] === val1 && asgn[var2] === val2) numerator += jp;
    }
  });
  return denominator === 0 ? 0 : numerator / denominator;
}

// ============================================================
// UI — Tab 1: Classic probability calculator
// ============================================================
function calculate() {
  const probType = document.getElementById("probType").value;
  const var1 = document.getElementById("var1").value;
  const val1 = document.getElementById("val1").value;
  const var2 = document.getElementById("var2").value;
  const val2 = document.getElementById("val2").value;
  const var3 = document.getElementById("var3").value;
  const val3 = document.getElementById("val3").value;
  const condVar1 = document.getElementById("condVar1").value;
  const condVal1 = document.getElementById("condVal1").value;

  let result = "";

  if (probType === "marginal") {
    const prob = calculateMarginalProbability(var1, val1);
    result = `P(${var1} = ${val1}) = ${prob.toFixed(6)} (${(prob * 100).toFixed(2)}%)`;

  } else if (probType === "joint") {
    if (new Set([var1, var2, var3]).size !== 3) {
      result = "Error: Cannot select the same variable multiple times!";
    } else {
      const prob = calculateJointProbability3(var1, val1, var2, val2, var3, val3);
      result = `P(${var1}=${val1}, ${var2}=${val2}, ${var3}=${val3}) = ${prob.toFixed(6)} (${(prob * 100).toFixed(4)}%)`;
    }

  } else if (probType === "conditional") {
    if (var1 === condVar1 || var2 === condVar1 || var1 === var2) {
      result = "Error: Event variables must be different from condition variable!";
    } else {
      const prob = conditionalProbability3(var1, val1, var2, val2, condVar1, condVal1);
      result = `P(${var1}=${val1}, ${var2}=${val2} | ${condVar1}=${condVal1}) = ${prob.toFixed(6)} (${(prob * 100).toFixed(4)}%)`;
    }
  }

  document.getElementById("result").innerHTML = result;
}

// ============================================================
// UI — Tab 2: Inference engine
// ============================================================
function runInference() {
  const queryVar  = document.getElementById("inferQueryVar").value;
  const method    = document.getElementById("inferMethod").value;
  const N         = 10000;

  // Build evidence object from the evidence rows
  const evidence = {};
  const rows = document.querySelectorAll(".evidence-row");
  const usedVars = new Set();

  for (const row of rows) {
    const eVar = row.querySelector(".ev-var").value;
    const eVal = row.querySelector(".ev-val").value;

    if (eVar === queryVar) {
      document.getElementById("inferResult").innerHTML =
        "Error: Evidence variable cannot be the same as query variable.";
      return;
    }
    if (usedVars.has(eVar)) {
      document.getElementById("inferResult").innerHTML =
        "Error: Duplicate evidence variable detected.";
      return;
    }
    usedVars.add(eVar);
    evidence[eVar] = eVal;
  }

  let result;
  if (method === "enumeration") {
    result = enumerationAsk(queryVar, evidence, bn);
  } else if (method === "rejection") {
    result = rejectionSampling(queryVar, evidence, bn, N);
  } else {
    result = likelihoodWeighting(queryVar, evidence, bn, N);
  }

  // Format output
  const evidStr = Object.entries(evidence)
    .map(([k, v]) => `${k}="${v}"`)
    .join(", ");
  const queryLabel = evidStr
    ? `P(${queryVar} | ${evidStr})`
    : `P(${queryVar})`;

  let html = `<div style="margin-bottom:8px;font-size:12px;color:#888;">${queryLabel} [${method}]</div>`;
  for (const [val, prob] of Object.entries(result)) {
    const pct = (prob * 100).toFixed(2);
    const barW = Math.round(prob * 100);
    html += `
      <div style="margin-bottom:6px;">
        <div style="display:flex;justify-content:space-between;font-size:13px;font-weight:700;">
          <span>${val}</span><span>${prob.toFixed(4)}</span>
        </div>
        <div style="background:#f2c7c7;border-radius:6px;height:8px;margin-top:3px;">
          <div style="background:linear-gradient(90deg,#ffb7c5,#f2c7c7);width:${barW}%;height:8px;border-radius:6px;"></div>
        </div>
        <div style="font-size:11px;color:#888;text-align:right;">${pct}%</div>
      </div>`;
  }

  document.getElementById("inferResult").innerHTML = html;
}

// Add / remove evidence rows dynamically
function addEvidenceRow() {
  const container = document.getElementById("evidenceRows");
  const allVars = BN_ORDER;

  const row = document.createElement("div");
  row.className = "evidence-row";
  row.style.cssText = "display:flex;gap:6px;align-items:center;margin-top:8px;";

  const varSel = document.createElement("select");
  varSel.className = "ev-var";
  varSel.style.cssText = "flex:1;";
  allVars.forEach(v => {
    const o = document.createElement("option");
    o.value = v; o.textContent = v;
    varSel.appendChild(o);
  });

  const valSel = document.createElement("select");
  valSel.className = "ev-val";
  valSel.style.cssText = "flex:1;";

  function fillEvidenceVals() {
    const vals = bn[varSel.value].values;
    valSel.innerHTML = "";
    vals.forEach(v => {
      const o = document.createElement("option");
      o.value = v; o.textContent = v;
      valSel.appendChild(o);
    });
  }

  varSel.addEventListener("change", fillEvidenceVals);
  fillEvidenceVals();

  const removeBtn = document.createElement("button");
  removeBtn.textContent = "✕";
  removeBtn.style.cssText = "width:32px;padding:6px;margin-top:0;font-size:12px;";
  removeBtn.onclick = () => container.removeChild(row);

  row.appendChild(varSel);
  row.appendChild(valSel);
  row.appendChild(removeBtn);
  container.appendChild(row);
}

// ============================================================
// CPT TABLES
// ============================================================
function generateProbabilityTables() {
  let html = `<h3 style="color:#333;margin:0 0 16px;font-size:16px;font-weight:600;">
    Conditional Probability Tables</h3>`;

  // Prior tables
  for (const varName of ["PreviousPerformance", "StudyHours", "Attendance"]) {
    html += `<table><thead><tr><th>${varName}</th><th>Probability</th><th>%</th></tr></thead><tbody>`;
    for (const val of bn[varName].values) {
      const p = bn[varName].cpt[""][val];
      html += `<tr><td><strong>${val}</strong></td><td>${p.toFixed(4)}</td><td>${(p*100).toFixed(1)}%</td></tr>`;
    }
    html += `</tbody></table><br>`;
  }

  // Understanding CPT
  html += `<table><thead><tr>
    <th>PrevPerf</th><th>StudyHrs</th><th>Attendance</th>
    <th>Understanding</th><th>P</th><th>%</th>
  </tr></thead><tbody>`;
  for (const key of Object.keys(bn.Understanding.cpt)) {
    const [pp, sh, att] = key.split(",");
    for (const uVal of bn.Understanding.values) {
      const p = bn.Understanding.cpt[key][uVal];
      html += `<tr>
        <td>${pp}</td><td>${sh}</td><td>${att}</td>
        <td><strong>${uVal}</strong></td>
        <td>${p.toFixed(4)}</td><td>${(p*100).toFixed(1)}%</td>
      </tr>`;
    }
  }
  html += `</tbody></table><br>`;

  // Grade CPT
  html += `<table><thead><tr>
    <th>Understanding</th><th>Attendance</th><th>Grade</th><th>P</th><th>%</th>
  </tr></thead><tbody>`;
  for (const key of Object.keys(bn.Grade.cpt)) {
    const [und, att] = key.split(",");
    for (const gVal of bn.Grade.values) {
      const p = bn.Grade.cpt[key][gVal];
      html += `<tr>
        <td>${und}</td><td>${att}</td>
        <td><strong>${gVal}</strong></td>
        <td>${p.toFixed(4)}</td><td>${(p*100).toFixed(1)}%</td>
      </tr>`;
    }
  }
  html += `</tbody></table>`;

  document.getElementById("tableContainer").innerHTML = html;
}

// ============================================================
// UI WIRING
// ============================================================
document.addEventListener("DOMContentLoaded", function () {
  // ---- Tab switching ----
  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
      document.querySelectorAll(".tab-panel").forEach(p => p.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById(btn.dataset.tab).classList.add("active");
    });
  });

  // ---- Classic probability tab ----
  const probTypeSelect = document.getElementById("probType");
  const var1El  = document.getElementById("var1");
  const val1El  = document.getElementById("val1");
  const var2El  = document.getElementById("var2");
  const val2El  = document.getElementById("val2");
  const var3El  = document.getElementById("var3");
  const val3El  = document.getElementById("val3");
  const condVar1El  = document.getElementById("condVar1");
  const condVal1El  = document.getElementById("condVal1");

  function valuesForVariable(variable) {
    return bn[variable] ? bn[variable].values : [];
  }

  function fillValueOptions(variableSelect, valueSelect) {
    const vals = valuesForVariable(variableSelect.value);
    valueSelect.innerHTML = "";
    vals.forEach(v => {
      const opt = document.createElement("option");
      opt.value = v; opt.textContent = v;
      valueSelect.appendChild(opt);
    });
  }

  function updateLabelVisibility() {
    const type = probTypeSelect.value;
    const show = (id, visible) => {
      document.getElementById(id).style.display = visible ? "block" : "none";
    };
    show("var2Label",    type !== "marginal");
    show("val2Label",    type !== "marginal");
    show("var2",         type !== "marginal");
    show("val2",         type !== "marginal");
    show("var3Label",    type === "joint");
    show("val3Label",    type === "joint");
    show("var3",         type === "joint");
    show("val3",         type === "joint");
    show("condVar1Label",type === "conditional");
    show("condVal1Label",type === "conditional");
    show("condVar1",     type === "conditional");
    show("condVal1",     type === "conditional");
  }

  probTypeSelect.addEventListener("change", updateLabelVisibility);
  var1El.addEventListener("change",     () => fillValueOptions(var1El, val1El));
  var2El.addEventListener("change",     () => fillValueOptions(var2El, val2El));
  var3El.addEventListener("change",     () => fillValueOptions(var3El, val3El));
  condVar1El.addEventListener("change", () => fillValueOptions(condVar1El, condVal1El));

  // Initial fill
  [var1El, var2El, var3El, condVar1El].forEach((sel, i) => {
    fillValueOptions(sel, [val1El, val2El, val3El, condVal1El][i]);
  });
  updateLabelVisibility();

  // ---- Inference tab ----
  const inferQueryVar = document.getElementById("inferQueryVar");
  BN_ORDER.forEach(v => {
    const o = document.createElement("option");
    o.value = v; o.textContent = v;
    inferQueryVar.appendChild(o);
  });
  // Default to Grade
  inferQueryVar.value = "Grade";

  generateProbabilityTables();
});
