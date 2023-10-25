class Scale2D {
    constructor(x, y) {
        this.scale = { x: x, y: y };
    }

    getXScale() {
        return this.scale.x;
    }

    getYscale() {
        return this.scale.y;
    }
}