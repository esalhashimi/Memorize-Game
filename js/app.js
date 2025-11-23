/*-------------------------------- Variables --------------------------------*/

let firstCard = null; // for add flip in First Card
let secondCard = null; // for add flip in Second Card
let image1 = null; // for add Path Image  in First Card
let image2 = null;// for add Path Image in Second Card
let canClick = true; // if not match can not click befor timeoun finish
let score = 0; //for win the game
let message = null; // For put message after win and lose
let randomOrder = null; //For shuffle all Cards
let max = 15; // for max Attemps
let count = 0; // for increase each Attemps to qual max
let timer; // for timer increase
let second = 0; //to track the second
let minutes =0; //to track the minutes
let audio = new Audio(); // Build Audio
/*------------------------ Cached Element References ------------------------*/

const allCards = document.querySelectorAll(".card"); // for controll All Cards
const AttempsCount = document.querySelector("#move-count"); // for increase Count
const timeElapsed = document.querySelector("#time-elapsed") // for calculate timer
const resetButton = document.querySelector("#restart-btn");// for after click button reset
const titleResult = document.querySelector("#modal-title"); // for put title the result
const descripeResult = document.querySelector("#model-text"); // for put the result if win or lose
/*----------------------------- Event Listeners -----------------------------*/


//for add Event for All Cards after click use handleCardClicket
for(let card = 0 ; card<allCards.length ; card++){
    allCards[card].addEventListener("click" , handleCardClicked);
}
resetButton.addEventListener("click",init);
init() // for init the game and reset


/*-------------------------------- Functions --------------------------------*/

// For can see the game befor start game
function init() {
    clearInterval(timer);
    shuffleCards(); // For change place card befor Play
    for (let i = 0; i < allCards.length; i++) {
        allCards[i].classList.add("flip");
    }

    canClick = false;

    setTimeout(() => {
        for (let i = 0; i < allCards.length; i++) {
            allCards[i].classList.remove("flip");
        }
        canClick = true; 
        startTimer(); // for start setup the timer
    }, 3000);

    second = 0;
    timeElapsed.textContent = "00 : 00"; // for display the init time
    count = 0;
    AttempsCount.textContent = count;
    titleResult.textContent = "";
descripeResult.innerHTML = "";
 playSound();// Play the sound
}

// handle clicking on a card
function handleCardClicked(Event){
    playSound(); //Play the sound
    if(canClick === false){
        return;
    }
   const clickedCard = Event.target.closest('.card'); // for use closer parent to card

   const frontCardImage = clickedCard.querySelector("img"); // for controll the Image Element

   const frontCardPath = frontCardImage.src; //for bring Path Image 

//prevent card double click
if(clickedCard.classList.contains("flip")){
    return;
}

        clickedCard.classList.add("flip"); // after click add flip class
        // store flip to firstCard and SecondCard
        if(firstCard === null){
            firstCard = clickedCard;
        }
        else if(secondCard === null){
            secondCard = clickedCard;
        }

        // store Image Path to image1 and image2
        if(image1 === null){

            image1 = frontCardPath;
            
        }
        else if(image2 === null){
            image2 = frontCardPath;
        }

        //for handle matching condition
        if(image1 === image2){
            Attemps();
            firstCard = null;
            secondCard = null;
            image1 = null;
            image2 = null;
           
            score++;
            if(score === 6){
                handleGameOver();
            }
           
        }
        
        //For non matching but the both card have the card store
        else if(image1 !== null && image2 !== null){
            canClick = false;
            setTimeout(() =>{
                 
            firstCard.classList.remove("flip");
            secondCard.classList.remove("flip");
            firstCard = null;
            secondCard = null;
            image1 = null;
            image2 = null;
            canClick = true;
            },1000);
        }
        Attemps();
}

// for after finish the game
function handleGameOver(){
    clearInterval(timer);
if(count === max){
    message = "You lose";
}
else{
    message = "You win";
}

//for store time Elapsed for finish the game and display the result
const finalTime = timeElapsed.textContent;
titleResult.textContent = "The Result is ";
descripeResult.innerHTML = message + "<br>" +
 "Number of Attempts: " + count + "<br>" + "Timer: " + finalTime;
canClick = false;
for(let card = 0 ; i<allCards.length ; card++){
    card.classList.remove("flip");
    card.removeEventListener("click", handleCardClicked);
    card.classList.add("Game Over Disabled");
}
}


// For replace random Card
function shuffleCards(){
    for(let card = 0 ; card<allCards.length ; card++){
        randomOrder = Math.floor(Math.random() * allCards.length);
        allCards[card].style.order = randomOrder;
    }
}

//for count Attemps
function Attemps(){
    if(image1 !== null && image2 !== null){
        count++;
        AttempsCount.textContent = count;
    }
    if(count === max){
        handleGameOver();
    }
    
}

// for count the time and display the time
function startTimer(){
    timer = setInterval(() =>{
        second++;
        minutes = Math.floor(second/60);
        const remainingSeconds = second%60; 

        const formattedMinutes = String(minutes).padStart(2,"0");
        const formattedSeconds = String(remainingSeconds).padStart(2,"0");

        timeElapsed.textContent = `${formattedMinutes} : ${formattedSeconds}`;
        
},1000);
}

//controll the sound
function playSound(){
    audio.src = "../sound/click.wav";
    audio.play();
}
