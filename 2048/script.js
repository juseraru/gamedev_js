const vals = (i) =>2**i;
const N = 4;
const Rand = (x)=> Math.floor(Math.random() * x);
const makeTag = (x,e)=> vals(x)<= 4096 ? 'x'+e.textContent: 'other';
const madeMoved = (x)=> x===true;

let score = 0;
let board;

window.onload= function(){
    // addListeners();
    document.getElementById('reset').addEventListener("click",resetBoard);
    resetBoard();
}

function addListeners(){
    let elemets = document.getElementsByClassName('empty')
    for (let i=0; i<elemets.length;i++){
        elemets[i].addEventListener("click",changeColor);
        //elemets[i].addEventListener("dblclick",resetColor);
    }}
function changeColor(){
    let element = document.getElementById(this.id);
    let [r,c] = getCoords(element.id);
    board[r][c] += 1; 
    // console.log(element.id, r,c, board[r][c])
    // if (element.textContent){
    //     element.classList.remove('x'+element.textContent);
    // }
    // element.textContent = vals(board[r][c]);
    // let tag = vals(board[r][c])<= 4096 ? 'x'+element.textContent: 'other';
    // element.classList.add(tag);
    updateBoard(r,c);
}

function updateBoard(){
    for (let i=0;i<N;i++){
        for(let j=0;j<N;j++){
            let element = document.getElementById(getID(j,i));
            if (element.textContent){
                element.classList.remove('x'+element.textContent);
                element.classList.remove('other');
            }
            element.textContent = board[j][i]!==0 ? vals(board[j][i]): undefined;
            let tag = board[j][i] !==0 ? makeTag(board[j][i],element): 'empty';
            element.classList.add(tag);
            // console.log(element.classList);
        }
    }
}

function emptySpace(){
    for (let i=0;i<N;i++){
        for(let j=0;j<N;j++){
            if (board[i][j]===0){
                return false; 
            }
        }
    }
    return true;
}

function randomTile(){
    if(emptySpace()){
        console.log('no space')
        return;
    }
    let i=Rand(N);
    let j=Rand(N);
    while (board[i][j]!==0){
        i=Rand(N);
        j=Rand(N);
    }
    if (Math.random()>0.75){
        board[i][j] = 2;  
    }else{
        board[i][j] = 1;
    }
    // updateBoard();
    // turn set into array, 
    // then break each string element into a array of numbers 
    // get a 2 by 2 array
    // let pair = [...set].map((i)=>i.split(',').map((i)=>Number(i)));
}

function testBoard(){
    return [
        [1,1,1,1],
        [3,2,2,2],
        [4,3,3,3],
        [4,4,4,4]
    ]
}

function resetBoard(){
    board = Array.from({length:N},
        ()=>Array.from({length:N},()=>0));
    randomTile();
    randomTile();
    
    // board = testBoard();
    updateBoard();
    document.getElementById('endGame').textContent = '2048';
}

function transpose(){
    let newBoard = Array.from({length:N},
        ()=>Array.from({length:N},()=>0));;
    for (let i=0;i<N;i++){
        for(let j=0;j<N;j++){
            newBoard[i][j] = board[j][i];
        }
    }
    return newBoard;
}

function flip(){
    let newBoard = [];
    for (let i=N-1;i>=0;i--){
        newBoard.push(board[i]);
    }
    return newBoard;
}

function updateScore(value){
    score += value;
    document.getElementById("score").textContent = score; 
}

function operate(column){
    let merge = N;
    let moved = false;
    for (let i=N-2;i>=0;i--){
        for (let k=0;k<N-1;k++){
            // console.log(i+k,'=>',i+1+k);
            let temp1 =board[i+k][column];
            if (i+1+k<N && temp1 !== 0){
                let temp2 = board[i+1+k][column];
                // console.log('inside');
                if(temp2 === 0){
                    // console.log('empty');
                    board[i+1+k][column] = board[i+k][column];
                    board[i+k][column] = 0;
                    moved = true;
                }else if (temp1 === temp2 && merge>i+1+k){
                    // console.log('same', merge);
                    board[i+1+k][column] += 1;   
                    board[i+k][column] = 0;
                    updateScore(vals(board[i+1+k][column]));
                    merge = i+1+k;
                    moved = true;
                }else if(temp1 !== temp2){
                    break;
                }
            }else{break;}
        }
    }
    return moved;
}

function isGameOver(){
    if(emptySpace){
        console.log('over')
        
        // let kb = new KeyboardEvent('keydown',{
        //     code: 'ArrowDown',
        //     bubbles: true,
        //     cancelable: true,
        // })
        // document.dispatchEvent(kb);

        document.getElementById('endGame').textContent = 'Game Over';
    }
}

window.addEventListener(
    "keydown",
    (event) => {
        if (event.repeat){
            return;
        }
        switch (event.code){
            case 'ArrowLeft':{
                board = transpose();
                board = flip();
                let moved = [];
                for (let i=0;i<N;i++){
                    moved.push(operate(i));   
                }
                if(moved.some(madeMoved)){
                    randomTile();
                }
                board = flip();
                board = transpose();
                updateBoard();
                break;
            }
            case 'ArrowRight':{
                board = transpose();
                let moved = [];
                for (let i=0;i<N;i++){
                    moved.push(operate(i));   
                }
                if(moved.some(madeMoved)){
                    randomTile();
                }
                board  = transpose();
                updateBoard();
                break;
            }
            case 'ArrowUp':{
                board = flip();
                let moved = [];
                for (let i=0;i<N;i++){
                    moved.push(operate(i));   
                }
                if(moved.some(madeMoved)){
                    randomTile();
                }
                board = flip();
                updateBoard();
                break;
            }
            case 'ArrowDown':{
                let moved = [];
                for (let i=0;i<N;i++){
                    moved.push(operate(i));   
                }
                if(moved.some(madeMoved)){
                    randomTile();
                }
                updateBoard();
                break;
            }                
        }
        // isGameOver();
    },
    false,
    );

function getNum(r,c){
    return (N*r+1) + c;
}

function getID(r,c){
    if (r<0 || r>=N || c<0 || c>=N){
        // console.log('out');
        return ;
    }
    return 'tile'+getNum(r,c).toString();
}

function getCoords(n){
    n = Number(n.slice(4))
    let r = Math.floor((n-1)/N) | 0;
    let c = (n-1) - (N*r);
    return [r, c];
}