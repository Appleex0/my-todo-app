const listGroup = document.querySelector(".list-group");
const input = document.querySelector("#addTask");
const addButton = document.querySelector("#addButton");
const error = document.querySelector("#error");
const main = document.querySelector(".main-container");
const btn = document.querySelector("#lightButton");
const headText = document.querySelector(".head-text");
const changeButton = document.querySelector("#lightButton");
const inputChange = document.querySelector("#input");

window.addEventListener("DOMContentLoaded", () => {
  Events();
  loadFromStorage();
});

function Events() {
  addButton.addEventListener("click", addTask);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      addTask();
    }
  });
  lightButton.addEventListener("click", changeColor);
}

function loadFromStorage() {
  let todos = JSON.parse(localStorage.getItem("todos")) || [];

  todos.forEach((text) => {
    const li = document.createElement("li");
    li.className = "li";
    li.textContent = text;

    const span = document.createElement("span");
    span.className = "actions";

    const aDelete = document.createElement("a");
    aDelete.className = "delete";

    const aRename = document.createElement("a");
    aRename.className = "rename";

    const iDelete = document.createElement("i");
    iDelete.className = "fa-solid fa-trash";

    const iRename = document.createElement("i");
    iRename.className = "fa-solid fa-pen-to-square";

    aDelete.appendChild(iDelete);
    aRename.appendChild(iRename);
    span.appendChild(aRename);
    span.appendChild(aDelete);
    li.appendChild(span);
    listGroup.appendChild(li);

    aDelete.addEventListener("click", deleteStorage);
    aRename.addEventListener("click", renameTask);
    selectClass(span)
  });
}

function addTask(e) {
  const cleanInput = input.value.trim();
  let todos = JSON.parse(localStorage.getItem("todos")) || [];
  const alreadyInput = todos.some((todo) => todo === cleanInput);
  if (alreadyInput) {
    errorMessage("This task is already available!");
  } else {
    if (cleanInput.length < 45) {
      if (cleanInput == "" || cleanInput == undefined) {
        errorMessage("Please enter a task!");
      } else {
        addStorage(cleanInput);
        error.innerHTML = "";
        input.value = "";

        const li = document.createElement("li");
        li.className = "li";
        li.textContent = cleanInput;

        const span = document.createElement("span");
        span.className = "actions";

        const aDelete = document.createElement("a");
        aDelete.className = "delete";

        const aRename = document.createElement("a");
        aRename.className = "rename";

        const iDelete = document.createElement("i");
        iDelete.className = "fa-solid fa-trash";

        const iRename = document.createElement("i");
        iRename.className = "fa-solid fa-pen-to-square";

        aDelete.appendChild(iDelete);
        aRename.appendChild(iRename);
        span.appendChild(aRename);
        span.appendChild(aDelete);
        li.appendChild(span);
        listGroup.appendChild(li);

        aDelete.addEventListener("click", deleteStorage);
        aRename.addEventListener("click", renameTask);
        selectClass(span)
        selectClass(li)
      }
    } else {
      errorMessage("Please enter a task with less than 45 characters!");
    }
  }
  e.preventDefault();
}

function errorMessage(msg) {
  error.innerHTML = msg;
  setTimeout(() => (error.innerHTML = ""), 3000);
}

function addStorage(text) {
  let todos = JSON.parse(localStorage.getItem("todos")) || [];
  todos.push(text);
  localStorage.setItem("todos", JSON.stringify(todos));
}

function deleteStorage() {
  const li = this.closest("li");
  const text = li.firstChild.textContent.trim();
  let todos = JSON.parse(localStorage.getItem("todos")) || [];
  todos = todos.filter((todo) => todo !== text);
  localStorage.setItem("todos", JSON.stringify(todos));
  li.remove();
}

function renameTask() {
  const li = this.closest("li");
  const text = li.firstChild.textContent.trim();
  const renameInput = document.createElement("input");
  renameInput.type = "text";
  renameInput.value = text;
  renameInput.className = "renameInput";
  li.firstChild.replaceWith(renameInput);
  renameInput.focus();

  const saveIcon = document.createElement("a");
  const i = document.createElement("i");
  const aRename = this;
  const aDelete = li.querySelector(".delete");
  i.className = "fa-solid fa-floppy-disk";
  saveIcon.appendChild(i);
  aRename.replaceWith(saveIcon);
  aDelete.remove();
  saveIcon.addEventListener("click", function () {
    let lastText = renameInput.value.trim();
    saveIcon.replaceWith(aRename, aDelete);
    li.firstChild.replaceWith(lastText);
    renameInput.remove();
    let todos = JSON.parse(localStorage.getItem("todos"));
    const index = todos.indexOf(text);
    if (index !== -1) {
      todos[index] = lastText;
    }
    localStorage.setItem("todos", JSON.stringify(todos));
  });
  selectClass(renameInput)
}

const themeElements = [main, btn, addButton, headText, inputChange];
function changeColor() {
  themeElements.forEach((el) => el.classList.toggle("dark"));
  if (btn.classList.contains("dark")) {
    btn.innerHTML = `Light Mode`;
  } else {
    btn.innerHTML = `Dark Mode`;
  }
  document.querySelectorAll(".actions, .renameInput, .li").forEach(selectClass);
}

function selectClass(element){
  if (main.classList.contains('dark')){
    element.classList.add('dark')
  }else{
    element.classList.remove('dark')
  }
}
