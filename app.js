document.addEventListener("DOMContentLoaded", () => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = storedTasks;
    updateTasksList();
    updateStats();
});

let tasks = [];

const saveTasks = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
};

const addTask = () => {
    const taskInput = document.getElementById("taskInput");
    const text = taskInput.value.trim();

    if (text) {
        tasks.push({ text: text, completed: false });
        taskInput.value = "";
        updateTasksList();
        updateStats();
        saveTasks();
    }
};

const toggleTaskComplete = (index) => {
    tasks[index].completed = !tasks[index].completed;
    updateTasksList();
    updateStats();
    saveTasks();

    // Check if all tasks are completed after toggling the checkbox
    const allTasksCompleted = tasks.every(task => task.completed);
    if (allTasksCompleted) {
        blastConfetti();
    }
};


const deleteTask = (index) => {
    const taskList = document.getElementById("task-list");
    const taskItem = taskList.children[index];

    // Add an exit animation before deletion
    taskItem.classList.add("fade-out");
    setTimeout(() => {
        tasks.splice(index, 1);
        updateTasksList();
        updateStats();
        saveTasks();
    }, 500); // Match with CSS transition duration
};

const editTask = (index) => {
    const taskInput = document.getElementById("taskInput");
    taskInput.value = tasks[index].text;
    tasks.splice(index, 1);
    updateTasksList();
    updateStats();
    saveTasks();
};

const updateStats = () => {
    const completedTasks = tasks.filter(task => task.completed).length;
    const totalTasks = tasks.length;
    const progress = totalTasks ? (completedTasks / totalTasks) * 100 : 0;
    const progressBar = document.getElementById('progress');
    const statusMessage = document.querySelector('.details p'); // Selects the status message paragraph

    progressBar.style.width = `${progress}%`;
    document.getElementById("numbers").innerText = `${completedTasks} / ${totalTasks}`;

    // Display messages based on task count and progress
    if (totalTasks === 0) {
        statusMessage.innerText = "Please add your tasks";
    } else if (completedTasks === totalTasks) {
        statusMessage.innerText = "Keep it up!";
        blastConfetti();
    } else if (completedTasks >= totalTasks / 2) {
        statusMessage.innerText = "Good Job!";
    } else {
        statusMessage.innerText = "Keep working";
    }
};



const updateTasksList = () => {
    const taskList = document.getElementById("task-list");
    taskList.innerHTML = '';

    tasks.forEach((task, index) => {
        const listItem = document.createElement('li');
        listItem.classList.add('taskItem', 'fade-in');

        listItem.innerHTML = `
            <div class="task ${task.completed ? 'completed' : ''}">
                <input type="checkbox" class="checkbox" ${task.completed ? "checked" : ""} onchange="toggleTaskComplete(${index})"/>
                <p>${task.text}</p>
            </div>
            <div class="icons">
                <img src="./edit.png" alt="Edit" onclick="editTask(${index})" />
                <img src="./bin.png" alt="Delete" onclick="deleteTask(${index})" />
            </div>
        `;
        
        taskList.append(listItem);
    });
};

document.getElementById('newTask').addEventListener("click", (e) => {
    e.preventDefault();
    addTask();
});

const blastConfetti = () => {
    const count = 200,
    defaults = { origin: { y: 0.7 } };

    function fire(particleRatio, opts) {
        confetti(
            Object.assign({}, defaults, opts, {
                particleCount: Math.floor(count * particleRatio),
            })
        );
    }

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
};
