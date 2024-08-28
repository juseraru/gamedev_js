const buttons =[
    "button-8x8",
    "button-16x16",
    "button-30x16"
]

let show, mines, numbers, flags;
let total_mines;
let C, R;
let gameOver = false;

const Rand = (x)=> Math.floor(Math.random() * x);

window.onload = function(){
    addListeners();
    click_event = new CustomEvent('click');
    btn_element = document.querySelector('#button-8x8');
    btn_element.dispatchEvent(click_event);
}

const addListeners = function() {
    for (let button of buttons){
        document.getElementById(button).addEventListener("click",clickButtons);
    }
    document.getElementById('reset').addEventListener("click",resetBoard);
}

const resetBoard = function(){
    let element = document.getElementById('board');
    let curr_board = element.classList[0].slice(6)
    element.innerHTML = '';
    createBoard(curr_board,element);
    gameOver = false;
}

const fillMines = function(cols,rows,total_mines){
    while (total_mines>0){
        let c = Rand(cols);
        let r = Rand(rows);
        if (mines[r][c] === 0){
            mines[r][c] = 1;
            total_mines -= 1;
        }
    }
}

const createMines = function(size){
    switch (size){
        case '8x8':
            total_mines = 10;
            document.getElementById('num_mines').innerText = total_mines;
            fillMines(8,8,total_mines);
            break;
        case '16x16':
            total_mines = 40;
            document.getElementById('num_mines').innerText = total_mines;
            fillMines(16,16,total_mines);
            break;
        case '30x16':
            total_mines = 90;
            document.getElementById('num_mines').innerText = total_mines;
            fillMines(30,16,total_mines);
            break;
    }
}

const testMines = function(){
    return [
        [0,0,0,0,1,0,1,0],
        [0,0,1,0,0,1,0,0],
        [0,0,0,0,0,0,1,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,1,0,0,0,0],
        [1,0,0,0,0,0,0,1],
        [0,0,0,0,0,0,0,0],
        [0,0,0,1,0,0,0,1],
    ]
}

const eightNeighbours = function(i,j){
    for (let p=i-1;p<=i+1;p++){
        for (let q=j-1;q<=j+1;q++){
            if (0<=p && p<R && 0<=q && q<C){
                if (mines[p][q]===0){
                    numbers[p][q]+=1;
                }
            }
        }       
    }
}

const computeNumbers=function(){
    for (let i=0;i<R;i++){
        for(let j=0;j<C;j++){
            if (mines[i][j]===1){
                eightNeighbours(i,j);
            }
        }
    }
}

const createBoard = function(size, container){
    // console.log('size ',size)
    if (size === '8x8'){
        C = Number(size.slice(0,1));
        R = Number(size.slice(-1));
        // console.log(n,m)
    } else{
        C = Number(size.slice(0,2));
        R = Number(size.slice(-2));
        // console.log(n,m)
    }
    // all tiles are unopened to change the vizuals
    show = Array.from({length:R},
        ()=>Array.from({length:C},()=>0));

    // where the mines are, 0 no mine, 1 mine. check game state
    mines = Array.from({length:R},
        ()=>Array.from({length:C},()=>0));

    // where the flags will be placed 0 no flag, 1 flag. check game state
    flags = Array.from({length:R},
        ()=>Array.from({length:C},()=>0));

    // where the numbers that surround the mines go
    numbers = Array.from({length:R},
        ()=>Array.from({length:C},()=>0));

    for ( let i=0;i<R;i++){
        for(let j=0;j<C;j++){
            let newElement = document.createElement("div");
            newElement.setAttribute("id","tile"+i.toString()+"-"+j.toString());
            newElement.setAttribute("class","tile");
            newElement.addEventListener('click',clickTiles);
            newElement.addEventListener("contextmenu", clickTiles);
            container.appendChild(newElement);
        }
    }
    createMines(size);
    // mines = testMines();
    computeNumbers();
}

const showMines = function(){
    for (let i=0;i<R;i++){
        for(let j=0;j<C;j++){
            if (mines[i][j]===1 && flags[i][j]===0 && show[i][j]===0){
                show[i][j]=1;
                let newElement = document.createElement("div");
                newElement.setAttribute("class","mine");
                let element = document.getElementById("tile"+i.toString()+"-"+j.toString());
                element.classList.add('tile-bomb');
                element.appendChild(newElement);
            } else if (mines[i][j]===1 && flags[i][j]===1 && show[i][j]===0){
                show[i][j]=1;
                let newElement = document.createElement("div");
                newElement.setAttribute("class","mine-cross");
                let element = document.getElementById("tile"+i.toString()+"-"+j.toString());
                element.classList.add('cross');
                element.appendChild(newElement);
            }
        }
    }
}

const bfs = function(i,j,visited){
    // console.log(i.toString()+"-"+j.toString())
    if(visited.includes(i.toString()+"-"+j.toString())){
        // console.log('visited');
        return;
    }
    visited.push(i.toString()+"-"+j.toString());
    if (mines[i][j]===1){
        // console.log('mine out');
        return;
    }
    if (numbers[i][j]>0){
        show[i][j]=1;
        let element = document.getElementById("tile"+i.toString()+"-"+j.toString());
        element.textContent = numbers[i][j].toString();
        element.classList.add('number');
        // console.log('number out');
        return;
    }
    for (let p=i-1;p<=i+1;p++){
        for (let q=j-1;q<=j+1;q++){
            if (0<=p && p<R && 0<=q && q<C){
                // console.log(typeof(p),typeof(i),typeof(q),typeof(j))
                if (p === i && q ===j){
                    continue;
                }
                // console.log(i,j,'bfs',p,q);
                bfs(p,q,visited);
            }
        }
    }
    show[i][j]=1;
    let element = document.getElementById("tile"+i.toString()+"-"+j.toString());
    element.classList.add('empty');
}

const clickTiles = function(e){
    e.preventDefault();
    if (gameOver){
        return;
    }
    let nums = this.id.slice(4).split('-');
    let i = Number(nums[0]);
    let j = Number(nums[1]);

    if (e.button === 2 && show[i][j]===0){
        flags[i][j] = 1;
        let element = document.getElementById("tile"+i.toString()+"-"+j.toString());
        element.classList.add('flag');
        return false;
    }
    
    if (mines[i][j]===1){
        showMines();
        gameOver=true;
        return;
    }else if(numbers[i][j]>0 && flags[i][j]===0){
        show[i][j]=1;
        let element = document.getElementById("tile"+i.toString()+"-"+j.toString());
        element.textContent = numbers[i][j].toString();
        element.classList.add('number');
    }else{
        let visited = [];
        bfs(i,j,visited);
    }
}

const clickButtons = function(){
    let element = document.getElementById('board');
    let button_id = this.id;
    if(element.childElementCount > 0){
        if(confirm("The board will be reset to board"+button_id.slice(6))){
            document.getElementById('board').innerHTML = '';
        }
        else{return}
    }
    let possible_classes = buttons.filter((x)=>(x !== button_id));
    for (let p_class of possible_classes){
            element.classList.remove('board'+p_class.slice(6));
        }
    element.classList.add('board'+button_id.slice(6));
    let board_size = button_id.slice(7)
    createBoard(board_size,element);
    // the update of the board should be outside
    // should only update when click on tile, no need to cover all board
    // only for debugging purposess
    // showMines(); 
    }
