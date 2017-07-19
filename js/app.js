// Game including scorekeeping and time keeping
var Game = function() {
  // Set game score to 0 and create scoreKeeper element to contain score
  this.score = 0;
  var scoreKeeper = document.createElement('span');
  scoreKeeper.id = 'score';
  document.body.appendChild(scoreKeeper);
  this.updateScore(this.score);

  // Set game timer to 15 seconds and create timeKeeper element to contain timer
  this.time = 15;
  var timeKeeper = document.createElement('span');
  timeKeeper.id = 'time';
  document.body.appendChild(timeKeeper);
  this.setTimer(this.time);
}

// Reset Game score and timer
Game.prototype.resetGame = function() {
  this.score = 0;
  this.updateScore(this.score);
  this.time = 15;
  document.getElementById('time').innerHTML = 'Time ' + 15;
}

// Update score in app
Game.prototype.updateScore = function(score) {
  document.getElementById('score').innerHTML = 'Score: ' + score;
  if (score === 5) {
    alert('You win!!');
    this.resetGame();
  }
}

// Update timer in app
Game.prototype.setTimer = function(time) {
  if (time > 0) {
    document.getElementById('time').innerHTML = 'Time: ' + (time);
  } else {
    this.resetGame();
    alert('The game is over! You lose :(');
    player.resetPlayer();
  }
}

// Enemies our player must avoid
var Enemy = function(x, y, speed) {
  // Variables applied to each of our instances go here,
  // we've provided one for you to get started

  // The image/sprite for our enemies, this uses
  // a helper we've provided to easily load images
  this.sprite = 'images/enemy-bug.png';
  this.x = x;
  this.y = y;
  this.speed = speed;
};

// Set Enemy speed to a random value
Enemy.prototype.newSpeed = function() {
  this.speed = Math.floor((Math.random() * 250) + 80);
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
  // You should multiply any movement by the dt parameter
  // which will ensure the game runs at the same speed for
  // all computers.
  this.x = this.x + this.speed * dt;
  if (this.x > 505) {
    this.x = -50;
    this.newSpeed();
  }

  // Detect collisions between Player and Enemies and reset game to 0 and move Player to origin
  if (this.x < player.x + 60  && this.x + 60  > player.x && this.y < player.y + 60 && this.y + 60 > player.y) {
    game.score = 0;
    game.updateScore(game.score);
    setTimeout(function() {
      player.resetPlayer();
    }, 50);
  }

};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(x, y) {
  this.sprite = 'images/char-boy.png';
  this.x = x;
  this.y = y;
};

// Render Player on canvas
Player.prototype.render = function(altImg) {
  var img = altImg === undefined ? Resources.get(this.sprite) : altImg;
  ctx.drawImage(img, this.x, this.y);
};

Player.prototype.update = function() {
  // Determine Player location to keep on canvas or register score and return Player to origin
  if (this.x > 505) {
    this.x = this.x - 103;
  } else if (this.x < -50) {
    this.x = this.x + 103;
  } else if (this.y > 460) {
    this.y = this.y - 83;
  } else if (this.y < 40) {
    game.score++;
    game.updateScore(game.score);
    this.resetPlayer();
  }
}

// Handle keyboard presses to determine Player movement
Player.prototype.handleInput = function(key) {
  switch (key) {
    case 'left':
      this.x = this.x - 103;
      break;
    case 'up':
      this.y = this.y - 83;
      break;
    case 'right':
      this.x = this.x + 103;
      break;
    case 'down':
      this.y = this.y + 83;
      break;
  }
}

// Reset Player position to origin
Player.prototype.resetPlayer = function() {
  this.x = 200;
  this.y = 385;
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var game = new Game(0);
var laneOne = 60,
    laneTwo = 145,
    laneThree = 225;
var lanes = [laneOne, laneTwo, laneThree];
var allEnemies = [];
for (var l = 0; l < lanes.length; l++) {
  var speed = Math.floor((Math.random() * 250) + 80);
  var enemy = new Enemy(-50, lanes[l], speed);
  allEnemies.push(enemy);
}
var player = new Player(200, 385);

// Set interval to update Game timer
setInterval(function() {
  game.time--;
  game.setTimer(game.time);
}, 1000);

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
  var allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
  };

  player.handleInput(allowedKeys[e.keyCode]);
});
