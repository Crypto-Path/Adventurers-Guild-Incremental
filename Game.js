class Game {
    constructor() {
        const FPS = 120;
        this.canvas = document.getElementById('infiniteCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.offsetX = window.innerWidth / 2;
        this.offsetY = window.innerHeight / 2;
        this.scale = 1;

        // Set canvas size to fill the screen
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        this.debugBox = new DebugBox(10, 10, 250, 120, '');
        this.trackedDebugBox = new DebugBox(window.innerWidth - (10 + 250), 10, 250, 120, '');
        this.hoveringEntity = null;
        this.entities = [];

        this.fpsCounter = new FPSCounter("FPS: ", 0, -40);
        this.drawFpsCounter = new FPSCounter("Draw FPS: ", 0, 0, 140);
        this.frameCount = 0;

        // Handle zoom
        window.addEventListener("resize", (e) => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            this.trackedDebugBox = new DebugBox(window.innerWidth - (10 + 250), 10, 250, 120, '');
        });

        // Handle zoom
        this.canvas.addEventListener('wheel', (e) => {
            const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1; // Zoom out for scroll down, zoom in for scroll up
            this.scale *= zoomFactor;
            this.scale = this.scale.toFixed(2);

            if (!this.trackedEntity) {
                // If not tracking, adjust the offset based on mouse position
                this.offsetX += (e.offsetX - this.offsetX) * (1 - zoomFactor);
                this.offsetY += (e.offsetY - this.offsetY) * (1 - zoomFactor);
            } else {
                // If tracking, zoom from the position of the tracked entity
                this.offsetX = window.innerWidth / 2 - this.trackedEntity.transform.vector2D.position.x * this.scale;
                this.offsetY = window.innerHeight / 2 - this.trackedEntity.transform.vector2D.position.y * this.scale;
                this.drawEntity(this.trackedEntity);
            }
        });

        // Handle pan
        let isMouseDown = false;
        let lastMouseX = 0;
        let lastMouseY = 0;

        this.trackedEntity = null;

        this.canvas.addEventListener('mousedown', (e) => {
            isMouseDown = true;
            lastMouseX = e.clientX;
            lastMouseY = e.clientY;

            const mouseX = (e.clientX - this.offsetX) / this.scale;
            const mouseY = (e.clientY - this.offsetY) / this.scale;

            for (let i = 0; i < this.entities.length; i++) {
                const entity = this.entities[i];

                const dx = mouseX - entity.transform.vector2D.position.x;
                const dy = mouseY - entity.transform.vector2D.position.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < entity.size * 2) {
                    // Clicked on an entity, start tracking it
                    this.trackedEntity = entity;
                    return;
                }
            }
            this.trackedEntity = null;
        });

        this.canvas.addEventListener('mouseup', () => {
            isMouseDown = false;
        });

        this.canvas.addEventListener('mousemove', (e) => {
            if (isMouseDown) {
                const deltaX = e.clientX - lastMouseX;
                const deltaY = e.clientY - lastMouseY;

                this.offsetX += deltaX;
                this.offsetY += deltaY;

                lastMouseX = e.clientX;
                lastMouseY = e.clientY;
            }

            const mouseX = (e.clientX - this.offsetX) / this.scale;
            const mouseY = (e.clientY - this.offsetY) / this.scale;

            for (let i = 0; i < this.entities.length; i++) {
                const entity = this.entities[i];

                const dx = mouseX - entity.transform.vector2D.position.x;
                const dy = mouseY - entity.transform.vector2D.position.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < entity.size * 3) {
                    this.hoveringEntity = entity;
                    this.debugBox.text = entity.getDebugInfo();
                    return;
                }
            }
            this.hoveringEntity = null;
        });

        this.isFPSVisible = false;

        document.addEventListener('keydown', (event) => {
            if (event.keyCode === 114) {
                this.isFPSVisible = !this.isFPSVisible;
                event.preventDefault();
            }
        });

        this.background = new Image();
        this.background.src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBiX_47O2yPhxltRqgA4YQyb2KPlrXislU6Q&usqp=CAU";

        this.background.onload = () => {
            // Update the entity every 16ms
            setInterval(() => this.update(), 1000 / FPS);
            this.offsetX = this.canvas.width / 2;
            this.offsetY = this.canvas.height / 2;


            // Initial draw
            this.draw();
        };
    }

    // Function to create an entity and add it to the entities array
    //Entity    (name, hp, maxHp, level, xp, xpBase, xpExponent, moveSpeed, range, position)
    createEntity(name, hp, maxHp, level, xp, moveSpeed, position) {
        //Entity                    (name, hp, maxHp, level, xp, xpBase, xpExponent, moveSpeed, range, position)
        const newEntity = new Entity(name, hp, maxHp, level, xp, 10, 1.2, moveSpeed, 2, position);
        this.entities.push(newEntity);
        return newEntity;
    }

    drawDebugBox() {
        this.debugBox.draw(this.ctx);
    }

    drawEntity(entity) {
        this.ctx.beginPath();
        this.ctx.arc(
            this.offsetX + entity.transform.vector2D.position.x * this.scale,
            this.offsetY + entity.transform.vector2D.position.y * this.scale,
            entity.size * this.scale,
            0,
            Math.PI * 2
        );
        this.ctx.fillStyle = 'blue';
        this.ctx.fill();
        this.ctx.closePath();
    }

    drawBackground() {
        // Calculate the scaled size of the background image
        const scaledWidth = this.background.width * this.scale;
        const scaledHeight = this.background.height * this.scale;

        // Calculate the number of image copies needed to fill the canvas
        const horizontalCopies = Math.ceil(this.canvas.width / scaledWidth);
        const verticalCopies = Math.ceil(this.canvas.height / scaledHeight);

        // Calculate the initial offset to ensure seamless alignment
        const initialOffsetX = this.offsetX % scaledWidth;
        const initialOffsetY = this.offsetY % scaledHeight;

        // Draw a green background across the entire canvas
        this.ctx.fillStyle = 'green';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw a limited number of background image copies
        if (horizontalCopies * verticalCopies < 2048) {
            // Draw background images
            for (let i = -1; i <= horizontalCopies; i++) {
                for (let j = -1; j <= verticalCopies; j++) {
                    const x = initialOffsetX + i * scaledWidth;
                    const y = initialOffsetY + j * scaledHeight;
                    this.ctx.drawImage(this.background, x, y, scaledWidth, scaledHeight);
                }
            }
        } else {
            // Draw a green background across the entire canvas
            this.ctx.fillStyle = 'rgb(113, 222, 72)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }

    update() {
        this.frameCount++;
        if (this.trackedEntity) {
            // Adjust the offset based on the tracked entity's position
            this.offsetX = window.innerWidth / 2 - this.trackedEntity.transform.vector2D.position.x * this.scale;
            this.offsetY = window.innerHeight / 2 - this.trackedEntity.transform.vector2D.position.y * this.scale;
            this.trackedDebugBox.text = this.trackedEntity.getDebugInfo();
        }
        // Example logic to update entity's position
        if (this.frameCount % 60 === 0) { // Update every second (assuming 60 FPS)
            if (this.hoveringEntity) {
                this.debugBox.text = this.hoveringEntity.getDebugInfo();
            }
        }
        this.fpsCounter.update();
        for (let i = 0; i < this.entities.length; i++) {
            const entity = this.entities[i];
            entity.update();
        }
    }

    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.drawBackground();

        // Draw entities
        for (let i = 0; i < this.entities.length; i++) {
            const entity = this.entities[i];
            this.drawEntity(entity);
        }

        if (this.hoveringEntity) {
            this.drawDebugBox();
            this.debugBox.draw(this.ctx);
        } else {
            this.debugBox.text = '';
        }

        if (this.trackedEntity) {
            this.trackedDebugBox.draw(this.ctx);
        }

        this.drawFpsCounter.update();

        // Draw debug information
        if (this.isFPSVisible) {
            this.fpsCounter.draw(this.ctx);
            this.drawFpsCounter.draw(this.ctx);
        }

        // Request next frame
        requestAnimationFrame(() => this.draw());
    }
}