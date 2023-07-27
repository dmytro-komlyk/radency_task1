import { createElement } from "../../helpers/domHelper";

export const showModal = ({ title, bodyElement, onClose = () => {} }) => {
    const root = getModalContainer();
    const modal = createModal({ title, bodyElement, onClose }); 
    root.append(modal);
    console.log(root)
}
  
const getModalContainer = () => {
    return document.getElementById('root');
}
  
const createModal = ({ title, bodyElement, onClose }) => {
    const layer = createElement({ tagName: 'div', className: 'fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full' , attributes: { id: 'task-modal' }});
    const modalContainer = createElement({ tagName: 'div', className: 'relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white' });
    const header = createHeader(title, onClose);
  
    modalContainer.append(header, bodyElement);
    layer.append(modalContainer);
  
    return layer;
}
  
const createHeader = (title, onClose) => {
    const headerElement = createElement({ tagName: 'div', className: 'flex justify-between mb-4' });
    const titleElement = createElement({ tagName: 'span' });
    const closeButton = createElement({ tagName: 'div' });
    
    titleElement.innerText = title;
    closeButton.innerText = '×';
    
    const close = () => {
      hideModal();
      onClose();
    }
    closeButton.addEventListener('click', close);
    headerElement.append(titleElement, closeButton);
    
    return headerElement;
}
  
const hideModal = () => {
    const modal = document.getElementById('task-modal');
    modal?.remove();
}