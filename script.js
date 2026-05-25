let allBtn = document.getElementById("allBtn");
let completedBtn = document.getElementById("completedBtn");
let pendingBtn = document.getElementById("pendingBtn");

let taskInput = document.getElementById("taskInput");
let addBtn = document.getElementById("addBtn");
let taskList = document.getElementById("taskList");

let themeBtn = document.getElementById("themeBtn");

let totalTasks = document.getElementById("totalTasks");
let completedTasks = document.getElementById("completedTasks");
let pendingTasks = document.getElementById("pendingTasks");

let dueDate = document.getElementById("dueDate");
let priority = document.getElementById("priority");


// Load tasks and theme when page opens
window.addEventListener("load", function(){

    loadTasks();
    loadTheme();

});


// Button Events
addBtn.addEventListener("click", addTask);

allBtn.addEventListener("click", showAll);

completedBtn.addEventListener("click", showCompleted);

pendingBtn.addEventListener("click", showPending);

themeBtn.addEventListener("click", toggleTheme);


// Enter key support
taskInput.addEventListener("keypress", function(event){

    if(event.key === "Enter"){
        addTask();
    }

});


// Add Task Function
function addTask(){

    let taskText = taskInput.value.trim();

    let dateValue = dueDate.value;

    let priorityValue = priority.value;

    // Validation
    if(taskText === ""){
        alert("Please enter a task");
        return;
    }

    // Create task UI
    createTask(taskText, false, dateValue, priorityValue);

    // Save to local storage
    saveTask(taskText, dateValue, priorityValue);

    // Clear inputs
    taskInput.value = "";
    dueDate.value = "";
    priority.value = "High";
}


// Create Task UI
function createTask(taskText, completed, dateValue, priorityValue){

    let li = document.createElement("li");

    // Completed task
    if(completed){
        li.classList.add("completed");
    }

    li.innerHTML = `
    
    <div>
        <span>${taskText}</span>

        <br>

        <small>
            Due: ${dateValue || "No Date"}
        </small>

        <br>

        <small class="${priorityValue}">
            Priority: ${priorityValue}
        </small>
    </div>

    <div>
        <button class="editBtn">✏</button>

        <button class="completeBtn">✔</button>

        <button class="deleteBtn">✖</button>
    </div>
    
    `;


    // EDIT TASK
    li.querySelector(".editBtn")
      .addEventListener("click", function(){

        let span = li.querySelector("span");

        let currentText = span.innerText;

        let newText = prompt("Edit task:", currentText);

        // Cancel clicked
        if(newText === null){
            return;
        }

        newText = newText.trim();

        // Empty validation
        if(newText === ""){
            alert("Task cannot be empty");
            return;
        }

        span.innerText = newText;

        updateLocalStorage();

    });


    // COMPLETE TASK
    li.querySelector(".completeBtn")
      .addEventListener("click", function(){

        li.classList.toggle("completed");

        updateLocalStorage();

        updateStats();

    });


    // DELETE TASK
    li.querySelector(".deleteBtn")
      .addEventListener("click", function(){

        li.remove();

        updateLocalStorage();

        updateStats();

    });


    // Add task to list
    taskList.appendChild(li);

    // Update stats
    updateStats();

}


// Save Task
function saveTask(taskText, dateValue, priorityValue){

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    tasks.push({

        text: taskText,

        completed: false,

        dueDate: dateValue,

        priority: priorityValue

    });

    localStorage.setItem("tasks", JSON.stringify(tasks));

}


// Update Local Storage
function updateLocalStorage(){

    let tasks = [];

    document.querySelectorAll("#taskList li").forEach(function(li){

        let smalls = li.querySelectorAll("small");

        tasks.push({

            text: li.querySelector("span").innerText,

            completed: li.classList.contains("completed"),

            dueDate: smalls[0].innerText.replace("Due: ", ""),

            priority: smalls[1].innerText.replace("Priority: ", "")

        });

    });

    localStorage.setItem("tasks", JSON.stringify(tasks));

}


// Load Tasks
function loadTasks(){

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    tasks.forEach(function(task){

        createTask(

            task.text,

            task.completed,

            task.dueDate,

            task.priority

        );

    });

}


// Show All Tasks
function showAll(){

    let tasks = document.querySelectorAll("#taskList li");

    tasks.forEach(function(task){

        task.style.display = "flex";

    });

}


// Show Completed Tasks
function showCompleted(){

    let tasks = document.querySelectorAll("#taskList li");

    tasks.forEach(function(task){

        if(task.classList.contains("completed")){

            task.style.display = "flex";

        }
        else{

            task.style.display = "none";

        }

    });

}


// Show Pending Tasks
function showPending(){

    let tasks = document.querySelectorAll("#taskList li");

    tasks.forEach(function(task){

        if(!task.classList.contains("completed")){

            task.style.display = "flex";

        }
        else{

            task.style.display = "none";

        }

    });

}


// Toggle Theme
function toggleTheme(){

    document.body.classList.toggle("dark-body");

    // Save Theme
    if(document.body.classList.contains("dark-body")){

        localStorage.setItem("theme", "dark");

        themeBtn.innerText = "☀";

    }
    else{

        localStorage.setItem("theme", "light");

        themeBtn.innerText = "🌙";

    }

}


// Load Theme
function loadTheme(){

    let savedTheme = localStorage.getItem("theme");

    if(savedTheme === "dark"){

        document.body.classList.add("dark-body");

        themeBtn.innerText = "☀";

    }

}


// Update Statistics
function updateStats(){

    let tasks = document.querySelectorAll("#taskList li");

    let total = tasks.length;

    let completed = document.querySelectorAll("#taskList li.completed").length;

    let pending = total - completed;

    totalTasks.innerText = total;

    completedTasks.innerText = completed;

    pendingTasks.innerText = pending;

}