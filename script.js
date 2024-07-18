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
        const newQuotes = [
            "Quote 11: Success is not final, failure is not fatal: It is the courage to continue that counts.",
            "Quote 12: Life isn't about finding yourself. Life is about creating yourself.",
            "Quote 13: Challenges are what make life interesting and overcoming them is what makes life meaningful.",
            "Quote 14: The only way to do great work is to love what you do.",
            "Quote 15: The best and most beautiful things in the world cannot be seen or even touched - they must be felt with the heart."
        ];

        quotes.push(...newQuotes);
        moreQuotesButton.disabled = true;
    });

    displayQuote();

    // Image Gallery functionality
    const imageGallery = document.getElementById('image-gallery');
    const uploadInput = document.getElementById('upload-input');
    const uploadButton = document.getElementById('upload-button');

    uploadButton.addEventListener('click', () => {
        const files = uploadInput.files;
        if (files.length === 0) {
            alert('Please select a file to upload.');
            return;
        }

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const reader = new FileReader();

            reader.onload = () => {
                const img = document.createElement('img');
                img.src = reader.result;
                img.alt = file.name;
                imageGallery.appendChild(img);
            };

            reader.readAsDataURL(file);
        }
    });

    // Tic Tac Toe functionality
    const ticTacToeBoard = document.getElementById('tic-tac-toe-board');
    const restartButton = document.getElementById('restart-button');
    const gameStatus = document.getElementById('game-status');

    const X_CLASS = 'x';
    const O_CLASS = 'o';
    let currentPlayerClass = X_CLASS;
    let gameActive = true;

    const cellElements = document.querySelectorAll('[data-cell]');

    cellElements.forEach(cell => {
        cell.addEventListener('click', handleClick, { once: true });
    });

    restartButton.addEventListener('click', startGame);

    function startGame() {
        cellElements.forEach(cell => {
            cell.classList.remove(X_CLASS);
            cell.classList.remove(O_CLASS);
            cell.removeEventListener('click', handleClick);
            cell.addEventListener('click', handleClick, { once: true });
        });
        gameStatus.textContent = '';
        gameActive = true;
        currentPlayerClass = X_CLASS;
    }

    function handleClick(event) {
        const cell = event.target;
        if (!gameActive || cell.classList.contains(X_CLASS) || cell.classList.contains(O_CLASS)) {
            return;
        }
        
        placeMark(cell, currentPlayerClass);
        if (checkWin(currentPlayerClass)) {
            endGame(false);
        } else if (isDraw()) {
            endGame(true);
        } else {
            swapTurns();
        }
    }

    function placeMark(cell, mark) {
        cell.classList.add(mark);
    }

    function swapTurns() {
        currentPlayerClass = currentPlayerClass === X_CLASS ? O_CLASS : X_CLASS;
    }

    function checkWin(mark) {
        const WINNING_COMBINATIONS = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        return WINNING_COMBINATIONS.some(combination => {
            return combination.every(index => {
                return cellElements[index].classList.contains(mark);
            });
        });
    }

    function isDraw() {
        return [...cellElements].every(cell => {
            return cell.classList.contains(X_CLASS) || cell.classList.contains(O_CLASS);
        });
    }

    function endGame(draw) {
        if (draw) {
            gameStatus.textContent = 'Draw!';
        } else {
            gameStatus.textContent = `${currentPlayerClass === X_CLASS ? "X" : "O"} wins!`;
        }
        gameActive = false;
    }
});
// JavaScript for handling feedback form submission
const feedbackForm = document.getElementById('feedback-form');
const feedbackStatus = document.getElementById('feedback-status');

feedbackForm.addEventListener('submit', function(event) {
    event.preventDefault();

    // Collect form data
    const formData = new FormData(feedbackForm);
    const feedbackData = {};
    formData.forEach((value, key) => {
        feedbackData[key] = value;
    });

    // Simulate submission (replace with actual submission logic)
    setTimeout(() => {
        feedbackStatus.textContent = 'Feedback submitted successfully!';
        feedbackForm.reset();
    }, 1000);
});

