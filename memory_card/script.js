const heart = '❤️';
const folder = 'images';
const card_h=180, card_w =100, margin=7;
const Rand = (x)=> Math.floor(Math.random() * x);

let CARDS = new Array(), found = [], selected = [];  //variables to store the cards and if they are up or down.
let CARD1, CARD2; // cards selected by user

let BOARD = document.getElementById('board');

const images = ['aftershock.svg', 'barrier-orb.svg', 'blade-storm.svg', 'blast-pack.svg', 'blaze.svg', 
    'boom-bot.svg', 'cloudburst.svg', 'curveball.svg', 'cyber-cage.svg', 'dark-cover.svg', 
    'fault-line.svg', 'flashpoint.svg', 'from-the-shadows.svg', 'healing-orb.svg', 'hot-hands.svg', 
    'hunters-fury.svg', 'incendiary.svg', 'neural-theft.svg', 'orbital-strike.svg', 'owl-drone.svg', 
    'paint-shells.svg', 'paranoia.svg', 'poison-cloud.svg', 'recon-bolt.svg', 'resurrection.svg', 
    'rolling-thunder.svg', 'run-it-back.svg', 'shock-bolt.svg', 'showstopper.svg', 'shrouded-step.svg', 
    'sky-smoke.svg', 'slow-orb.svg', 'snake-bite.svg', 'spycam.svg', 'stim-beacon.svg', 'tailwind.svg', 
    'toxic-screen.svg', 'trapwire.svg', 'updraft.svg', 'vipers-pit.svg'];

const BGI = ['BG1.jpg','BG2.jpg','BG3.jpg','BG4.webp','BG5.jpeg','BG6.jpg','BG7.jpg','BG8.jpg'];

const boards = {
    'beginner':{'rows':4,'cols':7}, //28 - 14 pairs
    'intermediate':{'rows':5,'cols':8}, //40 - 20 pairs
    'expert':{'rows':6,'cols':10}, // 56 - 28 pairs
}

window.onload = function(){
    document.getElementById('hearts').innerText = heart.repeat(5);
    // document.getElementById('reset').addEventListener('click',showCards);
    assingCards(boards['beginner']);
    makeCards(boards['beginner']);
    addListeners();
    BOARD.style.backgroundImage = 'url(images/background/'+BGI[Rand(BGI.length)]+')';
    // BOARD.style.opacity = '0.6';
}

const addListeners = function(){
    let cards = BOARD.children;
    for(let card of cards){
           card.addEventListener('click',clickCard);
    }
}

const clickCard = function(){
    if (CARD1 === undefined){
        CARD1 = this.id;
        document.getElementById(this.id).classList.toggle('card-flipped');
    }else if (CARD1 === this.id){
        console.log('shake card', this.id);
        // document.getElementById(this.id).classList.remove('card-flipped');
        document.getElementById(this.id).classList.add('wrong');
    }else if(!CARD2){
        console.log('second card');
        CARD2 = this.id;
        document.getElementById(this.id).classList.toggle('card-flipped');
    }

    console.log(CARD1, CARD2);
    setTimeout(update, 1000);
}

const update =function(){
    if(CARD1 && CARD2){
        let num1 = CARD1.slice(4).split('-');
        let num2 = CARD2.slice(4).split('-');
        
        if(CARDS[num1[0]][num1[1]] === CARDS[num2[0]][num2[1]]){
            found.push(CARD1);
            found.push(CARD2);
            document.getElementById(CARD1).classList.add('card-out');
            document.getElementById(CARD2).classList.add('card-out');
        }else{
            document.getElementById(CARD1).classList.toggle('card-flipped');
            document.getElementById(CARD2).classList.toggle('card-flipped');
            CARD1 = undefined;
            CARD2 = undefined;
        }
    }
}

const assingCards = function(size){
    CARDS = Array.from({length:size['rows']},
        ()=>Array.from({length:size['cols']},()=>0));
        
    faceCards = Array.from({length:size['rows']},
        ()=>Array.from({length:size['cols']},()=>0));

    let num_cards = size['rows']*size['cols']/2;
    for (let i=0;i<num_cards;i++){
        // get image from folder
        for (let j=0;j<2;j++){
            r1=Rand(size['rows']);
            c1=Rand(size['cols']);
            while(CARDS[r1][c1]!==0){
                r1=Rand(size['rows']);
                c1=Rand(size['cols']);
            }
            CARDS[r1][c1] = i+1;
            // assign image from folder
        }
    }
    selected = [];
    let img = Rand(images.length);
    while (selected.length<num_cards){
        img = Rand(images.length);
        if(!selected.includes(images[img])){
            selected.push(images[img])
        }
    }

} 

const makeCards = function(size){
    let board_h = size['rows']*card_h + size['rows']*2*margin;
    let board_w = size['cols']*card_w + size['cols']*2*(margin+0.5);
    // BOARD.style.padding = '35px 70px'
    BOARD.style.width = board_w.toString()+'px';
    BOARD.style.height = board_h.toString()+'px';

    for (let i=0;i<size['rows'];i++){
        for (let j=0;j<size['cols'];j++){
            let newDiv = document.createElement('div');
            newDiv.setAttribute("id","card"+i.toString()+"-"+j.toString());
            newDiv.setAttribute('class','card');
            
            let front = document.createElement('div');
            front.setAttribute("class","front");
            front.style.backgroundImage = 'url(images/logo/valorant-seeklogo.svg)';
            
            let back = document.createElement('div');
            back.setAttribute("class","back");
            
            back.style.backgroundImage = 'url(images/faces/'+selected[CARDS[i][j]-1]+')';
            
            newDiv.appendChild(front);
            newDiv.appendChild(back);
            BOARD.appendChild(newDiv);
        }
    }
}

// fucntion to get names from github !!!
// wont be use when runing the app !!!
async function getValorantIcons() {
    const owner = 'Blunix9';
    const repo = 'valorant-icons';
    const path = 'svg';
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
    
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      // Filter for files only (excluding directories)
      const files = data.filter(item => item.type === 'file');
      
      // Extract file names
      const fileNames = files.map(file => file.name);
      
      console.log(fileNames);
      return fileNames;
    } catch (error) {
      console.error('Error fetching Valorant icons:', error);
    }
  }

// None of the following code is being used due to wrong idea LOL

const showCards=function(){
    let cards = BOARD.children;
    for(let card of cards){
        if(areCardsDown){
            let num = card.id.slice(4).split('-');
            card.textContent = CARDS[num[0]][num[1]];
            turnCardUp(card,'url(images/faces/boom-bot.svg)');
            if(Rand(10)>8){
                turnCardUp(card,'url(images/faces/blaze.svg)'); 
            }
        }else{
            card.textContent ='';
            turnCardDown(card);
        }        
    }   
    areCardsDown = !areCardsDown;
}
const addTransfromationToCard =function(card){
    let num = card.id.slice(4).split('-');
    if (faceCards[num[0]][num[1]]===0){
        // card.classList.remove('card-rotate-down');
        card.classList.toggle('card-rotate');
        turnCardUp(card,'url(images/faces/blaze.svg)');
        card.textContent = CARDS[num[0]][num[1]];
        faceCards[num[0]][num[1]]=1;
    }else{
        card.classList.toggle('card-rotate');
        turnCardDown(card);
        faceCards[num[0]][num[1]]=0;
    }
}
const turnCardDown = function(card){
    // card.classList.toggle('card-content');
    card.style.backgroundColor = 'rgba(255, 0, 0, 0.703)';
    card.style.backgroundImage = 'url(images/logo/valorant-seeklogo.svg)';
}
const turnCardUp = function(card, card_id){
    card.style.backgroundColor = 'transparent';
    card.style.backgroundImage = card_id;
}


