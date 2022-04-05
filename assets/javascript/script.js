const currentDayEl = document.querySelector("#currentDay");
const containerEl = document.querySelector(".container");
let timeout;

// used the nullish operater to determine if there's already local storage, and if not to generate an empty array for both variables
let savedTasksArray = JSON.parse(
  localStorage.getItem("savedCalendarTasks")
) ?? ["", "", "", "", "", "", "", ""];
let unsavedTasksArray = JSON.parse(
  localStorage.getItem("unsavedCalendarTasks")
) ?? ["", "", "", "", "", "", "", ""];

// this variable gets used to set the date in the header; in addition it's used later to determine whether each hour has already passed
const today = moment();
currentDayEl.innerText = today.format("dddd, MMMM Do");

// This function gets called multiple times to create and append the rows of the table
function createHourLine(i) {
  const rowEl = document.createElement("tr");
  let hour = i > 11 ? i - 12 + ":00 PM" : i + ":00 AM";
  if (i === 12) {
    hour = "12:00 PM";
  }
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
    `</th><td contentEditable=true class="col-7 col-md-8 border border-dark p-3 editField text-break" data-content="` +
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

// this for loop executes createHourLine 8 times, and passes in the value of i as an argument each time
for (let i = 9; i < 17; i++) {
  createHourLine(i);
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
    localStorage.setItem(
      "unsavedCalendarTasks",
      JSON.stringify(unsavedTasksArray)
    );
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
    editableField.innerText += " (Saved!)";
    setTimeout(function () {
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
    localStorage.setItem(
      "unsavedCalendarTasks",
      JSON.stringify(unsavedTasksArray)
    );
    localStorage.setItem("savedCalendarTasks", JSON.stringify(savedTasksArray));
    localStorage.setItem(
      "unsavedCalendarTasks",
      JSON.stringify(unsavedTasksArray)
    );
    localStorage.setItem("savedCalendarTasks", JSON.stringify(savedTasksArray));
  }
});

// runs through each row and stores the "saved" phrases in unsaved storage, then clears all "saved" values and text
document.querySelector("#clearAll").addEventListener("click", function () {
  for (let i = 0; i < 8; i++) {
    const editableField = document.querySelector(
      "td[data-row-number='" + i + "']"
    );
    unsavedTasksArray[i] = savedTasksArray[i];
    editableField.innerText = "";
    editableField.dataset.content = "";
    savedTasksArray[i] = editableField.dataset.content;
  }
  localStorage.setItem(
    "unsavedCalendarTasks",
    JSON.stringify(unsavedTasksArray)
  );
  localStorage.setItem("savedCalendarTasks", JSON.stringify(savedTasksArray));
  localStorage.setItem(
    "unsavedCalendarTasks",
    JSON.stringify(unsavedTasksArray)
  );
  localStorage.setItem("savedCalendarTasks", JSON.stringify(savedTasksArray));
});

// runs through each row and displays the "Saved" phrase and state for each, but retains the unsaved version in the unsaved array
document.querySelector("#revertAll").addEventListener("click", function () {
  for (let i = 0; i < 8; i++) {
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
  for (let i = 0; i < 8; i++) {
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
      setTimeout(function () {
        editableField.innerText = editableField.dataset.content;
      }, 600);
    }
  }
  localStorage.setItem(
    "unsavedCalendarTasks",
    JSON.stringify(unsavedTasksArray)
  );
  localStorage.setItem("savedCalendarTasks", JSON.stringify(savedTasksArray));
  localStorage.setItem(
    "unsavedCalendarTasks",
    JSON.stringify(unsavedTasksArray)
  );
  localStorage.setItem("savedCalendarTasks", JSON.stringify(savedTasksArray));
});
// this code sets nextHour to be the beginning of the next hour; used in the subsequent interval function
let nextHour = moment();
nextHour.set({
  hour: nextHour.hour() + 1,
  minute: 0,
  second: 0,
  millisecond: 0,
});
// This interval determines the amount of time until the next hour, and when the hour passes it changes the formatting of the <tr> elements using bootstrap classes
setInterval(function () {
  const thisHourEl = document.querySelector(
    "tr[data-row-number='" + (moment().hour() - 9) + "']"
  );
  const nextHourEl = document.querySelector(
    "tr[data-row-number='" + (moment().hour() - 10) + "']"
  );
  thisHourEl.classList.remove("bg-success");
  thisHourEl.classList.add("bg-warning");
  nextHourEl.classList.remove("bg-warning");
  nextHourEl.classList.add("bg-secondary");
  nextHour = moment();
  nextHour.set({
    hour: nextHour.hour() + 1,
    minute: 0,
    second: 0,
    millisecond: 0,
  });
  // at midnight, this for loop will set the bootstrap classes to their proper values
  if (nextHour === 1) {
    for (let i = 0; i < 8; i++) {
      const rowEl = document.querySelector("tr[data-row-number='" + i + "']");
      rowEl.classList.remove("bg-warning");
      rowEl.classList.remove("bg-secondary");
      rowEl.classList.add("bg-success");
    }
  }
}, nextHour.diff(moment()) + 1);
