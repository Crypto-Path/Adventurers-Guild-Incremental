class Chicken extends Entity {
    constructor(position = { x: 0, y: 0 }) {
        super();

        this.name = "Chicken";
        this.hp = 3;
        this.maxHp = 3;
        this.level = 0;
        this.xp = 0;
        this.xpBase = 10;
        this.xpExponent = 1.2;
        this.moveSpeed = 30;
        this.range = 100;
        this.transform = new Transform(position, { x: 1, y: 1 }, { rot: 0 });
        this.currentState = EntityState.WANDERING;
        this.targetPosition = { x: this.transform.vector2D.position.x, y: this.transform.vector2D.position.y };
        this.distanceTraveled = 0;
        this.size = 10;

        this.break = 60 * 3;
    }

}