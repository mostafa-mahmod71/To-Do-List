const titleInp = document.getElementById("titleInp") as HTMLInputElement;
const levelInp = document.getElementById("levelInp") as HTMLInputElement;
const dateInp = document.getElementById("dateInp") as HTMLInputElement;
const descInp = document.getElementById("descInp") as HTMLInputElement;
const btnAdd = document.getElementById("btnAdd") as HTMLButtonElement;
const toDoContent = document.getElementById("toDo") as HTMLElement;
const progressContent = document.getElementById("progress") as HTMLElement;
const completedContent = document.getElementById("completed") as HTMLElement;
declare var bootstrap: any;
const todoCounter = document.getElementById("todoCounter") as HTMLElement;
const progressCounter = document.getElementById(
  "progressCounter",
) as HTMLElement;
const completedCounter = document.getElementById(
  "completedCounter",
) as HTMLElement;
const alertV = document.getElementById("alertV") as HTMLElement;

interface task {
  id: number;
  title: string;
  level: "low" | "medium" | "high";
  date: string;
  desc: string;
  status: "toDo" | "progress" | "completed";
  createdAt: number;
}

let allTasks: task[] = JSON.parse(localStorage.getItem("allTasks") || "[]");
let counter: number = JSON.parse(localStorage.getItem("tasksCounter") || "0");

displayTasks();

btnAdd.onclick = () => {
  if (
    titleInp.value.trim() === "" ||
    dateInp.value === "" ||
    descInp.value.trim() === ""
  ) {
    if (titleInp.value.trim() === "") {
      alertV.innerHTML = ` <div class="alert alert-danger" role="alert"> Title Required! </div>`;
    } else if (dateInp.value === "") {
      alertV.innerHTML = ` <div class="alert alert-danger" role="alert"> Date Required! </div>`;
    } else if (descInp.value.trim() === "") {
      alertV.innerHTML = ` <div class="alert alert-danger" role="alert"> description Required! </div>`;
    }
    return;
  }
  const newTask: task = {
    id: ++counter,
    title: titleInp.value,
    level: levelInp.value as "low" | "medium" | "high",
    date: dateInp.value,
    desc: descInp.value,
    status: "toDo",
    createdAt: Date.now(),
  };
  allTasks.push(newTask);
  displayTasks();
  clearForm();

  bootstrap.Modal.getInstance(
    document.getElementById("createTaskModal"),
  ).hide();
  localStorage.setItem("tasksCounter", JSON.stringify(newTask.id));
  alertV.innerHTML = "";
};

function displayTasks(): void {
  toDoContent.innerHTML = "";
  progressContent.innerHTML = "";
  completedContent.innerHTML = "";

  allTasks.forEach((task) => {
    let btnLeft = "";
    let btnRight = "";
    // set btns left & right
    if (task.status === "toDo") {
      btnLeft = `<button onclick="updateStatus(${task.id}, 'progress')" class="btn btn-warning-subtle flex-grow-1 py-2 rounded-3 border-0 text-warning-emphasis fw-bold"><i class="fa-solid fa-play me-2"></i> Start</button>`;
      btnRight = `<button onclick="updateStatus(${task.id}, 'completed')" class="btn btn-success-subtle flex-grow-1 py-2 rounded-3 border-0 text-success-emphasis fw-bold"><i class="fa-solid fa-check me-2"></i> Complete</button>`;
    } else if (task.status === "progress") {
      btnLeft = `<button onclick="updateStatus(${task.id}, 'toDo')" class="btn btn-warning-subtle flex-grow-1 py-2 rounded-3 border-0 text-warning-emphasis fw-bold"><i class="fa-solid fa-arrow-left me-2"></i> To Do</button>`;
      btnRight = `<button onclick="updateStatus(${task.id}, 'completed')" class="btn btn-success-subtle flex-grow-1 py-2 rounded-3 border-0 text-success-emphasis fw-bold"><i class="fa-solid fa-check me-2"></i> Complete</button>`;
    } else if (task.status === "completed") {
      btnLeft = `<button onclick="updateStatus(${task.id}, 'toDo')" class="btn btn-warning-subtle flex-grow-1 py-2 rounded-3 border-0 text-warning-emphasis fw-bold"><i class="fa-solid fa-arrow-left me-2"></i> To Do</button>`;
      btnRight = `<button onclick="updateStatus(${task.id}, 'progress')" class="btn btn-success-subtle flex-grow-1 py-2 rounded-3 border-0 text-success-emphasis fw-bold"><i class="fa-solid fa-play me-2"></i> start</button>`;
    }
    // set card
    let taskCard = ` <div
                    class="container task-card bg-white border rounded-4 py-3 mb-3 shadow-sm text-start"
                    >
                    <div
                        class="d-flex justify-content-between align-items-center mb-2"
                    >
                        <span class="text-muted small fw-semibold">#${task.id}</span>
                        <div class="actions">
                        <!--     edit btn       -->
                        <button onclick="editTask(${task.id})"
                            class="btn btn-link text-secondary p-0 me-2 shadow-none"
                        >
                            <i class="fa-solid fa-pen-to-square"></i>
                        </button>
                        <!--     delete btn       -->

                        <button onclick="deleteTask(${task.id})"
                        class="btn btn-link text-danger p-0 shadow-none">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                        </div>
                    </div>

                    <h5 class="fw-bold mb-1" style="color: #1e293b">${task.title}</h5>
                    <p class="text-muted small mb-3">${task.desc}</p>

                    <div class="d-flex gap-2 mb-3 justify-content-start">
                        <span
                        class="badge bg-light text-primary border rounded-pill px-2 d-flex align-items-center"
                        style="font-size: 11px"
                        >
                        <i
                            class="fa-solid fa-circle me-1"
                            style="font-size: 6px"
                        ></i>
                        ${task.level}
                        </span>
                        <span
                        class="badge bg-danger-subtle text-danger border border-danger-subtle rounded-pill px-2 d-flex align-items-center"
                        style="font-size: 11px"
                        >
                        <i class="fa-solid fa-triangle-exclamation me-1"></i>
                        ${task.status === "toDo" ? "OVERDUE" : task.status === "completed" ? "done" : "WorKing"}
                        </span>
                    </div>

                    <div
                        class="d-flex gap-3 text-muted small mb-3 border-bottom pb-3 justify-content-start"
                    >
                        <span
                        ><i
                            class="fa-regular fa-calendar-days text-danger me-1"
                        ></i>
                        ${task.date}</span
                        >
                        <! --            from time              ----- >
                        <span
                        ><i class="fa-regular fa-clock me-1"></i> ${taskDate(task.createdAt)}</span
                        >
                    </div>
                    <div class="d-flex gap-2 justify-content-start">
                        ${btnLeft}
                        ${btnRight}
                    </div>
                    </div>
    `;
    // show all cards
    if (task.status === "toDo") {
      toDoContent.innerHTML += taskCard;
    } else if (task.status === "progress") {
      progressContent.innerHTML += taskCard;
    } else if (task.status === "completed") {
      completedContent.innerHTML += taskCard;
    }
  });
  //   set & show empty cards
  let emptyContent = `<div class="mt-4 mb-5 emptyCard">
                    <i class="mx-auto h1 d-block fa-solid fa-folder-open"></i>
                    <span class="d-block">no tasks yet</span>
                    <span>click + to add one </span>
                    </div>`;
  if (toDoContent.innerHTML === "") {
    toDoContent.innerHTML = emptyContent;
  }
  if (progressContent.innerHTML === "") {
    progressContent.innerHTML = emptyContent;
  }
  if (completedContent.innerHTML === "") {
    completedContent.innerHTML = emptyContent;
  }
  //   counters tasks
  let tasksCounter: number = 0;
  tasksCounter = allTasks.filter((t) => t.status === "toDo").length;
  todoCounter.innerText = tasksCounter.toString();
  tasksCounter = 0;
  tasksCounter = allTasks.filter((t) => t.status === "progress").length;
  progressCounter.innerText = tasksCounter.toString();
  tasksCounter = 0;
  tasksCounter = allTasks.filter((t) => t.status === "completed").length;
  completedCounter.innerText = tasksCounter.toString();

  localStorage.setItem("allTasks", JSON.stringify(allTasks));
}

function editTask(id: number, stat: string): void {
  let taskEdit: task = allTasks.find((task) => task.id === id)!;

  deleteTask(id);
  //   show modul && add values
  bootstrap.Modal.getInstance(
    document.getElementById("createTaskModal"),
  ).show();

  titleInp.value = taskEdit.title;
  levelInp.value = taskEdit.level;
  dateInp.value = taskEdit.date;
  descInp.value = taskEdit.desc;
}

function deleteTask(id: number): void {
  let index: number = allTasks.findIndex((task) => task.id === id);
  if (index > -1) {
    allTasks.splice(index, 1);
  }

  displayTasks();
}

function clearForm(): void {
  titleInp.value = "";
  dateInp.value = "";
  descInp.value = "";
}

function updateStatus(id: number, stat: task["status"]): void {
  allTasks.find((task) => task.id === id)!.status = stat;
  displayTasks();
}

function taskDate(tDate: number): string {
  let taskDate = new Date(tDate).getTime();
  let now = new Date().getTime();
  let dateInSecc = Math.floor(now - taskDate) / 1000;
  let minute = Math.floor(dateInSecc / 60);
  let houre = Math.floor(minute / 60);
  let dayes = Math.floor(houre / 60);
  if (dateInSecc < 0) return "upcoming";
  if (dateInSecc < 60) return "just now";
  if (minute < 60) return `${minute} m ago`;
  if (houre < 60) return `${houre} h ago`;
  return `${dayes} d ago`;
}
