// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

if (!taskList) {
    taskList = [];
}

// Create a function to generate a unique task id
function generateTaskId() {
    if (!nextId) {
        nextId = 0;
    }
    const id = nextId;
    nextId++;
    localStorage.setItem("nextId", JSON.stringify(nextId));
    return id;
}

// Create a function to create a task card
function createTaskCard(task) {
    const taskCard = $("<div>").addClass("card task-card draggable my-3").attr("data-task-id", task.id);
    const cardHeader = $("<div>").addClass("card-header h4").text(task.title);
    const cardBody = $("<div>").addClass("card-body");
    const cardDescription = $("<p>").addClass("card-text").text(task.description);
    const cardDueDate = $("<p>").addClass("card-text").text(task.dueDate);
    const cardDeleteBtn = $("<button>").addClass("btn btn-danger delete").text("Delete").attr("data-task-id", task.id);
    cardDeleteBtn.on("click", handleDeleteTask);

    if (task.dueDate && task.status !== "done") {
        const now = dayjs();
        const taskDueDate = dayjs(task.dueDate, "DD/MM/YYYY");
    
        if (now.isSame(taskDueDate, "day")) {
          taskCard.addClass("bg-warning text-white");
        } else if (now.isAfter(taskDueDate)) {
          taskCard.addClass("bg-danger text-white");
          cardDeleteBtn.addClass("border-light");
        }
      }

      cardBody.append(cardDescription, cardDueDate, cardDeleteBtn);
      taskCard.append(cardHeader, cardBody);
    
      return taskCard;
}

// Create a function to render the task list and make cards draggable
function renderTaskList() {
    const todoList = $("#todo-cards");
    const inProgressList = $("#in-progress-cards");
    const doneList = $("#done-cards");

    todoList.empty();
    inProgressList.empty();
    doneList.empty();

    for (task of taskList) {
        if (task.status === "to-do") {
          todoList.append(createTaskCard(task));
        } else if (task.status === "in-progress") {
          inProgressList.append(createTaskCard(task));
        } else if (task.status === "done") {
          doneList.append(createTaskCard(task));
        }
    }

    $(".draggable").draggable();
}

// Create a function to handle adding a new task
function handleAddTask(event) {
    event.preventDefault();

    const taskTitle = $("#task-title").val();
    const taskDueDate = $("#task-due-date").val();
    const taskDescription = $("#task-description").val();

    const newTask = {
        id: generateTaskId(),
        title: taskTitle,
        dueDate: taskDueDate,
        description: taskDescription,
        status: "to-do"
    }

    taskList.push(newTask);
    localStorage.setItem("tasks", JSON.stringify(taskList));
    renderTaskList();

    $("#task-title").val("");
    $("#task-due-date").val("");
    $("#task-description").val("");
}

// Create a function to handle deleting a task
function handleDeleteTask(event) {
    const taskId = $(this).attr("data-task-id");

    for (task of taskList) {
        if (task.id == taskId) {
            taskList.splice(taskList.indexOf(task), 1);
        }
    }

    localStorage.setItem("tasks", JSON.stringify(taskList));
    renderTaskList();
}

// Create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    const taskId = ui.draggable[0].attr("data-task-id");
    const newStatus = event.target.id;
    for (task of taskList) {
        if (task.id === taskId) {
            task.status = newStatus;
        }
    }
    localStorage.setItem("tasks", JSON.stringify(taskList));
    renderTaskList();
}

// When the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    renderTaskList(); 
    $("#task-form").on("submit", handleAddTask);

    $(".lane").droppable({
        accept: ".draggable",
        drop: handleDrop
    });

    $("#task-due-date").datepicker({
        changeMonth: true,
        changeYear: true
    });
});
