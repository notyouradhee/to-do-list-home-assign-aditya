const taskInput = document.getElementById('taskInput');
const dueDateInput = document.getElementById('dueDateInput');
const categoryInput = document.getElementById('categoryInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const toggleThemeBtn = document.getElementById('toggleTheme');
const filterButtons = document.querySelectorAll('.filter-btn');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks(filter = 'all') {
    taskList.innerHTML = '';
    const filteredTasks = tasks.filter(task => {
        if (filter === 'all') return true;
        if (filter === 'completed') return task.completed === true;
        if (filter === 'pending') return task.completed === false;
    });

    filteredTasks
        .sort((a, b) => new Date(a.dueDate || '2100-01-01') - new Date(b.dueDate || '2100-01-01'))
        .forEach(task => {
            const li = document.createElement('li');
            li.className = `task-item ${task.completed ? 'completed' : ''}`;

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = task.completed;
            checkbox.onchange = () => {
                task.completed = checkbox.checked;
                saveTasks();
                loadTasks(filter);
            };

            const span = document.createElement('span');
            span.textContent = `${task.text} (Due: ${task.dueDate || 'No Date'}, Category: ${task.category})`;
            span.onclick = () => {
                const newText = prompt('Edit Task:', task.text);
                if (newText) {
                    task.text = newText.trim();
                    saveTasks();
                    loadTasks(filter);
                }
            };

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.onclick = () => {
                tasks = tasks.filter(t => t !== task);
                saveTasks();
                loadTasks(filter);
            };

            li.append(checkbox, span, deleteBtn);
            taskList.appendChild(li);
        });
}

function addTask() {
    const taskText = taskInput.value.trim();
    const taskDate = dueDateInput.value;
    const taskCategory = categoryInput.value;

    if (!taskText) {
        alert('Please enter a task!');
        return;
    }

    tasks.push({
        text: taskText,
        dueDate: taskDate,
        category: taskCategory,
        completed: false,
    });

    saveTasks();
    loadTasks();
    taskInput.value = '';
    dueDateInput.value = '';
    categoryInput.value = 'Work';
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
}

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        const filter = button.dataset.filter;
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        loadTasks(filter);
    });
});

addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', e => {
    if (e.key === 'Enter') addTask();
});
toggleThemeBtn.addEventListener('click', toggleTheme);

loadTasks();
