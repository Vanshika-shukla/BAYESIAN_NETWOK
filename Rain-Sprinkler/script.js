// Prior probabilities
const P_R = {
  "Yes": 0.3,
  "No": 0.7
};

// Conditional probability: Sprinkler given Rain
function P_S_given_R(R, S) {
  if (R === "Yes" && S === "On")  return 0.1;
  if (R === "Yes" && S === "Off") return 0.9;
  if (R === "No"  && S === "On")  return 0.5;
  if (R === "No"  && S === "Off") return 0.5;
  return 0;
}

// Conditional probability: Wet Grass given Rain and Sprinkler
function P_W_given_RS(R, S, W) {
  if (R === "Yes" && S === "On"  && W === "Yes") return 0.99;
  if (R === "Yes" && S === "Off" && W === "Yes") return 0.90;
  if (R === "No"  && S === "On"  && W === "Yes") return 0.80;
  if (R === "No"  && S === "Off" && W === "Yes") return 0.00;

  // For W = No
  if (R === "Yes" && S === "On"  && W === "No") return 0.01;
  if (R === "Yes" && S === "Off" && W === "No") return 0.10;
  if (R === "No"  && S === "On"  && W === "No") return 0.20;
  if (R === "No"  && S === "Off" && W === "No") return 1.00;

  return 0;
}

// Joint Probability
function jointProbability(R, S, W) {
  return P_R[R] * P_S_given_R(R, S) * P_W_given_RS(R, S, W);
}

// Marginal Probability P(Rain)
function marginalRain(rainValue) {
  let prob = 0;
  const S_vals = ["On", "Off"];
  const W_vals = ["Yes", "No"];

  for (let S of S_vals) {
    for (let W of W_vals) {
      prob += jointProbability(rainValue, S, W);
    }
  }
  return prob;
}

// Marginal Probability P(Sprinkler)
function marginalSprinkler(sprinklerValue) {
  let prob = 0;
  const R_vals = ["Yes", "No"];
  const W_vals = ["Yes", "No"];

  for (let R of R_vals) {
    for (let W of W_vals) {
      prob += jointProbability(R, sprinklerValue, W);
    }
  }
  return prob;
}

// Marginal Probability P(WetGrass = Yes)
function marginalWetGrass(wetValue = "Yes") {
  let prob = 0;
  const R_vals = ["Yes", "No"];
  const S_vals = ["On", "Off"];

  for (let R of R_vals) {
    for (let S of S_vals) {
      prob += jointProbability(R, S, wetValue);
    }
  }
  return prob;
}

// Conditional Probability P(A = a | B = b)
function conditionalProbability(eventVar, eventVal, condVar, condVal) {
  const R_vals = ["Yes", "No"];
  const S_vals = ["On", "Off"];
  const W_vals = ["Yes", "No"];

  // Get values for the conditioning variable
  const varVals = {
    "Rain": R_vals,
    "Sprinkler": S_vals,
    "WetGrass": W_vals
  };

  let numerator = 0;  // P(Event AND Condition)
  let denominator = 0; // P(Condition)

  // Sum over all combinations where condition is satisfied
  for (let R of R_vals) {
    for (let S of S_vals) {
      for (let W of W_vals) {
        const prob = jointProbability(R, S, W);

        // Check if condition variable matches condition value
        const conditionMet = (condVar === "Rain" && R === condVal) ||
                            (condVar === "Sprinkler" && S === condVal) ||
                            (condVar === "WetGrass" && W === condVal);

        if (conditionMet) {
          denominator += prob;

          // Check if both event AND condition are met
          const eventMet = (eventVar === "Rain" && R === eventVal) ||
                          (eventVar === "Sprinkler" && S === eventVal) ||
                          (eventVar === "WetGrass" && W === eventVal);

          if (eventMet) {
            numerator += prob;
          }
        }
      }
    }
  }

  // Avoid division by zero
  if (denominator === 0) return 0;
  return numerator / denominator;
}

// Conditional Probability P(Rain = Yes | WetGrass = Yes)
function conditionalRainGivenWet() {
  return conditionalProbability("Rain", "Yes", "WetGrass", "Yes");
}

// Main calculation handler
function calculate() {
  const probType = document.getElementById("probType").value;
  const var1 = document.getElementById("var1").value;
  const val1 = document.getElementById("val1").value;

  let resultText = "";

  if (probType === "joint") {
    const var2 = document.getElementById("var2").value;
    const val2 = document.getElementById("val2").value;
    const var3 = document.getElementById("var3").value;
    const val3 = document.getElementById("val3").value;

    // Check for duplicate variables
    const vars = [var1, var2, var3];
    if (new Set(vars).size !== vars.length) {
      document.getElementById("result").innerText = "Error: All variables must be different!";
      return;
    }

    const jp = calculateJointProbability3(var1, val1, var2, val2, var3, val3);
    resultText = `P(${var1}=${val1}, ${var2}=${val2}, ${var3}=${val3}) = ${jp.toFixed(6)}`;
  }
  else if (probType === "marginal") {
    const mp = calculateMarginalProbability(var1, val1);
    resultText = `P(${var1} = ${val1}) = ${mp.toFixed(6)}`;
  }
  else if (probType === "conditional") {
    const var2 = document.getElementById("var2").value;
    const val2 = document.getElementById("val2").value;
    const condVar1 = document.getElementById("condVar1").value;
    const condVal1 = document.getElementById("condVal1").value;

    // Check for duplicate variables
    const allVars = [var1, var2, condVar1];
    if (new Set(allVars).size !== allVars.length) {
      document.getElementById("result").innerText = "Error: All variables must be different!";
      return;
    }

    const cp = conditionalProbability3(var1, val1, var2, val2, condVar1, condVal1);
    resultText = `P(${var1}=${val1}, ${var2}=${val2} | ${condVar1}=${condVal1}) = ${cp.toFixed(6)}`;
  }

  document.getElementById("result").innerText = resultText;
  generateProbabilityTables();
}

// Calculate Joint Probability for 3 variables P(Var1=Val1, Var2=Val2, Var3=Val3)
function calculateJointProbability3(var1, val1, var2, val2, var3, val3) {
  const R_vals = ["Yes", "No"];
  const S_vals = ["On", "Off"];
  const W_vals = ["Yes", "No"];

  let prob = 0;
  
  for (let R of R_vals) {
    for (let S of S_vals) {
      for (let W of W_vals) {
        let matches = true;

        if (var1 === "Rain" && R !== val1) matches = false;
        if (var1 === "Sprinkler" && S !== val1) matches = false;
        if (var1 === "WetGrass" && W !== val1) matches = false;

        if (var2 === "Rain" && R !== val2) matches = false;
        if (var2 === "Sprinkler" && S !== val2) matches = false;
        if (var2 === "WetGrass" && W !== val2) matches = false;

        if (var3 === "Rain" && R !== val3) matches = false;
        if (var3 === "Sprinkler" && S !== val3) matches = false;
        if (var3 === "WetGrass" && W !== val3) matches = false;

        if (matches) {
          prob += jointProbability(R, S, W);
        }
      }
    }
  }

  return prob;
}

// Calculate Conditional Probability P(Var1=Val1, Var2=Val2 | CondVar1=CondVal1)
function conditionalProbability3(var1, val1, var2, val2, condVar1, condVal1) {
  const R_vals = ["Yes", "No"];
  const S_vals = ["On", "Off"];
  const W_vals = ["Yes", "No"];

  let numerator = 0;    // P(Event1 AND Event2 AND Condition)
  let denominator = 0;  // P(Condition)

  for (let R of R_vals) {
    for (let S of S_vals) {
      for (let W of W_vals) {
        const prob = jointProbability(R, S, W);

        // Check if condition is met
        const conditionMet = (condVar1 === "Rain" && R === condVal1) ||
                            (condVar1 === "Sprinkler" && S === condVal1) ||
                            (condVar1 === "WetGrass" && W === condVal1);

        if (conditionMet) {
          denominator += prob;

          // Check if both events are met
          let eventsMet = true;

          if (var1 === "Rain" && R !== val1) eventsMet = false;
          if (var1 === "Sprinkler" && S !== val1) eventsMet = false;
          if (var1 === "WetGrass" && W !== val1) eventsMet = false;

          if (var2 === "Rain" && R !== val2) eventsMet = false;
          if (var2 === "Sprinkler" && S !== val2) eventsMet = false;
          if (var2 === "WetGrass" && W !== val2) eventsMet = false;

          if (eventsMet) {
            numerator += prob;
          }
        }
      }
    }
  }

  // Avoid division by zero
  if (denominator === 0) return 0;
  return numerator / denominator;
}

// Calculate Marginal Probability P(Var = Val)
function calculateMarginalProbability(variable, value) {
  const R_vals = ["Yes", "No"];
  const S_vals = ["On", "Off"];
  const W_vals = ["Yes", "No"];

  let prob = 0;
  
  for (let R of R_vals) {
    for (let S of S_vals) {
      for (let W of W_vals) {
        let matches = true;

        if (variable === "Rain" && R !== value) matches = false;
        if (variable === "Sprinkler" && S !== value) matches = false;
        if (variable === "WetGrass" && W !== value) matches = false;

        if (matches) {
          prob += jointProbability(R, S, W);
        }
      }
    }
  }

  return prob;
}

// Generate Probability Tables for Rain, Sprinkler, WetGrass
function generateProbabilityTables() {
  let html = "";

  // Rain Table
  html += generateVariableTable("Rain", ["Yes", "No"]);
  
  // Sprinkler Table
  html += generateVariableTable("Sprinkler", ["On", "Off"]);
  
  // WetGrass Table
  html += generateVariableTable("WetGrass", ["Yes", "No"]);

  document.getElementById("tableContainer").innerHTML = html;
}

// Generate table for a single variable
function generateVariableTable(variable, values) {
  let html = `
    <table>
      <thead>
        <tr>
          <th style="width: 40%;">${variable}</th>
          <th style="width: 35%;">Probability</th>
          <th style="width: 25%;">%</th>
        </tr>
      </thead>
      <tbody>
  `;

  let totalProb = 0;
  const probs = [];

  // Calculate probabilities
  for (let val of values) {
    const prob = calculateMarginalProbability(variable, val);
    totalProb += prob;
    probs.push({ val, prob });
  }

  // Generate rows
  for (let item of probs) {
    const percentage = ((item.prob / totalProb) * 100).toFixed(1);
    const cssClass = variable === "Rain" ? (item.val === "Yes" ? "rain-yes" : "rain-no") :
                     variable === "Sprinkler" ? (item.val === "On" ? "sprinkler-on" : "sprinkler-off") :
                     (item.val === "Yes" ? "wetgrass-yes" : "wetgrass-no");

    html += `
      <tr class="${cssClass}">
        <td><strong>P(${variable} = ${item.val})</strong></td>
        <td>${item.prob.toFixed(6)}</td>
        <td>${percentage}%</td>
      </tr>
    `;
  }

  html += `
      <tr class="total-row">
        <td><strong>Total</strong></td>
        <td>${totalProb.toFixed(6)}</td>
        <td>100%</td>
      </tr>
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

  // Function to update value options based on variable
  function updateValueOptions(variableSelect, valueSelect) {
    const variable = variableSelect.value;
    valueSelect.innerHTML = "";
    
    if (variable === "Sprinkler") {
      valueSelect.innerHTML = '<option value="On">On</option><option value="Off">Off</option>';
    } else {
      valueSelect.innerHTML = '<option value="Yes">Yes</option><option value="No">No</option>';
    }
  }

  // Update value options when variables change
  var1.addEventListener("change", function() {
    updateValueOptions(var1, val1);
  });

  var2.addEventListener("change", function() {
    updateValueOptions(var2, val2);
  });

  var3.addEventListener("change", function() {
    updateValueOptions(var3, val3);
  });

  condVar1.addEventListener("change", function() {
    updateValueOptions(condVar1, condVal1);
  });

  function updateInputsVisibility() {
    const probType = probTypeSelect.value;
    
    if (probType === "joint") {
      var2Label.style.display = "block";
      var2.style.display = "block";
      val2Label.style.display = "block";
      val2.style.display = "block";
      var3Label.style.display = "block";
      var3.style.display = "block";
      val3Label.style.display = "block";
      val3.style.display = "block";
      condVar1Label.style.display = "none";
      condVar1.style.display = "none";
      condVal1Label.style.display = "none";
      condVal1.style.display = "none";
    } else if (probType === "marginal") {
      var2Label.style.display = "none";
      var2.style.display = "none";
      val2Label.style.display = "none";
      val2.style.display = "none";
      var3Label.style.display = "none";
      var3.style.display = "none";
      val3Label.style.display = "none";
      val3.style.display = "none";
      condVar1Label.style.display = "none";
      condVar1.style.display = "none";
      condVal1Label.style.display = "none";
      condVal1.style.display = "none";
    } else if (probType === "conditional") {
      var2Label.style.display = "block";
      var2.style.display = "block";
      val2Label.style.display = "block";
      val2.style.display = "block";
      var3Label.style.display = "none";
      var3.style.display = "none";
      val3Label.style.display = "none";
      val3.style.display = "none";
      condVar1Label.style.display = "block";
      condVar1.style.display = "block";
      condVal1Label.style.display = "block";
      condVal1.style.display = "block";
    }
  }

  probTypeSelect.addEventListener("change", updateInputsVisibility);
  
  // Initial display
  updateInputsVisibility();
  updateValueOptions(var1, val1);
  
  // Generate initial tables
  generateProbabilityTables();
});
