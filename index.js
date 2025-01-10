const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');


canvas.height = window.innerHeight;
canvas.width = window.innerWidth;


function DetectCollisionBetweenCircleAndRect(circle, rect) {
    let closestX = Math.max(rect.position.x, Math.min(circle.position.x + circle.velocity.x, rect.position.x + rect.width));
    let closestY = Math.max(rect.position.y, Math.min(circle.position.y + circle.velocity.y, rect.position.y + rect.height));

    let distanceX = circle.position.x + circle.velocity.x - closestX;
    let distanceY = circle.position.y + circle.velocity.y - closestY;

    let distanceSquared = distanceX * distanceX + distanceY * distanceY;

    return distanceSquared <= circle.radius * circle.radius;
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

class Player {
    constructor({ position, velocity }) {
        this.position = position;
        this.velocity = velocity;
        this.radius = 15;
        this.color = "red";
    }

    setvelocity(x, y) {
        this.velocity.x = x;
        this.velocity.y = y;
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI, true);
        ctx.fill();
        ctx.closePath();
    }
    update() {
        // console.log(player.position);
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}

const map = [
    ['-', '-', '-', '-', '-', '-', '-', '-', '-'],
    ['-', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '-'],
    ['-', '', '-', '-', '-', '-', '-', '-', '-'],
    ['-', ' ', ' ', ' ', '-', ' ', '-', '-', '-'],
    ['-', ' ', '-', ' ', ' ', ' ', ' ', ' ', '-'],
    ['-', ' ', ' ', ' ', ' ', '-', '-', '-', '-'],
    ['-', '-', '-', '-', '-', '-', '-', '-', '-'],
];


const boundaries = [];
const player = new Player({ position: { x: 60, y: 60 }, velocity: { x: 0, y: 0 } })
map.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === '-') {
            boundaries.push(new Boundary({ position: { x: j * 40, y: i * 40 } }));
        }
    });
})

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player.color = "red";
    boundaries.forEach((boundary) => {
        boundary.draw();
        if (DetectCollisionBetweenCircleAndRect(player, boundary)) {
            if (player.velocity.x !== 0) player.velocity.x = 0;
            if (player.velocity.y !== 0) player.velocity.y = 0;
        }

    });
    player.update();

}

animate();


const keyMap = {
    w: { x: 0, y: -1 },
    a: { x: -1, y: 0 },
    s: { x: 0, y: 1 },
    d: { x: 1, y: 0 },
};
const activeKey = [];
window.addEventListener('keydown', ({ key }) => {
    if (key in keyMap && !activeKey.includes(key)) {
        activeKey.push(key);
        const { x, y } = keyMap[key];
        player.setvelocity(x, y);
    }
});


window.addEventListener('keyup', ({ key }) => {
    if (key in keyMap) {
        const index = activeKey.indexOf(key);
        if (index > -1) activeKey.splice(index, 1);


        if (activeKey.length !== 0) {
            const { x, y } = keyMap[activeKey[activeKey.length - 1]]
            player.setvelocity(x, y);
        } else {
            player.setvelocity(0, 0);
        }
    }
});