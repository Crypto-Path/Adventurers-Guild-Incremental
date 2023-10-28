class Game {

    constructor() {
        const FPS = 120;

        this.canvas = document.getElementById('PlayField');
        this.ctx = this.canvas.getContext('2d');
        this.ctx.imageSmoothingEnabled = false;
        this.offsetX = window.innerWidth / 2;
        this.offsetY = window.innerHeight / 2;
        this.scale = 1;

        // Set canvas size to fill the screen
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        this.screenLeft = 0;
        this.screenRight = this.canvas.width;
        this.screenTop = 0;
        this.screenBottom = this.canvas.height;

        this.debugBox = new DebugBox(10, 10, 250, 150, '');
        this.entityTraits = new DebugBox(10, this.debugBox.height + 20, 250, 150, '');
        this.trackedDebugBox = new DebugBox(window.innerWidth - (10 + 250), 10, 250, 150, '');
        this.trackedEntityTraits = new DebugBox(window.innerWidth - (10 + 250), this.trackedDebugBox.height + 20, 250, 150, '');
        this.hoveringEntity = null;
        this.entities = [];

        this.fpsCounter = new FPSCounter("FPS: ", 0, -40);
        this.drawFpsCounter = new FPSCounter("Draw FPS: ", 0, 0, 140);
        this.frameCount = 0;

        this.ctrlDown = false;

        console.log(this.hero = this.createEntity("Hiro Valorheart", 10, 10, 0, 0, 50, {
            x: 0,
            y: 0
        }));
        this.hero.favorited = true;
        this.hero.setTraits({ good: true, heroic: true, adventurous: true });

        this.nameGenerator = new RandomNameGenerator();

        for (let i = 0; i < 99; i++) {
            const entity = this.generateAdventurer()
            entity.randomizeTraits();
            entity.transform.vector2D = new Vector2D((Math.random() - 0.5) * 2500, (Math.random() - 0.5) * 2500);
            entity.targetPosition = { x: entity.transform.vector2D.position.x, y: entity.transform.vector2D.position.y };
            console.log(entity);
        }

        // Handle zoom
        window.addEventListener("resize", (e) => {
            this.ctx.imageSmoothingEnabled = false;
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;

            this.screenLeft = 0;
            this.screenRight = this.canvas.width;
            this.screenTop = 0;
            this.screenBottom = this.canvas.height;

            this.trackedDebugBox.x = window.innerWidth - (10 + 250);
            this.trackedEntityTraits.x = this.trackedDebugBox.x;
            this.trackedEntityTraits.y = this.trackedDebugBox.height + 20;
        });

        // Handle zoom
        this.canvas.addEventListener('wheel', (e) => {
            if (!this.ctrlDown) {
                const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1; // Zoom out for scroll down, zoom in for scroll up
                this.scale *= zoomFactor;
                this.scale = this.scale.toFixed(3);

                let limited = false;
                // Limit zoom out to a scale factor of 0.1
                if (this.scale > 20) {
                    this.scale = 20;
                    limited = true;
                } else if (this.scale < 0.02) {
                    this.scale = 0.02;
                    limited = true;
                }

                if (!this.trackedEntity) {
                    if (!limited) {
                        // If not tracking, adjust the offset based on mouse position
                        this.offsetX += (e.offsetX - this.offsetX) * (1 - zoomFactor);
                        this.offsetY += (e.offsetY - this.offsetY) * (1 - zoomFactor);
                    }
                } else {
                    // If tracking, zoom from the position of the tracked entity
                    this.offsetX = window.innerWidth / 2 - this.trackedEntity.transform.vector2D.position.x * this.scale;
                    this.offsetY = window.innerHeight / 2 - this.trackedEntity.transform.vector2D.position.y * this.scale;
                    this.drawEntity(this.trackedEntity);
                }
                return;
            }
            e.preventDefault();
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
                    this.entityTraits.text = entity.getTraitInfo();
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
            if (event.keyCode === 17) {
                this.ctrlDown = true;
            }
            if ((event.ctrlKey && (event.key == "f"))) {
                console.log(this.trackedEntity)
                if (this.trackedEntity) {

                    this.trackedEntity.favorited = (this.trackedEntity.favorited) ? false : true;
                }
                event.preventDefault()
            }
        });

        document.addEventListener('keyup', (event) => {
            if (event.keyCode === 17) {
                this.ctrlDown = false;
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

        // setTimeout(() => {
        //     this.eventPosition(0, 0, 0.95)
        // }, 100000);
    }

    eventPosition(x, y, percent = 1) {
        for (let i = 0; i < this.entities.length; i++) {
            if (Math.random() < percent) {
                const entity = this.entities[i];
                entity.setTargetPosition(x, y);
            }
        }
    }

    generateAdventurer() {
        this.nameGenerator.setLang((Math.random() < 0.5) ? "jp" : "en");
        this.nameGenerator.setGender((Math.random() < 0.5) ? "male" : "female");
        const entity = this.createAdventurer(this.nameGenerator.generateName(), {
            x: 0,
            y: 0
        });
        return entity;
    }

    // Function to create an entity and add it to the entities array
    //Entity    (name, hp, maxHp, level, xp, xpBase, xpExponent, moveSpeed, range, position)
    createEntity(name, hp, maxHp, level, xp, moveSpeed, position) {
        //Entity                    (name, hp, maxHp, level, xp, xpBase, xpExponent, moveSpeed, range, position)
        const newEntity = new Entity(name, hp, maxHp, level, xp, 10, 1.2, moveSpeed, 2, position, (typeof animationsInstance !== 'undefined') ? animationsInstance : null);
        this.entities.push(newEntity);
        newEntity.setAnimation("Adventurer-Idle")
        return newEntity;
    }

    createAdventurer(name, position) {
        const entity = this.createEntity(name, 10, 10, 0, 0, 50, position);
        return entity;
    }

    update() {
        this.frameCount++;
        if (this.trackedEntity) {
            // Adjust the offset based on the tracked entity's position
            this.offsetX = window.innerWidth / 2 - this.trackedEntity.transform.vector2D.position.x * this.scale;
            this.offsetY = window.innerHeight / 2 - this.trackedEntity.transform.vector2D.position.y * this.scale;
            this.trackedDebugBox.text = this.trackedEntity.getDebugInfo();
            this.trackedEntityTraits.text = this.trackedEntity.getTraitInfo();
        }
        // Example logic to update entity's position
        if (this.frameCount % 60 === 0) { // Update every second (assuming 60 FPS)
            if (this.hoveringEntity) {
                this.debugBox.text = this.hoveringEntity.getDebugInfo();
                this.entityTraits.text = this.hoveringEntity.getTraitInfo();
            }
        }

        // Update entity animations
        const currentTime = performance.now();
        this.fpsCounter.update();
        for (let i = 0; i < this.entities.length; i++) {
            const entity = this.entities[i];
            entity.updateAnimation(currentTime);
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
            this.entityTraits.draw(this.ctx);
        } else {
            this.debugBox.text = '';
            this.entityTraits.text = '';
        }

        if (this.trackedEntity) {
            this.trackedDebugBox.draw(this.ctx);
            this.trackedEntityTraits.draw(this.ctx);
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
        if (horizontalCopies * verticalCopies < 1024) {
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

    drawEntity(entity) {
        const currentFrame = entity.getCurrentFrame();

        // Create a new Image object
        let frame = new Image();

        // Set the image source to the currentFrame path
        frame.src = currentFrame;

        const entityScreenX = entity.transform.vector2D.position.x * this.scale + this.offsetX;
        const entityScreenY = entity.transform.vector2D.position.y * this.scale + this.offsetY;
        const scaledWidth = frame.width * entity.size * this.scale / 8;
        const scaledHeight = frame.height * entity.size * this.scale / 8;

        // Check if the entity is within the screen boundaries

        if (entityScreenX + scaledWidth / 2 > this.screenLeft && entityScreenX - scaledWidth / 2 < this.screenRight && entityScreenY + scaledHeight / 2 > this.screenTop && entityScreenY - scaledHeight / 2 < this.screenBottom) {
            if (frame.src) {

                // Calculate the drawing position to center the image over the entity
                // const entityScreenX = entity.transform.vector2D.position.x * this.scale + this.offsetX;
                // const entityScreenY = entity.transform.vector2D.position.y * this.scale + this.offsetY;
                const drawX = entityScreenX - scaledWidth / 2;
                const drawY = entityScreenY - scaledHeight / 2;

                // Draw the image at the calculated position
                this.ctx.drawImage(frame, drawX, drawY, scaledWidth, scaledHeight);
            }

            if (entity.favorited || this.trackedEntity == entity || this.hoveringEntity == entity) {
                // Draw entity name above them
                this.ctx.font = "16px Arial";
                this.ctx.fillStyle = "white";
                this.ctx.textAlign = "center";
                this.ctx.fillText(entity.name, this.offsetX + entity.transform.vector2D.position.x * this.scale, this.offsetY + entity.transform.vector2D.position.y * this.scale - entity.size * this.scale - 18);

                // Draw health bar below them
                const healthBarWidth = 50; // Adjust the width of the health bar as needed
                const healthBarHeight = 8;
                const healthBarX = this.offsetX + entity.transform.vector2D.position.x * this.scale - healthBarWidth / 2;
                const healthBarY = this.offsetY + entity.transform.vector2D.position.y * this.scale + entity.size * this.scale + 5;
                const remainingHealthWidth = (entity.hp / entity.maxHp) * healthBarWidth;

                // Draw red background (missing health)
                this.ctx.fillStyle = "red";
                this.ctx.fillRect(healthBarX, healthBarY, healthBarWidth, healthBarHeight);

                // Draw green health bar
                this.ctx.fillStyle = "green";
                this.ctx.fillRect(healthBarX, healthBarY, remainingHealthWidth, healthBarHeight);
            }
        }
    }

    drawDebugBox() {
        this.debugBox.draw(this.ctx);
        this.entityTraits.draw(this.ctx);
    }
}