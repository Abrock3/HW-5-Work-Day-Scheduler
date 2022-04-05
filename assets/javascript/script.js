const currentDayEl = document.querySelector("#currentDay");
const containerEl = document.querySelector(".container");
let savedTasksArray = JSON.parse(
  localStorage.getItem("savedCalendarTasks")
) ?? ["", "", "", "", "", "", "", ""];
let unsavedTasksArray = JSON.parse(
  localStorage.getItem("unsavedCalendarTasks")
) ?? ["", "", "", "", "", "", "", ""];
const today = moment();
function setCurrentDay() {
  currentDayEl.innerText = today.format("dddd, MMMM Do");
}
setCurrentDay();

function createHourLine(i) {
  const rowEl = document.createElement("tr");
  const hour = i > 12 ? i - 12 + ":00 PM" : i + ":00 AM";
  const task = savedTasksArray[i - 9] ?? "";
  const rowNumber = i - 9;
  if (today.format("HH") > i) {
    rowEl.classList.add("bg-secondary");
  } else if (today.format("HH") == i) {
    rowEl.classList.add("bg-warning");
  } else if (today.format("HH") < i) {
    rowEl.classList.add("bg-success");
  }
  rowEl.dataset.rowNumber = rowNumber;
  rowEl.innerHTML =
    `<th class="col-2 col-md-2 col-lg-1 border border-dark p-3">` +
    hour +
    `</th><td contentEditable=true class="col-7 col-md-8 border border-dark p-3 editField" data-content="` +
    task +
    `" data-row-number="` +
    rowNumber +
    `":>` +
    task +
    `</td><td class="col-3 col-lg-1 border border-dark p-3"><i type=button class="fas fa-undo toggle" data-row-number="` +
    rowNumber +
    `"></i><i type=button class="fas fa-save ml-1" data-row-number="` +
    rowNumber +
    `"></i><i type=button class="trash fas fa-trash ml-1" data-row-number="` +
    rowNumber +
    `"></i></td> `;
  containerEl.appendChild(rowEl);
}
for (let i = 9; i < 17; i++) {
  createHourLine(i);
}
containerEl.addEventListener("focusin", (event) => {
  event.stopPropagation();
  const target = event.target;
  if (target.classList.contains("editField")) {
    target.innerText = target.dataset.content;
  }
});
containerEl.addEventListener("focusout", (event) => {
  event.stopPropagation();
  const target = event.target;
  if (
    target.classList.contains("editField") &&
    target.innerText != savedTasksArray[target.dataset.rowNumber]
  ) {
    unsavedTasksArray[target.dataset.rowNumber] = target.innerText;
    target.dataset.content = target.innerText;
    target.innerText = target.innerText + " (unsaved)";
    localStorage.setItem(
      "unsavedCalendarTasks",
      JSON.stringify(unsavedTasksArray)
    );
    target.classList.add("font-italic");
  } else {
    target.classList.remove("font-italic");
  }
});
containerEl.addEventListener("click", (event) => {
  event.stopPropagation();
  const target = event.target;
  const rowNumber = target.dataset.rowNumber;
  const editableField = document.querySelector(
    "td[data-row-number='" + rowNumber + "']"
  );
  if (
    target.classList.contains("fa-save") &&
    editableField.dataset.content != savedTasksArray[rowNumber]
  ) {
    const temp = unsavedTasksArray[rowNumber];
    unsavedTasksArray[rowNumber] = savedTasksArray[rowNumber];
    savedTasksArray[rowNumber] = temp;
    editableField.innerText = editableField.dataset.content;
    localStorage.setItem(
      "unsavedCalendarTasks",
      JSON.stringify(unsavedTasksArray)
    );
    localStorage.setItem("savedCalendarTasks", JSON.stringify(savedTasksArray));
    editableField.classList.remove("font-italic");
    return;
  }
  if (
    target.classList.contains("toggle") &&
    editableField.dataset.content === savedTasksArray[rowNumber]
  ) {
    editableField.dataset.content = unsavedTasksArray[rowNumber];
    editableField.innerText = editableField.dataset.content;
    editableField.classList.add("font-italic");
    editableField.innerText += " (unsaved)";
    return;
  }
  if (
    target.classList.contains("toggle") &&
    editableField.dataset.content === unsavedTasksArray[rowNumber]
  ) {
    editableField.dataset.content = savedTasksArray[rowNumber];
    editableField.innerText = editableField.dataset.content;
    editableField.classList.remove("font-italic");
    return;
  }
  if (target.classList.contains("trash") ) {
    unsavedTasksArray[rowNumber] = editableField.dataset.content;
    editableField.innerText = "";
    editableField.dataset.content = "";
    savedTasksArray[rowNumber] = "";
  }
});
