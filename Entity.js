const EntityState = {
    HUNTING: 'Hunting',
    WANDERING: 'Wandering',
    FLEEING: 'Fleeing',
    IDLING: 'Idling'
};

class Entity {
    constructor(name, hp, maxHp, level, xp, xpBase, xpExponent, moveSpeed, range, position = { x: 0, y: 0 }) {
        this.name = name || "???";
        this.hp = hp || 0;
        this.maxHp = maxHp || 0;
        this.level = level || 0;
        this.xp = xp || 0;
        this.xpBase = xpBase || 0;
        this.xpExponent = xpExponent || 0;
        this.moveSpeed = moveSpeed || 0;
        this.range = range * 100 || 0;
        this.transform = new Transform(position, { x: 1, y: 1 }, { rot: 0 });
        this.currentState = EntityState.WANDERING;
        this.targetPosition = { x: this.transform.vector2D.position.x, y: this.transform.vector2D.position.y };
        this.distanceTraveled = 0;
        this.size = 10;

        this.break = 60 * 3;
    }

    update() {
        if (this.currentState === EntityState.HUNTING) {
            // TODO: Implement hunting logic
        } else if (this.currentState === EntityState.WANDERING) {
            // Logic for wandering state
            const dx = this.targetPosition.x - this.transform.vector2D.position.x;
            const dy = this.targetPosition.y - this.transform.vector2D.position.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > 1) {
                const speed = this.moveSpeed / 1000 * 16;
                const ratio = speed / distance;
                this.transform.vector2D.position.x += dx * ratio;
                this.transform.vector2D.position.y += dy * ratio;
                this.distanceTraveled += (Math.abs(dx * ratio) + Math.abs(dy * ratio)) / 100;
            } else {
                const newXTarget = this.transform.vector2D.position.x + (Math.random() - 0.5) * this.range;
                const newYTarget = this.transform.vector2D.position.y + (Math.random() - 0.5) * this.range;
                this.setTargetPosition(newXTarget, newYTarget)
                this.currentState = EntityState.IDLING;
            }
        } else if (this.currentState === EntityState.FLEEING) {
            // TODO: Implement fleeing logic
        } else if (this.currentState === EntityState.IDLING) {
            this.break--;
            if (this.break < 0) {
                this.break = Math.random() * 120;
                this.currentState = EntityState.WANDERING;
            }
        }

        // Handle entity direction change smoothly here
        // ...
    }

    changeState(newState) {
        this.currentState = newState;
    }

    setTargetPosition(x, y) {
        this.targetPosition.x = x;
        this.targetPosition.y = y;
    }

    getTotalXP() {
        return this.xpBase * Math.pow(this.xpExponent, this.level);
    }

    getLevel() {
        let totalXP = this.xp;
        let currentLevel = 0;

        while (totalXP >= this.getTotalXP()) {
            totalXP -= this.xpBase * Math.pow(this.xpExponent, currentLevel);
            currentLevel++;
        }

        return currentLevel;
    }

    getDebugInfo() {
        const debugInfo = `Name ${this.name}
Health: ${this.hp} / ${this.maxHp}
Experience: ${this.xp} / ${this.getTotalXP()} (${this.getLevel()})
Position: (${(this.transform.vector2D.position.x / 100).toFixed(2)}, ${(this.transform.vector2D.position.y / 100).toFixed(2)})
Distance Traveled: ${this.distanceTraveled.toFixed(2)}
Target Position: (${this.targetPosition.x.toFixed(2)}, ${this.targetPosition.y.toFixed(2)})
State: ${this.currentState}
`;

        return debugInfo;
    }
}