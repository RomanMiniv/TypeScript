function getRandomInt(min, max) {
    // range: [min; max]
    max++;
    return (Math.floor(Math.random() * (max - min)) + min);
}

class Fighter {
    constructor(fighter) {
        this.data = { ...fighter };
    }

    getHitPower() {
        const criticalHitChance = getRandomInt(1, 2);
        const power = this.data.attack * criticalHitChance;
        
        return power;
    }

    getBlockPower() {
        const dodgeChance = getRandomInt(1, 2);
        const power = this.data.defense * dodgeChance;
        
        return power;
    }
}

export default Fighter;