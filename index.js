const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');


canvas.height = window.innerHeight;
canvas.width = window.innerWidth;




class Boundary {
    constructor({position}) {
        this.position = position;
        this.width = 40;
        this.height = 40;
    }
    draw() {
        ctx.fillStyle = "blue";
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}

class Player{
    constructor({position, velocity}) {
        this.position = position;
        this.velocity = velocity;
        this.radius = 15;
        this.color = "red";
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
    ['-', ' ', '-', '-', ' ', ' ', ' ', ' ', '-'],
    ['-', ' ', ' ', ' ', ' ', '-', '-', '-', '-'],
    ['-', '-', '-', '-', '-', '-', '-', '-', '-'],
  ];
  

const boundaries = [];
const player=new Player({position:{x:60,y:60},velocity:{x:0,y:0}})
map.forEach((row,i) => {
    row.forEach((symbol,j) => {
        if (symbol === '-') { 
            boundaries.push(new Boundary({position: {x: j*40, y: i*40}}));
        }
    });
})

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player.color = "red";
    boundaries.forEach((boundary) => {
        boundary.draw();
        let top = boundary.position.y;
        let bottom = boundary.position.y + boundary.height;
        let left = boundary.position.x;
        let right = boundary.position.x + boundary.width;
        if (player.position.y+player.velocity.y>=top-player.radius && player.position.y+player.velocity.y<=bottom+player.radius && player.position.x+player.velocity.x>=left-player.radius && player.position.x+player.velocity.x<=right+player.radius) {
            player.velocity.x = 0;
            player.velocity.y = 0;
        }
        
    });
    player.update();

}

animate();

window.addEventListener('keydown', ({key}) => {
    switch (key) {
        case 'w':
            player.velocity.y = -1;
            player.velocity.x = 0;
            break;
        case 'a':
            player.velocity.x = -1;
            player.velocity.y = 0;
            break;
        case 's':
            player.velocity.y = 1;
            player.velocity.x = 0;
            break;
        case 'd':
            player.velocity.x = 1;
            player.velocity.y = 0;
            break;
        default:
            break;
    }
});


window.addEventListener('keyup', ({key}) => {
    switch (key) {
        case 'w':
            player.velocity.y = 0;
            break;
        case 'a':
            player.velocity.x = 0;
            break;
        case 's':
            player.velocity.y = 0;
            break;
        case 'd':
            player.velocity.x = 0;
            break;
        default:
            break;
    }
 });