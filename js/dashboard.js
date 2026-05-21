const backendURL = "http://localhost:3000";
const token = localStorage.getItem("token");

if (!token) {
  alert("Please login first!");
  window.location.href = "index.html";
}

function navigatePage(page) {
  if (page) window.location.href = page;
}

async function loadTasks() {
  try {
    const res = await fetch(`${backendURL}/tasks`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const tasks = await res.json();

    const container = document.getElementById("taskContainer");
    container.innerHTML = "";

    tasks.forEach(task => {
      const card = document.createElement("div");
      card.className = "task-card";

      card.innerHTML = `
        <div class="task-title">${task.title}</div>
        <div class="task-meta">Assigned To: ${task.assignedTo?.name || "Unassigned"}</div>
        <div class="task-meta">Project: ${task.project?.name || "N/A"}</div>
        <div class="task-meta">Status: ${task.status}</div>
        <div class="progress-bar">
          <div class="progress-fill ${task.status === "Pending" ? "progress-pending" :
                                     task.status === "In Progress" ? "progress-inprogress" :
                                     "progress-completed"}"></div>
        </div>
        <button class="complete-btn">Complete</button>
      `;

      card.querySelector(".complete-btn").onclick = async () => {
        try {
          await fetch(`${backendURL}/tasks/${task._id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ status: "Completed" })
          });
          alert("Task completed!");
          loadTasks();
        } catch {
          alert("Error completing task");
        }
      };

      container.appendChild(card);
    });
  } catch {
    alert("Error loading tasks");
  }
}

document.addEventListener("DOMContentLoaded", loadTasks);
