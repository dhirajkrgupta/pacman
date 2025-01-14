const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');


canvas.height = window.innerHeight;
canvas.width = window.innerWidth;


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