import View from './view';
import Fighter from './fighter';
import Swal from 'sweetalert2';

class Fight {
    private _fighters: Fighter[];
    private _moveFightersStage: boolean;
    private _stagePlayer: boolean;

    public constructor(fighters: Fighter[]) {
        this._fighters = fighters;
        this._moveFightersStage = true; // true - fight, false - no actions
        this._stagePlayer = false;   // false(0) - first player, true(1) - second player
    }

    static fighterElement1: HTMLImageElement;
    static fighterElement2: HTMLImageElement;

    get fighters (): Fighter[] {
        return this._fighters;
    }

    public start(): void {
        try {
            this.setScene();
            Fight.fighterElement1.addEventListener('transitionend', () => this.fight());
            this.update();

            const timerId = setInterval(() => {
                this.moveFighters(Fight.fighterElement1, Fight.fighterElement2);

                if (this._fighters[0].data.health <= 0 || this._fighters[1].data.health <= 0) {
                    clearInterval(timerId);
                    const winner: Fighter = !this._fighters[0].data.health ? this._fighters[1] : this._fighters[0];

                    Swal.fire({
                        title: `Winner: ${winner.data.name}!`,
                    }).then((result) => {
                        Swal.fire({
                            title: 'Play new game?',
                            showCancelButton: true,
                            cancelButtonColor: '#d33'
                        }).then((result) => {
                            if (result.value) {
                                document.location.reload(false);
                            }
                        })
                    });
                }

            }, 1500);
        } catch (error) {
            console.warn(error);
            throw error;
        }
    }

    private setScene() {
        const fightersInfo = <HTMLDivElement>document.querySelector('.fightersInfo');
        const battleArea = <HTMLDivElement>document.querySelector('.battleArea');

        const view = new View();

        this._fighters.forEach((fighter, index) => {
            const value = <HTMLSpanElement>view.createElement({ tagName: 'span', className: 'value' });

            // set fighter
            const fighterWrapper = <HTMLDivElement>view.createElement({ tagName: 'div', className: 'fighter' });

            // set health
            const health = <HTMLDivElement>view.createElement({ tagName: 'div', className: 'health' });
            const healthWrapper = <HTMLDivElement>view.createElement({ tagName: 'div', className: 'healthWrapper' });
            const healthLine = <HTMLDivElement>view.createElement({ tagName: 'div', className: `healthLine healthLine${index + 1}` });
            const HP = <HTMLDivElement>view.createElement({ tagName: 'div', className: `HP HP${index + 1}` });

            const valueHealth: any = value.cloneNode(false);
            healthWrapper.appendChild(healthLine);
            valueHealth.textContent = fighter.data.health;
            HP.textContent = 'health: ';
            HP.appendChild(valueHealth);
            health.append(HP, healthWrapper);

            // set name
            const name = <HTMLDivElement>view.createElement({ tagName: 'div', className: 'name' });
            name.textContent = fighter.data.name;

            // set attack
            const attack = <HTMLDivElement>view.createElement({ tagName: 'div', className: 'attack' });
            const valueAttack: any = value.cloneNode(false);
            valueAttack.textContent = fighter.data.attack;
            attack.textContent = 'attack: ';
            attack.appendChild(valueAttack);

            // set defense
            const defense = <HTMLDivElement>view.createElement({ tagName: 'div', className: 'defense' });
            const valueDefense: any = value.cloneNode(false);
            valueDefense.textContent = fighter.data.defense;
            defense.textContent = 'defense: ';
            defense.appendChild(valueDefense);

            fighterWrapper.append(health, name, attack, defense);
            fightersInfo.appendChild(fighterWrapper);

            // set img
            const img = <HTMLImageElement>view.createElement({
                tagName: 'img',
                className: `fighter-image fighter${index + 1}`,
                attributes: { src: fighter.data.source }
            });
            battleArea.appendChild(img);
        });

        Fight.fighterElement1 = <HTMLImageElement>document.querySelector(".fighter1");
        Fight.fighterElement2 = <HTMLImageElement>document.querySelector(".fighter2");
    }

    private moveFighters(fighterElement1: HTMLImageElement, fighterElement2: HTMLImageElement) {
        fighterElement1.classList.toggle('fighter1Move');
        fighterElement2.classList.toggle('fighter2Move');

        this._moveFightersStage = !this._moveFightersStage;
    }

    private update() {
        const fightersHP: any[] = [document.querySelector(".HP1 .value"), document.querySelector(".HP2 .value")];
        const fightersHealthLine: any[] = [document.querySelector(".healthLine1"), document.querySelector(".healthLine2")];

        const healthWrapper = <HTMLDivElement>document.querySelector(".healthWrapper");
        const healthWrapperWidth = parseInt(<string>getComputedStyle(healthWrapper).width);

        const widthRatio: number = healthWrapperWidth / 100;

        let currentHealth: number, calculationHealth: number;

        this._fighters.forEach((fighter, index) => {
            currentHealth = this._fighters[index].data.health;
            calculationHealth = Math.floor((currentHealth / healthWrapperWidth) * 100 * widthRatio);

            fightersHP[index].textContent = currentHealth;
            fightersHealthLine[index].style.width = `${calculationHealth}%`;
        });
    }

    private fight() {
        // in turn
        if (this._moveFightersStage) {
            return;
        }

        let powerDifference: number;

        powerDifference = this._fighters[+this._stagePlayer].getHitPower() - this._fighters[+!this._stagePlayer].getBlockPower();
        if (powerDifference > 0) {
            let healthRemains: number = this._fighters[+!this._stagePlayer].data.health - powerDifference;
            healthRemains = healthRemains < 0 ? 0 : healthRemains;
            this._fighters[+!this._stagePlayer].data.health = healthRemains;
        }

        this.update();

        this._stagePlayer = !this._stagePlayer;
    }
}

export default Fight;
