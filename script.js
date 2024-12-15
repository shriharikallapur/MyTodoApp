const listContainerDui = document.querySelector('[data-lists-dui]')
const listContainerMui = document.querySelector('[data-lists-mui]')
const mainListFormDui = document.querySelector('[data-mainListForm-dui]')
const mainListFormMui = document.querySelector('[data-mainListForm-mui]');
const addNewListDui = document.querySelector('[data-addNewList-dui]');
const addNewListMui = document.querySelector('[data-addNewList-mui]');
const deleteListBtn = document.querySelector('[data-deleteListBtn]');
const listViewer = document.querySelector('[data-listViewer]');
const listName = document.querySelector('[data-listName]');
const listCount = document.querySelector('[data-listCount]');
const tasks = document.querySelector('[data-tasks]');
const tempTask = document.getElementById('tempTask');
const ListViewForm = document.querySelector('[data-ListViewForm]');
const addNewListView = document.querySelector('[data-addNewListView]');
const day = document.querySelector('[data-day]')
const month = document.querySelector('[data-month]')
const time = document.querySelector('[data-time]')
const date = document.querySelector('[data-date]')
const year = document.querySelector('[data-year]')
const dateContainer = document.querySelector('[data-date-container]')
const dataholderOnclick = document.querySelector('[data-task-data-holder-onclick]')

const LOC_STORAGE_LI_KEY = 'task.list';
let LOC_STORAGE_SELECTED_LI_ID_KEY = 'task.selectedIDList'
let mainList = JSON.parse(localStorage.getItem(LOC_STORAGE_LI_KEY)) || [];
let selectedListId = localStorage.getItem(LOC_STORAGE_SELECTED_LI_ID_KEY);

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

const months = ["January","February","March","April","May","June","July","August","September","October","November","December"]

function timer() {
  let currentTime = new Date()
  const hours = currentTime.getHours().toString().length === 1 ? 
  `0${currentTime.getHours()}` : 
  `${currentTime.getHours()}`
  
  const minute = currentTime.getMinutes().toString().length === 1 ? 
  `0${currentTime.getMinutes()}` : 
  `${currentTime.getMinutes()}`
  
  const second = currentTime.getSeconds().toString().length === 1 ?
  `0${currentTime.getSeconds()}` :
  `${currentTime.getSeconds()}`
   
  time.textContent = `${hours}:${minute}:${second}`
  day.textContent = days[currentTime.getDay()]
  month.textContent = months[currentTime.getMonth()]
  date.textContent = currentTime.getDate()
  dateContainer.style.backgroundColor = '#e0e0e0'
  year.textContent = currentTime.getFullYear()
}

const myInterval = setInterval(timer, 1000);

listContainerDui.addEventListener('click', e => {
  if(e.target.tagName.toLowerCase() === 'li') {
    selectedListId = e.target.dataset.listId
    saveRender()
    renderCompletedTask(mainList.find(list => list.id === selectedListId))
    location.reload()
  }
})

listContainerMui.addEventListener('click', e => {
  if(e.target.tagName.toLowerCase() === 'li'){
    selectedListId = e.target.dataset.listId
    saveRender()
    renderCompletedTask(mainList.find(list => list.id === selectedListId))
    document.querySelector('.navbar-menu').classList.add('hidden')
    location.reload()
  }
})

tasks.addEventListener('click', e => {
  if(e.target.tagName.toLowerCase() === 'input') {
    for(let i=0; i<e.target.classList.length; i++) {
      if(i === 'taskNameDisplay') {
        const selectedList = mainList.find(list => list.id === selectedListId);
        const selectedTask = selectedList.tasks.find(task => task.id === e.target.id)
        selectedTask.complete = e.target.checked;
        e.target.nextSibling.nextSibling.addEventListener('mousedown', e => e.detail > 1 ? e.preventDefault() : '', false);
        save()
        renderTaskCount(selectedList)
        renderCompletedTask(selectedList)
        location.reload()
      }
    }
  }
})

function renderCompletedTask(selectedList) {
  if(selectedList) {
    const completedTask = selectedList ? selectedList.tasks.filter(task => task.complete) : '';
    if(completedTask.length > 0) {
      let completedTaskName = ``
      for (const item of completedTask) {
        completedTaskName += `<p id='${item['id']}' class='p-[1rem] text-xl border-b-2'>${item['name']}</p>`
      }
      document.querySelector('[data-completed-tasks]').innerHTML = completedTaskName
    }
  }
}

deleteListBtn.addEventListener('click', e => {
  mainList = mainList.filter(list => list.id !== selectedListId)
  selectedListId = null
  saveRender()
  mainSelection()
})

mainListFormDui.addEventListener('submit', e => {
  e.preventDefault();
  let newListItem = addNewListDui.value;
  if(newListItem == null || newListItem === '') return;
  const list = createNewList(newListItem);
  mainList.push(list);
  saveRender()
  document.querySelector('.addNewList').value = ''
  mainSelection()
});

mainListFormMui.addEventListener('submit', e => {
  e.preventDefault();
  const newListItem = addNewListMui.value;
  if(newListItem == null || newListItem === '') return;
  const list = createNewList(newListItem);
  mainList.push(list);
  saveRender()
  document.querySelector('.addNewList').value = ''
  mainSelection()
});

ListViewForm.addEventListener('submit', e => {
  e.preventDefault();
  const newTaskItem = addNewListView.value;
  if(newTaskItem == null || newTaskItem === '') return;
  const task = createTask(newTaskItem);
  addNewListView.value = null;
  const selectedList = mainList.find(list => list.id === selectedListId)
  selectedList.tasks.push(task)
  saveRender()
  document.querySelector('.listViewerFooterAddNewList').value = '';
});

function createTask(name) {
  return {
    id: Date.now().toString(), 
    name: name, 
    complete: false
  }
}

function createNewList(name) {
  return {
    id: Date.now().toString(), 
    name: name, 
    tasks: []
  }
}

function saveRender() {
  save()
  render()
}

function save() {
  localStorage.setItem(LOC_STORAGE_LI_KEY, JSON.stringify(mainList));
  localStorage.setItem(LOC_STORAGE_SELECTED_LI_ID_KEY, selectedListId);
}

function render() {
  cleanElement(listContainerDui);
  cleanElement(listContainerMui);
  renderList()
  const selectedList = mainList.find(list => list.id === selectedListId)
  if(selectedListId == null) listViewer.style.display = 'none'
  else {
    listViewer.style.display = '';
    listName.innerText = selectedList ? selectedList.name : ''
    renderTaskCount(selectedList)
    cleanElement(tasks);
    renderTasks(selectedList)
    renderCompletedTask(selectedList)
  }
}

function renderTasks(selectedList) {
  if(selectedList) {
    const inCompleteTask = selectedList ? selectedList.tasks.filter(task => !task.complete) : '';
    inCompleteTask.forEach(task => {
      const taskTempElem = document.importNode(tempTask.content, true)
      const checkBox = taskTempElem.querySelector('input')
      checkBox.id = task.id
      checkBox.checked = task.complete
      const label = taskTempElem.querySelector('label')
      label.id = task.id
      label.dataset.taskNameLabeled = task.id
      label.append(task.name)
      taskTempElem.querySelector('input.taskNameLabeledInp').id = task.id
      taskTempElem.querySelector('input.taskNameLabeledInp').value = task.name
      // taskTempElem.querySelector('[data-display-date]').id = task.id
      // taskTempElem.querySelector('[data-display-date]').innerText = task.date
      // taskTempElem.querySelector('[data-display-time]').id = task.id
      // taskTempElem.querySelector('[data-display-time]').innerText = task.time
      // taskTempElem.querySelector('[data-display-date-inp]').id = task.id
      // taskTempElem.querySelector('[data-display-date-inp]').value = task.date
      // taskTempElem.querySelector('[data-display-time-inp]').id = task.id
      // taskTempElem.querySelector('[data-display-time-inp]').value = task.time
      taskTempElem.querySelector('div.dropdown').id = task.id
      taskTempElem.querySelector('button.dropbtn').id = task.id
      taskTempElem.querySelector('div.dropdown-content').id = `${task.id}-dropdown-content`
      taskTempElem.querySelector('button.editTaskName').id = task.id
      taskTempElem.querySelector('button.deleteTaskBtn').id = task.id
      tasks.appendChild(taskTempElem)
    })
  }
}

function renderTaskCount(selectedList) {
  const inCompleteTask = selectedList ? selectedList.tasks.filter(task => !task.complete).length : '';
  const completedTask = selectedList ? selectedList.tasks.filter(task => task.complete).length : '';
  const taskStr = inCompleteTask === 1 || completedTask === 1 ? 'task' : 'tasks';
  listCount.innerText = `${inCompleteTask} ${taskStr} remaining`
  document.querySelector('[data-completed-listCount]').innerText = `${completedTask} ${taskStr} Completed`
}

function renderList() {
  mainList.forEach(list => {
    const listElem = document.createElement('li');
    listElem.dataset.listId = list.id;
    listElem.classList.add('sameColorWhite');
    listElem.innerText = list.name;
    if(list.id === selectedListId) listElem.classList.add('activedList');
    var findElem = document.querySelector(".navbar-burger");
    if (window.getComputedStyle(findElem).display === "none") listContainerDui.appendChild(listElem)
    else if(window.getComputedStyle(findElem).display !== "none") listContainerMui.appendChild(listElem)
  });
}

function cleanElement(listItem) {
  while(listItem.firstChild) {
    listItem.removeChild(listItem.firstChild)
  }
}

render()
document.querySelector('.navbar-burger').addEventListener('click', function() {
  document.querySelector('.navbar-menu').classList.remove('hidden')
})

mainSelection()
function mainSelection() {
  if(screen.width >= 1024) {
    listContainerDui.firstChild.classList.add('activedList')
    if(listContainerDui.firstChild.tagName.toLowerCase() === 'li') {
      for(const i of listContainerDui.children) {
        if(i['classList'].length === 2) selectedListId = i.dataset.listId
      }
      saveRender()
    }
  } else {
    listContainerMui.firstChild.classList.add('activedList')
    if(listContainerMui.firstChild.tagName.toLowerCase() === 'li') {
      for(const i of listContainerMui.children) {
        if(i['classList'].length === 2) selectedListId = i.dataset.listId
      }
      saveRender()
    }
  }
}

deleteTaskBtn()
function deleteTaskBtn() {
  const delTaskBtn = document.querySelectorAll('.deleteTaskBtn')
  delTaskBtn.forEach(ele => {
    const tasksList = mainList.find(list => list.id === selectedListId).tasks
    ele.addEventListener('click', e => {
      console.log(tasksList.length, e.target);
      for (let i=0; i<tasksList.length; i++) {
        if(tasksList[i]['id'] === e.target.id) tasksList.splice(i, 1)
      }
      saveRender()
      mainSelection()
      location.reload()
    })
  })
}

openMenu()
function openMenu() {
  const dropbtn = document.querySelectorAll('.dropbtn')
  dropbtn.forEach(e => {
    e.addEventListener('click', el => {
      document.getElementById(`${e.id}-dropdown-content`).classList.toggle('show')
    })
  })
}

edit()
function edit() {
  const editBtn = document.querySelectorAll('.editTaskName')
  const taskNameLabeled = document.querySelectorAll('.taskNameLabeled')
  editBtn.forEach(el => {
    el.addEventListener('click', e => {
      taskNameLabeled.forEach(ele => {
        if(el.id === ele.id) {
          el.parentElement.parentElement.parentElement.parentElement.parentElement.firstElementChild.firstElementChild.classList.add('hidden')
          el.parentElement.parentElement.parentElement.parentElement.parentElement.firstElementChild.lastElementChild.firstElementChild.classList.remove('hidden')
          el.parentElement.parentElement.parentElement.parentElement.parentElement.firstElementChild.lastElementChild.firstElementChild.focus()
          el.parentElement.parentElement.parentElement.parentElement.firstElementChild.firstElementChild.classList.add('hidden')
          el.parentElement.parentElement.parentElement.parentElement.firstElementChild.lastElementChild.classList.remove('hidden')
        }
      })
    })
  })
}

const mainListTask = mainList.find(list => list.id === selectedListId)['tasks']

const renameBtn = document.querySelectorAll('.taskNameLabeledInpForm')
renameBtn.forEach(el => {
  el.addEventListener('submit', e => {
    e.preventDefault()
    for (const itm of mainListTask) {
      if(itm['id'] === e.target.firstElementChild.id) itm['name'] = e.target.firstElementChild.value
    }
    saveRender()
    mainSelection()
    location.reload()
  })
})

const dateFrom = document.querySelectorAll('.taskDateFrom')
dateFrom.forEach(el => {
  el.addEventListener('submit', e => {
    e.preventDefault()
    for (const itm of mainListTask) {
      if(itm['id'] === e.target.firstElementChild.id) itm['date'] = e.target.firstElementChild.value
    }
    saveRender()
    mainSelection()
    location.reload()
  })
})

const timeFrom = document.querySelectorAll('.taskTimeFrom')
timeFrom.forEach(el => {
  el.addEventListener('submit', e => {
    e.preventDefault()
    for (const itm of mainListTask) {
      if(itm['id'] === e.target.firstElementChild.id) itm['time'] = e.target.lastElementChild.value
    }
    saveRender()
    mainSelection()
    location.reload()
  })
})

window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {
    let dropdowns = document.getElementsByClassName("dropdown-content")
    for (let i = 0; i < dropdowns.length; i++) {
      let openDropdown = dropdowns[i]
      if (openDropdown.classList.contains('show')) openDropdown.classList.remove('show')
    }
  }
}

window.onbeforeunload = function notiBro() {
  let currentDate = new Date
  for (const item of mainListTask) {
    if(item['date'] !== undefined) {
      if(Number(item['date'].split('/')[0]) === currentDate.getDate()) {
        if(item['time'] !== undefined) {
          console.log(item['time'].split(':')[1], currentDate.getMinutes());
          if(Number(item['time'].split(':')[0]) === currentDate.getHours()) {
            if(Number(item['time'].split(':')[1]) === currentDate.getMinutes()) {
              if(document.visibilityState === 'hidden') {
                Notification.requestPermission().then(perm => {
                  if(perm === 'granted') {
                    new Notification(`${item['name']} ${item['date']} ${currentDate.getHours()}:${currentDate.getMinutes()}`, {
                      icon: '/favicon.ico'
                    })
                  }
                })
              } else {
                Notification.requestPermission().then(perm => {
                  if(perm === 'granted') {
                    new Notification(`${item['name']} ${item['date']} ${currentDate.getHours()}:${currentDate.getMinutes()}`, {
                      icon: '/favicon.ico'
                    })
                  }
                })
              }
            }
          }
        }
      }
    }
  }
}

// setInterval(notiBro, 1000)
