import View from './view';

class FighterView extends View {
  constructor(fighter, handleClick) {
    super();

    this.createFighter(fighter, handleClick);
  }

  createFighter(fighter, handleClick) {
    const { _id, name, source } = fighter;
    const nameElement = this.createName(name);
    const imageElement = this.createImage(source);
    const checkboxElement = this.createCheckbox(_id);
    const fighterElement = this.createElement({ tagName: 'div', className: 'fighter' });
   
    this.element = this.createElement({ tagName: 'div', className: 'fighterWrapper' });
   
    fighterElement.append(imageElement, nameElement);
    fighterElement.addEventListener('click', event => handleClick(event, fighter), false);

    this.element.append(fighterElement, checkboxElement);
  }

  createName(name) {
    const nameElement = this.createElement({ tagName: 'span', className: 'name' });
    nameElement.innerText = name;

    return nameElement;
  }

  createImage(source) {
    const attributes = { src: source };
    const imgElement = this.createElement({
      tagName: 'img',
      className: 'fighter-image',
      attributes
    });

    return imgElement;
  }

  createCheckbox(_id) {
    const attributes = { name: 'choiceFighter', type: 'checkbox', value: _id };
    const checkboxElement = this.createElement({
      tagName: 'input',
      attributes
    });
    
    return checkboxElement;
  }
}

export default FighterView;