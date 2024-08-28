const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const LINEAR_SPEED = 1.7;
const ANGULAR_SPEED = 0.015;
const FRICTION = 0.987;
let timePassed = 0, lastTime, fps;

canvas.width = window.innerWidth;
canvas.height = 860;

window.addEventListener('keydown', (event)=>{
    switch(event.code){
        case 'KeyW':
            console.log(event.repeat)
            // console.log('w pressed')
            playerInput.w.pressed = true
            break;
        case 'KeyA':
            // console.log('a pressed')
            playerInput.a.pressed = true
            break;
        case 'KeyD':
            // console.log('d pressed')
            playerInput.d.pressed = true
            break;
        case 'KeyS':
            // console.log('s pressed')
            playerInput.s.pressed = true
            break;
        case 'Space':
            if (event.repeat){
                return;
            }
            console.log('space bar pressed')
            playerInput.space.pressed = true
            break;
    }
})

window.addEventListener('keyup', (event)=>{
    switch(event.code){
        case 'KeyW':
            // console.log('w up')
            playerInput.w.pressed = false
            break;
        case 'KeyA':
            // console.log('a up')
            playerInput.a.pressed = false
            break;
        case 'KeyD':
            // console.log('d up')
            playerInput.d.pressed = false
            break;
        case 'KeyS':
            // console.log('s up')
            playerInput.s.pressed = false
            break;
        case 'Space':
            if (event.repeat){
                return;
            }
            // console.log('space bar up')
            playerInput.space.pressed = false
            break;
    }
})

function randomInt(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); 
}

class Player{
    constructor(x,y,vx=0,vy=0,rotation=3*Math.PI/2, omega = 0){
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.rotation = rotation;  // radians

        this.linear_speed = 0
        this.angular_speed = 0

        this.w = 35;
        this.h = 35;
        this.radius_collision = 8;

        this.bullets = [];
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
        ctx.lineTo(this.x + 1*this.w/4, this.y + this.h/2);
        ctx.lineTo(this.x, this.y + this.h);
        ctx.lineTo(this.x  + this.w, this.y+this.h/2);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(this.x+this.w/2,this.y+this.h/2,
            this.radius_collision,0,2*Math.PI);
        ctx.closePath()
        ctx.fill()
    }

    update(){
        this.vx = this.linear_speed * Math.cos(this.rotation);
        this.vy = this.linear_speed * Math.sin(this.rotation);
        
        this.rotation += this.angular_speed;
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
        this.draw();

        for (let b in this.bullets){
            this.bullets[b].update();
            if (this.bullets[b].x < 0 || canvas.width < this.bullets[b].x ||
                this.bullets[b].y < 0 || canvas.height < this.bullets[b].y){
                this.bullets.splice(b,1);
            }
        }
    
    }

    shoot(){
        let b = new Bullet(
                        this.x + this.w/2 + (this.w/2)*Math.cos(this.rotation), 
                        this.y + this.h/2 + (this.w/2)*Math.sin(this.rotation), 
                        this.rotation
                    )
        this.bullets.push(b)
    }
}

class Bullet{
    constructor(x, y, rotation, speed=5){
        this.x = x;
        this.y = y;
        this.rotation = rotation;
        this.speed = speed;
        this.radius = 5;
    }

    draw(){
        // ctx.save()
        ctx.fillStyle = 'white';
        ctx.beginPath()
        ctx.arc(this.x,this.y,this.radius,0,2*Math.PI)
        ctx.fill()
        ctx.closePath()
        // ctx.restore()
    }

    update(){
        let vx = this.speed * Math.cos(this.rotation);
        let vy = this.speed * Math.sin(this.rotation);
        this.x += vx;
        this.y += vy;

        this.draw();
    }
}

class Asteroid{
    constructor(x, y, radius, rotation=0, speed=0, breaks=3){
        this.x = x;
        this.y = y;
        this.rotation = rotation;
        this.speed = speed;
        this.radius = radius;
        
        this.breaks = breaks;
    }

    draw(){
        // ctx.save()
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.beginPath()
        ctx.arc(this.x,this.y,this.radius,0,2*Math.PI)
        // ctx.fillText(this.speed.toString(),this.x,this.y)
        ctx.stroke()
        ctx.closePath()
        // ctx.restore()
    }

    update(){
        let vx = this.speed * Math.cos(this.rotation);
        let vy = this.speed * Math.sin(this.rotation);
        this.x += vx;
        this.y += vy;

        this.draw();
    }

    static addAsteroid(){
        let x,y,radius,rotation,speed,breaks;
        switch(randomInt(0,3)){
            case 0: //east
                x = canvas.width;
                y = randomInt(0,canvas.height);
                rotation=Math.PI;
                break;
            case 1: //south
                x = randomInt(0,canvas.width);
                y = canvas.height;
                rotation=-Math.PI/2;
                break;
            case 2: //west
                x = 0;
                y = randomInt(0,canvas.height);
                rotation=0;
                break;
            case 3: //north
                x = randomInt(0,canvas.width);
                y = 0;
                rotation=Math.PI/2;
                break;
        }
        switch(randomInt(0,2)){
            case 0: // small
                radius = 15;
                speed = 4;
                breaks = 1;
                break;
            case 1: //medium
                radius = 50;
                speed = 2.5;
                breaks = 2;
                break;
            case 2: //big
                radius = 75;
                speed = 1;
                breaks = 3;
                break;
        }
        return new Asteroid(x,y,radius,rotation,speed,breaks)
    }
}

playerInput = {
    w:{
        pressed : false
    },
    a:{
        pressed : false
    },
    d:{
        pressed : false
    },
    s:{
        pressed : false
    },
    space:{
        pressed : false
    }
}

const player = new Player(
                    x=canvas.width/2,
                    y=canvas.height/2,
                )

let asteroids = []

const gameLoop = function(timeStamp){
    let delta = (timeStamp - lastTime)/1000;
    lastTime = timeStamp;
    if(lastTime && delta) {
        timePassed += delta;  
    }
    // console.log(lastTime, timePassed)
    fps = Math.round(1/delta)

    requestAnimationFrame(gameLoop);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = "white";
    ctx.font = "18px serif";
    ctx.fillText("FPS: " + fps, 10, 20)
    
    // all objects and player updates under this section
    
    player.angular_speed = 0;
    if (playerInput.w.pressed) player.linear_speed = LINEAR_SPEED;
    else if (!playerInput.w.pressed) player.linear_speed *= FRICTION;
    if (playerInput.a.pressed) player.angular_speed = -ANGULAR_SPEED;
    if (playerInput.d.pressed) player.angular_speed = ANGULAR_SPEED;

    if (playerInput.space.pressed) {
        player.shoot();
        playerInput.space.pressed = false;
        // console.log(player.bullets)
    }
    player.update();

    if (Math.abs(timePassed-1) < 0.001){
        asteroids.push(Asteroid.addAsteroid());
        timePassed = 0;
    }
    for (a in asteroids){
        asteroids[a].update()
        if (asteroids[a].x < 0 || canvas.width < asteroids[a].x ||
            asteroids[a].y < 0 || canvas.height < asteroids[a].y){
                asteroids.splice(a,1);
        }
        console.log(asteroids)
    }
    if(asteroids.length === 0){
        for (let j=0; j<3; j++){
            let a = Asteroid.addAsteroid();
            asteroids.push(a)
        }
    }
} 

gameLoop()


