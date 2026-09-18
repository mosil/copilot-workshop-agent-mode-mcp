const STORAGE_KEY = "todo-list-items";

const form = document.querySelector("#todo-form");
const input = document.querySelector("#todo-input");
const list = document.querySelector("#todo-list");
const emptyState = document.querySelector("#empty-state");
const remainingCount = document.querySelector("#remaining-count");

let todos = loadTodos();

// 從 localStorage 讀取資料,格式不正確時回傳空清單。
function loadTodos() {
  try {
    const savedTodos = localStorage.getItem(STORAGE_KEY);
    const parsedTodos = savedTodos ? JSON.parse(savedTodos) : [];
    return Array.isArray(parsedTodos) ? parsedTodos : [];
  } catch (error) {
    console.warn("讀取待辦事項失敗,將使用空清單。", error);
    return [];
  }
}

// 將目前的待辦事項保存到 localStorage。
function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

// 產生每筆待辦事項使用的識別碼。
function createTodoId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

// 依照目前資料重新繪製清單與統計數字。
function renderTodos() {
  list.replaceChildren();

  todos.forEach((todo) => {
    const item = document.createElement("li");
    item.className = todo.completed ? "todo-item completed" : "todo-item";
    item.dataset.id = todo.id;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.completed;
    checkbox.setAttribute("aria-label", `標記「${todo.text}」為完成`);

    const text = document.createElement("span");
    text.className = "todo-text";
    text.textContent = todo.text;

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "btn-delete";
    deleteButton.textContent = "刪除";
    deleteButton.setAttribute("aria-label", `刪除「${todo.text}」`);

    item.append(checkbox, text, deleteButton);
    list.append(item);
  });

  emptyState.hidden = todos.length > 0;
  const remainingTodos = todos.filter((todo) => !todo.completed).length;
  remainingCount.textContent = `未完成:${remainingTodos} 項`;
}

// 新增一筆待辦事項。
function addTodo(text) {
  todos.push({
    id: createTodoId(),
    text,
    completed: false,
  });
  saveTodos();
  renderTodos();
}

// 切換待辦事項的完成狀態。
function toggleTodo(id) {
  todos = todos.map((todo) => (
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  ));
  saveTodos();
  renderTodos();
}

// 刪除指定的待辦事項。
function deleteTodo(id) {
  todos = todos.filter((todo) => todo.id !== id);
  saveTodos();
  renderTodos();
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const text = input.value.trim();
  if (!text) {
    input.focus();
    return;
  }

  addTodo(text);
  input.value = "";
  input.focus();
});

// 使用事件委派處理動態產生的勾選框與刪除按鈕。
list.addEventListener("click", (event) => {
  const item = event.target.closest(".todo-item");
  if (!item) return;

  if (event.target.matches('input[type="checkbox"]')) {
    toggleTodo(item.dataset.id);
  }

  if (event.target.matches(".btn-delete")) {
    deleteTodo(item.dataset.id);
  }
});

renderTodos();
