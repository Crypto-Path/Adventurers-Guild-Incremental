class Structure {
    constructor(ctx, name, hp, maxHp, position = { x: 0, y: 0 }) {
        this.ctx = ctx;
        this.name = name || "???";
        this.hp = hp || 0;
        this.maxHp = maxHp || 0;
        this.transform = new Transform(position, { x: 1, y: 1 }, { rot: 0 });

        // Add a property to track whether the info panel should be displayed
        this.showInfoPanel = false;
    }

    // Method to toggle the display of the info panel
    toggleInfoPanel() {
        this.showInfoPanel = !this.showInfoPanel;
        this.drawInfoPanel(); // Call this method to redraw the canvas when the toggle changes
    }

    // Method to draw the info panel on the canvas
    drawInfoPanel() {
        if (this.showInfoPanel) {
            // Add your logic here to draw the info panel on the canvas using this.ctx
            // You can use properties like this.name, this.hp, etc., and position information from this.transform
        } else {
            // Clear the canvas or hide the info panel if it's not supposed to be shown
            this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        }
    }
}