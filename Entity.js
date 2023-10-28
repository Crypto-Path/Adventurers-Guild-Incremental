const EntityState = {
    HUNTING: 'Hunting',
    WANDERING: 'Wandering',
    FLEEING: 'Fleeing',
    IDLING: 'Idling'
};

const random = new Random();

class Entity {
    constructor(name, hp, maxHp, level, xp, xpBase, xpExponent, moveSpeed, range, position = { x: 0, y: 0 }, animations = null) {
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
        this.currentAnimation = null;
        this.distanceTraveled = 0;
        this.size = 10;

        this.favorited = false;

        let cycle = Math.random() * 120 * random.HighestRandom(2);

        this.break = cycle;

        this.lifeSpan = 0 - cycle;

        this.traits = {
            pretty: false,
            handsome: false,
            beutiful: false,
            gentleman: false,
            smart: false,
            dumb: false,
            drunkard: false,
            conviction: false,
            lucky: false,
            unlucky: false,
            strong: false,
            weak: false,
        };
    }

    update() {
        this.lifeSpan++;
        if (this.currentState === EntityState.HUNTING) {
            // TODO: Implement hunting logic
        } else if (this.currentState === EntityState.WANDERING) {
            // Logic for wandering state
            const dx = this.targetPosition.x - this.transform.vector2D.position.x;
            const dy = this.targetPosition.y - this.transform.vector2D.position.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > 1) {
                const wiggleAmount = ((this.traits.drunkard) ? Math.ceil(Math.sin(Math.cos((this.lifeSpan / 20) % 10)) - 0.5) : Math.sin(this.lifeSpan / 100)) * 0.5 * distance;
                this.moveToward(dx + wiggleAmount, dy - wiggleAmount, distance);
            } else {

                this.currentState = EntityState.IDLING;
                this.setAnimation("Adventurer-Idle")
            }
        } else if (this.currentState === EntityState.FLEEING) {
            // TODO: Implement fleeing logic
        } else if (this.currentState === EntityState.IDLING) {
            this.break--;
            if (this.break < 0) {
                const newXTarget = this.transform.vector2D.position.x + (Math.random() - 0.5) * 2 * this.range * ((this.traits.adventurous) ? 10 : ((this.traits.coward) ? 0.2 : 1));
                const newYTarget = this.transform.vector2D.position.y + (Math.random() - 0.5) * 2 * this.range * ((this.traits.adventurous) ? 10 : ((this.traits.coward) ? 0.2 : 1));
                this.setTargetPosition(newXTarget, newYTarget)
                let angle = Math.atan2(this.transform.vector2D.position.y - newYTarget, this.transform.vector2D.position.x - newXTarget) * (180 / Math.PI);
                switch (this.transform.getCardinalDirection(angle - 90)) {
                    case "N":
                        this.setAnimation("Adventurer-Walking-Right")
                        break;
                    case "NE":
                        this.setAnimation("Adventurer-Walking-Right")
                        break;
                    case "E":
                        this.setAnimation("Adventurer-Walking-Right")
                        break;
                    case "SE":
                        this.setAnimation("Adventurer-Walking-Right")
                        break;
                    case "S":
                        this.setAnimation("Adventurer-Walking-Left")
                        break;
                    case "SW":
                        this.setAnimation("Adventurer-Walking-Left")
                        break;
                    case "W":
                        this.setAnimation("Adventurer-Walking-Left")
                        break;
                    case "NW":
                        this.setAnimation("Adventurer-Walking-Left")
                        break;

                    default:
                        break;
                }

                this.break = Math.random() * 120 * random.HighestRandom(2) * ((this.traits.weak) ? Math.random() * 5 : 1);
                this.currentState = EntityState.WANDERING;
            }
        }

        // Handle entity direction change smoothly here
        // ...
    }

    moveToward(dx, dy, distance) {
        const speed = this.moveSpeed / 1000 * 16 * ((this.traits.drunkard) ? 0.8 : ((this.traits.drunkard) ? 1.2 : 1));
        const ratio = speed / distance;
        this.transform.vector2D.position.x += dx * ratio;
        this.transform.vector2D.position.y += dy * ratio;
        this.distanceTraveled += (Math.abs(dx * ratio) + Math.abs(dy * ratio)) / 100;
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
Position: (${(this.transform.vector2D.position.x / 50).toFixed(2)}, ${(this.transform.vector2D.position.y / 50).toFixed(2)})
Distance Traveled: ${this.distanceTraveled.toFixed(2) * 2}
Target Position: (${(this.targetPosition.x / 50).toFixed(2)}, ${(this.targetPosition.y / 50).toFixed(2)})
State: ${this.currentState}`;

        return debugInfo;
    }

    getTraitInfo() {
        let filteredString = 'TRAITS:';
        let num = 0
        for (const [key, value] of Object.entries(this.traits)) {
            if (value) {
                if (filteredString.length > 0) {
                    filteredString += '\n';
                    num++;
                }
                filteredString += `${key}`;
            }
        }
        return (num > 0) ? filteredString : '';
    }

    setAnimation(animationTitle) {
        const animation = animationsInstance.getAnimation(animationTitle);
        if (animation) {
            this.currentAnimation = animation;
        }
    }

    updateAnimation(currentTime) {
        if (this.currentAnimation) {
            const elapsedTime = currentTime - this.currentAnimation.lastFrameTime;
            const frameDuration = 1000 / this.currentAnimation.framesPerSecond;

            if (elapsedTime >= frameDuration) {
                this.currentAnimation.currentFrame = (this.currentAnimation.currentFrame + 1) % this.currentAnimation.frames.length;
                this.currentAnimation.lastFrameTime = currentTime;
            }
        }
    }

    getCurrentFrame() {
        if (this.currentAnimation) {
            return this.currentAnimation.frames[this.currentAnimation.currentFrame];
        }
        // Return a default frame or null if no animation is set
        return null;
    }

    randomizeTraits() {
        this.traits = {
            pretty: (Math.random() < 0.05) ? true : false,
            handsome: (Math.random() < 0.05) ? true : false,
            beutiful: (Math.random() < 0.05) ? true : false,
            dumb: (Math.random() < 0.05) ? true : false,
            drunkard: (Math.random() < 0.05) ? true : false,
            conviction: (Math.random() < 0.05) ? true : false,
            unlucky: (Math.random() < 0.05) ? true : false,
            weak: (Math.random() < 0.05) ? true : false,
            coward: (Math.random() < 0.05) ? true : false,
            slow: (Math.random() < 0.05) ? true : false,
        };
        // Nature
        this.traits.strong = (Math.random() < 0.05 && !this.traits.weak) ? true : false;
        this.traits.evil = (Math.random() < 0.05) ? true : false;
        this.traits.good = (Math.random() > 0.65 && !this.traits.evil) ? true : false;

        // Contradicting traits
        this.traits.fast = (Math.random() < 0.05 && !this.traits.slow) ? true : false;
        this.traits.adventurous = (Math.random() < 0.05 && !this.traits.coward) ? true : false;
        this.traits.gentleman = (Math.random() < 0.05 && !this.traits.drunkard) ? true : false;
        this.traits.smart = (Math.random() < 0.05 && !this.traits.dumb) ? true : false;
        this.traits.neutral = (!this.traits.good && !this.traits.evil) ? true : false
        this.traits.lucky = (Math.random() < 0.05 && !this.traits.unlucky) ? true : false;
    }

    setTraits(traits) {
        this.traits = traits;
    }

    // addTrait(trait){
    //     this.traits.
    // }
}