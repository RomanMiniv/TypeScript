import { IFighterDetails } from './services/fightersService';

function getRandomInt(min: number, max: number): number {
    // range: [min; max]
    max++;
    return (Math.floor(Math.random() * (max - min)) + min);
}

export interface IFighter {
    getHitPower: () => number;
    getBlockPower: () => number;
}

class Fighter implements IFighter {
    private data: IFighterDetails;

    constructor(fighterDetails: IFighterDetails) {
        this.data = { ...fighterDetails };
    }

    getHitPower(): number {
        const criticalHitChance: number = getRandomInt(1, 2);
        const power: number = this.data.attack * criticalHitChance;

        return power;
    }

    getBlockPower(): number {
        const dodgeChance: number = getRandomInt(1, 2);
        const power: number = this.data.defense * dodgeChance;

        return power;
    }
}

export default Fighter;