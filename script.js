// Function to get tasks from local storage
function getTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    return tasks;
}

// Function to save tasks to local storage
function saveTasks(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Function to render tasks based on category
function renderTasks() {
    const todayDate = new Date().toISOString().split('T')[0];
    const tasks = getTasks();

    const todayTasksDiv = document.getElementById('todayTasks');
    const futureTasksDiv = document.getElementById('futureTasks');
    const completedTasksDiv = document.getElementById('completedTasks');

    todayTasksDiv.innerHTML = '';
    futureTasksDiv.innerHTML = '';
    completedTasksDiv.innerHTML = '';

    tasks.forEach(task => {
        const taskDiv = document.createElement('div');
        taskDiv.classList.add('task');
        if (task.completed) {
            taskDiv.classList.add('completed');
        }
        if (!task.completed && task.date < todayDate) {
            taskDiv.classList.add('past-due');
        }

        const taskInfo = `<strong>${task.name}</strong> - Deadline: ${task.date} - Priority: ${task.priority}`;
        taskDiv.innerHTML = taskInfo;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => {
            const index = tasks.findIndex(t => t.name === task.name && t.date === task.date && t.priority === task.priority);
            tasks.splice(index, 1);
            saveTasks(tasks);
            renderTasks();
        };
        taskDiv.appendChild(deleteButton);

        const toggleButton = document.createElement('button');
        toggleButton.textContent = task.completed ? 'Undo' : 'Complete';
        toggleButton.onclick = () => {
            task.completed = !task.completed;
            saveTasks(tasks);
            renderTasks();
        };
        taskDiv.appendChild(toggleButton);

        if (task.date === todayDate) {
            todayTasksDiv.appendChild(taskDiv);
        } else if (!task.completed || task.date >= todayDate) {
            futureTasksDiv.appendChild(taskDiv);
        } else {
            completedTasksDiv.appendChild(taskDiv);
        }
    });
}

// Function to add a new task
function addItem() {
    const taskName = document.getElementById('taskName').value;
    const taskDate = document.getElementById('taskDate').value;
    const taskPriority = document.getElementById('taskPriority').value;

    if (taskName && taskDate && taskPriority) {
        const newTask = {
            name: taskName,
            date: taskDate,
            priority: taskPriority,
            completed: false
        };

        const tasks = getTasks();
        tasks.push(newTask);
        saveTasks(tasks);
        renderTasks();

        // Clear input fields after adding task
        document.getElementById('taskName').value = '';
        document.getElementById('taskDate').value = '';
        document.getElementById('taskPriority').value = 'high';
    } else {
        alert('Please fill in all fields.');
    }
}

// Initial rendering of tasks when page loads
renderTasks();
