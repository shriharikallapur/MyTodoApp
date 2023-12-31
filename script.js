const listContainerDui = document.querySelector('[data-lists-dui]')
const listContainerMui = document.querySelector('[data-lists-mui]')
const mainListFormDui = document.querySelector('[data-mainListForm-dui]');
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

const LOC_STORAGE_LI_KEY = 'task.list';
const LOC_STORAGE_SELECTED_LI_ID_KEY = 'task.selectedIDList'
let mainList = JSON.parse(localStorage.getItem(LOC_STORAGE_LI_KEY)) || [];
let selectedListId = localStorage.getItem(LOC_STORAGE_SELECTED_LI_ID_KEY);

listContainerDui.addEventListener('click', e => {
  e.target.tagName.toLowerCase() === 'li' ? (
    selectedListId = e.target.dataset.listId,
    saveRender()
  ) : ''
})

listContainerMui.addEventListener('click', e => {
  e.target.tagName.toLowerCase() === 'li' ? (
    selectedListId = e.target.dataset.listId,
    saveRender()
  ) : ''
})

tasks.addEventListener('click', e => {
  if(e.target.tagName.toLowerCase() === 'input') {
    const selectedList = mainList.find(list => list.id === selectedListId);
    const selectedTask = selectedList.tasks.find(task => task.id === e.target.id)
    selectedTask.complete = e.target.checked;
    e.target.nextSibling.nextSibling.addEventListener('mousedown', e => e.detail > 1 ? e.preventDefault() : '', false);
    save()
    renderTaskCount(selectedList)
  }
})

deleteListBtn.addEventListener('click', e => {
  mainList = mainList.filter(list => list.id !== selectedListId)
  selectedListId = null
  saveRender()
})

mainListFormDui.addEventListener('submit', e => {
  e.preventDefault();
  const newListItem = addNewListDui.value;
  if(newListItem == null || newListItem === '') return;
  const list = createNewList(newListItem);
  mainList.push(list);
  saveRender()
  document.querySelector('.addNewList').value = '';
});

mainListFormMui.addEventListener('submit', e => {
  e.preventDefault();
  const newListItem = addNewListMui.value;
  if(newListItem == null || newListItem === '') return;
  const list = createNewList(newListItem);
  mainList.push(list);
  saveRender()
  document.querySelector('.addNewList').value = '';
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
  if(selectedListId == null) {
    listViewer.style.display = 'none';
  } else {
    listViewer.style.display = '';
    listName.innerText = selectedList.name
    renderTaskCount(selectedList)
    cleanElement(tasks);
    renderTasks(selectedList)
  }
}

function renderTasks(selectedList) {
  selectedList.tasks.forEach(task => {
    const taskTempElem = document.importNode(tempTask.content, true)
    const checkBox = taskTempElem.querySelector('input');
    checkBox.id = task.id;
    checkBox.checked = task.complete;
    const label = taskTempElem.querySelector('label');
    label.htmlFor = task.id;
    label.append(task.name);
    tasks.appendChild(taskTempElem);
  });
}

function renderTaskCount(selectedList) {
  const inCompleteTask = selectedList.tasks.filter(task => !task.complete).length;
  const taskStr = inCompleteTask === 1 ? 'task' : 'tasks';
  listCount.innerText = `${inCompleteTask} ${taskStr} remaining`
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

document.addEventListener('DOMContentLoaded', function() {
  const burger = document.querySelectorAll('.navbar-burger');
  const menu = document.querySelectorAll('.navbar-menu');
  if (burger.length && menu.length) {
    for (var i = 0; i < burger.length; i++) {
      burger[i].addEventListener('click', function() {
        for (var j = 0; j < menu.length; j++) {
          menu[j].classList.toggle('hidden');
        }
      });
    }
  }

  const close = document.querySelectorAll('.navbar-close');
  const backdrop = document.querySelectorAll('.navbar-backdrop');
  if (close.length) {
    for (var i = 0; i < close.length; i++) {
      close[i].addEventListener('click', function() {
        for (var j = 0; j < menu.length; j++) {
          menu[j].classList.toggle('hidden');
        }
      });
    }
  }

  if (backdrop.length) {
    for (var i = 0; i < backdrop.length; i++) {
      backdrop[i].addEventListener('click', function() {
        for (var j = 0; j < menu.length; j++) {
          menu[j].classList.toggle('hidden');
        }
      });
    }
  }
});