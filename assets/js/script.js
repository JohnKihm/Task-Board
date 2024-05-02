// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

// Create a function to generate a unique task id
function generateTaskId() {
    if (!nextId) {
        nextId = 1;
    }
    const id = nextId;
    nextId++;
    localStorage.setItem("nextId", JSON.stringify(nextId));
    return id;
}

// Create a function to create a task card
function createTaskCard(task) {
    const taskCard = $("<div>").addClass("card project-card draggable my-3").attr("data-task-id", task.id);
    const cardHeader = $("<div>").addClass("card-header h4").text(task.title);
    const cardBody = $("<div>").addClass("card-body");
    const cardDescription = $("<p>").addClass("card-text").text(task.description);
    const cardDueDate = $("<p>").addClass("card-text").text(task.dueDate);
    const cardDeleteBtn = $("<button>").addClass("btn btn-danger delete").text("Delete").attr("data-task-id", task.id);
    cardDeleteBtn.on("click", handleDeleteTask);

    if (project.dueDate && project.status !== "done") {
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

// Todo: create a function to handle adding a new task
function handleAddTask(event){
    event.preventDefault();

    const taskTitle = $("#task-title").val();
    const taskDueDate = $("#task-due-date").val();
    const taskDescription = $("task-description").val();

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
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){

}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {

}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {

});
