import { createElement } from '../helpers/domHelper';
import { createTasks } from './tasksView';
import { categories } from './common';

export const taskForm = ({ task, services, type }) => {
    const form = createElement({ tagName: 'form', className: 'flex flex-col gap-y-5' });
    const groupInputRadioType = createElement({ tagName: 'div' });
    categories.forEach((category) => {
        const inputWrapper = createElement({ tagName: 'div', className: 'flex gap-x-2' });
        const input = createElement({
            tagName: 'input',
            attributes: {
                type: 'radio',
                id: category.value,
                name: "category",
                value: category.value,
             
            }
        });
        input.checked = category.value === task?.category;
        const label = createElement({ tagName: 'label', attributes: { for: category.value }});
        label.innerHTML = category.value;
        inputWrapper.append(input, label);
        groupInputRadioType.append(inputWrapper);
    })

    const inputName = createElement({ tagName: 'input', className: 'p-2 bg-slate-200', attributes: { type: 'text', name: 'name', placeholder: 'Title', value: task?.name || '' }});
    const inputContent = createElement({ tagName: 'input', className: 'p-2 bg-slate-200', attributes: { type: 'text', name: 'content', placeholder: 'Content', value: task?.content || '' }});
    const inputDate = createElement({ tagName: 'input', className: 'p-2 bg-slate-200', attributes: { type: 'date', name: 'date', value: task?.dates[0] || '' }});
    const inputSubmit = createElement({ tagName: 'input', className: 'p-2 bg-slate-500 text-white', attributes: { type: 'submit', value: type }});
    
    form.append(inputName, groupInputRadioType, inputContent, inputDate, inputSubmit);
    form.addEventListener('submit', (event) => {
        event.preventDefault()
        const formData = new FormData(event.target);
        const data = {};
        formData.forEach((value, key) => (data[key] = value));
        const { name, category, content, date } = data;
        if (type === 'create') services.createTask({ id: Math.random(), name, archived: false, created: Date.now(), category, content, dates: date ? [date] : [] });
        if (type === 'update') services.updateTask(task.id, data);
        createTasks(services);
    });
  
    return form;
}