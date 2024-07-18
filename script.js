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
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Weather data not available');
                    }
                    return response.json();
                })
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
        .then(response => {
            if (!response.ok) {
                throw new Error('Exchange rates not available');
            }
            return response.json();
        })
        .then(data => {
            const currencies = Object.keys(data.rates);
            populateCurrencySelect(fromCurrencySelect, currencies);
            populateCurrencySelect(toCurrencySelect, currencies);
        })
        .catch(error => {
            console.error('Error fetching exchange rates:', error);
            conversionResult.textContent = 'Error fetching exchange rates. Please try again later.';
            convertButton.disabled = true;
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
            .then(response => {
                if (!response.ok) {
                    throw new Error('Conversion rate not available');
                }
                return response.json();
            })
            .then(data => {
                const rate = data.rates[toCurrency];
                if (!rate) {
                    throw new Error(`Rate for ${toCurrency} not found`);
                }
                const convertedAmount = (amount * rate).toFixed(2);
                conversionResult.textContent = `${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency}`;
            })
            .catch(error => {
                console.error('Error converting currency:', error);
                conversionResult.textContent = 'Error converting currency. Please check your inputs and try again.';
            });
    });

    // Calculator functionality
    const calcDisplay = document.getElementById('calc-display');
    const calcButtonsBasic = document.querySelectorAll('.calc-buttons-basic .calc-button');
    const calcButtonsScientific = document.querySelectorAll('.calc-buttons-scientific .calc-button');
    const toggleScientificButton = document.getElementById('toggle-scientific');
    const toggleBasicButton = document.getElementById('toggle-basic');

    let calcInput = '';

    calcButtonsBasic.forEach(button => {
        button.addEventListener('click', () => {
            const value = button.getAttribute('data-value');

            if (value === '=') {
                try {
                    calcInput = calculateExpression(calcInput);
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

    calcButtonsScientific.forEach(button => {
        button.addEventListener('click', () => {
            const value = button.getAttribute('data-value');

            if (value === '=') {
                try {
                    calcInput = calculateExpression(calcInput);
                } catch {
                    calcInput = 'Error';
                }
            } else if (value === 'C') {
                calcInput = '';
            } else if (value === '←') {
                calcInput = calcInput.slice(0, -1);
            } else if (value === 'sin' || value === 'cos' || value === 'tan' || value === 'log' || value === 'sqrt') {
                calcInput = `${value}(${calcInput})`;
            } else if (value === 'pow') {
                calcInput += '**';
            } else if (value === 'pi') {
                calcInput += Math.PI;
            } else if (value === 'e') {
                calcInput += Math.E;
            } else {
                calcInput += value;
            }

            calcDisplay.value = calcInput;
        });
    });

    function calculateExpression(expression) {
        return Function('return ' + expression.replace(/(\d+(\.\d+)?)%/g, (match, p1) => (parseFloat(p1) / 100).toString()))();
    }

    toggleScientificButton.addEventListener('click', () => {
        document.getElementById('calc-buttons').style.display = 'none';
        document.getElementById('calc-buttons-scientific').style.display = 'grid';
    });

    toggleBasicButton.addEventListener('click', () => {
        document.getElementById('calc-buttons').style.display = 'grid';
        document.getElementById('calc-buttons-scientific').style.display = 'none';
    });

    // Handle keyboard input for the calculator
    document.addEventListener('keydown', (event) => {
        const key = event.key;

        if (!isNaN(key) || key === '.') {
            calcInput += key;
        } else if (key === 'Enter') {
            try {
                calcInput = calculateExpression(calcInput);
            } catch {
                calcInput = 'Error';
            }
        } else if (key === 'Backspace') {
            calcInput = calcInput.slice(0, -1);
        } else if (key === '+' || key === '-' || key === '*' || key === '/' || key === '%') {
            calcInput += key;
        } else if (key === 'Escape') {
            calcInput = '';
        }

        calcDisplay.value = calcInput;
    });

    // Random Quotes generator functionality
    const quotes = [
        "Quote 1: The only limit to our realization of tomorrow is our doubts of today.",
        "Quote 2: The future belongs to those who believe in the beauty of their dreams.",
        "Quote 3: Do not watch the clock. Do what it does. Keep going.",
        "Quote 4: Keep your face always toward the sunshine—and shadows will fall behind you.",
        "Quote 5: The best way to predict the future is to create it.",
        "Quote 6: You are never too old to set another goal or to dream a new dream.",
        "Quote 7: Life is 10% what happens to us and 90% how we react to it.",
        "Quote 8: The secret of getting ahead is getting started.",
        "Quote 9: It always seems impossible until it’s done.",
        "Quote 10: The best time to plant a tree was 20 years ago. The second best time is now."
    ];

    const quoteDisplay = document.getElementById('quote-display');
    const newQuoteButton = document.getElementById('new-quote-button');
    const moreQuotesButton = document.getElementById('more-quotes-button');

    function getRandomQuote() {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        return quotes[randomIndex];
    }

    function displayQuote() {
        quoteDisplay.textContent = getRandomQuote();
    }

    newQuoteButton.addEventListener('click', displayQuote);

    moreQuotesButton.addEventListener('click', () => {
        const newQuote = prompt('Enter a new quote:');
        if (newQuote) {
            quotes.push(newQuote);
            alert('New quote added successfully!');
        } else {
            alert('No quote added.');
        }
    });

    // Initial display of a random quote
    displayQuote();
});
