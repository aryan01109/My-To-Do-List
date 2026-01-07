const API = "http://localhost:5000/tasks";

async function loadTasks() {
  const res = await fetch(API);
  const tasks = await res.json();
  const list = document.getElementById("taskList");
  list.innerHTML = "";

  tasks.forEach(task => {
    const li = document.createElement("li");
    li.textContent = task.text;
    if (task.completed) li.classList.add("completed");

    li.onclick = async () => {
      await fetch(`${API}/${task._id}`, { method: "PUT" });
      loadTasks();
    };

    const del = document.createElement("button");
    del.textContent = "Delete";
    del.className = "delete-btn";
    del.onclick = async (e) => {
      e.stopPropagation();
      await fetch(`${API}/${task._id}`, { method: "DELETE" });
      loadTasks();
    };

    li.appendChild(del);
    list.appendChild(li);
  });
}

async function addTask() {
  const input = document.getElementById("taskInput");
  if (input.value === "") return;

  await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: input.value })
  });

  input.value = "";
  loadTasks();
}
async function loadStats() {
  const res = await fetch("http://localhost:5000/analytics");
  const data = await res.json();

  document.getElementById("daily").innerText = data.daily;
  document.getElementById("weekly").innerText = data.weekly;
  document.getElementById("monthly").innerText = data.monthly;
  document.getElementById("yearly").innerText = data.yearly;
}


loadTasks();
