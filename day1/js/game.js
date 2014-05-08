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


  function Game(el, opts){

    this.rows = opts.rows || this.defaults.rows;
    this.cols = opts.cols || this.defaults.cols;

    this.el = el;
    this.el.classList.add("board");
    this.el.style.height = ((ROW_HEIGHT * this.rows) + 10) + "px";
    this.el.style.width = ((COL_WIDTH * this.cols) + 10) + "px";
    this.pieces = [];
    this.activePlayer = 1;

    this.data = [];
    for(var row = 0; row < this.rows; row++){
      this.data[row] = [];
      for (var col = 0; col < this.cols; col++){
        this.data[row][col] = 0;
      }
    }


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

  }

  Game.prototype.defaults = {
    rows: 6,
    cols: 7
  };

  Game.prototype.clickedColumn = function (col){
    for(var row = 0; row < this.rows; row++){
      if (this.data[row][col] === 0) {
        this.data[row][col] = this.activePlayer;
        this.updatedPiece(row, col, this.activePlayer);

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