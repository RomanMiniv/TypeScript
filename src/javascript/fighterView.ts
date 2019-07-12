import View from './view';
import { IFighterData } from './services/fightersService';

class FighterView extends View {
	constructor(fighter: IFighterData, handleClick: (event: any, fighter: IFighterData) => Promise<void>) {
		super();

		this.createFighter(fighter, handleClick);
	}

	createFighter(fighter: IFighterData, handleClick: (event: any, fighter: IFighterData) => Promise<void>) {
		const { _id, name, source } = fighter;
		const nameElement = this.createName(name);
		const imageElement = this.createImage(source);
		const checkboxElement = this.createCheckbox(_id);
		const fighterElement = this.createElement({ tagName: 'div', className: 'fighter' });

		this.element = this.createElement({ tagName: 'div', className: 'fighterWrapper' });

		fighterElement.append(imageElement, nameElement);
		fighterElement.addEventListener('click', (event: any) => handleClick(event, fighter), false);

		this.element.append(fighterElement, checkboxElement);
	}

	createName(name: string) {
		const nameElement = this.createElement({ tagName: 'span', className: 'name' });
		nameElement.innerText = name;

		return nameElement;
	}

	createImage(source: string) {
		const attributes = { src: source };
		const imgElement = this.createElement({
			tagName: 'img',
			className: 'fighter-image',
			attributes
		});

		return imgElement;
	}

	createCheckbox(_id: number | string) {
		const attributes = { name: 'choiceFighter', type: 'checkbox', value: _id };
		const checkboxElement = this.createElement({
			tagName: 'input',
			attributes
		});

		return checkboxElement;
	}
}

export default FighterView;