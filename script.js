let tasks = JSON.parse(localStorage.getItem("tasks")) || {
  todo: [],
  doing: [],
  done: []
};

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Modal
function openModal() {
  document.getElementById("modal").style.display = "block";
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
  document.getElementById("taskInput").value = "";
}

// ESC fecha modal
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeModal();
  }
});

// Adicionar tarefa
function addTask() {
  const input = document.getElementById("taskInput");
  const text = input.value;

  if (!text.trim()) return;

  tasks.todo.push(text);
  saveTasks();
  renderTasks();
  closeModal();
}

// Renderizar tarefas
function renderTasks() {

  ["todo", "doing", "done"].forEach(status => {
    const column = document.getElementById(status);
    column.innerHTML = "";

    if (tasks[status].length === 0) {
      column.innerHTML = "<p style='color:#777'>Sem tarefas</p>";
      return;
    }

    tasks[status].forEach((task, index) => {

      const div = document.createElement("div");
      div.className = "task";
      div.draggable = true;

      div.innerHTML = `
        <span>${task}</span>
        <div class="actions">
          <button onclick="deleteTask('${status}', ${index})">❌</button>
        </div>
      `;

      // Drag start
      div.addEventListener("dragstart", () => {
        div.classList.add("dragging");
        localStorage.setItem("dragTask", JSON.stringify({ status, index }));
      });

      div.addEventListener("dragend", () => {
        div.classList.remove("dragging");
      });

      column.appendChild(div);
    });

    // Drop
    column.addEventListener("dragover", (e) => e.preventDefault());

    column.addEventListener("drop", () => {
      const data = JSON.parse(localStorage.getItem("dragTask"));

      const movedTask = tasks[data.status][data.index];

      tasks[data.status].splice(data.index, 1);
      tasks[status].push(movedTask);

      saveTasks();
      renderTasks();
    });

  });

}

// Deletar
function deleteTask(status, index) {
  tasks[status].splice(index, 1);
  saveTasks();
  renderTasks();
}

// Inicializar
renderTasks();