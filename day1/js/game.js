(function(global){
  var ROW_HEIGHT = 100;
  var COL_WIDTH = 100;

  function Piece(opts){
    this.game = opts.game;
    this.el = opts.el;
    this.el.classList.add("piece");
    this.el.classList.add("empty");
    
    this.row = opts.row;
    this.col = opts.col;
    console.log("making place for ", this.row, this.col);
    this.player = 0;
    this.el.onclick = this.onclick.bind(this);
    this.render();
  }

  Piece.prototype.playerClasses = {
    2: "player2",
    1: "player1",
    0: "empty"
  };

  Piece.prototype.removeClasses = function(){
    for (var key in this.playerClasses){
      var clazz = this.playerClasses[key];
      this.el.classList.remove(clazz);
    }
  };

  Piece.prototype.onclick = function(el){
    console.log("clicked", arguments, this);
    this.game.clickedColumn(this.col);
  };

  Piece.prototype.render = function(){
    this.el.style.left = (5 + this.col * 100) + "px";
    this.el.style.top = ((this.game.rows - 1) * ROW_HEIGHT + 5 - this.row * 100) + "px";
  };

  Piece.prototype.setState = function(player){
    console.log("setting state", this.row, this.col, player);
    // takes player 0, 1, or 2 to set proper color
    this.removeClasses();
    this.el.classList.add(this.playerClasses[player]);
  };


  function Game(el){

    this.rows = 6;
    this.cols = 7;

    this.el = el;
    this.el.classList.add("board");
    this.el.style.height = ((ROW_HEIGHT * this.rows) + 10) + "px";
    this.el.style.width = ((COL_WIDTH * this.cols) + 10) + "px";
    this.pieces = [];
    this.activePlayer = 1;

    for(var row = 0; row < this.rows; row++){
      for (var col = 0; col < this.cols; col++){
        var el = document.createElement("div");
        this.el.appendChild(el);
        
        this.pieces.push(new Piece({
          game: this,
          row: row,
          col: col,
          el: el
        }));
      }
    }

    this.setupBoard();
  }

  Game.prototype.setupBoard = function(){
    this.board = [];
    for(var row = 0; row < this.rows; row++){
      this.board[row] = [];
      for (var col = 0; col < this.cols; col++){
        this.board[row][col] = 0;
      }
    }
  };

  Game.prototype.checkWin = function(){
    // check horizontal
    console.log("checking win");
    for (var i = 0; i < this.rows; i++){
      var streak = [];
      for (var j = 0; j < this.cols; j++){
        var player = this.board[i][j];
        var last = streak[streak.length - 1];

        if(player !== 0 && (!last || player === last)){
          streak.push(player);
          if (streak.length == 4){
            this.won(player);
            return;
          }
        } else {
          streak = [];
        }
      }
    }
    
    // check vertical
    for (var j = 0; j < this.cols; j++) {
      for (var i = 0; i < this.rows; i++) {
        var player = this.board[i][j];
        var last = streak[streak.length - 1];
        if(player !== 0 && (!last || player === last)){
          streak.push(player);
          if (streak.length === 4){
            this.won(player);
            return;
          }
        } else {
          streak = [];
        }
      }
    }

    for(var i = 0; i < this.rows; i++){
      this.checkDiagonal(i, 0);
      this.checkDiagonal(i, this.rows - 1, true);
    }

    for(var j = 0; j < this.cols; j++){
      this.checkDiagonal(0, j);
      this.checkDiagonal(0, j, true);
    }
  }

  Game.prototype.checkDiagonal = function (row, col, reverse){
    reverse = reverse || false;
    var player = this.board[row][col];
    streak = [];
    while (typeof player !== "undefined"){
      var last = streak[streak.length - 1];
      if (player !== 0 && (!last || player === last)){
        streak.push(player);
        if (streak.length === 4){
          this.won(player);
          return;
        }
      } else {
        streak = [];
      }
      if (reverse){
        row++;
        col--;
      } else {
        row++;
        col++;
      }
      player = this.board[row, col];
    }
  }

  Game.prototype.won = function(player){
    console.log("player", player, "won!");
  }

  Game.prototype.clickedColumn = function(col){
    for(var row = 0; row < this.rows; row++){
      if (this.board[row][col] === 0) {
        this.board[row][col] = this.activePlayer;
        this.updatedPiece(row, col, this.activePlayer);
        this.checkWin();

        this.activePlayer = (this.activePlayer % 2) + 1;
        console.log("activePlayer is now", this.activePlayer);
        return true;
      }
    }
    return false;
  };

  Game.prototype.updatedPiece = function(row, col, player) {
    console.log("updating piece", row, col, player);
    for (var i = 0, piece; piece = this.pieces[i]; i++){
      if (piece.row === row && piece.col === col){
        piece.setState(player);
      }
    }
  };

  // external interface
  global.Game = Game;

})(window)