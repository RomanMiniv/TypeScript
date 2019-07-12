import View from './view';
import { IFighterData } from './services/fightersService';
import { THandleFighterClick } from './fightersView';

class FighterView extends View {
	public constructor(fighter: IFighterData, handleClick: THandleFighterClick) {
		super();
		this.createFighter(fighter, handleClick);
	}

	private createFighter(fighter: IFighterData, handleClick: THandleFighterClick): void {
		const { _id, name, source } = fighter;
		const nameElement = <HTMLSpanElement>this.createName(name);
		const imageElement = <HTMLImageElement>this.createImage(source);
		const checkboxElement = <HTMLInputElement>this.createCheckbox(_id);
		const fighterElement = <HTMLDivElement>this.createElement({ tagName: 'div', className: 'fighter' });

		this.element = <HTMLDivElement>this.createElement({ tagName: 'div', className: 'fighterWrapper' });

		fighterElement.append(imageElement, nameElement);
		fighterElement.addEventListener('click', (event: {}) => handleClick(event, fighter), false);

		this.element.append(fighterElement, checkboxElement);
	}

	private createName(name: string): HTMLElement {
		const nameElement = this.createElement({ tagName: 'span', className: 'name' });
		nameElement.innerText = name;

		return nameElement;
	}

	private createImage(source: string): HTMLElement {
		const attributes = { src: source };
		const imgElement = this.createElement({
			tagName: 'img',
			className: 'fighter-image',
			attributes
		});

		return imgElement;
	}

	private createCheckbox(_id: number | string): HTMLElement {
		const attributes = { name: 'choiceFighter', type: 'checkbox', value: _id };
		const checkboxElement = this.createElement({
			tagName: 'input',
			attributes
		});

		return checkboxElement;
	}
}

export default FighterView;