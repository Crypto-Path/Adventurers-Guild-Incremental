class Transform {
    constructor(position, scale, rotation) {
        try {
            this.vector2D = new Vector2D((position.hasOwnProperty("x")) ? position.x : 0, position.hasOwnProperty("y") ? position.y : 0);
            this.scale2D = new Scale2D((scale.hasOwnProperty("x") && scale.hasOwnProperty("y")) ? { x: scale.x, y: scale.y } : { x: 0, y: 0 });
            this.rotation2D = new Rotation2D((rotation.hasOwnProperty("rot")) ? { rot: rotation.rot } : { rot: 0 });
        } catch (error) {
            console.error(`Issue processing one of the following:\n${position}\n${scale}\n${rotation}`);
            console.error(error);
        }
    }
}