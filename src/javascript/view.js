class View {
  element;
  
  createElement({ tagName, className = '', attributes = {} }) {
    const element = document.createElement(tagName);

    if (className) {
        element.classList.add(...(className.split(' ')));
    }
    
    Object.keys(attributes).forEach(key => element.setAttribute(key, attributes[key]));

    return element;
  }
}

export default View;
