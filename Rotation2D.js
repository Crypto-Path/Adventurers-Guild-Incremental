class Rotation2D {
    constructor(rot) {
        this.rotation = { rot: rot };
    }

    getRotDeg() {
        let normalDegrees = this.rotation.rot % 360;
        if (normalDegrees < 0) {
            normalDegrees += 360;
        }
        return normalDegrees;
    }

    getRotRad() {
        let normalRadian = (this.rotation.rot / 180 * Math.pi) % Math.pi;
        if (normalRadian < 0) {
            normalRadian += Math.pi;
        }
        return normalRadian;
    }

    rotateDeg(deg) {
        this.rotation.rot += deg;
    }

    rotateRad(rad) {
        this.rotation.rot += rad / Math.pi * 180;
    }
}