class Player {
    constructor({ position, velocity }) {
        this.position = position;
        this.velocity = velocity;
        this.radius = 10;
        this.color = "red";
        this.speed = 1;
        this.score = 0;
        this.i = 0;
        this.e = 0;
        this.direction = 'right';
        this.status = 'running';
    }

    setVelocity(x, y) {
        this.velocity.x = x;
        this.velocity.y = y;
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(this.position.x, this.position.y);
        if (this.direction === 'right') {
            ctx.arc(this.position.x, this.position.y, this.radius, Math.PI / 3 - this.e, 2 * Math.PI - Math.PI / 3 + this.e, false);
        } else if (this.direction == 'left') {
            ctx.arc(this.position.x, this.position.y, this.radius, 2 * Math.PI / 3 + this.e, Math.PI + Math.PI / 3 - this.e, true);
        } else if (this.direction == 'down') {
            ctx.arc(this.position.x, this.position.y, this.radius, Math.PI / 2 - Math.PI / 3 + this.e, Math.PI / 2 + Math.PI / 3 - this.e, true);
        } else {
            ctx.arc(this.position.x, this.position.y, this.radius, 3 * Math.PI / 2 + this.e, 3 * Math.PI / 2 - this.e, false);
        }
        ctx.fill();

    }

    move(boundaries) {

        monsters.forEach(monster => {
            if (CollideWithMonster(this, monster)) {
                this.status = 'out';
                console.log("monster alert");

            }
        })

        const horizontalMove = {
            ...this,
            velocity: { x: this.velocity.x, y: 0 }
        };

        let horizontalCollision = false;
        for (const boundary of boundaries) {
            if (DetectCollisionBetweenCircleAndRect(horizontalMove, boundary)) {
                horizontalCollision = true;
                break;
            }
        }


        const verticalMove = {
            ...this,
            velocity: { x: 0, y: this.velocity.y }
        };

        let verticalCollision = false;
        for (const boundary of boundaries) {
            if (DetectCollisionBetweenCircleAndRect(verticalMove, boundary)) {
                verticalCollision = true;
                break;
            }
        }


        if (!horizontalCollision) {
            this.position.x += this.velocity.x;
        }
        if (!verticalCollision) {
            this.position.y += this.velocity.y;
        }
    }

    eat(pallets) {
        for (const pallet of pallets) {
            const dx = Math.abs(this.position.x - pallet.position.x);
            const dy = Math.abs(this.position.y - pallet.position.y);
            const dist = dx * dx + dy * dy;
            if (dist < Math.pow(this.radius + pallet.radius, 2)) {
                const i = pallets.indexOf(pallet);
                pallets.splice(i, 1);
                this.score += 10;
            }
        }
        if (pallets.length === 0) {
            this.status = 'win';
        }
    }
    update(boundaries, pallets, monsters) {
        this.e = Math.abs(Math.PI * Math.sin(0.2 * this.i) / 3);
        this.i++;
        this.draw();
        if (this.status === 'win') {
            WonTheGame();
        } else if (this.status === 'out') {
            LostTheGame();
        } else {
            this.move(boundaries, monsters);
            this.eat(pallets)
        }
    }
}
