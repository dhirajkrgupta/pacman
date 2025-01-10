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

const map = [
    ['-', '-', '-', '-', '-', '-', '-', '-', '-','-', '-', '-', '-', '-', '-', '-', '-'],
    ['-', ' ', ' ', ' ', '-', ' ', ' ', ' ', '-', ' ', ' ', '-', ' ', ' ', ' ', '-',' '],
    ['-', '-', ' ', '-', '-', '-', ' ', '-', '-', ' ', '-', '-', '-', ' ', '-', '-',' '],
    ['-', '-', ' ', '-', '-', '-', ' ', '-', '-','-', ' ', '-', '-', '-', ' ', '-', '-'],
    ['-', '-', ' ', '-', '-', '-', ' ', '-', '-','-', ' ', '-', '-', '-', ' ', '-', '-'],
    ['-', '-', ' ', '-', '-', '-', ' ', '-', '-','-', ' ', '-', '-', '-', ' ', '-', '-'],
    ['-', '-', ' ', '-', '-', '-', ' ', '-', '-','-', ' ', '-', '-', '-', ' ', '-', '-'],
    ['-', '-', ' ', '-', '-', '-', ' ', '-', '-','-', ' ', '-', '-', '-', ' ', '-', '-'],
    ['-', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '-',' ', ' ', ' ', ' ', ' ', ' ', ' ', '-'],
    ['-', '-', '-', '-', '-', '-', '-', '-', '-','-', '-', '-', '-', '-', '-', '-', '-']
];
const boundaries = [];

map.forEach((row,i) => {
    row.forEach((symbol,j) => {
        if (symbol === '-') { 
            boundaries.push(new Boundary({position: {x: j*40, y: i*40}}));
        }
    });
})

boundaries.forEach((boundary) => {
    boundary.draw();
 });