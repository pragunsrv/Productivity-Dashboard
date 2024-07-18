document.addEventListener('DOMContentLoaded', () => {
    // To-Do List functionality
    const newTaskInput = document.getElementById('new-task');
    const addTaskButton = document.getElementById('add-task-button');
    const toDoList = document.getElementById('to-do-list');

    addTaskButton.addEventListener('click', () => {
        const taskText = newTaskInput.value.trim();
        if (taskText !== '') {
            const listItem = document.createElement('li');
            const taskTime = document.createElement('span');
            taskTime.className = 'task-time';
            taskTime.textContent = `Added ${new Date().toLocaleString()}`;
            listItem.textContent = taskText;
            listItem.appendChild(taskTime);

            const deleteButton = document.createElement('button');
            deleteButton.className = 'delete-task-button';
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', () => {
                toDoList.removeChild(listItem);
            });

            listItem.appendChild(deleteButton);
            toDoList.appendChild(listItem);
            newTaskInput.value = '';
        }
    });

    // Weather widget functionality
    const weatherWidget = document.getElementById('weather-widget');
    const locationElement = document.getElementById('location');
    const temperatureElement = document.getElementById('temperature');
    const descriptionElement = document.getElementById('description');
    const iconElement = document.getElementById('icon');

    const apiKey = '444b04107ede1fa3a66aac35fc5945b7';

    function fetchWeatherData() {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
                .then(response => response.json())
                .then(data => {
                    const { name } = data;
                    const { temp } = data.main;
                    const { description, icon } = data.weather[0];

                    locationElement.textContent = name;
                    temperatureElement.textContent = `${temp}°C`;
                    descriptionElement.textContent = description;
                    iconElement.style.backgroundImage = `url(http://openweathermap.org/img/wn/${icon}.png)`;
                })
                .catch(error => {
                    console.error('Error fetching weather data:', error);
                    weatherWidget.innerHTML = '<p>Unable to fetch weather data.</p>';
                });
        });
    }

    fetchWeatherData();

    // Currency converter functionality
    const amountInput = document.getElementById('amount');
    const fromCurrencySelect = document.getElementById('from-currency');
    const toCurrencySelect = document.getElementById('to-currency');
    const convertButton = document.getElementById('convert-button');
    const conversionResult = document.getElementById('conversion-result');

    const apiUrl = 'https://api.exchangerate-api.com/v4/latest/USD';

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const currencies = Object.keys(data.rates);
            populateCurrencySelect(fromCurrencySelect, currencies);
            populateCurrencySelect(toCurrencySelect, currencies);
        })
        .catch(error => {
            console.error('Error fetching exchange rates:', error);
        });

    function populateCurrencySelect(selectElement, currencies) {
        currencies.forEach(currency => {
            const option = document.createElement('option');
            option.value = currency;
            option.textContent = currency;
            selectElement.appendChild(option);
        });
    }

    convertButton.addEventListener('click', () => {
        const amount = parseFloat(amountInput.value);
        const fromCurrency = fromCurrencySelect.value;
        const toCurrency = toCurrencySelect.value;

        if (isNaN(amount) || fromCurrency === '' || toCurrency === '') {
            conversionResult.textContent = 'Please fill in all fields.';
            return;
        }

        fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`)
            .then(response => response.json())
            .then(data => {
                const rate = data.rates[toCurrency];
                const convertedAmount = (amount * rate).toFixed(2);
                conversionResult.textContent = `${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency}`;
            })
            .catch(error => {
                console.error('Error converting currency:', error);
                conversionResult.textContent = 'Error converting currency.';
            });
    });

    // Calculator functionality
    const calcDisplay = document.getElementById('calc-display');
    const calcButtons = document.querySelectorAll('.calc-button');

    let calcInput = '';

    calcButtons.forEach(button => {
        button.addEventListener('click', () => {
            const value = button.getAttribute('data-value');

            if (value === '=') {
                try {
                    calcInput = eval(calcInput).toString();
                } catch {
                    calcInput = 'Error';
                }
            } else if (value === 'C') {
                calcInput = '';
            } else if (value === '←') {
                calcInput = calcInput.slice(0, -1);
            } else {
                calcInput += value;
            }

            calcDisplay.value = calcInput;
        });
    });

    // Adding percentage functionality
    function calculatePercentage(expression) {
        return expression.replace(/(\d+(\.\d+)?)%/g, (match, p1) => (parseFloat(p1) / 100).toString());
    }

    calcButtons.forEach(button => {
        button.addEventListener('click', () => {
            const value = button.getAttribute('data-value');

            if (value === '=') {
                try {
                    calcInput = calculatePercentage(calcInput);
                    calcInput = eval(calcInput).toString();
                } catch {
                    calcInput = 'Error';
                }
            } else if (value === 'C') {
                calcInput = '';
            } else if (value === '←') {
                calcInput = calcInput.slice(0, -1);
            } else {
                calcInput += value;
            }

            calcDisplay.value = calcInput;
        });
    });
});
