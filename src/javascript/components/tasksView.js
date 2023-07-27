import { createElement } from '../helpers/domHelper';
import { showModal } from './modal/modal';
import { taskForm } from './taskFormView';
import { getLocaleDateFormat, getDateFormat } from '../helpers/getFormat';
import { categories, mapTableHeaders } from './common';


export const createTasks = (services) => {
  const rootElement = document.getElementById('root');
  rootElement.innerHTML = '';
  const wrapper = createElement({ tagName: 'div', className: 'flex flex-col gap-5 px-10 pt-5 my-0 mx-auto' });
  const tasks = services.getTasks();
  const activeTasks = tasks.filter((task) => !task.archived);
  const infoTasks = categories.map((category) => {
    const matchedTasks = tasks.filter((task) => task.category === category.value);
    const { archived, active } = matchedTasks.reduce((acc, task) => {
      if (task.archived) {
        acc.archived += 1
      } else {
        acc.active += 1
      }
      return acc;
    }, { archived: 0, active: 0 });
    return { category: category.value, active, archived }
  });

  const activeTasksTable = createTable({ tasks: activeTasks, headers: mapTableHeaders.active, services, isMain: true });
  const addTaskButton = createElement({ tagName: 'button', className: 'p-2 ml-auto mb-10 rounded bg-slate-500 hover:bg-white text-white hover:p-1.5 hover:text-slate-900 hover:border-solid hover:border-2 hover:border-slate-500' });
  addTaskButton.innerHTML = 'Create Note';
  addTaskButton.addEventListener('click', (event) => {
    const form = taskForm({ services, type: 'create' });
    showModal({ title: 'Create Task', bodyElement: form });
  });
  const allTasksTable = createTable({ tasks: infoTasks, headers: mapTableHeaders.info, services, isMain: false });
  wrapper.append(activeTasksTable, addTaskButton, allTasksTable);
  rootElement.append(wrapper);
}

const createTable = ({ tasks, headers, services, isMain }) => {
  const container = createElement({ tagName: 'table', className: 'table-fixed w-full border-collapse rounded-xl overflow-hidden' });
  const taskListHeader = createTasksListHeader({ values: headers, isActions: isMain });
  const tasksListBody = createElement({ tagName: 'tbody' });
  
  const tasksListBodyItems = tasks.map((task) => createTask({ task, services, isActions: isMain }));
  tasksListBody.append(...tasksListBodyItems);
  container.append(taskListHeader, tasksListBody);
  return container;
}

const createTasksListHeader = ({ values, isActions }) => {
  const listHeaderElement = createElement({ tagName: 'thead', className: 'bg-slate-600 text-white' });
  const tableRowElement = createElement({ tagName: 'tr' });

  for (const value of values) {
    const listHeaderItemElement = createElement({ tagName: 'th', className: 'p-4 border-b-[5px] border-solid border-white' })
    listHeaderItemElement.innerHTML = value;
    tableRowElement.append(listHeaderItemElement);
  }

  if (isActions) {
    const iconsActions = createElement({ tagName: 'th', className: 'p-4 border-b-[5px] border-solid border-white' });
    const div = createElement({ tagName: 'div', className: 'flex justify-end gap-x-2' });
    const iconArchive = createElement({ tagName: 'i', className: 'fa-solid fa-box-archive fa-lg' });
    const iconDelete = createElement({ tagName: 'i', className: 'fa-solid fa-trash fa-lg'})
    div.append(iconArchive, iconDelete);
    iconsActions.append(div);
    tableRowElement.append(iconsActions);
  }

  listHeaderElement.append(tableRowElement);

  return listHeaderElement
}

const createTask = ({ task, services, isActions }) => {
  const { id, archived, ...taskInfo } = task;
  const taskItems = !isActions ? { ...taskInfo, archived } : taskInfo;
  const taskElement = createElement({ tagName: 'tr', className: 'p-4 border-b-[5px] border-solid border-white' });
  const iconInfo = categories.find((category) => category.value === taskInfo.category);

  for (const prop in taskItems) {
    const taskInfoItem = createElement({
        tagName: 'td',
        className: 'p-2 bg-slate-200 truncate'
    });
    switch(prop) {
      case 'name':
        const icon = createElement({ tagName: 'i', className: `${iconInfo.icon} mr-2` });
        taskInfoItem.append(icon, task[prop]);
        break;
      case 'created':
        const convertedDate = getLocaleDateFormat(task[prop], { month: 'long', day: 'numeric', year: 'numeric' })
        taskInfoItem.innerHTML = convertedDate;
        break;
      case 'dates':
        const dates = task[prop].map((date) => date.length ? getDateFormat(date, 'dd/mm/yyyy') : []).flat();
        taskInfoItem.innerHTML = dates.length > 0 ? dates.join(', ') : '';
        break;
      default:
        taskInfoItem.innerHTML = task[prop];
    }

    taskElement.append(taskInfoItem);
  }

  if (isActions) {
    const taskActions = createTaskActions({ id, services });
    taskElement.append(taskActions);
  }

  return taskElement;
}

const createTaskActions = ({ id, services }) => {
  const actionGroupElement = createElement({ tagName: 'td', className: `flex gap-3 p-3 justify-end bg-slate-200` });

  const actionEditElement = createElement({ tagName: 'button' });
  const actionArchiveElemen = createElement({ tagName: 'button' });
  const actionDeleteElement = createElement({ tagName: 'button' });

  const iconEditElement = createElement({ tagName: 'i', className: 'fa-solid fa-pen-to-square fa-lg' });
  const iconArchiveElement = createElement({ tagName: 'i', className: 'fa-solid fa-box-archive fa-lg' });
  const iconDeleteElement = createElement({ tagName: 'i', className: 'fa-solid fa-trash fa-lg'})

  actionEditElement.append(iconEditElement);
  actionArchiveElemen.append(iconArchiveElement);
  actionDeleteElement.append(iconDeleteElement);

  const onEdit = () => {
    const task = services.selectTask(id);
    const form = taskForm({ task, services, type: 'update' });
    showModal({ title: 'Edit Task', bodyElement: form });
  };

  const onDelete = () => {
    services.deleteTask(id);
    createTasks(services);
  };

  const onArchive = () => {
    services.archiveTask(id);
    createTasks(services);
  }

  actionEditElement.addEventListener('click', onEdit, false);
  actionArchiveElemen.addEventListener('click', onArchive, false);
  actionDeleteElement.addEventListener('click', onDelete, false);

  actionGroupElement.append(actionEditElement, actionArchiveElemen, actionDeleteElement);

  return actionGroupElement;
}

