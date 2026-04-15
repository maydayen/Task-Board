let nextTaskId = 1;
let currentColumnId = "todo";
let editingTaskId = null;

const tasks = [];
function createTaskCard(taskObj){
	const li = document.createElement("li");
	li.setAttribute("data-id", taskObj.id);
	li.setAttribute("data-priority", taskObj.priority);
	li.classList.add("task-card");

	const title = document.createElement("h3");
	title.classList.add("task-title");
	title.textContent = taskObj.title;

	const description = document.createElement("p");
	description.classList.add("task-desc");
	description.textContent = taskObj.description;

	const priority = document.createElement("span");
	priority.classList.add("priority-badge");

	const level = taskObj.priority.toLowerCase();
	priority.classList.add("priority-" + level);

	priority.textContent = taskObj.priority;

	const dueDate = document.createElement("p");
	dueDate.classList.add("task-due");
	if (taskObj.dueDate) {
  const date = new Date(taskObj.dueDate);
  dueDate.textContent = "Due: " + date.toLocaleDateString();
	}

	const editButton = document.createElement("button");
	editButton.setAttribute("type", "button");
	editButton.setAttribute("data-action", "edit");
	editButton.setAttribute("data-id", taskObj.id);
	editButton.classList.add("edit-btn");
	editButton.textContent = "Edit";

	const deleteButton = document.createElement("button");
	deleteButton.setAttribute("type", "button");
	deleteButton.setAttribute("data-action", "delete");
	deleteButton.setAttribute("data-id", taskObj.id);
	deleteButton.classList.add("delete-btn");
	deleteButton.textContent = "Delete";

	const moveSelect = document.createElement("select");
	moveSelect.setAttribute("data-action", "move");
	moveSelect.setAttribute("data-id", taskObj.id);
	moveSelect.classList.add("move-select");

	const defaultOption = document.createElement("option");
	defaultOption.value = "";
	defaultOption.textContent = "Move to";
	moveSelect.appendChild(defaultOption);

	/* Only show columns that are NOT the current column */

	if (taskObj.column !== "todo") {
	  const todoOption = document.createElement("option");
	  todoOption.value = "todo";
	  todoOption.textContent = "To Do";
	  moveSelect.appendChild(todoOption);
	}

	if (taskObj.column !== "inprogress") {
	  const inprogressOption = document.createElement("option");
	  inprogressOption.value = "inprogress";
	  inprogressOption.textContent = "In Progress";
	  moveSelect.appendChild(inprogressOption);
	}

	if (taskObj.column !== "done") {
	  const doneOption = document.createElement("option");
	  doneOption.value = "done";
	  doneOption.textContent = "Done";
	  moveSelect.appendChild(doneOption);
	}

	li.appendChild(title);
	li.appendChild(description);

	const meta = document.createElement("div");
	meta.classList.add("task-meta");
	meta.appendChild(priority);
	meta.appendChild(dueDate);

	li.appendChild(meta);
	const actions = document.createElement("div");
	actions.classList.add("task-actions");

	li.appendChild(actions);
	actions.appendChild(editButton);
	actions.appendChild(deleteButton);
	actions.appendChild(moveSelect);

	return li;

}

function addTask(columnId, taskObj){
	const card = createTaskCard(taskObj);

	let list;

	if (columnId === "todo") {
		list = document.getElementById("todoList");
	}
	else if (columnId === "inprogress") {
		list = document.getElementById("inprogressList");
	}
	else {
		list = document.getElementById("doneList");
	}

	list.appendChild(card);

	updateTaskCounter();
}

function deleteTask(taskId){
	const card = document.querySelector('[data-id="' + taskId + '"]');
	
	if (!card) return;

	card.classList.add("fade-out");

	setTimeout(function() {
	  card.remove();

	  const taskIndex = tasks.findIndex(function(t){
	    return t.id === taskId;
	  });

	  if (taskIndex !== -1){
	    tasks.splice(taskIndex, 1);
	  }

	  updateTaskCounter();
	}, 300);

}

function updateTaskCounter(){
  const counter = document.getElementById("taskCounter");
  const totalTasks = document.querySelectorAll(".task-card").length;

  if (totalTasks === 1){
    counter.textContent = "1 Task";
  } else {
    counter.textContent = totalTasks + " Tasks";
  }
}

function editTask(taskId){

	const task = tasks.find(function(t){
		return t.id === taskId;
	});

	if (!task) return;

	editingTaskId = taskId;

	document.getElementById("taskTitle").value = task.title;
	document.getElementById("taskDescription").value = task.description;
	document.getElementById("taskPriority").value = task.priority;
	document.getElementById("taskDueDate").value = task.dueDate;
	document.getElementById("taskModal").classList.remove("hidden");
}

function updateTask(taskId	, updatedData){

	const task = tasks.find(function (t){
		return t.id === taskId;
	});

	if (!task) return;

	task.title = updatedData.title;
	task.description = updatedData.description;
	task.priority = updatedData.priority;
	task.dueDate = updatedData.dueDate;

	const oldCard = document.querySelector(`[data-id="${taskId}"]`);

	if (!oldCard) return;

	const newCard = createTaskCard(task);

	oldCard.replaceWith(newCard);
}

function moveTask(taskId, newColumn){
	const task = tasks.find(function(t){
		return t.id === taskId;
	});

	if (!task) return;

	const oldCard = document.querySelector('[data-id="' + taskId + '"]');
	if (oldCard) {
		oldCard.remove();
	}

	task.column = newColumn;
	addTask(newColumn, task);
}

const modal = document.getElementById("taskModal");

const addButtons = document.querySelectorAll('[data-column]');

addButtons.forEach(function(button){
	button.addEventListener("click", function(){
		currentColumnId = button.getAttribute("data-column");
		editingTaskId = null;
		taskForm.reset();
		modal.classList.remove("hidden");
	});
});

const cancelBtn = document.getElementById("cancelTask");

cancelBtn.addEventListener("click", function(){
	modal.classList.add("hidden");
});

const taskForm = document.getElementById("taskForm");
taskForm.addEventListener("submit", function(event){
  event.preventDefault();

  const titleValue = document.getElementById("taskTitle").value.trim();
  const descriptionValue = document.getElementById("taskDescription").value.trim();
  const priorityValue = document.getElementById("taskPriority").value;
  const dueDateValue = document.getElementById("taskDueDate").value;

  if (titleValue === "" || descriptionValue === "") return;

  if (editingTaskId === null) {
    const taskObj = {
		  id: nextTaskId,
		  title: titleValue,
		  description: descriptionValue,
		  priority: priorityValue,
		  dueDate: dueDateValue,
		  column: currentColumnId
		};

    tasks.push(taskObj);
    addTask(currentColumnId, taskObj);
    nextTaskId++;
  } else {
    updateTask(editingTaskId, {
      title: titleValue,
      description: descriptionValue,
      priority: priorityValue,
      dueDate: dueDateValue
    });
  }

  modal.classList.add("hidden");
  taskForm.reset();
  editingTaskId = null;
});

const todoList = document.getElementById("todoList");
const inprogressList = document.getElementById("inprogressList");
const doneList = document.getElementById("doneList");

[todoList, inprogressList, doneList].forEach(function(list) {
  list.addEventListener("click", function(event) {
    const action = event.target.getAttribute("data-action");
    const idStr = event.target.getAttribute("data-id");

    if (!action || !idStr) return;

    const taskId = parseInt(idStr, 10);

    if (action === "delete") {
      deleteTask(taskId);
    }

    if (action === "edit") {
      editTask(taskId);
    }
  });
});


[todoList, inprogressList, doneList].forEach(function(list) {
  list.addEventListener("dblclick", function(event) {

    if (!event.target.classList.contains("task-title")) return;

    const titleElement = event.target;
    const card = titleElement.closest(".task-card");
    const taskId = parseInt(card.getAttribute("data-id"), 10);

    const input = document.createElement("input");
    input.type = "text";
    input.value = titleElement.textContent;

    titleElement.replaceWith(input);
    input.focus();

    function saveTitle() {
      const newTitle = input.value.trim();
      if (newTitle === "") return;

      const task = tasks.find(function(t) {
        return t.id === taskId;
      });

      if (task) {
        task.title = newTitle;
      }

      const newTitleElement = document.createElement("h3");
      newTitleElement.classList.add("task-title");
      newTitleElement.textContent = newTitle;

      input.replaceWith(newTitleElement);
    }

    input.addEventListener("keydown", function(e) {
      if (e.key === "Enter") {
        saveTitle();
      }
    });

    input.addEventListener("blur", saveTitle);

  });
});

[todoList, inprogressList, doneList].forEach(function(list) {
  list.addEventListener("change", function(event) {

    const action = event.target.getAttribute("data-action");
    const idStr = event.target.getAttribute("data-id");

    if (action !== "move" || !idStr) return;

    const taskId = parseInt(idStr, 10);
    const newColumn = event.target.value;

    if (newColumn === "") return;

    moveTask(taskId, newColumn);
  });
});


const priorityFilter = document.getElementById("priorityFilter");

priorityFilter.addEventListener("change", function() {
  const selectedPriority = priorityFilter.value;
  const allCards = document.querySelectorAll(".task-card");

  allCards.forEach(function(card) {
    const cardPriority = card.getAttribute("data-priority");

    const shouldHide =
      selectedPriority !== "All" && cardPriority !== selectedPriority;

    card.classList.toggle("is-hidden", shouldHide);
  });
});

const clearDoneBtn = document.getElementById("clearDone");

clearDoneBtn.addEventListener("click", function() {
  const doneCards = doneList.querySelectorAll(".task-card");

  doneCards.forEach(function(card, index) {
    setTimeout(function() {
      card.classList.add("fade-out");

      setTimeout(function() {
        const taskId = parseInt(card.getAttribute("data-id"), 10);

        card.remove();

        const taskIndex = tasks.findIndex(function(t) {
          return t.id === taskId;
        });

        if (taskIndex !== -1) {
          tasks.splice(taskIndex, 1);
        }

        updateTaskCounter();
      }, 300);

    }, index * 100);
  });
});

updateTaskCounter();