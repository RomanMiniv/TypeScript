import View from './view';
import FighterView from './fighterView';
import { fighterService, IFighterData, IFighterDetails } from './services/fightersService';
import Fighter from './fighter';
import Swal from 'sweetalert2';

export type THandleFighterClick = (event: {}, fighter: IFighterData) => Promise<void>;

class FightersView extends View {
	private _fightersDetailsMap = new Map();
	public handleClick: THandleFighterClick;

	public constructor(fighters: IFighterData[]) {
		super();

		this.handleClick = this.handleFighterClick.bind(this);
		this.createFighters(fighters);
	}

	private createFighters(fighters: IFighterData[]): void {
		const fighterElements: HTMLElement[] = fighters.map(fighter => {
			const fighterView = new FighterView(fighter, this.handleClick);
			return fighterView.element;
		});

		this.element = <HTMLDivElement>this.createElement({ tagName: 'div', className: 'fighters' });
		this.element.append(...fighterElements);
	}

	private async setFighterDetails(_id: number | string): Promise<void> {
		if (!this._fightersDetailsMap.has(_id)) {
			const fighterDetails: IFighterDetails = await fighterService.getFighterDetails(_id);
			this._fightersDetailsMap.set(_id, fighterDetails);
		}
	}

	public async handleFighterClick(event: {}, fighter: IFighterData): Promise<void> {
		await this.setFighterDetails(fighter._id);

		const currentFighter = this._fightersDetailsMap.get(fighter._id);

		const MAX_VALUE: number = 100;
		Swal.fire({
			type: 'info',
			title: 'Fighter settings',
			html: `<div class="setupArea">
              <form class='settings'>
                <div>
                  <p>Name: ${currentFighter.name}</p>
                </div>
                <div>
                  <label>
                    <span>Health</span>
                    <input name='health' type='number' min='1' max='${MAX_VALUE}' value='${currentFighter.health}'>
                  </label>
                </div>
                <div>
                    <label>
                      <span>Attack</span>
                      <input name='attack' type='number' min='1' max='${MAX_VALUE}' value='${currentFighter.attack}'>
                    </label>
                  </div>
                  <div>
                      <label>
                        <span>Defense</span>
                        <input name='defense' type='number' min='1' max='${MAX_VALUE}' value='${currentFighter.defense}'>
                      </label>
                    </div>
              </form>
            </div>`
		}).then((result) => {
			if (result.value) {
				const form = <HTMLFormElement>document.querySelector('.settings');

				for (let i = 0; i < form.elements.length; i++) {
					const property = <HTMLInputElement>form.elements[i];
					currentFighter[property.name] = +property.value > MAX_VALUE ? MAX_VALUE : property.value;
				}

				this._fightersDetailsMap.set(currentFighter._id, currentFighter);
			}
		});
	}

	public async getFighter(_id: number | string): Promise<Fighter> {
		await this.setFighterDetails(_id);
		const fighterDetails: IFighterDetails = this._fightersDetailsMap.get(_id);

		return new Fighter(fighterDetails);
	}
}

export default FightersView;