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
    private _data: IFighterDetails;

    public constructor(fighterDetails: IFighterDetails) {
        this._data = { ...fighterDetails };
    }

    public get data() {
        return this._data;
    }

    public getHitPower(): number {
        const criticalHitChance: number = getRandomInt(1, 2);
        const power: number = this._data.attack * criticalHitChance;

        return power;
    }

    public getBlockPower(): number {
        const dodgeChance: number = getRandomInt(1, 2);
        const power: number = this._data.defense * dodgeChance;

        return power;
    }
}

export default Fighter;