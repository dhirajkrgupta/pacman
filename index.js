const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');


canvas.height = window.innerHeight;
canvas.width = window.innerWidth;


function DetectCollisionBetweenCircleAndRect(circle, rect) {

    const nextX = circle.position.x + circle.velocity.x;
    const nextY = circle.position.y + circle.velocity.y;


    const closestX = Math.max(rect.position.x, Math.min(nextX, rect.position.x + rect.width));
    const closestY = Math.max(rect.position.y, Math.min(nextY, rect.position.y + rect.height));


    const distanceX = nextX - closestX;
    const distanceY = nextY - closestY;


    return (distanceX * distanceX + distanceY * distanceY) <= (circle.radius * circle.radius);
}


class Boundary {
    constructor({ position }) {
        this.position = position;
        this.width = 40;
        this.height = 40;
    }
    draw() {
        ctx.fillStyle = "blue";
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}

class Pallet {
    constructor({ position }) {
        this.position = position;
        this.radius = 5;
        this.color = 'yellow';
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI, true);
        ctx.fill();
        ctx.closePath();
    }
}

class Player {
    constructor({ position, velocity }) {
        this.position = position;
        this.velocity = velocity;
        this.radius = 10;
        this.color = "red";
        this.speed = 5;
        this.score = 0;
        this.i = 0;
        this.e = 0;
    }

    setVelocity(x, y) {
        this.velocity.x = x;
        this.velocity.y = y;
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(this.position.x, this.position.y);
        ctx.arc(this.position.x, this.position.y, this.radius, Math.PI/3-this.e, 2*Math.PI-Math.PI/3+this.e, false);
        ctx.fill();
        
    }

    move(boundaries) {
        // Try horizontal movement first
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

        // Try vertical movement
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

        // Apply movement based on collision results
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
    }
    update(boundaries, pallets) {
        this.e = Math.abs(Math.PI * Math.sin(0.1*this.i)/3);
        this.i++;
        this.draw();
        this.move(boundaries);
        this.eat(pallets)
        console.log(this.e);

    }
}

const map = [
    ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-'],
    ['-', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '-'],
    ['-', ' ', '-', ' ', '-', '-', '-', ' ', '-', ' ', '-'],
    ['-', ' ', ' ', ' ', ' ', '-', ' ', ' ', ' ', ' ', '-'],
    ['-', ' ', '-', '-', ' ', ' ', ' ', '-', '-', ' ', '-'],
    ['-', ' ', ' ', ' ', ' ', '-', ' ', ' ', ' ', ' ', '-'],
    ['-', ' ', '-', ' ', '-', '-', '-', ' ', '-', ' ', '-'],
    ['-', ' ', ' ', ' ', ' ', '-', ' ', ' ', ' ', ' ', '-'],
    ['-', ' ', '-', '-', ' ', ' ', ' ', '-', '-', ' ', '-'],
    ['-', ' ', ' ', ' ', ' ', '-', ' ', ' ', ' ', ' ', '-'],
    ['-', ' ', '-', ' ', '-', '-', '-', ' ', '-', ' ', '-'],
    ['-', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '-'],
    ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-'],
];


const boundaries = [];
const pallets = [];
const player = new Player({ position: { x: 60, y: 60 }, velocity: { x: 0, y: 0 } })
map.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === '-') {
            boundaries.push(new Boundary({ position: { x: j * 40, y: i * 40 } }));
        } else {
            pallets.push(new Pallet({ position: { x: j * 40 + 20, y: i * 40 + 20 } }));
        }
    });
})

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    boundaries.forEach(boundary => boundary.draw());
    pallets.forEach(pallet => pallet.draw());
    player.update(boundaries, pallets);
    ctx.fillStyle = 'white';
    ctx.fillText("Score:" + player.score, 20, 20);
    

}

animate();


const keyMap = {
    w: { vx: 0, vy: -1 },
    a: { vx: -1, vy: 0 },
    s: { vx: 0, vy: 1 },
    d: { vx: 1, vy: 0 },
};
const activeKeys = new Set();
window.addEventListener('keydown', ({ key }) => {
    const lowerKey = key.toLowerCase();
    if (lowerKey in keyMap) {
        activeKeys.add(lowerKey);
        updatePlayerVelocity();
    }
});



window.addEventListener('keyup', ({ key }) => {
    const lowerKey = key.toLowerCase();
    if (lowerKey in keyMap) {
        activeKeys.delete(lowerKey);
        updatePlayerVelocity();
    }
});

function updatePlayerVelocity() {
    let dx = 0;
    let dy = 0;

    activeKeys.forEach(key => {
        dx += keyMap[key].vx;
        dy += keyMap[key].vy;
    });
    // console.log(dx, dy);
    // Normalize diagonal movement
    if (dx !== 0 && dy !== 0) {
        const length = Math.sqrt(dx * dx + dy * dy);
        console.log(length);
        dx = dx / length;
        dy = dy / length;
    }

    player.setVelocity(dx * player.speed, dy * player.speed);
}