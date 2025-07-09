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

document.getElementById('quote-form').addEventListener('submit', function(e) {
  e.preventDefault();

  const state = document.getElementById('state').value.trim().toUpperCase();
  const age = parseInt(document.getElementById('age').value);
  let gender = document.getElementById('gender').value.trim().toUpperCase();
  const upgrade = parseFloat(document.getElementById('association').value);

  if (gender === "" || gender === "UNKNOWN") {
    gender = "F"; // default to female if unknown
  }

  const matches = quoteData
    .filter(q => q.state === state && q.gender === gender)
    .sort((a, b) => Math.abs(a.age - age) - Math.abs(b.age - age)); // find nearest age

  const resultDiv = document.getElementById('result');
  if (matches.length > 0) {
    const base = matches[0].price;
    const total = base + upgrade;
    resultDiv.innerHTML = `
  <h2>Premier Advantage – Plan 1 – Minimum MedGuard</h2>
  <p>Monthly Premium: $${total.toFixed(2)}</p>
`;

  } else {
    resultDiv.innerHTML = `<h2>No matching quote found.</h2>`;
  }
});

