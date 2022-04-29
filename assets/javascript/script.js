const currentDayEl = document.querySelector("#currentDay");
const containerEl = document.querySelector(".container-fluid");
let timeout;
let timeInterval;
const firstVisitText =
  "Type your text here, and save once you're done editing!";
// Allows the developer to change the displayed hours if desired.
// Later I may add functionality to let the user modify these and save them in local storage
// Because the savedTasksArray's indices are linked to the hour, and not the number of rows, this should be easy to implement if desired
const firstHour = 0;
const lasthour = 23;
// used the nullish operater to determine if there's already local storage, and if not to generate an empty array for both variables
let savedTasksArray = JSON.parse(
  localStorage.getItem("savedCalendarTasks")
) ?? [
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
];
let unsavedTasksArray = JSON.parse(
  localStorage.getItem("unsavedCalendarTasks")
) ?? [
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
];
// this code deals with a bug from interactions with local storage from previous versions of the site
// previously the 9:00 hour was stored at the 0 index, and the array was only 8 indices long
// this will convert their old arrays into a format that interacts well with the new version
if (savedTasksArray.length < 24) {
  for (let i = 0; i < 9; i++) {
    savedTasksArray.unshift("");
    unsavedTasksArray.unshift("");
  }
  for (let i = 0; i <= 24 - savedTasksArray.length; i++) {
    savedTasksArray.push("");
    unsavedTasksArray.push("");
  }
}
// this variable gets used to set the date in the header; in addition it's used later to determine whether each hour has already passed
const today = moment();
currentDayEl.innerText = today.format("dddd, MMMM Do");

// This function gets called multiple times to create and append the rows of the table
function createHourLine(i) {
  const rowEl = document.createElement("tr");
  let hour = i > 11 ? i - 12 + ":00 PM" : i + ":00 AM";
  if (i === 12) {
    hour = "12:00 PM";
  } else if (i === 0) {
    hour = "12:00 AM";
  }

  let taskText;
  // this if statement will determine if the user has any local storage, and if not will display tutorial text in each field.
  // after the task arrays get stored locally, this will never appear again
  // there is a focusin listener that wipes the tutorial text when that element is focused
  if (JSON.parse(localStorage.getItem("unsavedCalendarTasks") === null)) {
    taskText = firstVisitText;
  } else {
    taskText = savedTasksArray[i];
  }
  if (today.format("HH") > i) {
    rowEl.classList.add("bg-secondary");
  } else if (today.format("HH") == i) {
    rowEl.classList.add("bg-warning");
  } else if (today.format("HH") < i) {
    rowEl.classList.add("bg-success");
  }
  rowEl.classList.add("row-fluid");
  rowEl.dataset.rowNumber = i;
  rowEl.innerHTML =
    `<th class="col-2 col-xl-1 border border-dark p-2 pt-4 align-items-center">` +
    hour +
    `</th><td contentEditable=true class="col-8 col-lg-9 col-xl-10 border border-dark p-3 editField text-break" data-content="` +
    savedTasksArray[i] +
    `" data-row-number="` +
    i +
    `":>` +
    taskText +
    `</td><td class="col-2 col-lg-1 border border-dark p-1 text-center"><i type=button class="fas fa-undo toggle p-2 rounded" data-row-number="` +
    i +
    `"></i><i type=button class="fas fa-save save p-2 rounded" data-row-number="` +
    i +
    `"></i><br><i type=button class="trash fas fa-trash p-2 rounded" data-row-number="` +
    i +
    `"></i></td> `;
  containerEl.appendChild(rowEl);
}

// this for loop executes createHourLine the desired number of times, and passes in the value of i as an argument each time
for (let i = firstHour; i <= lasthour; i++) {
  createHourLine(i);
}

function setLocalStorage() {
  localStorage.setItem(
    "unsavedCalendarTasks",
    JSON.stringify(unsavedTasksArray)
  );
  localStorage.setItem("savedCalendarTasks", JSON.stringify(savedTasksArray));
}

// this eventlistener works on focus to set the editable fields to their correct content (when it's not selected, sometimes more text is added)
containerEl.addEventListener("focusin", (event) => {
  event.stopPropagation();
  const target = event.target;
  if (target.classList.contains("editField")) {
    target.innerText = target.dataset.content;
  }
});

// on focusout, the editable field will check whether the text is different from the "saved" text, and if so will be italicized and
// text will be added to make it clear that it's not saved
containerEl.addEventListener("focusout", (event) => {
  event.stopPropagation();
  const target = event.target;

  if (target.classList.contains("editField")) {
    target.innerText = target.innerText.trim();
  }

  if (
    target.classList.contains("editField") &&
    target.innerText != savedTasksArray[target.dataset.rowNumber]
  ) {
    unsavedTasksArray[target.dataset.rowNumber] = target.innerText;
    target.dataset.content = target.innerText;
    target.innerText = target.innerText + " (not saved yet)";
    setLocalStorage();
    target.classList.add("font-italic");
  } else {
    target.classList.remove("font-italic");
  }
});

// this eventlistener uses event delegation to listen for clicks, the if statements determine what the target is, and
// will save the phrase from the associated row, toggle it between saved and unsaved, or clear it
containerEl.addEventListener("click", (event) => {
  event.stopPropagation();
  const target = event.target;
  const rowNumber = target.dataset.rowNumber;
  const editableField = document.querySelector(
    "td[data-row-number='" + rowNumber + "']"
  );

  //   if an unsaved phrase is displayed, swaps the unsaved and saved array indices of this row, and takes off the italics and the text saying "(unsaved)"
  if (
    target.classList.contains("save") &&
    editableField.dataset.content != savedTasksArray[rowNumber]
  ) {
    const temp = unsavedTasksArray[rowNumber];
    unsavedTasksArray[rowNumber] = savedTasksArray[rowNumber];
    savedTasksArray[rowNumber] = temp;
    editableField.innerText = editableField.dataset.content;
    setLocalStorage();
    editableField.classList.remove("font-italic");
    editableField.innerText += " (Saved!)";
    timeout = setTimeout(function () {
      editableField.innerText = editableField.dataset.content;
    }, 600);
    return;
  }

  //   swaps the "saved" phrase and state on this row to the "unsaved" phrase and state
  if (
    target.classList.contains("toggle") &&
    editableField.dataset.content === savedTasksArray[rowNumber] &&
    unsavedTasksArray[rowNumber] !== ""
  ) {
    editableField.dataset.content = unsavedTasksArray[rowNumber];
    editableField.innerText = editableField.dataset.content;
    editableField.classList.add("font-italic");
    editableField.innerText += " (not saved yet)";
    return;
  }

  //   swaps to the saved phrase and state
  if (
    target.classList.contains("toggle") &&
    editableField.dataset.content === unsavedTasksArray[rowNumber]
  ) {
    editableField.dataset.content = savedTasksArray[rowNumber];
    editableField.innerText = editableField.dataset.content;
    editableField.classList.remove("font-italic");
    return;
  }

  //   puts the "saved" phrase into unsaved storage, then clears the text, content attribute, and savedTasksArray index associated with this row
  if (target.classList.contains("trash")) {
    unsavedTasksArray[rowNumber] = savedTasksArray[rowNumber];
    editableField.innerText = "";
    editableField.dataset.content = "";
    savedTasksArray[rowNumber] = "";
    setLocalStorage();
  }
});

// runs through each row and stores the "saved" phrases in unsaved storage, then clears all "saved" values and text
document.querySelector("#clearAll").addEventListener("click", function () {
  clearTimeout(timeout);
  for (let i = firstHour; i <= lasthour; i++) {
    const editableField = document.querySelector(
      "td[data-row-number='" + i + "']"
    );
    unsavedTasksArray[i] = savedTasksArray[i];
    editableField.innerText = "";
    editableField.dataset.content = "";
    savedTasksArray[i] = editableField.dataset.content;
  }
  setLocalStorage();
});

// runs through each row and displays the "Saved" phrase and state for each, but retains the unsaved version in the unsaved array
document.querySelector("#revertAll").addEventListener("click", function () {
  for (let i = firstHour; i <= lasthour; i++) {
    const editableField = document.querySelector(
      "td[data-row-number='" + i + "']"
    );
    editableField.innerText = savedTasksArray[i];
    editableField.dataset.content = savedTasksArray[i];
    editableField.classList.remove("font-italic");
  }
});

// runs through each row and saves all visible unsaved content to the "saved" array
document.querySelector("#saveAll").addEventListener("click", function () {
  for (let i = firstHour; i <= lasthour; i++) {
    const editableField = document.querySelector(
      "td[data-row-number='" + i + "']"
    );
    if (editableField.dataset.content != savedTasksArray[i]) {
      const temp = unsavedTasksArray[i];
      unsavedTasksArray[i] = savedTasksArray[i];
      savedTasksArray[i] = temp;
      editableField.innerText = savedTasksArray[i];
      editableField.classList.remove("font-italic");
      editableField.innerText += " (Saved!)";
      timeout = setTimeout(function () {
        editableField.innerText = editableField.dataset.content;
      }, 600);
    }
  }
  setLocalStorage();
});
// this code sets nextHour to be the beginning of the next hour; used in the subsequent interval function
let nextHour = moment();
nextHour.set({
  hour: nextHour.hour() + 1,
  minute: 0,
  second: 0,
  millisecond: 0,
});

// this code determines the current hour, retrieves the elements associated with that hour and the last hour, and changes their bootstrap classes
function hourPassing() {
  const thisHourEl = document.querySelector(
    "tr[data-row-number='" + (moment().hour()) + "']"
  );
  const lastHourEl = document.querySelector(
    "tr[data-row-number='" + (moment().hour()-1) + "']"
  );
  thisHourEl.classList.remove("bg-success");
  thisHourEl.classList.add("bg-warning");
  lastHourEl.classList.remove("bg-warning");
  lastHourEl.classList.add("bg-secondary");
  nextHour = moment();
  nextHour.set({
    hour: nextHour.hour() + 1,
    minute: 0,
    second: 0,
    millisecond: 0,
  });
  // at midnight, this for loop will set the bootstrap classes to their proper values
  if (nextHour === 1) {
    for (let i = firstHour; i < lasthour; i++) {
      const rowEl = document.querySelector("tr[data-row-number='" + i + "']");
      rowEl.classList.remove("bg-warning");
      rowEl.classList.remove("bg-secondary");
      rowEl.classList.add("bg-success");
      currentDayEl.innerText = moment().format("dddd, MMMM Do");
    }
  }
}
// This interval determines the amount of time until the next hour, and when the hour passes it calls the hourPassing function
function createInterval() {
  timeInterval = setInterval(hourPassing(), nextHour.diff(moment()) + 1);
}
// this clears timeInterval and calls the hourPassing and createInterval function every time the window regains focus
// this makes sure that the user can't interrupt the interval by tabbing away, especially on mobile
window.addEventListener("focus", function () {
  clearInterval(timeInterval);
  hourPassing();
  createInterval();
});
createInterval();