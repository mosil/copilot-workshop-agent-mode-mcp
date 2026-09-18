const STORAGE_KEY = "todo-list-items";

const form = document.querySelector("#todo-form");
const input = document.querySelector("#todo-input");
const list = document.querySelector("#todo-list");
const emptyState = document.querySelector("#empty-state");
const remainingCount = document.querySelector("#remaining-count");
const clearCompletedButton = document.querySelector("#clear-completed");
const themeToggle = document.querySelector("#theme-toggle");
const themeIcon = document.querySelector("#theme-icon");
const themeLabel = document.querySelector("#theme-label");
const filterButtons = document.querySelectorAll(".filter-button");

let todos = loadTodos();
let currentFilter = "all";

const THEME_STORAGE_KEY = "todo-list-theme";
const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");

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

// 依照手動選擇或作業系統設定套用顏色主題。
function applyTheme() {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  const isDark = savedTheme ? savedTheme === "dark" : systemTheme.matches;

  document.body.classList.toggle("dark-theme", isDark);
  themeIcon.textContent = isDark ? "☀️" : "🌙";
  themeLabel.textContent = isDark ? "淺色模式" : "深色模式";
  themeToggle.setAttribute("aria-pressed", String(isDark));
}

// 取得目前篩選條件下要顯示的待辦事項。
function getVisibleTodos() {
  if (currentFilter === "active") {
    return todos.filter((todo) => !todo.completed);
  }

  if (currentFilter === "completed") {
    return todos.filter((todo) => todo.completed);
  }

  return todos;
}

// 更新篩選按鈕的選取樣式與無資料提示文字。
function updateFilterControls(visibleTodos) {
  filterButtons.forEach((button) => {
    const isActive = button.dataset.filter === currentFilter;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  if (todos.length === 0) {
    emptyState.textContent = "還沒有任何待辦事項,新增一個吧!";
  } else if (visibleTodos.length === 0 && currentFilter === "active") {
    emptyState.textContent = "太棒了!目前沒有未完成事項。";
  } else if (visibleTodos.length === 0 && currentFilter === "completed") {
    emptyState.textContent = "目前沒有已完成事項。";
  }
}

// 產生每筆待辦事項使用的識別碼。
function createTodoId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

// 依照目前資料重新繪製清單與統計數字。
function renderTodos() {
  list.replaceChildren();
  const visibleTodos = getVisibleTodos();

  visibleTodos.forEach((todo) => {
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

  updateFilterControls(visibleTodos);
  emptyState.hidden = visibleTodos.length > 0;
  const remainingTodos = todos.filter((todo) => !todo.completed).length;
  const completedTodos = todos.filter((todo) => todo.completed);
  clearCompletedButton.disabled = completedTodos.length === 0;
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

// 在確認後刪除所有已完成的待辦事項。
function clearCompletedTodos() {
  const hasCompletedTodos = todos.some((todo) => todo.completed);
  if (!hasCompletedTodos || !window.confirm("確定要清除所有已完成事項嗎?")) return;

  todos = todos.filter((todo) => !todo.completed);
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

themeToggle.addEventListener("click", () => {
  const isDark = !document.body.classList.contains("dark-theme");
  localStorage.setItem(THEME_STORAGE_KEY, isDark ? "dark" : "light");
  applyTheme();
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;
    renderTodos();
  });
});

clearCompletedButton.addEventListener("click", clearCompletedTodos);

systemTheme.addEventListener("change", () => {
  if (!localStorage.getItem(THEME_STORAGE_KEY)) {
    applyTheme();
  }
});

applyTheme();
renderTodos();
