window.onload = () => {
    loadTasks();
    checkEmpty();

    // Load saved theme
    let savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
        document.body.classList.add("dark");
        document.getElementById("themeToggle").textContent = "☀️";
    }
};

// Add Task
function addTask() {
    let text = taskInput.value;
    let date = dueDate.value;
    let category = document.getElementById("category").value;

    if (!text) return alert("Enter task");

    let task = {
        id: Date.now(),
        text,
        date,
        category
    };

    saveTask(task);
    createTask(task);

    taskInput.value = "";
    dueDate.value = "";

    checkEmpty();
}

// Create Task
function createTask(task) {
    let li = document.createElement("li");
    li.classList.add(task.category.toLowerCase());

    let span = document.createElement("span");
    span.textContent = `${task.text} (${task.date})`;

    span.onclick = () => {
        li.classList.toggle("completed");
        updateStorage();
    };

    let div = document.createElement("div");
    div.className = "task-buttons";

    let edit = document.createElement("button");
    edit.textContent = "✏️";
    edit.onclick = () => {
        let newText = prompt("Edit task", task.text);
        if (newText) {
            task.text = newText;
            span.textContent = `${task.text} (${task.date})`;
            updateStorage();
        }
    };

    let del = document.createElement("button");
    del.textContent = "🗑️";
    del.onclick = () => {
        li.remove();
        deleteTask(task.id);
        checkEmpty();
    };

    div.append(edit, del);

    li.append(span, div);
    taskList.appendChild(li);
}

// Search
function searchTask() {
    let val = search.value.toLowerCase();
    document.querySelectorAll("#taskList li").forEach(li => {
        li.style.display = li.innerText.toLowerCase().includes(val) ? "flex" : "none";
    });
}

// Toggle Theme
function toggleTheme() {
    let body = document.body;
    let btn = document.getElementById("themeToggle");

    body.classList.toggle("dark");

    if (body.classList.contains("dark")) {
        localStorage.setItem("theme", "dark");
        btn.textContent = "☀️";
    } else {
        localStorage.setItem("theme", "light");
        btn.textContent = "🌙";
    }
}

// Storage
function saveTask(task) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(createTask);
}

function updateStorage() {
    let tasks = [];
    document.querySelectorAll("#taskList li").forEach(li => {
        tasks.push({ text: li.innerText });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function deleteTask(id) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks = tasks.filter(t => t.id !== id);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Empty check
function checkEmpty() {
    emptyMsg.style.display =
        document.querySelectorAll("#taskList li").length ? "none" : "block";
}