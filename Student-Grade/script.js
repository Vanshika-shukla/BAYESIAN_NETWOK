// ====== Bayesian Network for Student Grade ======
// Variables:
// PreviousPerformance (Good, Poor)
// StudyHours (High, Low)
// Attendance (Good, Poor)
// Understanding (Good, Poor)
// Grade (High, Low)

// ---- Priors ----
const P_PreviousPerformance = {
  "Good": 0.6,
  "Poor": 0.4
};

const P_StudyHours = {
  "High": 0.5,
  "Low": 0.5
};

const P_Attendance = {
  "Good": 0.7,
  "Poor": 0.3
};

// ---- Conditional: Understanding | PreviousPerformance, StudyHours, Attendance ----
// P(Understanding = Good | P, S, A)
function P_Understanding_given_PSA(P, S, A, U) {
  let pGood;

  if (P === "Good" && S === "High" && A === "Good") {
    pGood = 0.95;
  } else if (P === "Good" && S === "High" && A === "Poor") {
    pGood = 0.85;
  } else if (P === "Good" && S === "Low" && A === "Good") {
    pGood = 0.80;
  } else if (P === "Good" && S === "Low" && A === "Poor") {
    pGood = 0.60;
  } else if (P === "Poor" && S === "High" && A === "Good") {
    pGood = 0.75;
  } else if (P === "Poor" && S === "High" && A === "Poor") {
    pGood = 0.55;
  } else if (P === "Poor" && S === "Low" && A === "Good") {
    pGood = 0.50;
  } else if (P === "Poor" && S === "Low" && A === "Poor") {
    pGood = 0.20;
  } else {
    pGood = 0.5;
  }

  if (U === "Good") return pGood;
  if (U === "Poor") return 1 - pGood;
  return 0;
}

// ---- Conditional: Grade | Understanding, Attendance ----
// P(Grade = High | U, A)
function P_Grade_given_UA(U, A, G) {
  let pHigh;

  if (U === "Good" && A === "Good") {
    pHigh = 0.97;
  } else if (U === "Good" && A === "Poor") {
    pHigh = 0.85;
  } else if (U === "Poor" && A === "Good") {
    pHigh = 0.55;
  } else if (U === "Poor" && A === "Poor") {
    pHigh = 0.20;
  } else {
    pHigh = 0.5;
  }

  if (G === "High") return pHigh;
  if (G === "Low") return 1 - pHigh;
  return 0;
}

// ---- Helper Domains ----
const Prev_vals = ["Good", "Poor"];
const Study_vals = ["High", "Low"];
const Att_vals = ["Good", "Poor"];
const Und_vals = ["Good", "Poor"];
const Grade_vals = ["High", "Low"];

// ---- Joint Probability ----
function jointProbability(PreviousPerformance, StudyHours, Attendance, Understanding, Grade) {
  return P_PreviousPerformance[PreviousPerformance] *
         P_StudyHours[StudyHours] *
         P_Attendance[Attendance] *
         P_Understanding_given_PSA(PreviousPerformance, StudyHours, Attendance, Understanding) *
         P_Grade_given_UA(Understanding, Attendance, Grade);
}

// ---- General Marginal P(Var = val) ----
function calculateMarginalProbability(variable, value) {
  let prob = 0;

  for (let P of Prev_vals) {
    for (let S of Study_vals) {
      for (let A of Att_vals) {
        for (let U of Und_vals) {
          for (let G of Grade_vals) {
            const jp = jointProbability(P, S, A, U, G);

            let matches = false;
            if (variable === "PreviousPerformance" && P === value) matches = true;
            if (variable === "StudyHours" && S === value) matches = true;
            if (variable === "Attendance" && A === value) matches = true;
            if (variable === "Understanding" && U === value) matches = true;
            if (variable === "Grade" && G === value) matches = true;

            if (matches) prob += jp;
          }
        }
      }
    }
  }

  return prob;
}

// ---- General Conditional P(Event = e | Cond = c) ----
function conditionalProbability(eventVar, eventVal, condVar, condVal) {
  let numerator = 0;
  let denominator = 0;

  for (let P of Prev_vals) {
    for (let S of Study_vals) {
      for (let A of Att_vals) {
        for (let U of Und_vals) {
          for (let G of Grade_vals) {
            const jp = jointProbability(P, S, A, U, G);

            const eventSatisfied =
              (eventVar === "PreviousPerformance" && P === eventVal) ||
              (eventVar === "StudyHours" && S === eventVal) ||
              (eventVar === "Attendance" && A === eventVal) ||
              (eventVar === "Understanding" && U === eventVal) ||
              (eventVar === "Grade" && G === eventVal);

            const condSatisfied =
              (condVar === "PreviousPerformance" && P === condVal) ||
              (condVar === "StudyHours" && S === condVal) ||
              (condVar === "Attendance" && A === condVal) ||
              (condVar === "Understanding" && U === condVal) ||
              (condVar === "Grade" && G === condVal);

            if (condSatisfied) {
              denominator += jp;
              if (eventSatisfied) numerator += jp;
            }
          }
        }
      }
    }
  }

  if (denominator === 0) return 0;
  return numerator / denominator;
}

// ---- Joint P(Var1=v1, Var2=v2, Var3=v3) ----
function calculateJointProbability3(var1, val1, var2, val2, var3, val3) {
  let result = 0;

  for (let P of Prev_vals) {
    for (let S of Study_vals) {
      for (let A of Att_vals) {
        for (let U of Und_vals) {
          for (let G of Grade_vals) {
            const matches1 =
              (var1 === "PreviousPerformance" && P === val1) ||
              (var1 === "StudyHours" && S === val1) ||
              (var1 === "Attendance" && A === val1) ||
              (var1 === "Understanding" && U === val1) ||
              (var1 === "Grade" && G === val1);

            const matches2 =
              (var2 === "PreviousPerformance" && P === val2) ||
              (var2 === "StudyHours" && S === val2) ||
              (var2 === "Attendance" && A === val2) ||
              (var2 === "Understanding" && U === val2) ||
              (var2 === "Grade" && G === val2);

            const matches3 =
              (var3 === "PreviousPerformance" && P === val3) ||
              (var3 === "StudyHours" && S === val3) ||
              (var3 === "Attendance" && A === val3) ||
              (var3 === "Understanding" && U === val3) ||
              (var3 === "Grade" && G === val3);

            if (matches1 && matches2 && matches3) {
              result += jointProbability(P, S, A, U, G);
            }
          }
        }
      }
    }
  }

  return result;
}

// ---- Conditional P(Var1=v1, Var2=v2 | CondVar=CondVal) ----
function conditionalProbability3(var1, val1, var2, val2, condVar1, condVal1) {
  let numerator = 0;
  let denominator = 0;

  for (let P of Prev_vals) {
    for (let S of Study_vals) {
      for (let A of Att_vals) {
        for (let U of Und_vals) {
          for (let G of Grade_vals) {
            const jp = jointProbability(P, S, A, U, G);

            const event1Satisfied =
              (var1 === "PreviousPerformance" && P === val1) ||
              (var1 === "StudyHours" && S === val1) ||
              (var1 === "Attendance" && A === val1) ||
              (var1 === "Understanding" && U === val1) ||
              (var1 === "Grade" && G === val1);

            const event2Satisfied =
              (var2 === "PreviousPerformance" && P === val2) ||
              (var2 === "StudyHours" && S === val2) ||
              (var2 === "Attendance" && A === val2) ||
              (var2 === "Understanding" && U === val2) ||
              (var2 === "Grade" && G === val2);

            const condSatisfied =
              (condVar1 === "PreviousPerformance" && P === condVal1) ||
              (condVar1 === "StudyHours" && S === condVal1) ||
              (condVar1 === "Attendance" && A === condVal1) ||
              (condVar1 === "Understanding" && U === condVal1) ||
              (condVar1 === "Grade" && G === condVal1);

            if (condSatisfied) {
              denominator += jp;
              if (event1Satisfied && event2Satisfied) {
                numerator += jp;
              }
            }
          }
        }
      }
    }
  }

  if (denominator === 0) return 0;
  return numerator / denominator;
}

// ---- Main calculate handler ----
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
    const vars = [var1, var2, var3];
    const uniqueVars = new Set(vars);

    if (uniqueVars.size !== 3) {
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

// ---- Probability Tables / CPTs ----
function generateProbabilityTables() {
  let html = `
    <h3 style="color: #333333; margin: 0 0 16px 0; font-size: 16px; font-weight: 600;">
      Conditional Probability Tables (Based on Student Grade DAG)
    </h3>
  `;

  html += generatePreviousPerformanceCPT();
  html += generateStudyHoursCPT();
  html += generateAttendanceCPT();
  html += generateUnderstandingCPT();
  html += generateGradeCPT();

  document.getElementById("tableContainer").innerHTML = html;
}

function generatePreviousPerformanceCPT() {
  let html = `
    <table>
      <thead>
        <tr>
          <th>PreviousPerformance</th>
          <th>Probability</th>
          <th>%</th>
        </tr>
      </thead>
      <tbody>
  `;

  for (let v of Prev_vals) {
    const prob = P_PreviousPerformance[v];
    const pct = (prob * 100).toFixed(1);
    html += `
      <tr>
        <td><strong>${v}</strong></td>
        <td>${prob.toFixed(6)}</td>
        <td>${pct}%</td>
      </tr>
    `;
  }

  html += `
      </tbody>
    </table>
    <br>
  `;
  return html;
}

function generateStudyHoursCPT() {
  let html = `
    <table>
      <thead>
        <tr>
          <th>StudyHours</th>
          <th>Probability</th>
          <th>%</th>
        </tr>
      </thead>
      <tbody>
  `;

  for (let v of Study_vals) {
    const prob = P_StudyHours[v];
    const pct = (prob * 100).toFixed(1);
    html += `
      <tr>
        <td><strong>${v}</strong></td>
        <td>${prob.toFixed(6)}</td>
        <td>${pct}%</td>
      </tr>
    `;
  }

  html += `
      </tbody>
    </table>
    <br>
  `;
  return html;
}

function generateAttendanceCPT() {
  let html = `
    <table>
      <thead>
        <tr>
          <th>Attendance</th>
          <th>Probability</th>
          <th>%</th>
        </tr>
      </thead>
      <tbody>
  `;

  for (let v of Att_vals) {
    const prob = P_Attendance[v];
    const pct = (prob * 100).toFixed(1);
    html += `
      <tr>
        <td><strong>${v}</strong></td>
        <td>${prob.toFixed(6)}</td>
        <td>${pct}%</td>
      </tr>
    `;
  }

  html += `
      </tbody>
    </table>
    <br>
  `;
  return html;
}

// Understanding CPT: P(Understanding | PreviousPerformance, StudyHours, Attendance)
function generateUnderstandingCPT() {
  let html = `
    <table>
      <thead>
        <tr>
          <th>PreviousPerformance</th>
          <th>StudyHours</th>
          <th>Attendance</th>
          <th>Understanding</th>
          <th>P(Understanding)</th>
          <th>%</th>
        </tr>
      </thead>
      <tbody>
  `;

  for (let P of Prev_vals) {
    for (let S of Study_vals) {
      for (let A of Att_vals) {
        for (let U of Und_vals) {
          const prob = P_Understanding_given_PSA(P, S, A, U);
          const pct = (prob * 100).toFixed(1);
          html += `
            <tr>
              <td><strong>${P}</strong></td>
              <td><strong>${S}</strong></td>
              <td><strong>${A}</strong></td>
              <td><strong>${U}</strong></td>
              <td>${prob.toFixed(6)}</td>
              <td>${pct}%</td>
            </tr>
          `;
        }
      }
    }
  }

  html += `
      </tbody>
    </table>
    <br>
  `;
  return html;
}

// Grade CPT: P(Grade | Understanding, Attendance)
function generateGradeCPT() {
  let html = `
    <table>
      <thead>
        <tr>
          <th>Understanding</th>
          <th>Attendance</th>
          <th>Grade</th>
          <th>P(Grade)</th>
          <th>%</th>
        </tr>
      </thead>
      <tbody>
  `;

  for (let U of Und_vals) {
    for (let A of Att_vals) {
      for (let G of Grade_vals) {
        const prob = P_Grade_given_UA(U, A, G);
        const pct = (prob * 100).toFixed(1);
        html += `
          <tr>
            <td><strong>${U}</strong></td>
            <td><strong>${A}</strong></td>
            <td><strong>${G}</strong></td>
            <td>${prob.toFixed(6)}</td>
            <td>${pct}%</td>
          </tr>
        `;
      }
    }
  }

  html += `
      </tbody>
    </table>
    <br>
  `;
  return html;
}

// ---- UI Wiring ----
document.addEventListener("DOMContentLoaded", function() {
  const probTypeSelect = document.getElementById("probType");
  const var1 = document.getElementById("var1");
  const val1 = document.getElementById("val1");
  const var2 = document.getElementById("var2");
  const val2 = document.getElementById("val2");
  const var3 = document.getElementById("var3");
  const val3 = document.getElementById("val3");
  const condVar1 = document.getElementById("condVar1");
  const condVal1 = document.getElementById("condVal1");

  const var2Label = document.getElementById("var2Label");
  const val2Label = document.getElementById("val2Label");
  const var3Label = document.getElementById("var3Label");
  const val3Label = document.getElementById("val3Label");
  const condVar1Label = document.getElementById("condVar1Label");
  const condVal1Label = document.getElementById("condVal1Label");

  function valuesForVariable(variable) {
    if (variable === "PreviousPerformance") return Prev_vals;
    if (variable === "StudyHours") return Study_vals;
    if (variable === "Attendance") return Att_vals;
    if (variable === "Understanding") return Und_vals;
    if (variable === "Grade") return Grade_vals;
    return [];
  }

  function fillValueOptions(variableSelect, valueSelect) {
    const vals = valuesForVariable(variableSelect.value);
    valueSelect.innerHTML = "";
    for (let v of vals) {
      const opt = document.createElement("option");
      opt.value = v;
      opt.textContent = v;
      valueSelect.appendChild(opt);
    }
  }

  function updateLabelVisibility() {
    const type = probTypeSelect.value;

    var2Label.style.display = type === "marginal" ? "none" : "block";
    val2Label.style.display = type === "marginal" ? "none" : "block";
    var2.style.display = type === "marginal" ? "none" : "block";
    val2.style.display = type === "marginal" ? "none" : "block";

    var3Label.style.display = type === "joint" ? "block" : "none";
    val3Label.style.display = type === "joint" ? "block" : "none";
    var3.style.display = type === "joint" ? "block" : "none";
    val3.style.display = type === "joint" ? "block" : "none";

    condVar1Label.style.display = type === "conditional" ? "block" : "none";
    condVal1Label.style.display = type === "conditional" ? "block" : "none";
    condVar1.style.display = type === "conditional" ? "block" : "none";
    condVal1.style.display = type === "conditional" ? "block" : "none";
  }

  function updateAllValueOptions() {
    fillValueOptions(var1, val1);
    fillValueOptions(var2, val2);
    fillValueOptions(var3, val3);
    fillValueOptions(condVar1, condVal1);
  }

  probTypeSelect.addEventListener("change", updateLabelVisibility);
  var1.addEventListener("change", () => fillValueOptions(var1, val1));
  var2.addEventListener("change", () => fillValueOptions(var2, val2));
  var3.addEventListener("change", () => fillValueOptions(var3, val3));
  condVar1.addEventListener("change", () => fillValueOptions(condVar1, condVal1));

  // Initial setup
  updateLabelVisibility();
  updateAllValueOptions();
  generateProbabilityTables();
});

