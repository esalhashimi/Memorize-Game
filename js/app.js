/*-------------------------------- Variables --------------------------------*/

let firstCard = null; // for add flip in First Card
let secondCard = null; // for add flip in Second Card
let image1 = null; // for add Path Image  in First Card
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
let initTimeout; // for init setTimeout variable gor store time

/*------------------------ Cached Element References ------------------------*/

const allCards = document.querySelectorAll(".card"); // for controll All Cards
const AttempsCount = document.querySelector("#move-count"); // for increase Count
const timeElapsed = document.querySelector("#time-elapsed") // for calculate timer
const resetButton = document.querySelector("#restart-btn");// for after click button reset
const titleResult = document.querySelector("#modal-title"); // for put title the result
const descripeResult = document.querySelector("#modal-text"); // for put the result if win or lose

/*----------------------------- Event Listeners -----------------------------*/

//for add Event for All Cards after click use handleCardClicket
for(let card = 0 ; card<allCards.length ; card++){
    allCards[card].addEventListener("click" , handleCardClicked);
}
resetButton.addEventListener("click",init);
init() // for init the game and reset


/*-------------------------------- Functions --------------------------------*/

// For can see the game befor start game
function init(Event) {
    clearInterval(timer); // stop the temporary
    clearTimeout(initTimeout); // for cancellation
    
    // for remove the event and add event to prevent replace the event
    for(let card=0; card<allCards.length ; card++){
        allCards[card].removeEventListener("click", handleCardClicked);
        allCards[card].addEventListener("click", handleCardClicked);
        allCards[card].classList.remove("flip");
        // **NEW (Fix 3): Clean 'matched' class for a new game**
        allCards[card].classList.remove("matched"); 
    }
    
    score = 0; // reset the result
    shuffleCards(); // For change place card befor Play
    
    //display the card after 3 second
    for (let i = 0; i < allCards.length; i++) {
        allCards[i].classList.add("flip");
    }

    canClick = false;

    initTimeout = setTimeout(() => {
        for (let i = 0; i < allCards.length; i++) {
            allCards[i].classList.remove("flip");
        }
        canClick = true; 
        startTimer(); // for start setup the timer
    }, 3000);

    second = 0;
    minutes = 0;
    timeElapsed.textContent = "00 : 00"; // for display the init time
    count = 0;
    AttempsCount.textContent = count;
    titleResult.textContent = "";
    descripeResult.innerHTML = "";
    if(Event && Event.target && Event.target.id === "restart-btn"){
        playSound("Reset","wav"); // play Reset sound
    }
}

// handle clicking on a card
function handleCardClicked(Event){
    playSound("click","wav"); //Play the click sound
    
    if(canClick === false || Event.target.closest('.card').classList.contains("matched")){
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
            image1 = frontCardPath; // Store image path right away
        }
        else if(secondCard === null){
            secondCard = clickedCard;
            image2 = frontCardPath; // Store image path right away
        }


        //for handle matching condition
        if(image1 === image2 && image1 !== null){
            // **NEW (Fix 1): Add 'matched' class to keep cards open on finish**
            firstCard.classList.add("matched"); 
            secondCard.classList.add("matched"); 
            
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
            Attemps(); // Count attempt before timeout
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
}

// for after finish the game
function handleGameOver(){
    clearInterval(timer);
    
    if(count >= max && score < 6){
        message = "You lose";
    }
    else if(score === 6){
        message = "You win";
        playSound("win","wav");
    }

    // display the result
    titleResult.textContent = "The Result is ";
    descripeResult.innerHTML = message + "<br>" +
    "Number of Attempts: " + count + "<br>" + 
    "Timer: " + timeElapsed.textContent;
    
    canClick = false;
    
    // **NEW (Fix 2): Only close non-matched cards**
    for(let card = 0 ; card<allCards.length ; card++){
        // If the card is NOT 'matched', remove 'flip' (close it)
        if(!allCards[card].classList.contains("matched")){ 
            allCards[card].classList.remove("flip");
        }
        // Always remove the event listener to lock the game
        allCards[card].removeEventListener("click", handleCardClicked);
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
    if(count >= max && score < 6){
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
function playSound(name,Path){
    // stop terminate and setup
    audio.pause();
    audio.currentTime = 0;
    
    // set a new path
    audio.src = "../sound/" + name + "." + Path;
    
    // Attempting to run with error handling
    audio.play().catch(error => {
    });
}