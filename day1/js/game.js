(function(global){
  var ROW_HEIGHT = 100;
  var COL_WIDTH = 100;
  var ROWS = 6;
  var COLS = 7;

  function Piece(opts){
    this.game = opts.game;
    this.el = opts.el;
    this.el.classList.add("piece");
    this.el.classList.add("empty");
    
    this.row = opts.row;
    this.col = opts.col;
    console.log("making place for ", this.row, this.col);
    this.player = 0;
    this.el.addEventListener("click", this.onclick.bind(this));
    this.render();
  }

  Piece.playerClasses = {
    2: "player2",
    1: "player1",
    0: "empty"
  };

  Piece.prototype.removeClasses = function(){
    for (var key in Piece.playerClasses){
      var styleClass = Piece.playerClasses[key];
      this.el.classList.remove(styleClass);
    }
  };

  Piece.prototype.onclick = function(el){
    console.log("clicked", arguments, this);
    this.game.clickedColumn(this.col);
  };

  Piece.prototype.render = function(){
    this.el.style.left = (5 + this.col * 100) + "px";
    this.el.style.top = ((ROWS - 1) * ROW_HEIGHT + 5 - this.row * 100) + "px";
  };

  Piece.prototype.setPlayerNumber = function(player){
    // takes player 0, 1, or 2 to set proper color
    this.player = player;
    this.removeClasses();
    this.el.classList.add(Piece.playerClasses[player]);
  };

  function Game(el){

    this.containerEl = el;
    var boardEl = document.createElement("div");
    this.containerEl.appendChild(boardEl);
    this.boardEl = boardEl;
    this.boardEl.classList.add("board");
    this.boardEl.style.height = ((ROW_HEIGHT * ROWS) + 10) + "px";
    this.boardEl.style.width = ((COL_WIDTH * COLS) + 10) + "px";
    this.containerEl.style.width = this.boardEl.style.width;

    var messageEl = document.createElement("div");
    this.containerEl.appendChild(messageEl);
    this.messageEl = messageEl;
    this.messageEl.classList.add("message");
    this.messageEl.classList.add("hidden");

    this.activePlayer = 1;
    this.over = false; 

    this.setupBoard();
  }

  Game.prototype.setupBoard = function(){
    this.board = [];
    for(var row = 0; row < ROWS; row++){
      this.board[row] = [];
      for (var col = 0; col < COLS; col++){
        var el = document.createElement("div");
        this.boardEl.appendChild(el);
        this.board[row][col] = new Piece({
          game: this, 
          row: row, 
          col: col,
          el: el
        });
      }
    }
  };

  Game.prototype.checkWin = function(row, col, player){
    
    var horizontalStreak = 0;

    for (var j = 0; j < COLS; j++) {
      var current = this.board[row][j].player;
      
      if(current === player) {
        horizontalStreak++;
      } else {
        horizontalStreak = 0;
      }
      
      if(horizontalStreak === 4){
        this.won(player);
        return;
      }
    }

    var verticalStreak = 0;
    for (var i = 0; i < ROWS; i ++){
      var current = this.board[i][col].player;
      
      if(current === player) {
        verticalStreak++;
      } else {
        verticalStreak = 0;
      }

      if(verticalStreak === 4){
        this.won(player);
        return;
      }
    }
  }

  Game.prototype.won = function(player){
    this.over = true;
    this.messageEl.classList.remove("hidden");
    this.messageEl.innerHTML = "Player " + player + " wins! <small>refresh to play again</small>";
  }

  Game.prototype.clickedColumn = function(col){
    if (this.over){
      return;
    }
    for(var row = 0; row < ROWS; row++){
      console.log(this.board[row][col]);
      if (this.board[row][col].player === 0) {
        this.board[row][col].setPlayerNumber(this.activePlayer);
        this.updatedPiece(row, col, this.activePlayer);
        this.checkWin(row, col, this.activePlayer);

        this.activePlayer = (this.activePlayer % 2) + 1;
        return true;
      }
    }
    return false;
  };

  Game.prototype.updatedPiece = function(row, col, player) {
    console.log("updating piece", row, col, player);
    var piece = this.board[row][col];
    piece.setPlayerNumber(player);
  };

  // external interface
  window.addEventListener("DOMContentLoaded", function(){
    var el = document.getElementById("game");
    new Game(el);
  });

})(window)