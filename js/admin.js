const backendURL = "http://localhost:3000";
const token = localStorage.getItem("token");

if (!token) {
  alert("Please login first!");
  window.location.href = "index.html";
}

async function createProject() {
  const name = document.getElementById("projectName").value;
  const description = document.getElementById("projectDescription").value;

  try {
    const res = await fetch(`${backendURL}/projects`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ name, description })
    });
    const data = await res.json();
    alert(data.message || "Project created successfully!");
    loadOptions(); // refresh project dropdown
  } catch (err) {
    alert("Error creating project");
  }
}

async function assignTask() {
  const title = document.getElementById("taskTitle").value;
  const description = document.getElementById("taskDescription").value;
  const assignedTo = document.getElementById("assignedTo").value;
  const projectId = document.getElementById("projectId").value;

  try {
    const res = await fetch(`${backendURL}/projects/${projectId}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ title, description, assignedTo })
    });
    const data = await res.json();
    alert(data.message || "Task assigned successfully!");
  } catch (err) {
    alert("Error assigning task");
  }
}

async function loadOptions() {
  try {
    // Projects
    const projectRes = await fetch(`${backendURL}/projects`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const projects = await projectRes.json();
    const projectSelect = document.getElementById("projectId");
    projectSelect.innerHTML = "";
    projects.forEach(p => {
      const opt = document.createElement("option");
      opt.value = p._id;
      opt.textContent = p.name;
      projectSelect.appendChild(opt);
    });

    // Users
    const userRes = await fetch(`${backendURL}/auth/users`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const users = await userRes.json();
    const userSelect = document.getElementById("assignedTo");
    userSelect.innerHTML = "";
    users.forEach(u => {
      const opt = document.createElement("option");
      opt.value = u._id;
      opt.textContent = u.name;
      userSelect.appendChild(opt);
    });
  } catch (err) {
    alert("Error loading options");
  }
}

document.addEventListener("DOMContentLoaded", loadOptions);
