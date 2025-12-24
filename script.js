let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let timerInterval;
let time = 25 * 60;

const taskList = document.getElementById("taskList");
const progressBar = document.getElementById("progressBar");

/* ---------- TASK FUNCTIONS ---------- */
function renderTasks(filter = "all") {
  taskList.innerHTML = "";

  let filtered = tasks.filter(task => {
    if (filter === "completed") return task.completed;
    if (filter === "pending") return !task.completed;
    return true;
  });

  filtered.forEach((task, index) => {
    const li = document.createElement("li");

    li.innerHTML = `
      <span class="${task.completed ? 'completed' : ''}">
        ${task.text} (${task.priority})
      </span>
      <div>
        <button onclick="toggleTask(${index})">✔</button>
        <button onclick="deleteTask(${index})">❌</button>
      </div>
    `;

    taskList.appendChild(li);
  });

  updateProgress();
}

function addTask(e) {
  e.preventDefault();

  const text = taskInput.value;
  const priority = document.getElementById("priority").value;

  tasks.push({ text, priority, completed: false });
  localStorage.setItem("tasks", JSON.stringify(tasks));

  taskInput.value = "";
  renderTasks();
}

function toggleTask(index) {
  tasks[index].completed = !tasks[index].completed;
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}

function filterTasks(type) {
  renderTasks(type);
}

function updateProgress() {
  const completed = tasks.filter(t => t.completed).length;
  const percent = tasks.length === 0 ? 0 : (completed / tasks.length) * 100;
  progressBar.style.width = percent + "%";
}

/* ---------- POMODORO ---------- */
function startTimer() {
  if (timerInterval) return;

  timerInterval = setInterval(() => {
    if (time <= 0) {
      clearInterval(timerInterval);
      alert("Pomodoro complete!");
      return;
    }
    time--;
    updateTimer();
  }, 1000);
}

function resetTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  time = 25 * 60;
  updateTimer();
}

function updateTimer() {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  document.getElementById("timer").innerText =
    `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

/* ---------- THEME ---------- */
const themeToggle = document.getElementById("themeToggle");

// Load saved theme
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  themeToggle.textContent = "☀️"; // Sun for light mode switch
} else {
  themeToggle.textContent = "🌙"; // Moon for dark mode switch
}

// Toggle theme
themeToggle.onclick = () => {
  document.body.classList.toggle("dark");

  if (document.body.classList.contains("dark")) {
    themeToggle.textContent = "🌙"; // show sun when dark
    localStorage.setItem("theme", "dark");
  } else {
    themeToggle.textContent = "☀️"; // show moon when light
    localStorage.setItem("theme", "light");
  }
};


/* ---------- INIT ---------- */
document.getElementById("taskForm").addEventListener("submit", addTask);
renderTasks();
