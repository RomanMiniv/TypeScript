import View from './view';
import FightersView from './fightersView';
import { fighterService, IFighterData } from './services/fightersService';
import Fighter from './fighter';
import Fight from './fight';
import Swal from 'sweetalert2';

class App {
	public _game: any;
	public fighters: Fighter[];

	public constructor() {
		this._game;
		this.fighters = [];

		this.startApp();
	}

	static rootElement = <HTMLDivElement>document.getElementById('root');

	static startElement = <HTMLDivElement>document.getElementById('start');
	static playElement = <HTMLButtonElement>document.getElementById('play');

	static loadingElement = <HTMLDivElement>document.getElementById('loading-overlay');
	static choiceFightersElement = <HTMLDivElement>document.getElementById('choiceFighters');

	static fightElement = <HTMLDivElement>document.getElementById('fight');

	private *gameProcess() {
		this.redrawingScene(App.choiceFightersElement);
		this.choiceFighters();

		yield 1;
		this.redrawingScene(App.fightElement);
		this.fight(this.fighters);

		yield 2;
		// start new game
	}

	private nextGameStage = () => {
		const state = this._game.next();

		if (state.done) {
			this._game = this.gameProcess();
		}
	}

	private redrawingScene(activeScene: HTMLDivElement): void {
		const rootSelector: string = `#${App.rootElement.getAttribute('id')}`;
		const activeSceneSelector: string = `#${activeScene.getAttribute('id')}`;

		const inactiveScenes: any = document.querySelectorAll(`${rootSelector} > *:not(${activeSceneSelector})`);

		for (let i = 0; i < inactiveScenes.length; i++) {
			inactiveScenes[i].style.display = 'none';
		}

		activeScene.style.display = '';
	}

	private startApp(): void {
		try {
			this._game = this.gameProcess();

			this.redrawingScene(App.startElement);
			App.playElement.addEventListener("click", this.nextGameStage);
		} catch (error) {
			console.warn(error);
			throw error;
		}
	}

	private async choiceFighters(): Promise<void> {
		try {
			App.loadingElement.style.visibility = 'visible';

			const view = new View();

			const titleElement = <HTMLHeadingElement>view.createElement({
				tagName: 'h2'
			});
			titleElement.textContent = 'Choice fighter';

			const confirmChoiceElement = <HTMLButtonElement>view.createElement({
				tagName: 'button',
				attributes: { id: 'confirmChoice' }
			});
			confirmChoiceElement.textContent = 'Confirm';

			const fighters: IFighterData[] = await fighterService.getFighters();
			const fightersView = new FightersView(fighters);
			const fightersElement = fightersView.element;

			App.choiceFightersElement.append(titleElement, fightersElement, confirmChoiceElement);

			const selectedFighters: string[] = [];
			confirmChoiceElement.addEventListener("click", async (event: {}) => {
				if (selectedFighters.length !== 2) {
					Swal.fire({
						type: 'info',
						title: 'Choice two fighters!'
					});
					return;
				}

				for (let i = 0; i < selectedFighters.length; i++) {
					const fighter: Fighter = await fightersView.getFighter(selectedFighters[i]);
					this.fighters.push(fighter);
				}

				this.nextGameStage();
			});

			App.choiceFightersElement.addEventListener("change", (event) => {
				const target = <HTMLInputElement>event.target;
				const fighterId = target.value;

				if (target.checked) {
					if (selectedFighters.length === 2) {
						Swal.fire({
							type: 'info',
							title: 'Choice only two fighters!'
						});
						target.checked = false;
						return;
					}

					selectedFighters.push(fighterId);
				} else {
					const index = selectedFighters.indexOf(fighterId);
					selectedFighters.splice(index, 1);
				}
			});

		} catch (error) {
			console.warn(error);
			App.choiceFightersElement.innerText = 'Failed to load data';
		} finally {
			App.loadingElement.style.visibility = 'hidden';
		}
	}

	private fight(fighters: Fighter[]): void {
		const fight = new Fight(fighters);
		fight.start();
	}
}

export default App;