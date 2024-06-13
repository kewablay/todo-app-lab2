let todos = [];
let currentFilter = "all"; //  track current filter
let currentSortOrder = "asc"; //  track current sort order

function openModal(modalType) {
  document.querySelector(".modal-overlay").classList.remove("hidden");

  if (modalType === "addTodo") {
    document.querySelector(".add-todo-modal").classList.remove("hidden");
    document.querySelector(".update-todo-modal").classList.add("hidden");
  } else {
    document.querySelector(".add-todo-modal").classList.add("hidden");
    document.querySelector(".update-todo-modal").classList.remove("hidden");
  }
}

function closeModal(modalType) {
  if (modalType === "updateTodo") {
    document.querySelector(".update-todo-modal").classList.add("hidden");
  } else {
    document.querySelector(".add-todo-modal").classList.add("hidden");
  }
  document.querySelector(".modal-overlay").classList.add("hidden");
}

// Function to add a new to-do item
function addTodoItem(title, description, dueDate) {
  const todo = {
    id: Date.now(),
    title: title,
    description: description,
    dueDate: new Date(dueDate),
    completed: false,
  };
  todos.push(todo);
  renderTodoList();
}

// Function to update a to-do item
function updateTodoItem(id, title, description, dueDate) {
  const todo = todos.find((t) => t.id === id);
  if (todo) {
    todo.title = title;
    todo.description = description;
    todo.dueDate = new Date(dueDate);
    renderTodoList();
  }
}

// Function to render the to-do list
function renderTodoList() {
  const todoList = document.getElementById("todoList");
  todoList.innerHTML = "";

  let filteredTodos = todos;

  if (currentFilter === "completed") {
    filteredTodos = todos.filter((todo) => todo.completed);
  } else if (currentFilter === "pending") {
    filteredTodos = todos.filter((todo) => !todo.completed);
  }

  // Apply sorting based on currentSortOrder
  filteredTodos.sort((a, b) => {
    return currentSortOrder === "asc"
      ? a.dueDate - b.dueDate
      : b.dueDate - a.dueDate;
  });

  // Create the todo items
  filteredTodos.forEach((todo) => {
    const todoItem = document.createElement("div");
    todoItem.className =
      "todo flex items-start gap-4 bg-gray-50 w-full border border-gray-100 p-4 rounded-lg";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "w-5 h-5 cursor-pointer";
    checkbox.checked = todo.completed;
    checkbox.addEventListener("change", () => {
      todo.completed = checkbox.checked;
      renderTodoList();
    });

    const todoContent = document.createElement("div");
    todoContent.className = "flex flex-col gap-4 w-full";

    const todoTitle = document.createElement("h3");
    todoTitle.className = "w-full font-bold";
    todoTitle.textContent = todo.title;

    const todoDescription = document.createElement("p");
    todoDescription.className = "w-full";
    todoDescription.textContent = todo.description;

    const todoFooter = document.createElement("div");
    todoFooter.className = "flex justify-between items-center w-full gap-3";

    const actions = document.createElement("div");
    actions.className = "actions flex items-center gap-3";

    const updateButton = document.createElement("button");
    updateButton.className =
      "px-4 text-sm py-1.5 rounded-full bg-[#C5F5E166] border border-gray-100 flex items-center gap-2";
    updateButton.innerHTML =
      '<img src="assets/update-icon.png" alt="Update" /> Update';

    // if update todo button clicked
    updateButton.addEventListener("click", () => {
      // Show the modal with current values
      document.getElementById("update-todo-title").value = todo.title;
      document.getElementById("update-todo-description").value =
        todo.description;
      document.getElementById("update-todo-date").value = todo.dueDate
        .toISOString()
        .substring(0, 10); // Date input expects YYYY-MM-DD format
      openModal();

      // Update the to-do item on form submission
      document.getElementById("updateTodoForm").onsubmit = (event) => {
        event.preventDefault();
        updateTodoItem(
          todo.id,
          document.getElementById("update-todo-title").value,
          document.getElementById("update-todo-description").value,
          document.getElementById("update-todo-date").value
        );
        closeModal("updateTodo");
      };
    });

    const deleteButton = document.createElement("button");
    deleteButton.className =
      "px-4 text-sm py-1.5 rounded-full bg-[#F5C5C566] border border-gray-100 flex items-center gap-2";
    deleteButton.innerHTML =
      '<img src="assets/delete-icon.png" alt="Delete" /> Delete';
    deleteButton.addEventListener("click", () => {
      todos = todos.filter((t) => t.id !== todo.id);
      renderTodoList();
    });

    actions.appendChild(updateButton);
    actions.appendChild(deleteButton);

    const todoDate = document.createElement("p");
    todoDate.className = "text-sm";
    todoDate.textContent = todo.dueDate.toLocaleDateString();

    todoFooter.appendChild(actions);
    todoFooter.appendChild(todoDate);

    todoContent.appendChild(todoTitle);
    todoContent.appendChild(todoDescription); // Append the description here
    todoContent.appendChild(todoFooter);

    todoItem.appendChild(checkbox);
    todoItem.appendChild(todoContent);

    todoList.appendChild(todoItem);
  });
}

// Function to filter the to-do list
function filterTodoList(filter) {
  currentFilter = filter;
  renderTodoList();

  // Update filter button styles
  document.querySelectorAll(".filter-button").forEach((button) => {
    if (button.id === filter + "Filter") {
      button.classList.add("bg-black", "text-white");
    } else {
      button.classList.remove("bg-black", "text-white");
    }
  });
}

// Function to sort the to-do list
function sortTodoList(order) {
  currentSortOrder = order;
  renderTodoList();
}

// Function to initialize event listeners
function initializeEventListeners() {
  document
    .getElementById("allFilter")
    .addEventListener("click", () => filterTodoList("all"));
  document
    .getElementById("completedFilter")
    .addEventListener("click", () => filterTodoList("completed"));
  document
    .getElementById("pendingFilter")
    .addEventListener("click", () => filterTodoList("pending"));

  document
    .getElementById("addTodoButton")
    .addEventListener("click", () => openModal("addTodo"));

  document
    .querySelector(".modal-overlay .close-button")
    .addEventListener("click", () => closeModal("addTodo"));
  document
    .querySelector(".modal-overlay .update-close-button")
    .addEventListener("click", () => closeModal("updateTodo"));

  document.getElementById("todoForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const title = document.getElementById("todo-title").value;
    const description = document.getElementById("todo-description").value;
    const dueDate = document.getElementById("todo-date").value;
    addTodoItem(title, description, dueDate);
    closeModal();
  });

  document.getElementById("sort").addEventListener("change", (event) => {
    sortTodoList(event.target.value);
  });
}

// Initialize event listeners on page load
window.addEventListener("DOMContentLoaded", () => {
  initializeEventListeners();
  renderTodoList();
});
