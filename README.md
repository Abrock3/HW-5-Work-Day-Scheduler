# HW-5-Workday-Planner

## Description

I was asked to use the following list of acceptance criteria to create a work-day planner and satisfactorily resolve a user story:

```md
GIVEN I am using a daily planner to create a schedule
WHEN I open the planner
THEN the current day is displayed at the top of the calendar
WHEN I scroll down
THEN I am presented with timeblocks for standard business hours
WHEN I view the timeblocks for that day
THEN each timeblock is color coded to indicate whether it is in the past, present, or future
WHEN I click into a timeblock
THEN I can enter an event
WHEN I click the save button for that timeblock
THEN the text for that event is saved in local storage
WHEN I refresh the page
THEN the saved events persist
```

I wrote all code from scratch using my prior knowledge from my class's content, with minimal assistance from googled articles. The javascript dynamically creates table rows using content from locally stored arrays, and uses the event delegation method to make them mimic buttons and input fields so the user can enter, save and revert the tasks in each hour.

A gif was provided to us to demonstrate proper functionality; I tried to mimic the functions in that gif as closely as possible while adding my own style and several new functions.

## Usage

Here's a link to the deployed webpage: https://abrock3.github.io/HW-5-Work-Day-Scheduler/

Below is a screenshot of the page:

![Screenshot](./assets/images/screenshot.jpg?raw=true "Screenshot")

![Screenshot](./assets/images/screenshot2.jpg?raw=true "Screenshot")

## Credits

I used moment to help fetch and parse times.
I used the moment.js documentation and two W3 schools articles to help me implement moment properly.

## Contact Info

Telephone: 727-400-9280
Email: a.paulbrock@gmail.com
linkedin: https://www.linkedin.com/in/adam-p-brock/