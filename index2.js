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

class Player {
    constructor({ position, velocity }) {
        this.position = position;
        this.velocity = velocity;
        this.radius = 10;
        this.color = "red";
        this.speed = 5;
        this.currentDirection = null; // Store current direction
        this.nextDirection = null;    // Store next queued direction
    }

    setDirection(direction) {
        // If no current direction, set it immediately
        if (!this.currentDirection) {
            this.currentDirection = direction;
            this.updateVelocityFromDirection(direction);
        } else {
            // Queue the next direction
            this.nextDirection = direction;
        }
    }

    updateVelocityFromDirection(direction) {
        if (!direction) return;
        const velocityMap = {
            'up': { x: 0, y: -this.speed },
            'down': { x: 0, y: this.speed },
            'left': { x: -this.speed, y: 0 },
            'right': { x: this.speed, y: 0 }
        };
        const newVelocity = velocityMap[direction];
        this.velocity.x = newVelocity.x;
        this.velocity.y = newVelocity.y;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI, true);
        ctx.fill();
        ctx.closePath();
    }

    move(boundaries) {
        // Try movement with current velocity
        let canMove = true;
        const nextPosition = {
            ...this,
            position: {
                x: this.position.x + this.velocity.x,
                y: this.position.y + this.velocity.y
            }
        };

        // Check for collisions
        for (const boundary of boundaries) {
            if (DetectCollisionBetweenCircleAndRect(this, boundary)) {
                canMove = false;
                break;
            }
        }

        // If we can't move in current direction and have a queued direction
        if (!canMove && this.nextDirection) {
            // Try the queued direction
            this.currentDirection = this.nextDirection;
            this.updateVelocityFromDirection(this.currentDirection);
            this.nextDirection = null;
            
            // Check if we can move in the new direction
            canMove = true;
            for (const boundary of boundaries) {
                if (DetectCollisionBetweenCircleAndRect(this, boundary)) {
                    canMove = false;
                    break;
                }
            }
        }

        // Apply movement if possible
        if (canMove) {
            this.position.x += this.velocity.x;
            this.position.y += this.velocity.y;
        } else {
            // If we hit a wall, stop movement
            this.velocity.x = 0;
            this.velocity.y = 0;
            this.currentDirection = null;
        }
    }

    update(boundaries) {
        this.draw();
        this.move(boundaries);
    }
}

const map = [
    ['-', '-', '-', '-', '-', '-', '-', '-', '-'],
    ['-', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '-'],
    ['-', ' ', '-', ' ', '-', ' ', '-', ' ', '-'],
    ['-', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '-'],
    ['-', ' ', '-', ' ', '-', ' ', '-', ' ', '-'],
    ['-', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '-'],
    ['-', '-', '-', '-', '-', '-', '-', '-', '-'],
];

const boundaries = [];
const player = new Player({ 
    position: { x: 60, y: 60 }, 
    velocity: { x: 0, y: 0 } 
});

map.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === '-') {
            boundaries.push(new Boundary({ position: { x: j * 40, y: i * 40 } }));
        }
    });
});

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    boundaries.forEach(boundary => boundary.draw());
    player.update(boundaries);
}

animate();

// Key mapping to directions
const keyToDirection = {
    'w': 'up',
    'arrowup': 'up',
    's': 'down',
    'arrowdown': 'down',
    'a': 'left',
    'arrowleft': 'left',
    'd': 'right',
    'arrowright': 'right'
};

window.addEventListener('keydown', ({ key }) => {
    const direction = keyToDirection[key.toLowerCase()];
    if (direction) {
        player.setDirection(direction);
    }
});
