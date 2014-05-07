(function(global){

  // views

  function PieceView(gameView, opts){
    this.opts = shallowMerge(opts, this.defaults);
    console.log("making place for ", this.opts.row, this.opts.col);
    this.init();
  }
  PieceView.prototype = {
    defaults: {
      playerColors: {
        2: "#C22",
        1: "#2C2",
        0: "#CCC"
      }
    },
    init: function(){
      this.player = 0;
      this.el = this.opts.el;
      this.row = this.opts.row;
      this.col = this.opts.col;
      this.render();
    },
    render: function(){
      this.el.style.position = "absolute";
      this.el.style.backgroundColor = this.opts.playerColors[this.player];
      this.el.style.height = "90px";
      this.el.style.width = "90px";
      this.el.style.left = (this.col * 100) + "px";
      this.el.style.top = (this.row * 100) + "px";
    },
    setState: function(player){
      // takes player 0, 1, or 2 to set proper color
      this.state = player;
      this.render();
    }
  }


  function GameView(el, opts){
    this.el = el;
    this.opts = shallowMerge(opts, this.defaults);
    this.init();
  }

  GameView.prototype = {
    defaults: {
      rowHeight: 100,
      colWidth: 100,
      backgroundColor: "#333"
    },
    init: function(){
      this.game = new Game({});
      this.rows = this.game.opts.rows;
      this.cols = this.game.opts.cols;
      for(var row = 0; row < this.game.opts.rows; row++){
        for (var col = 0; col < this.game.opts.cols; col++){
          var el = document.createElement("div");
          this.el.appendChild(el);
          new PieceView(this, {
            row: row,
            col: col,
            el: el
          });
        }
      }
      this.render();
    },
    render: function(){
      this.el.style.width = (this.opts.colWidth * this.cols) + "px";
      this.el.style.height = (this.opts.rowHeight * this.rows) + "px";
      this.el.style.backgroundColor = this.opts.backgroundColor;
      console.log("rendered", this.el);
    }
  }

  // models

  function Game(opts){
    this.opts = shallowMerge(opts, this.defaults);
    this.init();
  } 
  Game.prototype = {
    defaults:{
      rows: 6,
      cols: 7
    },

    init: function(){
      console.log("starting game at", this.el);
      this.data = [];
      for(var row = 0; row < this.opts.rows; row++){
        this.data[row] = [];
        for (var col = 0; col < this.opts.cols; col++){
          this.data[row][col] = 0;
        }
      }
      console.log(this.data);
    },

    setPiece: function(row, col, player){
      this.data[row][col] = player;
    },

    gameState: function(){

    }
  }

  // external interface
  global.GameView = GameView;

  
  // utility functions

  function shallowMerge(obj, defaults){
    var result = {};
    for (var attributeName in defaults){ result[attributeName] = defaults[attributeName]; }
    for (var attributeName in obj){ result[attributeName] = obj[attributeName]; }
    return result;
  }

})(window)