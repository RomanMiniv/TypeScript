import View from './view';
import FighterView from './fighterView';
import { fighterService } from './services/fightersService';
import Fighter from './fighter'; 
import Swal from 'sweetalert2';

class FightersView extends View {
  constructor(fighters) {
    super();
    
    this.handleClick = this.handleFighterClick.bind(this);
    this.createFighters(fighters);
  }

  fightersDetailsMap = new Map();

  createFighters(fighters) {
    const fighterElements = fighters.map(fighter => {
      const fighterView = new FighterView(fighter, this.handleClick);
      return fighterView.element;
    });

    this.element = this.createElement({ tagName: 'div', className: 'fighters' });
    this.element.append(...fighterElements);
  }

  async setFighterDetails(_id) {
    if (!this.fightersDetailsMap.has(_id)) {
      const fighterDetails = await fighterService.getFighterDetails(_id);
      this.fightersDetailsMap.set(_id, fighterDetails);
    }
  }

  async handleFighterClick(event, fighter) {
    await this.setFighterDetails(fighter._id);

    const currentFighter = this.fightersDetailsMap.get(fighter._id);
    
    const MAX_VALUE = 100;
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
        const form = document.querySelector('.settings');

        for (let i = 0; i < form.elements.length; i++) {
          const property = form.elements[i];
          currentFighter[property.name] = property.value > MAX_VALUE ? MAX_VALUE : property.value;
        }

        this.fightersDetailsMap.set(currentFighter._id, currentFighter);
      }
    });
  }

  async getFighter(_id) {
    await this.setFighterDetails(_id);
    const fighterDetails = this.fightersDetailsMap.get(_id);
    
    return new Fighter(fighterDetails);
  }
}

export default FightersView;