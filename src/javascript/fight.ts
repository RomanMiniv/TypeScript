import View from './view';
import Swal from 'sweetalert2';

class Fight {
    constructor(fighters) {
        this.fighters = fighters;
        this.moveFightersStage = true; // true - fight, false - no actions
        this.stagePlayer = false;   // false(0) - first player, true(1) - second player

        this.fighterElement1;
        this.fighterElement2;
    }

    start() {
        try {
            this.setScene();
            this.fighterElement1.addEventListener('transitionend', () => this.fight());
            this.update();

            const timerId = setInterval(() => {
                this.moveFighters(this.fighterElement1, this.fighterElement2);

                if (this.fighters[0].data.health <= 0 || this.fighters[1].data.health <= 0) {
                    clearInterval(timerId);
                    const winner = !this.fighters[0].data.health ? this.fighters[1] : this.fighters[0];

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

    setScene() {
        const fightersInfo = document.querySelector('.fightersInfo');
        const battleArea = document.querySelector('.battleArea');

        const view = new View();

        this.fighters.forEach((fighter, index) => {
            const value = view.createElement({ tagName: 'span', className: 'value' });

            // set fighter
            const fighterWrapper = view.createElement({ tagName: 'div', className: 'fighter' });

            // set health
            const health = view.createElement({ tagName: 'div', className: 'health' });
            const healthWrapper = view.createElement({ tagName: 'div', className: 'healthWrapper' });
            const healthLine = view.createElement({ tagName: 'div', className: `healthLine healthLine${index + 1}` });
            const HP = view.createElement({ tagName: 'div', className: `HP HP${index + 1}` });

            const valueHealth = value.cloneNode(false);
            healthWrapper.appendChild(healthLine);
            valueHealth.textContent = fighter.data.health;
            HP.textContent = 'health: ';
            HP.appendChild(valueHealth);
            health.append(HP, healthWrapper);

            // set name
            const name = view.createElement({ tagName: 'div', className: 'name' });
            name.textContent = fighter.data.name;

            // set attack
            const attack = view.createElement({ tagName: 'div', className: 'attack' });
            const valueAttack = value.cloneNode(false);
            valueAttack.textContent = fighter.data.attack;
            attack.textContent = 'attack: ';
            attack.appendChild(valueAttack);

            // set defense
            const defense = view.createElement({ tagName: 'div', className: 'defense' });
            const valueDefense = value.cloneNode(false);
            valueDefense.textContent = fighter.data.defense;
            defense.textContent = 'defense: ';
            defense.appendChild(valueDefense);

            fighterWrapper.append(health, name, attack, defense);
            fightersInfo.appendChild(fighterWrapper);

            // set img
            const img = view.createElement({
                tagName: 'img',
                className: `fighter-image fighter${index + 1}`,
                attributes: { src: fighter.data.source }
            });
            battleArea.appendChild(img);
        });

        this.fighterElement1 = document.querySelector(".fighter1");
        this.fighterElement2 = document.querySelector(".fighter2");
    }

    moveFighters(fighterElement1, fighterElement2) {
        fighterElement1.classList.toggle('fighter1Move');
        fighterElement2.classList.toggle('fighter2Move');

        this.moveFightersStage = !this.moveFightersStage;
    }

    update() {
        const fightersHP = [document.querySelector(".HP1 .value"), document.querySelector(".HP2 .value")];
        const fightersHealthLine = [document.querySelector(".healthLine1"), document.querySelector(".healthLine2")];
        
        const healthWrapper = document.querySelector(".healthWrapper");
        const healthWrapperWidth = parseInt(getComputedStyle(healthWrapper).width);
        
        const widthRatio = healthWrapperWidth / 100;

        let currentHealth, calculationHealth;
        
        this.fighters.forEach((fighter, index) => {
            currentHealth = this.fighters[index].data.health;
            calculationHealth = Math.floor((currentHealth / healthWrapperWidth) * 100 * widthRatio);

            fightersHP[index].textContent = currentHealth;
            fightersHealthLine[index].style.width = `${calculationHealth}%`;
        });
    }

    fight() {
        // in turn
        if (this.moveFightersStage) {
            return;
        }

        let powerDifference;

        powerDifference = this.fighters[+this.stagePlayer].getHitPower() - this.fighters[+!this.stagePlayer].getBlockPower();
        if (powerDifference > 0) {
            let healthRemains = this.fighters[+!this.stagePlayer].data.health - powerDifference;
            healthRemains = healthRemains < 0 ? 0 : healthRemains;
            this.fighters[+!this.stagePlayer].data.health = healthRemains;
        }

        this.update();

        this.stagePlayer = !this.stagePlayer;
    }
}

export default Fight;
