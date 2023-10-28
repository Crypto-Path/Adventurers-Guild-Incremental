class DebugBox {
    constructor(x, y, width, height, text) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.text = text;
        this.padding = 10;
    }

    draw(ctx) {
        // Split text into lines
        const lines = this.text.split('\n');
        this.height = lines.length * 20 + this.padding;

        // Draw white outline
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.closePath();

        // Draw black transparent background
        ctx.beginPath();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.closePath();

        // Draw wrapped text inside the box
        ctx.font = '16px Arial';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';

        // for (let i = 0; i < wrappedText.length; i++) {
        //     ctx.fillText(wrappedText[i], this.x + this.padding, this.y + this.padding + i * 20);
        // }

        for (let i = 0; i < lines.length; i++) {
            ctx.fillText(lines[i], this.x + this.padding, this.y + this.padding + i * 20);
        }
    }
}