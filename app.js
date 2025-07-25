const listGroup = document.querySelector(".list-group");
const input = document.querySelector("#addTask");
const addButton = document.querySelector("#addButton");
const error = document.querySelector("#error");
const body = document.querySelector(".body");
const btn = document.querySelector("#themeChange");
const headText = document.querySelector(".head-text");
const themeChange = document.querySelector("#themeChange");
const inputChange = document.querySelector("#input");
const languageChange = document.querySelector("#languageChange");

window.addEventListener("DOMContentLoaded", () => {
  Events();
  loadFromStorage();
  loadLang();
  loadTheme();
  animationDom(themeChange);
});

function Events() {
  addButton.addEventListener("click", addTask);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      addTask();
    }
  });
  themeChange.addEventListener("click", changeColor);
  languageChange.addEventListener("click", langSelector);
}

function loadFromStorage() {
  let todos = JSON.parse(localStorage.getItem("todos")) || [];

  todos.forEach((text) => {
    const li = document.createElement("li");
    li.className = "li";

    const span = document.createElement("span");
    span.className = "actions";

    const textSpan = document.createElement("span");
    textSpan.className = "li-text";
    textSpan.textContent = text;

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
    li.appendChild(textSpan);
    li.appendChild(span);
    listGroup.appendChild(li);
    animationDom(span);
    animationDom(li);

    aDelete.addEventListener("click", deleteStorage);
    aRename.addEventListener("click", renameTask);
    selectClass(span);
  });
}

function addTask(e) {
  const cleanInput = input.value.trim();
  let todos = JSON.parse(localStorage.getItem("todos")) || [];
  const alreadyInput = todos.some((todo) => todo === cleanInput);
  if (alreadyInput) {
    if (localStorage.getItem("language") === "en") {
      errorMessage("This task is already available!");
    } else {
      errorMessage("Bu görev zaten mevcut!");
    }
  } else {
    if (cleanInput.length < 45) {
      if (cleanInput == "" || cleanInput == undefined) {
        if (localStorage.getItem("language") === "en") {
          errorMessage("Please enter a task!");
        } else {
          errorMessage("Lütfen bir görev girin!");
        }
      } else {
        addStorage(cleanInput);
        error.innerHTML = "";
        input.value = "";

        const li = document.createElement("li");
        li.className = "li";

        const textSpan = document.createElement("span");
        textSpan.className = "li-text";
        textSpan.textContent = cleanInput;

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
        li.appendChild(textSpan);
        li.appendChild(span);
        listGroup.appendChild(li);

        aDelete.addEventListener("click", deleteStorage);
        aRename.addEventListener("click", renameTask);
        selectClass(span);
        selectClass(li);
        selectClass(textSpan);
        animationDom(span);
        animationDom(li);
      }
    } else {
      if (localStorage.getItem("language") === "en") {
        errorMessage("Please enter a task with less than 45 characters!");
      } else {
        errorMessage("Lütfen 45 karakterden az bir görev girin!");
      }
    }
  }
  e.preventDefault();
}

function errorMessage(msg) {
  error.innerHTML = msg;
  setTimeout(() => (error.innerHTML = ""), 5000);
  animationDom(error);
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
  const oldText = li.firstChild.textContent.trim();
  const renameInput = document.createElement("input");
  renameInput.type = "text";
  renameInput.value = oldText;
  renameInput.className = "renameInput";
  li.firstChild.replaceWith(renameInput);
  renameInput.focus();

  const saveIcon = document.createElement("a");
  const i = document.createElement("i");
  i.className = "fa-solid fa-floppy-disk";
  saveIcon.appendChild(i);

  const aRename = this;
  const aDelete = li.querySelector(".delete");
  aRename.replaceWith(saveIcon);
  aDelete.remove();

  saveIcon.addEventListener("click", function () {
    const newText = renameInput.value.trim();

    if (newText === "") {
      const lang = localStorage.getItem("language");
      errorMessage(
        lang === "en" ? "Please enter a task!" : "Lütfen bir görev girin!"
      );
      return;
    }

    if (newText.length > 45) {
      const lang = localStorage.getItem("language");
      errorMessage(
        lang === "en"
          ? "Please enter a task with less than 45 characters!"
          : "Lütfen 45 karakterden az bir görev girin!"
      );
      return;
    }

    if (newText === oldText) {
      li.firstChild.replaceWith(document.createTextNode(oldText));
      renameInput.remove();
      saveIcon.replaceWith(aRename, aDelete);
      return;
    }

    let todos = JSON.parse(localStorage.getItem("todos"));
    const alreadyInput = todos.some((todo) => todo === newText);
    if (alreadyInput) {
      const lang = localStorage.getItem("language");
      errorMessage(
        lang === "en"
          ? "This task is already available!"
          : "Bu görev zaten mevcut!"
      );
      return;
    }

    li.firstChild.replaceWith(document.createTextNode(newText));
    renameInput.remove();
    saveIcon.replaceWith(aRename, aDelete);

    const index = todos.indexOf(oldText);
    if (index !== -1) {
      todos[index] = newText;
      localStorage.setItem("todos", JSON.stringify(todos));
    }
  });

  selectClass(renameInput);
  animationDom(renameInput);
}

const themeElements = [
  body,
  btn,
  addButton,
  headText,
  inputChange,
  languageChange,
];

function changeColor() {
  themeElements.forEach((el) => el.classList.toggle("dark"));
  const currentTheme = localStorage.getItem("theme") || "light";
  let newTheme;
  if (currentTheme === "light") {
    btn.innerHTML = `Light Mode`;
    newTheme = "dark";
  } else {
    btn.innerHTML = `Dark Mode`;
    newTheme = "light";
  }
  localStorage.setItem("theme", newTheme);
  document.querySelectorAll(".actions, .renameInput, .li").forEach(selectClass);
}

function selectClass(element) {
  if (body.classList.contains("dark")) {
    element.classList.add("dark");
  } else {
    element.classList.remove("dark");
  }
}

function loadTheme() {
  const savedTheme = localStorage.getItem("theme") || "light";
  if (savedTheme === "dark") {
    themeElements.forEach((el) => el.classList.add("dark"));
    btn.innerHTML = `Dark Mode`;
  } else {
    btn.innerHTML = `Light Mode`;
    themeElements.forEach((el) => el.classList.remove("dark"));
  }
  document
    .querySelectorAll(".actions, .renameInput, .li, .textSpan")
    .forEach(selectClass);
}

function loadLang() {
  const savedLang = localStorage.getItem("language") || "en";
  if (savedLang === "tr") {
    turkishLanguage();
  } else {
    englishLanguage();
  }
}

function langSelector() {
  const currentLang = localStorage.getItem("language") || "en";
  let newLang;

  if (currentLang === "en") {
    newLang = "tr";
    turkishLanguage();
  } else {
    newLang = "en";
    englishLanguage();
  }
  languageChange.value = newLang;
  localStorage.setItem("language", newLang);
}

const animElements = [languageChange, input, headText, addButton, inputChange];

function turkishLanguage() {
  animElements.forEach((el) => {
    animationDom(el);
  });
  languageChange.innerHTML = "English";
  input.placeholder = "Görev girin...";
  headText.innerHTML = "Yapılacaklar listesi";
  addButton.innerHTML = "Görev Ekle";
}

function englishLanguage() {
  animElements.forEach((el) => {
    animationDom(el);
  });
  languageChange.innerHTML = "Türkçe";
  input.placeholder = "Input task...";
  headText.innerHTML = "Todo App";
  addButton.innerHTML = "Add todo";
}

function animationDom(element) {
  element.classList.add("fade-in");
  setTimeout(() => {
    element.classList.add("show");
  }, 10);
}
