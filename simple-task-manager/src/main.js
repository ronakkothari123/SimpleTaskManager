const { invoke } = window.__TAURI__.tauri;

const images = [
    "https://images.unsplash.com/photo-1433086966358-54859d0ed716",
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e",
    "https://images.unsplash.com/photo-1426604966848-d7adac402bff",
    "https://images.unsplash.com/photo-1475924156734-496f6cac6ec1",
    "https://images.unsplash.com/photo-1439853949127-fa647821eba0"
]

function getFormattedDate() {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const today = new Date();
    const day = days[today.getDay()];
    const date = today.getDate();
    const month = months[today.getMonth()];
    const year = today.getFullYear();

    function getDateSuffix(date) {
        if (date > 3 && date < 21) return 'th';
        switch (date % 10) {
            case 1: return "st";
            case 2: return "nd";
            case 3: return "rd";
            default: return "th";
        }
    }

    const dateSuffix = getDateSuffix(date);
    return `${day}, ${month} ${date}${dateSuffix}`;
}

function loadTasks() {
    const taskTable = document.getElementById('task-table');
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    tasks.forEach(task => {
        addTaskToDOM(task.name, new Date(task.date));
    });
}

function saveTaskToLocalStorage(taskName, date) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push({ name: taskName, date: date.toISOString() });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function removeTaskFromLocalStorage(taskName) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(task => task.name !== taskName);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function openPomodoroTimer(){
    invoke('show_secondary_window');
}

function addTask() {
    const taskName = document.getElementById('main-input').value;

    if (!taskName.trim()) {
        return;
    }

    const today = new Date();
    addTaskToDOM(taskName, today);
    saveTaskToLocalStorage(taskName, today);

    document.getElementById('main-input').value = '';
}

function addTaskToDOM(taskName, date) {
    const taskTable = document.getElementById('task-table');

    const taskDiv = document.createElement('div');

    const nameDiv = document.createElement('div');
    const taskTitle = document.createElement('h1');
    taskTitle.textContent = taskName;
    nameDiv.appendChild(taskTitle);

    const dateDiv = document.createElement('div');
    const taskDate = document.createElement('p');
    taskDate.textContent = `${date.toDateString()}`;
    dateDiv.appendChild(taskDate);

    const buttonDiv = document.createElement('div');
    const completeButton = document.createElement('button');
    completeButton.className = 'button-secondary';
    completeButton.textContent = 'Complete';

    completeButton.addEventListener('click', function() {
        taskTable.removeChild(taskDiv);
        removeTaskFromLocalStorage(taskName);
    });

    buttonDiv.appendChild(completeButton);

    taskDiv.appendChild(nameDiv);
    taskDiv.appendChild(dateDiv);
    taskDiv.appendChild(buttonDiv);

    taskTable.appendChild(taskDiv);
}

// Example usage: Call addTask() when a button is clicked
document.getElementById('main-input-button').addEventListener('click', addTask);

document.getElementById('main-input').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        addTask();
    }
});

window.addEventListener("DOMContentLoaded", () => {
    const dateContainer = document.getElementById("main-date");
    const date = getFormattedDate();

    const dayContainer = document.createElement("span");
    dayContainer.classList.add("light-text");
    dayContainer.textContent = date.split(" ")[0];

    const textNode = document.createTextNode(date.substr(date.indexOf(" ")));

    document.getElementById("main-wrapper").style.backgroundImage = `url(${images[Math.floor(Math.random() * images.length)]})`

    dateContainer.append(dayContainer, textNode);

    loadTasks();
});
