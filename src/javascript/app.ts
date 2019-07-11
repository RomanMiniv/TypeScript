import FightersView from './fightersView';
import { fighterService } from './services/fightersService';
import Fight from './fight';
import View from './view';
import Swal from 'sweetalert2';

class App {
  game: any;
  fighters: any;
  constructor() {
    this.startApp();

    this.game;
    this.fighters = [];
  }

  static rootElement = document.getElementById('root');

  static startElement = document.getElementById('start');
  static playElement = document.getElementById('play');

  static loadingElement = document.getElementById('loading-overlay');
  static choiceFightersElement = document.getElementById('choiceFighters');

  static fightElement = document.getElementById('fight');

  *gameProcess() {
    this.redrawingScene(App.choiceFightersElement);
    this.choiceFighters();

    yield 1;
    this.redrawingScene(App.fightElement);
    this.fight(this.fighters);

    yield 2;
    // start new game
  }

  nextGameStage = () => {
    const state = this.game.next();

    if (state.done) {
      this.game = this.gameProcess();
    }
  }

  redrawingScene(activeScene: any) {
    const rootSelector = `#${App.rootElement.getAttribute('id')}`;
    const activeSceneSelector = `#${activeScene.getAttribute('id')}`;

    const inactiveScenes:any = document.querySelectorAll(`${rootSelector} > *:not(${activeSceneSelector})`);

    for (let i = 0; i < inactiveScenes.length; i++) {
      inactiveScenes[i].style.display = 'none';
    }

    activeScene.style.display = '';
  }

  startApp() {
    try {
      this.game = this.gameProcess();

      this.redrawingScene(App.startElement);
      App.playElement.addEventListener("click", this.nextGameStage);
    } catch (error) {
      console.warn(error);
      throw error;
    }
  }

  async choiceFighters() {
    try {
      App.loadingElement.style.visibility = 'visible';

      const view = new View();

      const titleElement = view.createElement({
        tagName: 'h2'
      });
      titleElement.textContent = 'Choice fighter';

      const confirmChoiceElement = view.createElement({
        tagName: 'button',
        attributes: { id: 'confirmChoice' }
      });
      confirmChoiceElement.textContent = 'Confirm';

      const fighters = await fighterService.getFighters();
      const fightersView = new FightersView(fighters);
      const fightersElement = fightersView.element;

      App.choiceFightersElement.append(titleElement, fightersElement, confirmChoiceElement);

      const selectedFighters = [];
      confirmChoiceElement.addEventListener("click", async (event) => {
        if (selectedFighters.length !== 2) {
          Swal.fire({
            type: 'info',
            title: 'Choice two fighters!'
          });
          return;
        }

        for (let i = 0; i < selectedFighters.length; i++) {
          const fighter = await fightersView.getFighter(selectedFighters[i]);
          this.fighters.push(fighter);
        }

        this.nextGameStage();
      });

      App.choiceFightersElement.addEventListener("change", (event) => {
        const target:any = event.target;
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

  fight(fighters) {
    const fight = new Fight(fighters);
    fight.start();
  }

}

export default App;