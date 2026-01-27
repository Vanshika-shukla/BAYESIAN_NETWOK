// Prior probabilities
const P_Smoking = {
  "Yes": 0.3,
  "No": 0.7
};

// Conditional probability: LungCancer given Smoking
function P_LungCancer_given_Smoking(Smoking, LungCancer) {
  if (Smoking === "Yes" && LungCancer === "Yes")  return 0.1;
  if (Smoking === "Yes" && LungCancer === "No") return 0.9;
  if (Smoking === "No"  && LungCancer === "Yes")  return 0.01;
  if (Smoking === "No"  && LungCancer === "No") return 0.99;
  return 0;
}

// Conditional probability: XRay given LungCancer
function P_XRay_given_LungCancer(LungCancer, XRay) {
  if (LungCancer === "Yes" && XRay === "Yes") return 0.9;
  if (LungCancer === "Yes" && XRay === "No") return 0.1;
  if (LungCancer === "No"  && XRay === "Yes") return 0.1;
  if (LungCancer === "No"  && XRay === "No") return 0.9;
  return 0;
}

// Conditional probability: Dyspnea given LungCancer
function P_Dyspnea_given_LungCancer(LungCancer, Dyspnea) {
  if (LungCancer === "Yes" && Dyspnea === "Yes") return 0.65;
  if (LungCancer === "Yes" && Dyspnea === "No") return 0.35;
  if (LungCancer === "No"  && Dyspnea === "Yes") return 0.1;
  if (LungCancer === "No"  && Dyspnea === "No") return 0.9;
  return 0;
}

// Joint Probability
function jointProbability(Smoking, LungCancer, XRay, Dyspnea) {
  return P_Smoking[Smoking] * 
         P_LungCancer_given_Smoking(Smoking, LungCancer) * 
         P_XRay_given_LungCancer(LungCancer, XRay) * 
         P_Dyspnea_given_LungCancer(LungCancer, Dyspnea);
}

// Marginal Probability P(Smoking)
function marginalSmoking(smokingValue) {
  let prob = 0;
  const LC_vals = ["Yes", "No"];
  const XR_vals = ["Yes", "No"];
  const D_vals = ["Yes", "No"];

  for (let LC of LC_vals) {
    for (let XR of XR_vals) {
      for (let D of D_vals) {
        prob += jointProbability(smokingValue, LC, XR, D);
      }
    }
  }
  return prob;
}

// Marginal Probability P(LungCancer)
function marginalLungCancer(lcValue) {
  let prob = 0;
  const Sm_vals = ["Yes", "No"];
  const XR_vals = ["Yes", "No"];
  const D_vals = ["Yes", "No"];

  for (let Sm of Sm_vals) {
    for (let XR of XR_vals) {
      for (let D of D_vals) {
        prob += jointProbability(Sm, lcValue, XR, D);
      }
    }
  }
  return prob;
}

// Marginal Probability P(XRay)
function marginalXRay(xrayValue) {
  let prob = 0;
  const Sm_vals = ["Yes", "No"];
  const LC_vals = ["Yes", "No"];
  const D_vals = ["Yes", "No"];

  for (let Sm of Sm_vals) {
    for (let LC of LC_vals) {
      for (let D of D_vals) {
        prob += jointProbability(Sm, LC, xrayValue, D);
      }
    }
  }
  return prob;
}

// Marginal Probability P(Dyspnea)
function marginalDyspnea(dyspneaValue) {
  let prob = 0;
  const Sm_vals = ["Yes", "No"];
  const LC_vals = ["Yes", "No"];
  const XR_vals = ["Yes", "No"];

  for (let Sm of Sm_vals) {
    for (let LC of LC_vals) {
      for (let XR of XR_vals) {
        prob += jointProbability(Sm, LC, XR, dyspneaValue);
      }
    }
  }
  return prob;
}

// Marginal probability calculator
function calculateMarginalProbability(variable, value) {
  if (variable === "Smoking") return marginalSmoking(value);
  if (variable === "LungCancer") return marginalLungCancer(value);
  if (variable === "XRay") return marginalXRay(value);
  if (variable === "Dyspnea") return marginalDyspnea(value);
  return 0;
}

// Conditional Probability - General function
function conditionalProbability(eventVar, eventVal, condVar, condVal) {
  const Sm_vals = ["Yes", "No"];
  const LC_vals = ["Yes", "No"];
  const XR_vals = ["Yes", "No"];
  const D_vals = ["Yes", "No"];

  let numerator = 0;
  let denominator = 0;

  for (let Sm of Sm_vals) {
    for (let LC of LC_vals) {
      for (let XR of XR_vals) {
        for (let D of D_vals) {
          const prob = jointProbability(Sm, LC, XR, D);
          
          // Check if both event and condition are satisfied
          const eventSatisfied = (eventVar === "Smoking" && Sm === eventVal) ||
                               (eventVar === "LungCancer" && LC === eventVal) ||
                               (eventVar === "XRay" && XR === eventVal) ||
                               (eventVar === "Dyspnea" && D === eventVal);
          
          const condSatisfied = (condVar === "Smoking" && Sm === condVal) ||
                              (condVar === "LungCancer" && LC === condVal) ||
                              (condVar === "XRay" && XR === condVal) ||
                              (condVar === "Dyspnea" && D === condVal);
          
          if (eventSatisfied && condSatisfied) {
            numerator += prob;
          }
          
          if (condSatisfied) {
            denominator += prob;
          }
        }
      }
    }
  }

  return denominator === 0 ? 0 : numerator / denominator;
}

// Three-variable joint probability
function calculateJointProbability3(var1, val1, var2, val2, var3, val3) {
  const Sm_vals = ["Yes", "No"];
  const LC_vals = ["Yes", "No"];
  const XR_vals = ["Yes", "No"];
  const D_vals = ["Yes", "No"];

  let result = 0;

  for (let Sm of Sm_vals) {
    for (let LC of LC_vals) {
      for (let XR of XR_vals) {
        for (let D of D_vals) {
          const matches1 = (var1 === "Smoking" && Sm === val1) ||
                          (var1 === "LungCancer" && LC === val1) ||
                          (var1 === "XRay" && XR === val1) ||
                          (var1 === "Dyspnea" && D === val1);
          
          const matches2 = (var2 === "Smoking" && Sm === val2) ||
                          (var2 === "LungCancer" && LC === val2) ||
                          (var2 === "XRay" && XR === val2) ||
                          (var2 === "Dyspnea" && D === val2);
          
          const matches3 = (var3 === "Smoking" && Sm === val3) ||
                          (var3 === "LungCancer" && LC === val3) ||
                          (var3 === "XRay" && XR === val3) ||
                          (var3 === "Dyspnea" && D === val3);
          
          if (matches1 && matches2 && matches3) {
            result += jointProbability(Sm, LC, XR, D);
          }
        }
      }
    }
  }

  return result;
}

// Three-variable conditional probability
function conditionalProbability3(var1, val1, var2, val2, condVar1, condVal1) {
  const Sm_vals = ["Yes", "No"];
  const LC_vals = ["Yes", "No"];
  const XR_vals = ["Yes", "No"];
  const D_vals = ["Yes", "No"];

  let numerator = 0;
  let denominator = 0;

  for (let Sm of Sm_vals) {
    for (let LC of LC_vals) {
      for (let XR of XR_vals) {
        for (let D of D_vals) {
          const prob = jointProbability(Sm, LC, XR, D);
          
          const event1Satisfied = (var1 === "Smoking" && Sm === val1) ||
                                (var1 === "LungCancer" && LC === val1) ||
                                (var1 === "XRay" && XR === val1) ||
                                (var1 === "Dyspnea" && D === val1);
          
          const event2Satisfied = (var2 === "Smoking" && Sm === val2) ||
                                (var2 === "LungCancer" && LC === val2) ||
                                (var2 === "XRay" && XR === val2) ||
                                (var2 === "Dyspnea" && D === val2);
          
          const condSatisfied = (condVar1 === "Smoking" && Sm === condVal1) ||
                              (condVar1 === "LungCancer" && LC === condVal1) ||
                              (condVar1 === "XRay" && XR === condVal1) ||
                              (condVar1 === "Dyspnea" && D === condVal1);
          
          if (event1Satisfied && event2Satisfied && condSatisfied) {
            numerator += prob;
          }
          
          if (condSatisfied) {
            denominator += prob;
          }
        }
      }
    }
  }

  return denominator === 0 ? 0 : numerator / denominator;
}

// Main calculate function
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
  } 
  else if (probType === "joint") {
    // Check for duplicate variables
    const vars = [var1, var2, var3];
    const uniqueVars = new Set(vars);
    
    if (uniqueVars.size !== 3) {
      result = "Error: Cannot select the same variable multiple times!";
    } else {
      const prob = calculateJointProbability3(var1, val1, var2, val2, var3, val3);
      result = `P(${var1}=${val1}, ${var2}=${val2}, ${var3}=${val3}) = ${prob.toFixed(6)} (${(prob * 100).toFixed(4)}%)`;
    }
  } 
  else if (probType === "conditional") {
    // Validate that we have different variables
    if (var1 === condVar1 || var2 === condVar1 || var1 === var2) {
      result = "Error: Event variables must be different from condition variable!";
    } else {
      const prob = conditionalProbability3(var1, val1, var2, val2, condVar1, condVal1);
      result = `P(${var1}=${val1}, ${var2}=${val2} | ${condVar1}=${condVal1}) = ${prob.toFixed(6)} (${(prob * 100).toFixed(4)}%)`;
    }
  }

  document.getElementById("result").innerHTML = result;
}

function generateProbabilityTables() {
  let html = `
    <h3 style="color: #e8f0ff; margin: 0 0 20px 0; font-size: 16px; font-weight: 600;">
      Conditional Probability Tables (Based on DAG Structure)
    </h3>
  `;

  // Smoking CPT: P(Smoking) - Prior, no parents
  html += generateSmokingCPT();
  
  // LungCancer CPT: P(LungCancer | Smoking)
  html += generateLungCancerCPT();

  // XRay CPT: P(XRay | LungCancer)
  html += generateXRayCPT();

  // Dyspnea CPT: P(Dyspnea | LungCancer)
  html += generateDyspneaCPT();

  document.getElementById("tableContainer").innerHTML = html;
}

// Smoking CPT: P(Smoking) - Prior probability, no parents
function generateSmokingCPT() {
  let html = `
    <table>
      <thead>
        <tr>
          <th style="width: 50%;">Smoking</th>
          <th style="width: 25%;">Probability</th>
          <th style="width: 25%;">%</th>
        </tr>
      </thead>
      <tbody>
  `;

  const smokingValues = ["Yes", "No"];

  for (let val of smokingValues) {
    const prob = P_Smoking[val];
    const percentage = (prob * 100).toFixed(1);
    const cssClass = val === "Yes" ? "smoking-yes" : "smoking-no";

    html += `
      <tr class="${cssClass}">
        <td><strong>P(Smoking = ${val})</strong></td>
        <td>${prob.toFixed(6)}</td>
        <td>${percentage}%</td>
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

// LungCancer CPT: P(LungCancer | Smoking)
function generateLungCancerCPT() {
  let html = `
    <table>
      <thead>
        <tr>
          <th style="width: 30%;">Smoking</th>
          <th style="width: 30%;">LungCancer</th>
          <th style="width: 20%;">Probability</th>
          <th style="width: 20%;">%</th>
        </tr>
      </thead>
      <tbody>
  `;

  const smokingValues = ["Yes", "No"];
  const lcValues = ["Yes", "No"];

  for (let sm of smokingValues) {
    for (let lc of lcValues) {
      const prob = P_LungCancer_given_Smoking(sm, lc);
      const percentage = (prob * 100).toFixed(1);
      const cssClass = lc === "Yes" ? "lungcancer-yes" : "lungcancer-no";

      html += `
        <tr class="${cssClass}">
          <td><strong>${sm}</strong></td>
          <td><strong>${lc}</strong></td>
          <td>${prob.toFixed(6)}</td>
          <td>${percentage}%</td>
        </tr>
      `;
    }
  }

  html += `
      </tbody>
    </table>
    <br>
  `;
  return html;
}

// XRay CPT: P(XRay | LungCancer)
function generateXRayCPT() {
  let html = `
    <table>
      <thead>
        <tr>
          <th style="width: 30%;">LungCancer</th>
          <th style="width: 30%;">XRay</th>
          <th style="width: 20%;">Probability</th>
          <th style="width: 20%;">%</th>
        </tr>
      </thead>
      <tbody>
  `;

  const lcValues = ["Yes", "No"];
  const xrayValues = ["Yes", "No"];

  for (let lc of lcValues) {
    for (let xr of xrayValues) {
      const prob = P_XRay_given_LungCancer(lc, xr);
      const percentage = (prob * 100).toFixed(1);
      const cssClass = xr === "Yes" ? "xray-yes" : "xray-no";

      html += `
        <tr class="${cssClass}">
          <td><strong>${lc}</strong></td>
          <td><strong>${xr}</strong></td>
          <td>${prob.toFixed(6)}</td>
          <td>${percentage}%</td>
        </tr>
      `;
    }
  }

  html += `
      </tbody>
    </table>
    <br>
  `;
  return html;
}

// Dyspnea CPT: P(Dyspnea | LungCancer)
function generateDyspneaCPT() {
  let html = `
    <table>
      <thead>
        <tr>
          <th style="width: 30%;">LungCancer</th>
          <th style="width: 30%;">Dyspnea</th>
          <th style="width: 20%;">Probability</th>
          <th style="width: 20%;">%</th>
        </tr>
      </thead>
      <tbody>
  `;

  const lcValues = ["Yes", "No"];
  const dyspneaValues = ["Yes", "No"];

  for (let lc of lcValues) {
    for (let d of dyspneaValues) {
      const prob = P_Dyspnea_given_LungCancer(lc, d);
      const percentage = (prob * 100).toFixed(1);
      const cssClass = d === "Yes" ? "dyspnea-yes" : "dyspnea-no";

      html += `
        <tr class="${cssClass}">
          <td><strong>${lc}</strong></td>
          <td><strong>${d}</strong></td>
          <td>${prob.toFixed(6)}</td>
          <td>${percentage}%</td>
        </tr>
      `;
    }
  }

  html += `
      </tbody>
    </table>
    <br>
  `;
  return html;
}

// Handle probability type change
document.addEventListener('DOMContentLoaded', function() {
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

  function updateLabelVisibility() {
    const type = probTypeSelect.value;
    
    // Always show variable 1
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

  function updateValueOptions() {
    const variables = [
      { select: var1, valueSelect: val1 },
      { select: var2, valueSelect: val2 },
      { select: var3, valueSelect: val3 },
      { select: condVar1, valueSelect: condVal1 }
    ];

    variables.forEach(({ select, valueSelect }) => {
      const variable = select.value;
      if (variable === "Smoking" || variable === "LungCancer" || variable === "Dyspnea") {
        valueSelect.innerHTML = '<option value="Yes">Yes</option><option value="No">No</option>';
      } else if (variable === "XRay") {
        valueSelect.innerHTML = '<option value="Yes">Yes</option><option value="No">No</option>';
      }
    });
  }

  probTypeSelect.addEventListener("change", updateLabelVisibility);
  var1.addEventListener("change", updateValueOptions);
  var2.addEventListener("change", updateValueOptions);
  var3.addEventListener("change", updateValueOptions);
  condVar1.addEventListener("change", updateValueOptions);

  // Initialize
  updateLabelVisibility();
  updateValueOptions();
  generateProbabilityTables();
});
