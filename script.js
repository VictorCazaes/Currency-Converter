window.addEventListener("load", () => {
    if (StoregedCurrencies.get() == null) {
        Utils.currencyList();
    } else {
        const currencies = StoregedCurrencies.get();
        currencies.forEach(DOM.displayCurrenciesFrom);
        currencies.forEach(DOM.displayCurrenciesTo);
    }
});

const StoregedCurrencies = {
    get() {
        return JSON.parse(localStorage.getItem("Currencies"));
    },
    set(currencies) {
        localStorage.setItem("Currencies", JSON.stringify(currencies));
    }
};

const GetCurrency = {
    fromCurrency: document.querySelector("#currencies-from"),
    toCurrency: document.querySelector("#currencies-to"),
    convertCurrency(from, to) {
        fetch(`https://free.currconv.com/api/v7/convert?q=${from}_${to}&apiKey=93b01b04743e11484773`)
            .then(response => {
                return response.json();
            })
            .then((data) => {
                const currencies = `${from}_${to}`;
                const value = data.results[currencies].val;
                DOM.displayResult(from, to, value);
            })
            .catch((error) => {
                alert(error, 'We did not find what you are looking for, please try again.');
            });
    },
    inputValues() {
        const from = GetCurrency.fromCurrency.value;
        const to = GetCurrency.toCurrency.value;
        GetCurrency.convertCurrency(from, to);
    }
};

const DOM = {
    currencyFrom: document.querySelector("#currencies-from"),
    currencyTo: document.querySelector("#currencies-to"),
    amount: document.querySelector("#input-amount"),
    resultBoard: document.querySelector("#display-result"),
    displayCurrenciesFrom(currency, index) {
        const option = document.createElement("option");
        option.dataset.index = index;
        option.value = currency.id;
        option.textContent = currency.currencyName;
        DOM.currencyFrom.appendChild(option);
    },
    displayCurrenciesTo(currency, index) {
        const option = document.createElement("option");
        option.dataset.index = index;
        option.value = currency.id;
        option.textContent = currency.currencyName;
        DOM.currencyTo.appendChild(option);
    },
    displayResult(from, to, value) {
        value = (value * DOM.amount.value).toFixed(2);
        DOM.resultBoard.innerHTML = `${DOM.amount.value} ${from} = ${value} ${to}`
    }
};

const Utils = {
    currencyList() {
        fetch("https://free.currconv.com/api/v7/currencies?&apiKey=93b01b04743e11484773")
            .then(response => {
                return response.json();
            })
            .then((data) => {
                StoregedCurrencies.set(Object.values(data.results))
            })
    }
};

const form = document.querySelector("form");
form.addEventListener("submit", (event) => {
    event.preventDefault();
    GetCurrency.inputValues();
});