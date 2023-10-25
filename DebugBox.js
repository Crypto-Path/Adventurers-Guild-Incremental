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

        // Calculate wrapped text and box height
        const wrappedText = this.wrapText(ctx, this.text, this.width - this.padding * 2, 16);
        const textHeight = wrappedText.length * 20; // Assuming font size is 16px and line height is 20px

        // Extend box height if necessary
        if (textHeight + this.padding * 3 > this.height) {
            this.height = textHeight + this.padding * 3;
        }

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

    wrapText(ctx, text, maxWidth, lineHeight) {
        let words = text.split(' ');
        let lines = [];
        let currentLine = words[0];

        for (let i = 1; i < words.length; i++) {
            let word = words[i];
            let width = ctx.measureText(currentLine + ' ' + word).width;
            if (width < maxWidth) {
                currentLine += ' ' + word;
            } else {
                lines.push(currentLine);
                currentLine = word;
            }
        }

        lines.push(currentLine);
        return lines;
    }
}

// Extend canvas context with roundRect function
CanvasRenderingContext2D.prototype.roundRect = function(x, y, width, height, radius) {
    this.beginPath();
    this.moveTo(x + radius, y);
    this.arcTo(x + width, y, x + width, y + height, radius);
    this.arcTo(x + width, y + height, x, y + height, radius);
    this.arcTo(x, y + height, x, y, radius);
    this.arcTo(x, y, x + width, y, radius);
    this.closePath();
    return this;
};