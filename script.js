const aibcStates = ['FL', 'VA', 'TX', 'GA', 'SC', 'NC', 'TN', 'MO', 'IN', 'MI'];

const accidentOptions = {
  NV: [
    { label: "5K / $250 ded (default)", value: 0 },
    { label: "7.5K / $250 ded (+$6)", value: 6 },
    { label: "10K / $500 ded (+$9.75)", value: 9.75 },
    { label: "12.5K / $500 ded (+$17.25)", value: 17.25 },
    { label: "15K / $500 ded (+$24.75)", value: 24.75 },
  ],
  KS: [
    { label: "5K / $250 ded (default)", value: 0 },
    { label: "7.5K / $250 ded (+$9)", value: 9 },
    { label: "10K / $500 ded (+$17.25)", value: 17.25 },
    { label: "12.5K / $1K ded (+$21)", value: 21 },
    { label: "15K / $1K ded (+$31.50)", value: 31.50 },
  ]
};

let quoteData = [];

// Load the CSV file
fetch('quotes.csv')
  .then(response => response.text())
  .then(csv => {
    const lines = csv.trim().split('\n').slice(1); // Skip header
    quoteData = lines.map(line => {
      const [state, age, gender, price] = line.split(',');
      return {
        state: state.trim().toUpperCase(),
        age: parseInt(age.trim()),
        gender: gender.trim().toUpperCase(),
        price: parseFloat(price.trim())
      };
    });
  });

  document.getElementById('state').addEventListener('input', function () {
  const state = this.value.trim().toUpperCase();
  const isAIBC = aibcStates.includes(state);
  const upgradeContainer = document.getElementById('upgrade-container');
  const associationGroup = document.getElementById('association-group');
  const accidentGroup = document.getElementById('accident-group');
  const accidentSelect = document.getElementById('accident');

  upgradeContainer.style.display = 'block';
  associationGroup.style.display = isAIBC ? 'block' : 'none';
  accidentGroup.style.display = isAIBC ? 'none' : 'block';

  if (!isAIBC && accidentOptions[state]) {
    accidentSelect.innerHTML = ""; // Clear existing options
    accidentOptions[state].forEach(opt => {
      const option = document.createElement('option');
      option.value = opt.value;
      option.textContent = opt.label;
      accidentSelect.appendChild(option);
    });
  } else if (!isAIBC) {
    accidentSelect.innerHTML = `<option value="0">No upgrade options</option>`;
  }
});

document.getElementById('quote-form').addEventListener('submit', function(e) {
  e.preventDefault();

  const state = document.getElementById('state').value.trim().toUpperCase();
  const age = parseInt(document.getElementById('age').value);
  let gender = document.getElementById('gender').value.trim().toUpperCase();
  let upgradeValue = 0;
let upgradeLabel = "";

if (aibcStates.includes(state)) {
  upgradeValue = parseFloat(document.getElementById('association').value);
  if (upgradeValue === 10) upgradeLabel = "Sapphire";
  else if (upgradeValue === 20) upgradeLabel = "Emerald";
  else if (upgradeValue === 30) upgradeLabel = "Diamond";
  else if (upgradeValue === 57) upgradeLabel = "Executive Diamond";
  else upgradeLabel = "Ruby";
} else {
  const accidentSelect = document.getElementById('accident');
  upgradeValue = parseFloat(accidentSelect.value);
  upgradeLabel = accidentSelect.options[accidentSelect.selectedIndex].text;
}


  if (gender === "" || gender === "UNKNOWN") {
    gender = "F"; // default to female if unknown
  }

  const matches = quoteData
    .filter(q => q.state === state && q.gender === gender)
    .sort((a, b) => Math.abs(a.age - age) - Math.abs(b.age - age)); // find nearest age

const resultDiv = document.getElementById('result');

if (matches.length > 0) {
  const base = matches[0].price;
  const total = base + upgradeValue;

  const planLabel = aibcStates.includes(state)
    ? `Premier Advantage – Plan 1 – Minimum MedGuard + AIBC ${upgradeLabel}`
    : `Premier Advantage – Plan 1 – Minimum MedGuard + ${upgradeLabel}`;

  resultDiv.innerHTML = `
    <h2>${planLabel}</h2>
    <p>Monthly Premium: $${total.toFixed(2)}</p>
  `;
} else {
  resultDiv.innerHTML = `<h2>No matching quote found.</h2>`;
}
});


