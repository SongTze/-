"use strict";

const STORAGE_KEY = "offline-todo-items";
const form = document.querySelector("#todo-form");
const input = document.querySelector("#todo-input");
const list = document.querySelector("#todo-list");
const emptyState = document.querySelector("#empty-state");
const remainingCount = document.querySelector("#remaining-count");

function loadTodos() {
  try {
    const savedTodos = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(savedTodos)
      ? savedTodos.filter(
          (todo) =>
            todo &&
            typeof todo.id === "string" &&
            typeof todo.text === "string" &&
            typeof todo.completed === "boolean",
        )
      : [];
  } catch {
    return [];
  }
}

let todos = loadTodos();

function saveTodos() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch {
    return;
  }
}

function renderTodos() {
  list.replaceChildren();

  todos.forEach((todo) => {
    const item = document.createElement("li");
    item.className = "todo-item";
    if (todo.completed) {
      item.classList.add("is-completed");
    }

    const checkbox = document.createElement("input");
    checkbox.className = "todo-checkbox";
    checkbox.type = "checkbox";
    checkbox.checked = todo.completed;
    checkbox.setAttribute("aria-label", `標記「${todo.text}」為完成`);
    checkbox.addEventListener("change", () => {
      todo.completed = checkbox.checked;
      saveTodos();
      renderTodos();
    });

    const text = document.createElement("span");
    text.className = "todo-text";
    text.textContent = todo.text;

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.type = "button";
    deleteButton.textContent = "刪除";
    deleteButton.setAttribute("aria-label", `刪除「${todo.text}」`);
    deleteButton.addEventListener("click", () => {
      todos = todos.filter((itemToKeep) => itemToKeep.id !== todo.id);
      saveTodos();
      renderTodos();
    });

    item.append(checkbox, text, deleteButton);
    list.append(item);
  });

  const unfinished = todos.filter((todo) => !todo.completed).length;
  remainingCount.textContent = `未完成:${unfinished} 項`;
  emptyState.hidden = todos.length > 0;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) {
    input.value = "";
    return;
  }

  todos.push({
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    text,
    completed: false,
  });
  saveTodos();
  renderTodos();
  form.reset();
  input.focus();
});

renderTodos();