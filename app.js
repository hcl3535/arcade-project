//state ------------------------------------------------------------------------------------------------------------- 
let state = {
  start: function() {
    createPlayBoxTest()
    createSnake()
    createApple()
  },
  playing: function(speed) {
    changeDirectionsToScore()
    startTimer(true, speed)
    dissapearDifficultys()
    changeToReset()
    this.currentState = "playing"
  }, 
  gameOver: function() {
    startTimer(false)
    updateScreenForGameOver()
    updateHighScore()
    this.currentState = "gameOver"
  },
  score: 0,
  lengthOfSnake: 0,
  grid: [],
  snake: [[9, 10],[8, 10],[7, 10],[6, 10]],
  direction:[1,0],
  appleLocation: [],
  currentState:"start",
  highScore: [0,0,0,0,0,0,0,0,0,0]
 }


//state changers --------------------------------------------------------------------------------------------------------


// creates grid(array of array of objects) that has position and div referances
let playBox = document.getElementById("playBox")

function createPlayBoxTest() {
  for(let i = 0; i < 20; i++) {
    let row = [];
    for (let j = 0; j < 20; j++){     
      let div = document.createElement("div");
      playBox.append(div);
      div.style.width = "28px"
      div.style.height = "28px"
      div.style.border = "1px solid green"
      row.push({position: [i,j], reference: div,})
    }
    state.grid.push(row)
  }
}
// console.log(state.grid)

//creates apple
function createApple() {
  getRandomCoordinates()
  placeApple()
}
//finds random block to place apple
function getRandomCoordinates(){
  let repeat = false
  let location = []
  let randomY = Math.floor(Math.random() * (19 - 0 + 1))
  let randomX = Math.floor(Math.random() * (19 - 0 + 1))
  location.push(randomY)
  location.push(randomX)
  let result = state.snake.filter( (array) => {
    if (array.toString() === location.toString()){
      console.log("apple collision") 
      repeat = true
      }
    }
  )

  state.appleLocation = location
  if(repeat) {
    createApple()
  }
}
// colors the apple block
function placeApple(){
  let y = state.appleLocation.slice(0, 1)
  let x = state.appleLocation.slice(1)
  let block = state.grid[y][x].reference
  block.style.backgroundColor = "red";
}

//deletes old apple
function deleteOldApple(){
  let y = state.appleLocation.slice(0, 1)
  let x = state.appleLocation.slice(1)
  let block = state.grid[y][x].reference
  block.style.backgroundColor = "black";
}

//creates snake
function createSnake() {
  for (let i = 0; i < state.snake.length; i++ ) {
    let currentSnakePart = state.snake[i]
    // console.log(state.snake[i])
    let y = currentSnakePart.slice(0, 1)
    let x = currentSnakePart.slice(1)
    let block = state.grid[y][x].reference
    // console.log(block)
    block.style.backgroundColor = "lime";
    block.style.borderColor = "lime"
    if(i === 0){
      block.style.backgroundColor = "limegreen" 
      block.style.borderColor = "limegreen"
    }
  }
}

//deletes old snake
function deleteOldSnake() {
  for (let i = 0; i < state.snake.length; i++ ) {
    let currentSnakePart = state.snake[i]
    // console.log(state.snake[i])
    let y = currentSnakePart.slice(0, 1)
    let x = currentSnakePart.slice(1)
    let block = state.grid[y][x].reference
    // console.log(block)
    block.style.backgroundColor = "black";
    block.style.borderColor = "green"
    }
  }




//starts the interval which controls game speed
let timer
function startTimer(bool, speed) {
  // debugger;
  console.log("starting timer")
  if(bool === true ) {
    timer = setInterval(moveSnake, speed)
  } 
  if (bool === false){
    clearInterval(timer)
    console.log("clear")
  }  
} 

//moves snake
function moveSnake(){
  let dead = addHead()
  if (dead === true) return
  if (state.snake[0].toString() !== state.appleLocation.toString()){
    removeTail()
  } else{
    addScore()
    updateScore()
    createApple()
  }
  createSnake()
  
}

function addHead(){
  let newHeadLocation = []
  let directionY = state.direction.slice(0, 1) 
  let directionX = state.direction.slice(1)
  let snakeHeadY = state.snake[0].slice(0, 1)
  let snakeHeadX = state.snake[0].slice(1)
  let newHeadLocationY = parseInt(snakeHeadY) + parseInt(directionY)
  let newHeadLocationX = parseInt(snakeHeadX) + parseInt(directionX)
  newHeadLocation.push(newHeadLocationY)
  newHeadLocation.push(newHeadLocationX)
  if (checkIfSnakeRanIntoItself(newHeadLocation)){
    state.gameOver()
    return true
  }
  if (checkIfSnakeRanOffScreen(newHeadLocation)) {
    state.gameOver()
    return true
  }
  state.snake.unshift(newHeadLocation) 
  // console.log(state.snake[0])
} 

function removeTail(){
  let tail = state.snake[state.snake.length - 1]
  let y = tail.slice(0, 1)
  let x = tail.slice(1)
  let block = state.grid[y][x].reference
  block.style.backgroundColor = "black"
  block.style.borderColor = "green"
  // console.log(tail)
  state.snake.pop()
}

//increeses score by 100
function addScore() {
  state.score += 100
}

//checks if snake ran into itself
function checkIfSnakeRanIntoItself(newHeadLocation){
  // debugger
  let result = state.snake.filter( (array) => {
    if (array.toString() === newHeadLocation.toString()){
      console.log("should die")
      state.gameOver()
      return true
    }
    }
  )
  return false
} 

//checks if snake ran off screen
function checkIfSnakeRanOffScreen(newHeadLocation){
  let y = newHeadLocation.slice(0, 1)
  let x = newHeadLocation.slice(1)
  if (y <= -1 || y >= 20){
    
    return true
  } 
  if (x <= -1 || x >= 20){
    
    return true
  } 
  return false
}

//keydown Events
document.addEventListener('keydown', whichKeyWasPressed)

function whichKeyWasPressed(key) {    
  if(key.key === 'w' && state.direction.toString() !== [1,0].toString()) state.direction = [-1,0]
  if(key.key === 's' && state.direction.toString() !== [-1,0].toString()) state.direction = [1,0]
  if(key.key === 'a' && state.direction.toString() !== [0,1].toString()) state.direction = [0,-1]
  if(key.key === 'd' && state.direction.toString() !== [0,-1].toString()) state.direction = [0,1]
  if(key.key === 'ArrowUp' && state.direction.toString() !== [1,0].toString()) state.direction = [-1,0]
  if(key.key === 'ArrowDown'&& state.direction.toString() !== [-1,0].toString()) state.direction = [1,0]
  if(key.key === 'ArrowLeft' && state.direction.toString() !== [0,1].toString()) state.direction = [0,-1]
  if(key.key === 'ArrowRight' && state.direction.toString() !== [0,-1].toString()) state.direction = [0,1]

  
}

//reset button
let resetButton = document.getElementById("reset")

resetButton.addEventListener('click', resetGame)

function resetGame(){
  if(state.currentState !== "start"){
    startTimer(false)
    state.score = 0
    updateScore()
    deleteOldSnake()
    state.snake = [[9, 10],[8, 10],[7, 10],[6, 10]]
    createSnake()
    state.currentState = "start"
    deleteOldApple()
    createApple()
    reappearDifficultys()
    changeResetToSelectDifficulty()
    state.direction = [1, 0]
  }     
}

//rendering --------------------------------------------------------------------------------------------------------

//change start directions to score

let instructions = document.getElementById("instructions")

function changeDirectionsToScore() {
  instructions.innerText = "Your Score"
}

//updates score
let score = document.getElementById("score")

function updateScore(){
  score.innerText = state.score
}

//updates everything for game over screen
function updateScreenForGameOver(){
  instructions.innerText = "Game Over!"
}

//updates the difficultys to dissapear when game starts

let easy = document.getElementById("easy")
let medium = document.getElementById("medium")
let hard = document.getElementById("hard")

function dissapearDifficultys(){
  easy.innerText = ""
  medium.innerText = ""
  hard.innerText = ""
}
//clickevents for difficultys
easy.addEventListener('click', easyMode)
medium.addEventListener('click', mediumMode)
hard.addEventListener('click', hardMode)

function easyMode() {
  state.playing(300)
}

function mediumMode() {
  state.playing(150)
}

function hardMode() {
  state.playing(75)
}

//changes select difficulty to reset button
function changeToReset() {
  resetButton.innerText = "Reset Game"
}

//reappears difficultys after clicking reset
function reappearDifficultys(){
  easy.innerText = "Easy"
  medium.innerText = "Medium"
  hard.innerText = "Hard"
}

//changes reset to select difficulty
function changeResetToSelectDifficulty(){
  resetButton.innerText = "Select Difficulty"
}

//updates high Score
let highScore = document.getElementsByClassName("highScore")

function updateHighScore() {
  for(let i = 0; i < 10; i++){
    if(state.score > state.highScore[i]) {
      for(j = 9; j > i; j--){
        state.highScore[j] = state.highScore[j -1]
        highScore[j].innerText = state.highScore[j]  
      }
      state.highScore[i] = state.score
      highScore[i].innerText = state.score
      return
    }
  }
}
//do at screen load ---------------------------------------------------------------------------------------------------------
state.start()