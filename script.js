document.addEventListener('DOMContentLoaded', () => {
    const addTaskButton = document.getElementById('add-task-button');
    const newTaskInput = document.getElementById('new-task');
    const toDoList = document.getElementById('to-do-list');

    addTaskButton.addEventListener('click', () => {
        const taskText = newTaskInput.value.trim();
        if (taskText !== '') {
            addTask(taskText);
            newTaskInput.value = '';
        }
    });

    function addTask(taskText) {
        const listItem = document.createElement('li');

        const taskContent = document.createElement('span');
        taskContent.textContent = taskText;

        const taskTime = document.createElement('span');
        taskTime.className = 'task-time';
        taskTime.textContent = `Added on: ${new Date().toLocaleString()}`;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'delete-task-button';
        deleteButton.addEventListener('click', () => {
            listItem.remove();
        });

        listItem.appendChild(taskContent);
        listItem.appendChild(taskTime);
        listItem.appendChild(deleteButton);
        toDoList.appendChild(listItem);
    }

    // Weather widget functionality
    const apiKey = '444b04107ede1fa3a66aac35fc5945b7'; // Replace with your actual API key
    const weatherWidget = document.getElementById('weather-widget');
    const locationElement = document.getElementById('location');
    const temperatureElement = document.getElementById('temperature');
    const descriptionElement = document.getElementById('description');
    const iconElement = document.getElementById('icon');

    function fetchWeatherData() {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;

            fetch(apiUrl)
                .then(response => response.json())
                .then(data => {
                    const { name } = data;
                    const { temp } = data.main;
                    const { description, icon } = data.weather[0];

                    locationElement.textContent = name;
                    temperatureElement.textContent = `${temp.toFixed(1)}°C`;
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
});
