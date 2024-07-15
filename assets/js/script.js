document.addEventListener('DOMContentLoaded', function() {
    const heroDiv = document.createElement('div');
    heroDiv.classList.add('hero_div');
    const headDiv = document.createElement('div');
    headDiv.classList.add('head_div');
    const h2Element = document.createElement('h2');
    h2Element.textContent = 'مهامي';
    const addButton = document.createElement('i');
    addButton.classList.add('fa-sharp', 'fa-solid', 'fa-plus');
    addButton.addEventListener('click', AddButtonClicked);
    headDiv.appendChild(h2Element);
    headDiv.appendChild(addButton);
    const tasksContainer = document.createElement('div');
    tasksContainer.id = 'tasks_container';
    tasksContainer.classList.add('tasks_container');
    heroDiv.appendChild(headDiv);
    heroDiv.appendChild(tasksContainer);
    document.body.appendChild(heroDiv);
    const styleLink = document.createElement('link');
    styleLink.rel = 'stylesheet';
    styleLink.href = '/assets/css/style.css';
    document.head.appendChild(styleLink);
    const fontAwesomeLink = document.createElement('link');
    fontAwesomeLink.rel = 'stylesheet';
    fontAwesomeLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css';
    fontAwesomeLink.integrity = 'sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A==';
    fontAwesomeLink.crossOrigin = 'anonymous';
    fontAwesomeLink.referrerPolicy = 'no-referrer';
    document.head.appendChild(fontAwesomeLink);
});

var ToDo_data = [];

window.onload = function() {
    var storedTasks = localStorage.getItem('ToDo_data');
    if (storedTasks) {
        ToDo_data = JSON.parse(storedTasks);
        ToDo_data.forEach(function(task) {
            addTaskToDOM(task, false);
        });
    }
};

function AddButtonClicked() {
    var userTask = prompt("أدخل المهمة القادمة:");
    if (userTask !== "" && userTask.trim() !== "") {
        var task = {
            id: 'task_' + Date.now(),
            title: userTask,
            time: new Date().toLocaleTimeString(),
            completed: false
        };

        ToDo_data.unshift(task);
        localStorage.setItem('ToDo_data', JSON.stringify(ToDo_data));
        addTaskToDOM(task, true);
    } else {
        alert("يرجى إدخال نص معين !");
    }
}

function addTaskToDOM(task, isNewTask) {
    var taskElement = document.createElement('div');
    taskElement.id = task.id;
    taskElement.className = 'each_task';
    if (task.completed) {
        taskElement.classList.add('each_task_changed');
    }
    taskElement.innerHTML = `
        <div class="left_side">
            <i onclick="editButtonClicked('${task.id}')" class="fa-solid fa-pen"></i>
            <i onclick="checkButtonClicked('${task.id}')" class="fa-solid fa-${task.completed ? 'x' : 'check'} icon"></i>
            <i onclick="deleteButtonClicked('${task.id}')" class="fa-solid fa-trash"></i>
        </div>
        <div class="right_side">
            <h3>${task.title}</h3>
            <span>
                <i class="time">${task.time}</i>
                <i class="fa-regular fa-clock"></i>
            </span>
        </div>
    `;

    var tasksContainer = document.getElementById("tasks_container");
    if (isNewTask) {
        tasksContainer.insertAdjacentElement('afterbegin', taskElement);
    } else {
        tasksContainer.appendChild(taskElement);
    }
}

function checkButtonClicked(taskId) {
    var taskElement = document.getElementById(taskId);
    taskElement.classList.toggle('each_task_changed');

    var checkedButton = taskElement.querySelector('.icon');
    if (checkedButton.classList.contains("fa-check")) {
        checkedButton.classList.remove("fa-check");
        checkedButton.classList.add("fa-x");
    } else {
        checkedButton.classList.remove("fa-x");
        checkedButton.classList.add("fa-check");
    }

    var task = ToDo_data.find(t => t.id === taskId);
    task.completed = !task.completed;
    localStorage.setItem('ToDo_data', JSON.stringify(ToDo_data));
}

function editButtonClicked(taskId) {
    var taskElement = document.getElementById(taskId);
    var taskTitleElement = taskElement.querySelector('h3');
    var taskTimeElement = taskElement.querySelector('.time');
    var taskTitle = taskTitleElement.textContent;
    var taskTime = taskTimeElement.textContent;
    var newTaskTitle = prompt("الرجاء إدخال العنوان الجديد للمهمة:", taskTitle);
    var newTaskTime = new Date().toLocaleTimeString()

    if (newTaskTitle !== null && newTaskTitle.trim() !== "") {
        taskTitleElement.textContent = newTaskTitle;
        taskTimeElement.textContent = newTaskTime;

        var task = ToDo_data.find(t => t.id === taskId);
        task.title = newTaskTitle;
        task.time = newTaskTime;
        localStorage.setItem('ToDo_data', JSON.stringify(ToDo_data));
    } else {
        alert("لم يتم تحديث العنوان. يجب إدخال قيمة صالحة.");
    }
}

function deleteButtonClicked(taskId) {
    var taskElement = document.getElementById(taskId);

    var result = confirm("هل أنت متأكد من رغبتك في حذف هذه المهمة؟");

    if (result) {
        taskElement.remove();
        ToDo_data = ToDo_data.filter(t => t.id !== taskId);
        localStorage.setItem('ToDo_data', JSON.stringify(ToDo_data));
        alert("تم حذف المهمة بنجاح !");
    }
}