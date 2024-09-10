// inspiration 
// https://radufromfinland.com/projects/plane_1/


const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = 860;

const SIZE = 55;
let timePassed = 0, lastTime, fps;

let mouse_points = [];
let isMoving = false;

let lightPoints = [];
let point_radius = 50;

let isWayPoint = false;
let isFollowing = false;

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
            // console.log(event.button)
            lightPoints.push(
                new PointLight(
                    event.clientX,
                    event.clientY,
                    point_radius
                )
            )
            break;
    }
})

canvas.addEventListener('pointerup',(event)=>{
    switch(event.button){
        case 0:
            isMoving = false
            mouse_points = []
            player.checkLength()
            player.updatePaths()
            break;
        case 2:
            console.log(event.button)
            break;
    }
    
})

canvas.addEventListener('mouseout',(event)=>{
    if(isMoving){
        isMoving = false;
        mouse_points = [];
    }
})

canvas.addEventListener('pointermove',(event)=>{
    if(isFollowing) return;
    if(isMoving){
        mouse_points.push({x:event.clientX,y:event.clientY})
        player.paths[player.paths.length-1] = mouse_points
        return;
    }
    let e ={
        x:event.clientX,
        y:event.clientY
    }
    player.rotation = getDirection(e)
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

function getDirection(point){
    let y = point.y - (player.y + player.h/2);
    let x = point.x - (player.x + player.w/2);
    return Math.atan2(y,x);
} 

class PointLight{
    constructor(x,y,radius,brightness=null,rgba=null){
        this.x = x;
        this.y = y;
        this.radius = radius;
        
        this.brightness = brightness;
        this.rgba = rgba;
    }
    
    ligthenGradient() {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        let rnd = 0.05 * Math.sin(1.1 * Date.now() / 1000);
        let radius = this.radius * (1 + rnd);
        var radialGradient = ctx.createRadialGradient(
            this.x, this.y, 0, 
            this.x, this.y, radius);
        radialGradient.addColorStop(0.0, '#BB9');
        radialGradient.addColorStop(0.2 + rnd, '#AA8');
        radialGradient.addColorStop(0.7 + rnd, '#330');
        radialGradient.addColorStop(0.90, '#110');
        radialGradient.addColorStop(1, '#000');
        ctx.fillStyle = radialGradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore();
    }
}

class Player{
    constructor(x,y,size,vx=0,vy=0,rotation=-Math.PI/2){
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.rotation = rotation;  // radians

        this.linear_speed = 350
        this.angular_speed = 0

        this.w = size;
        this.h = size;
        this.radius_collision = 8;

        this.paths = [];
        this.curr_path = this.paths.at(-1);
        this.r_points = 0;
        this.kept_paths = 6;

        this.wayPoint = {
            x: this.x + this.w/2,
            y: this.y + this.h/2,
        };
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

    moveTo(delta){
        let ex = Math.abs(this.wayPoint.x - (this.x+this.w/2))
        let ey = Math.abs(this.wayPoint.y - (this.y+this.h/2))
        if (ex**2 + ey**2 < 2) {  
            if(isWayPoint){
                isWayPoint = false;
            }else if(isFollowing && this.r_points === this.curr_path.length-1){
                isFollowing = false;  
                this.curr_path = null;  
            }else{
                this.r_points++;
            }
            return;   
        }
        this.rotation = getDirection(this.wayPoint)
        this.vx = this.linear_speed * Math.cos(this.rotation) * delta;
        this.vy = this.linear_speed * Math.sin(this.rotation) * delta;
        
        // this.rotation += this.angular_speed; // does not rotate
        this.x += this.vx;
        this.y += this.vy;
        // set limit of the screen
        this.x = Math.max(this.radius_collision/14,
            Math.min(this.x,
                canvas.width - 4*this.radius_collision)
        )
        this.y = Math.max(this.radius_collision/14,
            Math.min(this.y,
                canvas.height - 4*this.radius_collision)
        )
    }

    update(delta){
        // console.log(isWayPoint, isFollowing)
        if (isWayPoint){
            this.moveTo(delta)
        }
        if(isFollowing){
            this.wayPoint = this.curr_path[this.r_points];
            this.moveTo(delta)
        }
        this.draw();
    }

    updatePaths(){
        if (this.paths.length > this.kept_paths){
            this.paths = this.paths.splice(
                -this.kept_paths,this.paths.length-1)
        }
    }
    
    drawPaths(){
        if(this.paths.length > 0){
            for(let j=0;j<this.paths.length;j++){
                let path = this.paths[j]
                if(path.length > 0){
                    ctx.beginPath()
                    ctx.moveTo(path[0].x,path[0].y);
                    ctx.lineWidth = 1;
                    ctx.strokeStyle = 'black';
                    if(j === this.paths.length - 1) ctx.strokeStyle = 'blue';
                    for (let i=0;i<path.length-1;i++){
                        ctx.lineTo(path[i+1].x,path[i+1].y)
                    }
                    ctx.stroke()
                }
            }
        }
    }

    checkLength(){
        if(this.paths.at(-1).length < 3) {
            let wp = this.paths.pop()
            if (wp) {
                // console.log('wp', wp.at(-1));
                isWayPoint = true;
                this.wayPoint = wp.at(-1);
                // console.log(isWayPoint, isFollowing)
            }
        }else if(this.paths.at(-1)){
            // console.log('new path')
            isFollowing = true;
            this.curr_path = this.paths.at(-1)
            this.r_points = 0;
        }
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
    // ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgb(27, 154, 148)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = "white";
    ctx.font = "18px serif";
    ctx.fillText("FPS: " + fps, 10, 20)
    // ctx.fillText(player.paths.length, 
    //     10, 40)

    player.drawPaths()
    player.update(delta)
    
    for (let i=0;i<lightPoints.length;i++){
        lightPoints[i].ligthenGradient()
    }
}

gameLoop()


function gradient_light(){
    const gradient = ctx.createRadialGradient(
        300, 100, 30, 
        300, 100, 70);

    // Add three color stops
    gradient.addColorStop(0, "rgb(255 255 175 / 70%)");
    // gradient.addColorStop(0, "rgb(255, 255, 175, 0.7)");
    gradient.addColorStop(0.9, "rgb(255 255 194 / 20%)");
    gradient.addColorStop(1, "rgb(27, 154, 148, 10%)");

    // Set the fill style and draw a rectangle
    ctx.fillStyle = gradient;
    ctx.fillRect(230, 30, 140, 140);
}