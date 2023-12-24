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

    getCardinalDirection(angle = null) {
        if (!angle) {
            angle = this.rotation2D.getRotDeg();
        }
        angle = (angle + 360) % 360;

        // Define cardinal directions and their corresponding angle ranges
        const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
        const angleRanges = [22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5];

        // Determine the cardinal direction based on the angle
        for (let i = 0; i < directions.length; i++) {
            if (angle < angleRanges[i]) {
                return directions[i];
            }
        }

        // If the angle is between 337.5 and 360 or 0 and 22.5, it corresponds to 'N'
        return 'N';
    }

    moveToward(targetX, targetY, speed) {
        const dx = targetX - this.vector2D.position.x;
        const dy = targetY - this.vector2D.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 0) {
            const ratio = Math.min(speed / distance, 1);
            this.vector2D.position.x += dx * ratio;
            this.vector2D.position.y += dy * ratio;
        }
    }

    moveForward(distance, speed) {
        const radian = this.rotation2D.getRotRad();
        const dx = Math.cos(radian) * distance;
        const dy = Math.sin(radian) * distance;

        const ratio = speed / distance;
        this.vector2D.position.x += dx * ratio;
        this.vector2D.position.y += dy * ratio;
    }

    moveRight(distance, speed) {
        const radian = this.rotation2D.getRotRad() + Math.PI / 2;
        const dx = Math.cos(radian) * distance;
        const dy = Math.sin(radian) * distance;

        const ratio = speed / distance;
        this.vector2D.position.x += dx * ratio;
        this.vector2D.position.y += dy * ratio;
    }
}