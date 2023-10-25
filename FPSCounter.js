class FPSCounter {
    constructor(text = "FPS: ", x = 0, y = 0, width = 100) {
        this.text = text;
        this.x = x;
        this.y = y;
        this.width = width;
        this.lastFrameTime = performance.now();
        this.frameCount = 0;
        this.fps = 0;
        this.bgColor = 'rgba(64, 64, 128, 0.5)'; // Light blue transparent background
    }

    update() {
        this.frameCount++;
        const currentTime = performance.now();
        const elapsedTime = currentTime - this.lastFrameTime;

        if (elapsedTime >= 1000) {
            this.fps = Math.round((this.frameCount * 100000) / elapsedTime) / 100;
            this.frameCount = 0;
            this.lastFrameTime = currentTime;
        }
    }

    draw(ctx) {
        const x = 20 + this.x;
        const y = ctx.canvas.height - 30 + this.y; // Bottom left corner

        // Draw the background
        ctx.fillStyle = this.bgColor;
        ctx.roundRect(x - 5, y - 20, this.width, 30, 10).fill();

        // Set font size and text alignment
        ctx.font = "16px Arial";
        ctx.textAlign = "left"; // or "center" or "right" depending on your preference

        // Draw the FPS text
        ctx.fillStyle = "white";
        ctx.fillText(`${this.text}${this.fps}`, x, y);
    }
}

// Add a utility function for rounded rectangles
CanvasRenderingContext2D.prototype.roundRect = function(x, y, width, height, radius) {
    this.beginPath();
    this.moveTo(x + radius, y);
    this.lineTo(x + width - radius, y);
    this.arcTo(x + width, y, x + width, y + radius, radius);
    this.lineTo(x + width, y + height - radius);
    this.arcTo(x + width, y + height, x + width - radius, y + height, radius);
    this.lineTo(x + radius, y + height);
    this.arcTo(x, y + height, x, y + height - radius, radius);
    this.lineTo(x, y + radius);
    this.arcTo(x, y, x + radius, y, radius);
    this.closePath();
    return this;
};