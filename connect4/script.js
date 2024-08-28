const playerRed = 'Red';
const playerBlue = 'Blue';
let currentPlayer, pastPlayer, gameOver, spot, board;

const columns = 7;
const rows = 6;

window.onload = function (){
    init()
    addListeners()
}

function init(){
    gameOver = false;
    currentPlayer = Math.random() > 0.5 ?  playerRed : playerBlue;
    document.getElementById('text').textContent = 'player\'s move';
    changeText(currentPlayer)
    
    spot = Array.from({length:columns},()=>rows-1);
    board = Array.from({length:rows},()=>Array.from({length:columns},()=>' '));
}

function addListeners(){
    document.getElementById('reset').addEventListener("click",resetBoard);

    for (let i =1; i<=columns*rows; i++) {
        document.getElementById('circ'+i.toString()).addEventListener("click", changeColor);
    }
}

function resetBoard(){
    init()
    for (let i =1; i<=columns*rows; i++) {
        document.getElementById('circ'+i.toString()).style.backgroundColor = 'White';
        document.getElementById('circ'+i.toString()).style.borderColor = 'black';
    }
}

function changeText (cur){
    if (gameOver){
        cur = pastPlayer
        document.getElementById('text').textContent = 'player is the WINNER';
    }
    document.getElementById('player').textContent = cur;
    document.getElementById('player').style.color = cur;
}

function getNum(r,c){
    return (7*r+1) + c;
}

function getID(r,c){
    if (r<0 || r>=rows){
        // console.log('out');
        return ;
    }
    if (c<0 || c>=columns){
        // console.log('out');
        return ;
    }
    return 'circ'+getNum(r,c).toString();
}

function getCoords(n){
    n = Number(n.slice(4))
    let r = Math.floor((n-1)/columns) | 0;
    let c = (n-1) - (7*r);
    return [r, c];
}

function setPiece(r,c){
    board[r][c] = currentPlayer;
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function changeBorder(ids){
    let n = ids.length;
    for (let i=0; i<n-3;i++){
        for (let j=i; j<i+4;j++){
            document.getElementById(ids[j]).style.borderColor = 'yellow';
        }
    }
}

async function AchangeBorder(ids){
    let n = ids.length;
    for (let i=0; i<n-3;i++){
        for (let j=i; j<i+4;j++){
            document.getElementById(ids[j]).style.borderColor = 'yellow';
        }
        await delay(1000)
        for (let j=i; j<i+4;j++){
            document.getElementById(ids[j]).style.borderColor = 'black';
        }
    }
}

function checkEquals(ids){
    let n = ids.length;
    for (let i=0; i<n-3;i++){
        let arr = [];
        for (let j=i; j<i+4;j++){
            let [r,c] = getCoords(ids[j]);
            arr.push(board[r][c]);
        }
        if (new Set(arr).size === 1){
            // console.log('winner'+currentPlayer)
            gameOver = true;
            changeBorder(ids.slice(i,i+4));
        }
    }
}

function checkWinner(r,c){
    let left = c-3;
    let right = c+3;
    let top = r-3;
    let down = r+3;

    //horizontal
    let ids = [];
    for (let i =left; i<=right; i++){
        if (getID(r,i)){
            ids.push(getID(r,i));
        }
    }
    // AchangeBorder(ids);
    checkEquals(ids);
    
    // vertical
    ids = [];
    for (let i=top; i<=down; i++){
        if (getID(i,c)){
            ids.push(getID(i,c));
        }
    }
    // AchangeBorder(ids);
    checkEquals(ids);

    //diagonals
    ids = [];
    let i = left;
    let j = down;
    while (i<=right && j>=top){
        if (getID(j,i)){
            ids.push(getID(j,i));
        }
        i++;
        j--;
    }
    // AchangeBorder(ids);
    checkEquals(ids);

    ids = [];
    i = left;
    j = top;
    while (i<=right && j<=down){
        if (getID(j,i)){
            ids.push(getID(j,i));
        }
        i++;
        j++;
    }
    // AchangeBorder(ids);
    checkEquals(ids);
}   

function changeColor(){
    if (gameOver){
        return ;
    }

    let [r,c] = getCoords(this.id)
    //console.log(this.id, '=>',  r, c )
    if (spot[c] > -1){
        newR = spot[c];
        setPiece(newR,c);
        spot[c] -= 1;
    }
    else {
        return ;
    }
    
    element = getID(newR, c);
    pastPlayer = currentPlayer;
    if (currentPlayer == playerRed){
        document.getElementById(element).style.backgroundColor = playerRed;
        currentPlayer = playerBlue;
    } else {
        document.getElementById(element).style.backgroundColor = playerBlue;
        currentPlayer = playerRed;
    }
    checkWinner(newR, c)    
    changeText(currentPlayer);
}