const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');


canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

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
function CollideWithMonster(circle1, cirlce2) {
    const dx = Math.abs(circle1.position.x - cirlce2.position.x);
    const dy = Math.abs(circle1.position.y - cirlce2.position.y);
    const distanceSquared = dx * dx + dy * dy;

    return distanceSquared <= (circle1.radius + cirlce2.radius) ** 2;
}

function DetectCollisionBetweenCircleAndRect(circle, rect) {

    const nextX = circle.position.x + circle.velocity.x;
    const nextY = circle.position.y + circle.velocity.y;


    const closestX = Math.max(rect.position.x, Math.min(nextX, rect.position.x + rect.width));
    const closestY = Math.max(rect.position.y, Math.min(nextY, rect.position.y + rect.height));


    const distanceX = nextX - closestX;
    const distanceY = nextY - closestY;


    return (distanceX * distanceX + distanceY * distanceY) <= (circle.radius * circle.radius);
}

function WonTheGame() {
    ctx.beginPath();
    ctx.fillStyle = "rgba(255, 255, 255, 0.64)";
    const offsetX = (canvas.width - map[0].length * 40) / 2;
    const offsetY = (canvas.height - map.length * 40) / 2;
    ctx.fillRect(offsetX, offsetY, map[0].length * 40, map.length * 40);
    ctx.closePath();
    ctx.fillStyle = 'green';
    ctx.font = '50px Arial';
    ctx.fillText("WON", offsetX + map[0].length * 20, offsetY + map.length * 20);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
}

function LostTheGame() {
    ctx.beginPath();
    ctx.fillStyle = "rgba(255, 255, 255, 0.64)";
    const offsetX = (canvas.width - map[0].length * 40) / 2;
    const offsetY = (canvas.height - map.length * 40) / 2;
    ctx.fillRect(offsetX, offsetY, map[0].length * 40, map.length * 40);
    ctx.closePath();
    ctx.fillStyle = 'red';
    ctx.font = '50px Arial';
    ctx.fillText("OUT", offsetX + map[0].length * 20, offsetY + map.length * 20);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
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
        this.color = `hsl(${250 * Math.random() + 50},100%,50%)`
    }
}



const boundaries = [];
const pallets = [];
const monsters = [];
const offsetX = (canvas.width - map[0].length * 40) / 2;
const offsetY = (canvas.height - map.length * 40) / 2;
const player = new Player({ position: { x: offsetX + 60, y: offsetY + 60 }, velocity: { x: 0, y: 0 } })

map.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === '-') {
            boundaries.push(new Boundary({ position: { x: offsetX + j * 40, y: offsetY + i * 40 } }));
        } else {
            pallets.push(new Pallet({ position: { x: offsetX + j * 40 + 20, y: offsetY + i * 40 + 20 } }));
        }
    });
})


for (let idx = 0; idx < 3; idx++) {
    const idx = Math.floor(Math.random() * (pallets.length - 1));
    monsters.push(new Monster({ position: { x: pallets[idx].position.x, y: pallets[idx].position.y }, velocity: { x: 0, y: 0 } }));
}


function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    boundaries.forEach(boundary => boundary.draw());
    pallets.forEach(pallet => pallet.draw());
    monsters.forEach(monster => monster.update(boundaries, player));
    player.update(boundaries, pallets, monsters);
    ctx.fillStyle = 'white';
    ctx.font = "30px Arial";
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText("Score:" + player.score, offsetX + map[0].length * 20, offsetY);
}

animate();


const keyMap = {
    w: { vx: 0, vy: -1, dir: 'up' },
    'arrowup': { vx: 0, vy: -1, dir: 'up' },
    a: { vx: -1, vy: 0, dir: 'left' },
    'arrowleft': { vx: -1, vy: 0, dir: 'left' },
    s: { vx: 0, vy: 1, dir: 'down' },
    'arrowdown': { vx: 0, vy: 1, dir: 'down' },
    d: { vx: 1, vy: 0, dir: 'right' },
    'arrowright': { vx: 1, vy: 0, dir: 'right' }
};
const activeKeys = new Set();
window.addEventListener('keydown', ({ key }) => {
    const lowerKey = key.toLowerCase();
    if (lowerKey in keyMap) {
        player.direction = keyMap[lowerKey].dir;
        activeKeys.add(lowerKey);
        updatePlayerVelocity();
    }
});




window.addEventListener('keyup', ({ key }) => {
    const lowerKey = key.toLowerCase();
    if (lowerKey in keyMap) {
        activeKeys.delete(lowerKey);
        // updatePlayerVelocity();
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