const columns = document.querySelectorAll(".tasks");

let tasks = JSON.parse(localStorage.getItem("tasks")) || {
  todo: [],
  progress: [],
  done: []
};

let draggedTaskId = null;
let currentStatus = null;

// 🚀 Inicializar
renderTasks();

// 💾 Salvar
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// 🎨 Renderizar
function renderTasks() {
  ["todo", "progress", "done"].forEach(status => {
    document.getElementById(status).innerHTML = "";
  });

  Object.keys(tasks).forEach(status => {
    tasks[status].forEach(task => {
      const el = createTaskElement(task, status);
      document.getElementById(status).appendChild(el);
    });
  });
}

// 🧱 Criar tarefa
function createTaskElement(task, status) {
  const div = document.createElement("div");
  div.className = "task";

  div.innerHTML = `
    <span>${task.text}</span>
    <div class="actions">
      <button onclick="editTask(${task.id})">✏️</button>
      <button onclick="deleteTask(${task.id})">🗑️</button>
    </div>
  `;

  div.draggable = true;

  div.addEventListener("dragstart", () => {
    draggedTaskId = task.id;
    div.classList.add("dragging");
  });

  div.addEventListener("dragend", () => {
    div.classList.remove("dragging");
  });

  return div;
}

// ➕ Modal
function openModal(status) {
  currentStatus = status;
  document.getElementById("modal").classList.remove("hidden");
}

function closeModal() {
  document.getElementById("modal").classList.add("hidden");
}

// 💾 Salvar tarefa
function saveTask() {
  const input = document.getElementById("taskInput");
  const text = input.value;

  if (!text) return;

  const newTask = {
    id: Date.now(),
    text: text
  };

  tasks[currentStatus].push(newTask);

  saveTasks();
  renderTasks();

  input.value = "";
  closeModal();
}

// ✏️ Editar
function editTask(id) {
  let newText = prompt("Editar tarefa:");
  if (!newText) return;

  Object.keys(tasks).forEach(status => {
    tasks[status].forEach(task => {
      if (task.id === id) {
        task.text = newText;
      }
    });
  });

  saveTasks();
  renderTasks();
}

// 🗑️ Deletar
function deleteTask(id) {
  Object.keys(tasks).forEach(status => {
    tasks[status] = tasks[status].filter(t => t.id !== id);
  });

  saveTasks();
  renderTasks();
}

// 🔄 Drag and Drop
columns.forEach(column => {
  column.addEventListener("dragover", e => {
    e.preventDefault();
  });

  column.addEventListener("drop", () => {
    if (!draggedTaskId) return;

    let movedTask = null;

    Object.keys(tasks).forEach(status => {
      const found = tasks[status].find(t => t.id === draggedTaskId);
      if (found) {
        movedTask = found;
        tasks[status] = tasks[status].filter(t => t.id !== draggedTaskId);
      }
    });

    tasks[column.id].push(movedTask);

    saveTasks();
    renderTasks();
  });
});