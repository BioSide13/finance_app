const taxamo = new Taxamoapi({
    apiToken: ''
})

// Country Dropdown
function loadCountrie() {

    taxamo.countries().then(response => {
        const countrySelect = document.getElementById('countrySelect');
        response.data.forEach(country => {
            const option = document.getElement('option');
            option.value = country.code;
            option.textContent - country.name;
            countrySelect.appendChild(option);
        });
    });
}

// Function to select tax bracket
function loadTaxBrackets(countryCode, income) {
    taxamo.getTaxBrackets(countryCode).then(response => {
        let selectedBracket = null;

        //Find and dispaly the tax bracket
        response.data.tax_brackets.forEach(bracket => {
            if (income >= bracket.min_income && income <= bracket.max_income){
                selectedBracket = bracket;
            }
        });

        //Display the bracket
        if (selectedBracket) {
            taxBracketDiv.textContent = `Tax Bracket: ${selectedBracket.name} - ${selectedBracket.rate}%`
        } else {
            taxBracketDiv.textContent = 'No tax bracket available for this income.';
        }
    });
}

//Calculate tax based on income
function calcTax() {
    const countryCode = document.getElementById('countrySelect').value;
    const income = parseFloat(document.getElementById('income').value);

    // Load tax brackets
    loadTaxBrackets(countryCode, income)

    // Load and Display
    setTimeout(() => {
        taxamo.calcTax({
            countryCode: countryCode,
            amount: income
        }).then(response => {
            const resultDiv = document.getElementById('result');
            resultDiv.textContent = `Total tax: ${response.data.tax_amount} ${response.data.currency}`;
        });
    }, 500); //Delay for loading
}

//Initialise page elements
document.addEventListener('DOMContentLoaded', () => {
    loadCountries();
    document.getElementById('countrySelect').addEventListener('change', () => {
        const income = (parseFloat(document.getElementById('incomeInput').value));
        const countryCode = document.getElementById('countrySelect').value;
        loadTaxBrackets(countryCode, income);
    });
    document.getElementById('tax').addEventListener('click', calcTax);
    document.getElementById('analyse').addEventListener('click', analyseFinances);
});
 
    function analyseFinances() {
        let income = parseFloat(document.getElementById('livingExpenses').value) - resultDiv
        let livingExpenses = parseFloat(document.getElementById('livingExpenses').value) || 0;
        let foodExpenses = parseFloat(document.getElementById('foodExpenses').value) || 0;
        let educationExpenses = parseFloat(document.getElementById('educationExpenses').value) || 0;
        let entertainmentExpenses = parseFloat(document.getElementById('entertainmentExpenses').value) || 0;
 
        let totalExpenses = livingExpenses + foodExpenses + educationExpenses + entertainmentExpenses;
        let savings = income - totalExpenses;
        let suggestions = "";
 
        if (savings > totalExpenses) {
            suggestions = "You're doing well! Consider investing your savings.";
        } else if (savings == totalExpenses) {
            suggestions = "You are breaking even. Look into cutting down on non-essential expenses.";
        } else {
            suggestions = "You're spending more than you're earning. Review your expenses to reduce unnecessary spending.";
        }
 
        // Display financial analysis
        document.getElementById('analysisOutput').innerHTML = `
            <p>Your total monthly expenses are: $${totalExpenses.toFixed(2)}</p>
            <p>Your savings after expenses: $${savings.toFixed(2)}</p>
            <p>Suggestion: ${suggestions}</p>
        `;
    }