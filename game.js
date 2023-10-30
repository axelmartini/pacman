const successMessages = ["Så där ja! Bra jobbat!", "Gött! En fjäder i tyrolerhatten till dig.",
  "Till skillnad från F.R. David så kommer orden lätt till dig!", "Så ska en slipsten dras!",
  "Game, set and match Pang-Man!", "Grattis! Du har vunnit en fjällsemester i Burträsk!"]


window.onload = function() {
  buildPlatform()
  buildWordInput()
  drawImages()
  let input = window.addEventListener('keypress', function(e) {
    let currentLetter = e.key
    console.log(currentLetter)
    checkPlayerInput(currentLetter.toLowerCase())
  }) 
}  

// object for ghost
let ghost = {
  img: 'images/ghost.png',
  position: 0,
  headStart: 5, // how far ahead the player will be
  size: 80,
  alive: true, 
  move: function() {  // pang-man and the ghost have different patterns of movement
    this.position++
  },
  draw: function(pos) {   // draws the ghost to the position provided
    let element = document.getElementById('sq-' + pos)
    let image = document.createElement('img')
    image.src = this.img
    image.style.width = this.size+'px'   
    image.style.height = this.size+'px'
    element.appendChild(image)
  }
}

// object for game settings and functionality
let game = {
  solution: "bap",
  getNewWord: function() {
    let index = Math.floor(Math.random() * wordList.length)
    this.solution = wordList[index]
    console.log(this.solution)
  },
  getPlatformLength: function() {   // calculation needed to dynamically create elements
    return this.solution.length + ghost.headStart + 1
  },
  answerHistory: [],  
  collision: false,
  checkCollision: function() {
    if (ghost.position == pacman.position) {
      this.collision = true
      console.log('COLLISION!')
      let element = document.getElementById('sq-' + pacman.position)
      let images = element.querySelectorAll('img')
      images.forEach((img) => {
        img.remove()
        failure()
      })
    }
  },
  checkSuccess: function() {
    let endIndex = this.getPlatformLength() - 1
    if (pacman.position == endIndex) {
    success()
    }
  }
}

// updates graphics and text when game over
function failure() {
  let platform = document.getElementById('platform')
  let children = platform.querySelectorAll('img')
  for (dot of children) {
    dot.remove()
  }
  for (let i = 0; i < game.getPlatformLength(); i++) {
    document.getElementById('sq-' + i).innerHTML = ""
    ghost.draw(i)
  }
  let endMessage = document.getElementById('resultText')
  endMessage.innerHTML = "Det där gick ju inte så bra. Ordet du sökte var " + game.solution.toUpperCase()
}

// updates graphics and text when word is completed
function success() {
  let platform = document.getElementById('platform')
  let children = platform.querySelectorAll('img')
  children.forEach((img) => {
    img.src = pacman.img
  })
  let endMessage = document.getElementById('resultText')
  endMessage.innerHTML = successMessages[Math.floor(Math.random()*successMessages.length)]
}

// not sure where to put this, for now it is placed after game object is initiated
game.getNewWord() 

// pangman object, still called pacman :)
let pacman = {
  img: 'images/pacman.png',
  position: ghost.headStart,
  size: 80,
  alive: true, 
  move: function(progress) {
    this.position = this.position + progress
  },
  draw: function() {
    let element = document.getElementById('sq-' + this.position)
    let image = document.createElement('img')
    image.src = this.img
    image.style.width = this.size+'px'
    image.style.height = this.size+'px'
    element.appendChild(image)
  }
}

// draws the dots that pang-man eats
function drawDots() {
  let start = pacman.position + 1
  let length = game.getPlatformLength()
  for (i = start; i < length; i++) {
    let element = document.getElementById('sq-' + i)
    let dot = document.createElement('img')
    if (i == length-1) {  // we want the last dot to symbolize goal
      dot.src = 'images/goal.png'
    }
    else {
    dot.src = 'images/food.png'
    }
    dot.className = 'dot'
    element.appendChild(dot)
  }
}

// this function is called after each user input and updates all the game graphics
function drawImages() {
  pacman.draw() 
  ghost.draw(ghost.position) 
  drawDots()
}

// removes all images before new ones are drawn
function clearImages() {
  let platform = document.getElementById('platform')
  let children = platform.querySelectorAll('img')
  children.forEach((img) => {
    img.remove()
  })
  drawImages()
}

// generates the div elements for the word display in the game
function buildWordInput() {
  let wordContainer = document.getElementById('wordContainer')
  for (let i = 0; i < game.solution.length; i++) {
    let letterBox = document.createElement('div')
    wordContainer.appendChild(letterBox)
    letterBox.className = 'letterBox'
    letterBox.id = 'lb-' + i
  }
}

// generates the div elements needed for the pacman part of the game
function buildPlatform() {
  let platform = document.getElementById('platform')
  let length = game.getPlatformLength()
  for (let i = 0; i < length; i++) {
    let square = document.createElement('div')
    platform.appendChild(square)
    square.className = 'square'
    square.id = 'sq-' + i  
  }
}

// evaluate and do this based on input from user/event listener
function checkPlayerInput(playerInput) {
  let checkHistory = game.answerHistory.includes(playerInput)
  for (let i = 0; i < game.solution.length; i++) {    
    if (playerInput === game.solution[i] && !checkHistory) {
      game.answerHistory.push(playerInput)
      document.getElementById('lb-' + i).innerHTML = playerInput
      pacman.position = pacman.position + 1     
    }
  }
  ghost.position++
  showLetter(playerInput)
  game.checkCollision()
  game.checkSuccess()
  if (!game.collision) {
    clearImages()
  }
}

// displays the letter the user has used so far in the game
function showLetter(letter) {
  let position = ghost.position-1
  document.getElementById('sq-' + position).innerHTML = '<p>' + letter + '</p>'
}

