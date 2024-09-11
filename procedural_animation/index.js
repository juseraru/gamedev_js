// inspiration
// https://github.com/argonautcode/animal-proc-anim/tree/main

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = 860;

let isMoving = false;
let lastTime;
let curr_index;

const RADIUS = 15

const PlayerInput ={
    mouse1:{
        pressed: false
    },
    c:{ // connect circles
        pressed: false,
        color: "red",
    },
    r:{ // change radius
        pressed: false,
        color: "cyan",
    },
    f:{ // from fill to stroke
        pressed: false,
        color: "gray", // rgb(211, 211, 211)
    },
    selected:{
        index: null,
    }
}

window.addEventListener('keydown',(event)=>{
    switch(event.code){
        case "KeyF":
            PlayerInput.f.pressed = true;
            break;
        case "KeyR":
            PlayerInput.r.pressed = true;
            break;
        case "KeyC":
            PlayerInput.c.pressed = true;
            break;
        default:
            break;
    }
})

window.addEventListener('keyup',(event)=>{
    switch(event.code){
        case "KeyF":
            PlayerInput.f.pressed = false;
            break;
        case "KeyR":
            PlayerInput.r.pressed = false;
            break;
        case "KeyC":
            PlayerInput.c.pressed = false;
            break;
        default:
            break;
    }
})

canvas.addEventListener('mousedown',(event)=>{
    let x = event.clientX;
    let y = event.clientY;
    let [ret, index] = Circle.addCircle(x,y,RADIUS) 
    if (!ret){
        PlayerInput.mouse1.pressed = true;
        curr_index = index;
    }
    if(PlayerInput.f.pressed){
        Circle.circles[index].setFill()
    }
})

canvas.addEventListener('mouseup',(event)=>{
    PlayerInput.mouse1.pressed = false;
})

canvas.addEventListener('mousemove', (event)=>{
    isMoving = true;
    if(PlayerInput.mouse1.pressed){
        if(PlayerInput.r.pressed){
            Circle.changeRadius(curr_index,event.x,event.y)
        }else{Circle.moveCircle(curr_index,event.x,event.y)}
    }
    for (let c in Circle.circles){
        let cc = Circle.circles[c]
        if (distance(event.x,event.y,cc.x,cc.y) <= cc.radius){
            PlayerInput.selected.index = c;
            return;       
        }
    }
    PlayerInput.selected.index = null;
})

function distance(x1,y1,x2,y2){
    return Math.sqrt((x1-x2)**2 + (y1-y2)**2)
}

class Circle{
    static circles = [];

    constructor(x,y,radius){
        this.x = x;
        this.y = y;
        this.radius = radius;

        this.fill_flag = true;
    }

    static addCircle(x,y,radius){
        for (let c in this.circles){
            let cc = this.circles[c]
            if (distance(x,y,cc.x,cc.y) <= cc.radius){
                return [false, c]
            }
        }
        this.circles.push(
            new Circle(x,y,radius)
        )
        return [true, -1]
    }

    static moveCircle(index,x,y){
        if(index === null) return
        this.circles[index].setPos(x,y)
    }

    static changeRadius(index,x,y){
        this.circles[index].radius = distance(
            x,
            y,
            this.circles[index].x,
            this.circles[index].y
        )
    }

    draw(c){
        c.fillStyle = 'white';
        c.strokeStyle = 'white'; 
        c.lineWidth = 2
        c.beginPath()
        c.arc(this.x, this.y, this.radius,0,2*Math.PI)
        if(this.fill_flag) c.fill()
        else c.stroke()
        c.closePath()
    }

    setPos(x,y){
        this.x = x;
        this.y = y;
    }

    setRadius(r){
        this.radius = r;
    }

    setFill(){
        this.fill_flag = !this.fill_flag;
    }
}

function highlight(ctx){
    if(!PlayerInput.r.pressed 
        && !PlayerInput.f.pressed
        && !PlayerInput.c.pressed) return
    
    if(PlayerInput.f.pressed){
        if(PlayerInput.selected.index === null) return
        ctx.strokeStyle = PlayerInput.f.color
    }else if(PlayerInput.r.pressed){
        if(PlayerInput.selected.index === null) return
        ctx.strokeStyle = PlayerInput.r.color
    }else if(PlayerInput.c.pressed){
        if(PlayerInput.selected.index === null) return
        ctx.strokeStyle = PlayerInput.c.color
    }    
    
    let circle = Circle.circles[PlayerInput.selected.index]
    ctx.lineWidth = 5
    ctx.beginPath()
    ctx.arc(circle.x,circle.y,circle.radius,0,2*Math.PI)
    ctx.stroke()
}

function animate(timeStep){
    let delta = (timeStep - lastTime)/1000;
    lastTime = timeStep;

    ctx.clearRect(0,0,canvas.width,canvas.height)
    let fps = Math.ceil(1/delta);
    ctx.fillStyle = 'white';
    ctx.font = "24px serif";
    ctx.fillText('FPS: '+fps, 10,25)
    
    requestAnimationFrame(animate)

    for (let c in Circle.circles){
        Circle.circles[c].draw(ctx);
    }

    highlight(ctx)
}

animate()