// inspiration 
// https://radufromfinland.com/projects/plane_1/
// https://github.com/argonautcode/animal-proc-anim/tree/main

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = 860;

const SIZE = 55;
let timePassed = 0, lastTime, fps;

let mouse_points = [];
let isMoving = false;

document.addEventListener('contextmenu', event => {
    event.preventDefault();
  });

canvas.addEventListener('mousedown',(event)=>{
    switch(event.button){
        case 0:
            mouse_points.push({x:event.clientX,y:event.clientY})
            player.paths.push(mouse_points)
            isMoving = true
            break;
        case 2:
            console.log(event.button)
            break;
    }
})

canvas.addEventListener('pointerup',(event)=>{
    switch(event.button){
        case 0:
            isMoving = false
            // console.log(mouse_points.length)
            mouse_points = []
            break;
        case 2:
            console.log(event.button)
            break;
    }
    
})

canvas.addEventListener('pointermove',(event)=>{
    if(isMoving){
        mouse_points.push({x:event.clientX,y:event.clientY})
    }
    y = event.clientY - player.y;
    x = event.clientX - player.x;
    player.rotation = Math.atan2(y,x);
})

function randomInt(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); 
}

function randomFloat(min, max, t=null) {
    // lerp
    t = t ? t : Math.random();
    return (1.0-t)*min + t*max; 
}

class Player{
    constructor(x,y,size,vx=0,vy=0,rotation=-Math.PI/2){
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.rotation = rotation;  // radians

        this.linear_speed = 0
        this.angular_speed = 0

        this.w = size;
        this.h = size;
        this.radius_collision = 8;

        this.paths = [];
    }

    draw(){
        ctx.save();
        ctx.fillStyle = 'blue';
        ctx.beginPath();
        ctx.translate(this.x + this.w/2, this.y+this.h/2);
        ctx.rotate(this.rotation);
        ctx.translate(-1*(this.x + this.w/2), -1*(this.y+this.h/2))
        ctx.moveTo(this.x + this.w, this.y + this.h/2);
        ctx.lineTo(this.x, this.y);
        ctx.lineTo(this.x + this.w/4, this.y + this.h/2); 
        ctx.lineTo(this.x, this.y + this.h);
        ctx.lineTo(this.x  + this.w, this.y+this.h/2);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    update(){
        this.vx = this.linear_speed * Math.cos(this.rotation);
        this.vy = this.linear_speed * Math.sin(this.rotation);
        
        // this.rotation += this.angular_speed;
        this.x += this.vx;
        this.y += this.vy;
        this.x = Math.max(this.radius_collision/4,
            Math.min(this.x,
                canvas.width - 4*this.radius_collision)
        )
        this.y = Math.max(this.radius_collision/4,
            Math.min(this.y,
                canvas.height - 4*this.radius_collision)
        )
        
        if (this.paths.length > 10){
            this.paths = this.paths.splice(-10,this.paths.length-1)
        }

        this.draw();
    }
}

let player = new Player(canvas.width/2,canvas.height/2,SIZE)

const gameLoop = function(timeStamp){
    let delta = (timeStamp - lastTime)/1000;
    lastTime = timeStamp;
    if(lastTime && delta) {
        timePassed += delta;  
    }
    // console.log(lastTime, timePassed)
    fps = Math.round(1/delta)

    requestAnimationFrame(gameLoop);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.font = "18px serif";
    ctx.fillText("FPS: " + fps, 10, 20)

    player.draw()
    let paths = player.paths
    let paths_size = paths.length
    if(paths.length > 0){
        for(let j=0;j<paths.length;j++){
            let path = paths[j]
            if(path.length > 0){
                ctx.beginPath()
                ctx.moveTo(path[0].x,path[0].y);
                ctx.lineWidth = 1;
                ctx.strokeStyle = 'black';
                if(j === paths_size-1) ctx.strokeStyle = 'blue';
                for (let i=0;i<path.length-1;i++){
                    ctx.lineTo(path[i+1].x,path[i+1].y)
                }
                ctx.stroke()
            }
        }
    }
}

gameLoop()