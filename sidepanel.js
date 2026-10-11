document.getElementById("calculateBtn").addEventListener("click", function() {
  var prodTime = parseFloat(document.getElementById("prodTime").value);
  var prodQty = parseFloat(document.getElementById("prodQty").value);
  var consTime = parseFloat(document.getElementById("consTime").value);
  var consQty = parseFloat(document.getElementById("consQty").value);

  var ratioProd = parseFloat(document.getElementById("ratioProd").value);
  var ratioCons = parseFloat(document.getElementById("ratioCons").value);
  var targetConsumers = parseFloat(document.getElementById("targetConsumers").value);
  
  var resultDiv = document.getElementById("result");

  if (!prodTime || !prodQty || !consTime || !consQty || !ratioProd || !ratioCons || !targetConsumers) {
    resultDiv.innerHTML = "<span style='color: #ff6b6b;'>Please fill out all fields!</span>";
    return;
  }

  // Items per second per single machine
  var prodRate = prodQty / prodTime; 
  var consRate = consQty / consTime; 

  var naturalRatio = consRate / prodRate; 
  var userRatioValue = ratioCons / ratioProd; 

  // Target machine counts & Surplus logic
  var totalConsumerDemand = consRate * targetConsumers;
  var exactProducersNeeded = totalConsumerDemand / prodRate;
  
  // Math.ceil automatically rounds UP so you add more producers 
  // until it covers demand or creates a safe surplus!
  var roundedProducers = Math.ceil(exactProducersNeeded);
  
  // Calculate actual production vs demand to show surplus percentage
  var actualProduction = roundedProducers * prodRate;
  var surplusItems = actualProduction - totalConsumerDemand;

  // Efficiency warning for your manual ratio
  var efficiencyNote = "";
  var difference = Math.abs(userRatioValue - (1 / naturalRatio));
  if (difference < 0.05) {
    efficiencyNote = "<span style='color: #4CAF50;'>✔ This ratio is well-balanced! Minimal waste.</span>";
  } else if (userRatioValue > (1 / naturalRatio)) {
    efficiencyNote = "<span style='color: #ffa500;'>⚠ Warning: Producers might lag behind (under-producing).</span>";
  } else {
    efficiencyNote = "<span style='color: #3498db;'>ℹ Surplus Active: Producers are overproducing (great for backups!).</span>";
  }

  // Find all clean integer ratios
  var possibleRatiosHTML = "";
  var foundCount = 0;
  
  for (var p = 1; p <= 20; p = p + 1) {
    for (var c = 1; c <= 20; c = c + 1) {
      var production = p * prodRate;
      var consumption = c * consRate;
      
      if (Math.abs(production - consumption) / consumption < 0.01) {
        possibleRatiosHTML = possibleRatiosHTML + "<li><b>" + p + "</b> Producer(s) : <b>" + c + "</b> Consumer(s)</li>";
        foundCount = foundCount + 1;
      }
    }
  }

  if (foundCount === 0) {
    possibleRatiosHTML = "<li>No clean integer ratios found under 20:20. Try using approximate setups.</li>";
  }

  resultDiv.innerHTML = 
    "<b>Machine Count for " + targetConsumers + " Consumers:</b><br>" +
    "- Build <b>" + roundedProducers + "</b> Producer machines<br>" +
    "- Build <b>" + targetConsumers + "</b> Consumer machines<br>" +
    "<span style='font-size: 11px; color: #aaa;'>(Exact fractional need: " + exactProducersNeeded.toFixed(2) + " producers)</span><br>" +
    "<span style='font-size: 11px; color: #3498db;'>(Surplus buffer: +" + surplusItems.toFixed(2) + " items/sec)</span><br>" +
    "<hr style='border:0; border-top:1px solid #444; margin:6px 0;'>" +
    efficiencyNote +
    "<hr style='border:0; border-top:1px solid #444; margin:6px 0;'>" +
    "<b>All Possible Clean Ratios (Up to 20:20):</b>" +
    "<ul style='margin: 4px 0 0 0; padding-left: 18px; font-size: 11px; color: #ddd;'>" +
    possibleRatiosHTML +
    "</ul>";
});