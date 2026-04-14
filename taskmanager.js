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
	priority.textContent = taskObj.priority;

	const dueDate = document.createElement("p");
	dueDate.classList.add("task-due");
	dueDate.textContent = taskObj.dueDate;

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

	li.appendChild(title);
	li.appendChild(description);
	li.appendChild(priority);
	li.appendChild(dueDate);
	li.appendChild(editButton);
	li.appendChild(deleteButton);

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
	const card = document.querySelector(`[data-id="${taskId}"]`);
	
	if (!card) return;

	card.classList.add("fade-out");

	setTimeout(function() {
		card.remove();
	}, 300);

}

function editTask(taskId){

	const task = tasks.find(function(t){
		return t.id === taskId;
	});

	if (!task) return;

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

	const oldCard = document.querySelector(`[data-id="'+ taskId + '"]`);

	if (!oldCard) return;

	const newCard = createTaskCard(task);

	oldCard.replaceWith(newCard);
}

const modal = document.getElementById("taskModal");

const addButtons = document.querySelectorAll('[data-column]');

addButtons.forEach(function(button){
	button.addEventListener("click", function(){
		modal.classList.remove("hidden");
	});
});

const cancelBtn = document.getElementById("cancelTask");

cancelBtn.addEventListener("click", function(){
	modal.classList.add("hidden");
});