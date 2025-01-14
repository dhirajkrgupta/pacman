class Monster {
    constructor({ position, velocity }) {
        this.position = position;
        this.velocity = velocity;
        this.radius = 10;
        this.color = "pink";
        this.speed = 2;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.strokeStyle = 'red';
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.closePath();
        ctx.beginPath();
        ctx.fillStyle = 'black';
        ctx.arc(this.position.x - 0.423 * this.radius, this.position.y - 0.333 * this.radius, this.radius * .2, 0, Math.PI * 2, false);
        ctx.arc(this.position.x + 0.423 * this.radius, this.position.y - 0.333 * this.radius, this.radius * .2, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.closePath();

    }
    move(boundaries) {

        const nextPosition = {
            x: this.position.x + this.velocity.x,
            y: this.position.y + this.velocity.y,
        };


        let collision = false;
        for (const boundary of boundaries) {
            if (DetectCollisionBetweenCircleAndRect({ ...this, position: nextPosition }, boundary)) {
                collision = true;
                break;
            }
        }


        if (collision || Math.random() < 0.02) {
            const directions = [
                { x: 1, y: 0 },  // Right
                { x: -1, y: 0 }, // Left
                { x: 0, y: 1 },  // Down
                { x: 0, y: -1 }, // Up
            ];
            const randomDirection = directions[Math.floor(Math.random() * directions.length)];
            this.velocity.x = randomDirection.x * this.speed;
            this.velocity.y = randomDirection.y * this.speed;
        } else {
            this.position.x += this.velocity.x;
            this.position.y += this.velocity.y;
        }
    }


    update(boundaries, player) {
        this.draw();
        this.move(boundaries)
        this.color = `hsl(${10 + 50 * Math.random()},50%,50%)`
    }
}
