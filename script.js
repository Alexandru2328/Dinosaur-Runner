let board;
let ctx;
const dinoX = 10;
const dinoY = 90;
let dinoRect = { x: dinoX, y: dinoY, w: 27, h: 40 };
let walkingFrame = 0;
let gameStatus = false;
let isJumping = false;
let isCrouching = false;
let obstacleList = [];
let tipeObstacle = [
  {id: 0, name: "img/cactus3.png", w: 25, h: 45, x: 290, y: 105},
  {id: 1, name: "img/big-cactus1.png", w: 15, h: 50, x: 290, y: 105},
  {id: 2, name: "img/big-cactus2.png", w: 25, h: 55, x: 290, y: 99},
  {id: 3, name: "img/big-cactus3.png", w: 30, h: 55, x: 290, y: 99},
  {id: 4,name: "img/bird2.png", w: 30, h: 25, x: 290, y: 90}
];
let score = 0;

function newGame() {
  window.location.reload();
}

function obstacleEffect(obj) {
  if (obj.x < -50) {
    obstacleList.splice(obj, 1);
    score += 50;
  }
  if (gameStatus) {
    ctx.clearRect(obj.x + 2, obj.y, obj.w, obj.h);
    let nextEnemyImg = new Image();
    nextEnemyImg.src = obj.name;
    nextEnemyImg.onload = function() {
      ctx.drawImage(nextEnemyImg, obj.x, obj.y, obj.w, obj.h);
    };
  }
}

function spawnObstacle() { 
  let obj = tipeObstacle[Math.floor(Math.random() * tipeObstacle.length)];
  if (gameStatus) {
    enemyImg = new Image();
    enemyImg.src = obj.name;
    enemyImg.onload = function() {
      ctx.drawImage(enemyImg, obj.x, obj.y, obj.w,
        obj.h);
      };
      obstacleList.push({id: obj.id, name: obj.name, w: obj.w, h: obj.h, x: obj.x, y: obj.y, });
    }
  }
  
  function crouch(e) {
    if (e.code === "ArrowDown" && gameStatus && !isJumping) {
      isCrouching = true;
      ctx.clearRect(dinoRect.x, dinoRect.y, 50, 80)
      dinoRect.y = 120;
      let newDinoImg = new Image(); 
      newDinoImg.src = "img/dino-duck1.png";
      newDinoImg.onload = function() {
        ctx.drawImage(newDinoImg, dinoX, dinoRect.y, 40, 30);
      }
      setTimeout(function() {
        ctx.clearRect(dinoRect.x, dinoRect.y, 50, 80)
        dinoRect.y = 90;
        let newDinoImg = new Image(); 
        newDinoImg.src = "img/dino2.png";
        newDinoImg.onload = function() {
          ctx.drawImage(newDinoImg, dinoX, dinoRect.y, 30, 55);
        }
        isCrouching = false;
      }, 1200);
    } 
  }
  
  function jumpEffect(timestamp) {
    if (gameStatus) {
      const jumpDuration = 1400; 
      const jumpHeight = 80; 
      let progress = (timestamp - jumpStartTime) / jumpDuration;
      dinoRect.y = dinoY - jumpHeight * (4 * progress * (1 - progress));
      let newDinoImg = new Image(); 
      newDinoImg.src = "img/dino2.png";
      newDinoImg.onload = function() {
        ctx.clearRect(dinoX, dinoRect.y -10 , 30, 70);
        ctx.drawImage(newDinoImg, dinoX, dinoRect.y, 30, 55);
      };
      if (progress >= 1) {
        isJumping = false;
      } else {
        requestAnimationFrame(jumpEffect);
      }
    }
  }
  
  function jump(e) {
    if (e.code === "Space" && !isJumping && gameStatus && !isCrouching) {
      isJumping = true;
      jumpStartTime = performance.now();
      requestAnimationFrame(jumpEffect);
    }
  }
  
  function walkingAnimation() {
    if (!isJumping && !isCrouching && gameStatus) {
      let dinoImgSrc;
      if (walkingFrame % 2 === 0) {
        dinoImgSrc = "img/dino-run1.png";
      } else {
        dinoImgSrc = "img/dino-run2.png";
      }
      let dinoImg = new Image();
      dinoImg.src = dinoImgSrc;
      dinoImg.onload = function() {
        ctx.clearRect(dinoX, dinoRect.y, 50, 140);
        ctx.drawImage(dinoImg, dinoX, dinoY, 30, 55);
      };
      ++walkingFrame;
    }
  }
  
  function checkCollision(obj1, obj2) {
    return (
        obj1.x < obj2.x + obj2.w &&
        obj1.x + obj1.w > obj2.x &&
        obj1.y < obj2.y + obj2.h &&
        obj1.y + obj1.h > obj2.y
    );
  }

  function gameUpdate() {
    if (gameStatus) {
      ++score;
      let myText = document.getElementById("text");
      for (let i = 0; i < obstacleList.length; ++i) {
        obstacleList[i].x -= 2;
        obstacleEffect(obstacleList[i], i);
        if (checkCollision(dinoRect, obstacleList[i])) {
          console.log("Collision detected");
          let dinoImg = new Image();
        dinoImg.src = "img/dino-dead.png";
        dinoImg.onload = function() {
        ctx.clearRect(dinoRect.x, dinoRect.y, dinoRect.w, dinoRect.h);
        ctx.drawImage(dinoImg, dinoRect.x, dinoRect.y, 30, 55);
        myText.innerHTML = "GAME OVER !!<br>" + "SCORE: " + score;
        let button = document.getElementById("startGame");
      button.textContent = "NEW GAME";
      button.setAttribute('onclick',
        `newGame()`);
      }
          gameStatus = false;
        }
      }
      myText.innerHTML = "SCORE: " + score;
    }
  }

  function resumeGame() {
    gameStatus = true;
    let button = document.getElementById("startGame");
    button.textContent = "PAUSE";
    button.setAttribute('onclick',
        `pauseGame()`);
        isJumping = false;
}

function pauseGame() {
    gameStatus = false;
    let button = document.getElementById("startGame");
    button.textContent = "RESUME";
    button.setAttribute('onclick',
        `resumeGame()`);
}
  
  function startGame() {
    gameStatus = true;
    board = document.getElementById("myCanvas");
    ctx = board.getContext("2d");   
    let dinoImg = new Image();
    dinoImg.src = "img/dino2.png";
    dinoImg.onload = function() {
      ctx.drawImage(dinoImg, dinoX, dinoY, 30, 55);
    };
    let startButton = document.getElementById("startGame");
    startButton.textContent = "PAUSE";
    startButton.setAttribute('onclick',
        `pauseGame()`);
  }
  
setInterval(spawnObstacle, 2600);
setInterval(gameUpdate, 27);
setInterval(walkingAnimation, 200)
document.addEventListener("keyup", jump);
document.addEventListener("keydown", crouch);