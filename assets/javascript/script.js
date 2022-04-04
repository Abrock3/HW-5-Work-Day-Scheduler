const currentDayEl = document.querySelector("#currentDay")
function setCurrentDay(){
    const today = moment();
    currentDayEl.innerText = today.format("dddd, MMMM Do");
}
setCurrentDay();