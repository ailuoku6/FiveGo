var context = document.getElementById('canvas').getContext('2d');
var me = true;
var chessBoard = [];
var wins = [];//赢法数组,布尔值
var count = 0;//赢法总数
var myWin = [];
var computerWin = [];
var over = false;

drawChessBoard();
init_chessBoard();
init_Wins();
init_myAndComWin();


function init_chessBoard() {//初始化棋盘
  for (var i = 0; i < 15; i++) {
    chessBoard[i] = [];
    for (var j = 0; j < 15; j++) {
      chessBoard[i][j] = 0;
    }
  }
}

function init_Wins() {//初始化wins数组
  count = 0;
  for (var i = 0; i < 15; i++) {
    wins[i] = [];
    for (var j = 0; j < 15; j++) {
      wins[i][j]  =[];
    }
  }

  for (var i = 0; i < 15; i++) {//横向赢法
    for (var j = 0; j < 11; j++) {
        for (var k = 0; k < 5; k++) {
            wins[j + k][i][count] = true;
        }
        count++;
    }
  }

  for (var i = 0; i < 15; i++) {//纵向赢法
    for (var j = 0; j < 11; j++) {
        for (var k = 0; k < 5; k++) {
            wins[i][j+k][count] = true;
        }
        count++;
    }
  }

  for (var i = 0; i < 11; i++){//斜线赢法
    for (var j = 0; j < 11; j++) {
      for (var k = 0; k < 5; k++) {
        wins[i+k][j+k][count] = true;
      }
      count++;
    }
  }

  for (var i = 0; i < 11; i++) {//反斜线赢法
    for (var j = 14; j > 3; j--) {
      for (var k = 0; k < 5; k++) {
        wins[i+k][j-k][count] = true;
      }
      count++;
    }
  }
}

function init_myAndComWin() {
  for (var i = 0; i < count; i++) {
      myWin[i] = 0;
      computerWin[i] = 0;
  }
}

function drawChessBoard() {//绘制棋盘
  context.strokeStyle = "#AB7C51";
  for (var i = 0; i < 15; i++) {
    context.moveTo(15 + i * 30, 15);
    context.lineTo(15 + i * 30, 435);
    context.stroke();
    context.moveTo(15, 15 + i * 30);
    context.lineTo(435, 15 + i * 30);
    context.stroke();
  }
}

function oneStep(x,y,me) {
  //me = false代表白方,反之黑方
  context.beginPath();
  context.arc(15 + x * 30, 15 + y * 30, 13, 0, 2 * Math.PI);
  context.closePath();

  var gradient = context.createRadialGradient(15 + x * 30 + 2, 15 + y * 30 - 2, 13, 15 + x * 30 + 2, 15 + y * 30 - 2, 0);
  if (me) {
      gradient.addColorStop(0, "#0A0A0A");
      gradient.addColorStop(1, "#636766");
  } else {
      gradient.addColorStop(0, "#D1D1D1");
      gradient.addColorStop(1, "#F9F9F9");
  }
  context.fillStyle = gradient;
  context.fill();
}

function computerAI() {
  var myScore = [];
  var computerScore = [];
  var max = 0; //保存最高分
  var u = 0, v = 0; //保存最高分的坐标
  for (var i = 0; i < 15; i++) {//初始化每个点分数
      myScore[i] = [];
      computerScore[i] = [];
      for (var j = 0; j < 15; j++) {
          myScore[i][j] = 0;
          computerScore[i][j] = 0;
      }
  }

  for (var i = 0; i < 15; i++) {
    for (var j = 0; j < 15; j++) {
      if (chessBoard[i][j] == 0) {
        for (var k = 0; k < count; k++) {
          if (wins[i][j][k]) {
            if (myWin[k] == 1) {
              myScore[i][j]+=200*Math.floor(Math.random()*(100-60+1)+60)/100;
            }else if (myWin[k] == 2) {
              myScore[i][j]+=500*Math.floor(Math.random()*(100-60+1)+60)/100;
            }else if (myWin[k] == 3) {
              myScore[i][j]+=2000;
            }else if (myWin[k] == 4) {
              myScore[i][j]+=4500;
            }

            if (computerWin[k] == 1) {
              computerScore[i][j]+=220*Math.floor(Math.random()*(100-60+1)+60)/100;
            }else if (computerWin[k] == 2) {
              computerScore[i][j]+=600*Math.floor(Math.random()*(100-60+1)+60)/100;
            }else if (computerWin[k] == 3) {
              computerScore[i][j]+=2400;
            }else if (computerWin[k] == 4) {
              computerScore[i][j]+=5000;
            }
          }
        }

        if (myScore[i][j]>max) {
          max = myScore[i][j];
          u = i;
          v = j;
        }else if (myScore[i][j] == max) {
          if (computerScore[i][j] > computerScore[u][v]) {
            u = i;
            v = j;
          }
        }

        if (computerScore[i][j] > max) {
          max = computerScore[i][j];
          u = i;
          v = j;
        }else if (computerScore[i][j] == max) {
          if (myScore[i][j] > myScore[u][v]) {
            u = i;
            v = j;
          }
        }

      }
    }
  }

  oneStep(u,v,false);
  chessBoard[u][v] = 2;

  for (var i = 0; i < count; i++) {
    if (wins[u][v][i]) {
      computerWin[i]++;
      myWin[i] = 6;
      if (computerWin[i]==5) {
        document.getElementById('tips').innerHTML = "机器人赢了";
        over = true;
      }
    }
  }
  if (!over) {
    me = !me;
  }
}

document.getElementById('canvas').onclick = function(e) {
  var x = Math.floor(e.offsetX / 30);
  var y = Math.floor(e.offsetY / 30);
  if (chessBoard[x][y]==0&&!over) {
    oneStep(x,y,me);
    chessBoard[x][y] = 1;//黑棋在数组标1

    for (var i = 0; i < count; i++) {
      if (wins[x][y][i]) {
        myWin[i]++;
        computerWin[i] = 6;
        if (myWin[i]==5) {
          document.getElementById('tips').innerHTML = "你赢了";
          over = true;
        }
      }
    }
    if (!over) {
      me = !me;
      computerAI();
    }
  }
}

document.getElementById('restart').onclick = function () {
  document.getElementById('tips').innerHTML = "";
  context.clearRect(0,0,450,450);
  me = true;
  over = false;
  init_chessBoard();
  init_Wins();
  init_myAndComWin();
  drawChessBoard();
}
