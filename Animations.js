class Animations {
    constructor() {
        this.animations = {};
    }

    createAnimation(animationTitle, animationFrames, framesPerSecond) {
        this.animations[animationTitle] = {
            frames: animationFrames,
            currentFrame: 0,
            framesPerSecond: framesPerSecond,
            lastFrameTime: animationFrames.length
        };
    }

    getAnimation(animationTitle) {
        return this.animations[animationTitle];
    }
}

// Initialize Animations
const animationsInstance = new Animations();
animationsInstance.createAnimation("a", ["Resources/Adventurer/Temp.png"], 1);