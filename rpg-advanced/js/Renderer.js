/**
 * Manages the render order of drawable items keeping the depth correct.
 * Given a TileMap containing tiles with a background and foreground
 * image, render the background using `repaintBackground`.
 * Tile foreground and drawable items are kept in order and rendered using `draw`.
 */
function Renderer () {
  this._drawableItems = [];
  this._tilemap = null;
  this.debug = false;
}

/**
 * The renderer handles the tilemap by separating the tile
 * background and foreground drawing steps.
 * @param {TileMap} tilemap
 */
Renderer.prototype.setTileMap = function (tilemap) {
  this._tilemap = tilemap;
};

/**
 * Add an item to the render queue.
 * A drawable item must implement the 'draw' method.
 * @param {object} item
 */
Renderer.prototype.add = function (item) {
  if (typeof item.draw !== 'function') {
    throw Error("item does not implement the draw method");
  }
  this._drawableItems.push(item);
};

/**
 * Remove an item from the render queue.
 * @param {object} item
 */
Renderer.prototype.remove = function (item) {
  var idx = this._drawableItems.indexOf(item);
  //ignore if not there
  if (idx > -1) {
    this._drawableItems.splice(idx, 1);
  }
};

/**
 * Only draw the tile background to the specified context.
 * This doesn't need to be done very often.
 * @param {CanvasRenderingContext2D} ctx
 */
Renderer.prototype.repaintBackground = function (ctx) {
  //check if tilemap image is ready
  if (this._tilemap && this._tilemap._tilesheet.imageLoaded) {
    var tiles = this._tilemap._tiles;
    var tilesheet = this._tilemap._tilesheet;

    //iterate row/column and draw each tile
    for (var row = 0, rows = tiles.length; row < rows; row++) {
      for (var col = 0, cols = tiles[row].length; col < cols; col++) {
        var x = col * tilesheet.tileWidth;
        var y = row * tilesheet.tileHeight;
        var bg_data = tiles[row][col].data.background;
        ctx.drawImage(tilesheet.image,
                      bg_data.x, bg_data.y, bg_data.width, bg_data.height,
                      x, y, bg_data.width, bg_data.height);
      }
    }
  }
};

/**
 * Draws the tile foreground and the drawable items render queue---in correct order.
 * Tiles are iterated by row/column and drawn from top-left to bottom-right.
 * While progressing down the rows, if a drawable item is found at the
 * current y-height, draw it before continuing. This is how the appearance of depth
 * is maintained---drawing from top to bottom.
 * This render function is called every frame.
 * @param {CanvasRenderingContext2D} ctx
 */
Renderer.prototype.draw = function (ctx) {
  //sort drawable items by depth (using y coordinate position)
  this._drawableItems.sort(Renderer.depthSort);

  //don't draw anything until the tilemap has been loaded
  if (this._tilemap && this._tilemap._tilesheet.imageLoaded) {
    var tiles = this._tilemap._tiles;
    var tilesheet = this._tilemap._tilesheet;
    var i = 0; //drawableItem index

    //iterate down each row
    for (var row = 0, rows = tiles.length; row < rows; row++) {
      //check if a drawable item falls within the current row 'band'
      var y_cur  = row * tilesheet.tileHeight;
      var y_next = (row + 1) * tilesheet.tileHeight;
      
      //if so, draw all items located within the current row
      while (i < this._drawableItems.length &&
             this._drawableItems[i].y + tilesheet.tileHeight > y_cur &&
             this._drawableItems[i].y + tilesheet.tileHeight <= y_next) {
        this._drawableItems[i].draw(ctx, this.debug);
        i++;
      }

      //iterate columns, drawing tile foreground
      for (var col = 0, cols = tiles[row].length; col < cols; col++) {
        var fg_data = tiles[row][col].data.foreground;
        if (fg_data) {
          var x = col * tilesheet.tileWidth;
          var y = row * tilesheet.tileHeight;
          if (fg_data.offsetX) x += fg_data.offsetX;
          if (fg_data.offsetY) y += fg_data.offsetY;
          ctx.drawImage(tilesheet.image,
                        fg_data.x, fg_data.y, fg_data.width, fg_data.height,
                        x, y, fg_data.width, fg_data.height);
        }
      }
    }
    if (this.debug) this._debugDraw(ctx);
  }
};

/**
 * Draw the tile grid representation.
 * @param {CanvasRenderingContext2D} ctx
 */
Renderer.prototype._debugDraw = function (ctx) {
  var tiles = this._tilemap._tiles;
  var tilesheet = this._tilemap._tilesheet;
  var rows = tiles.length;
  var cols = tiles[0].length;
  var w = cols * tilesheet.tileWidth;
  var h = rows * tilesheet.tileHeight;

  ctx.save();
  ctx.strokeStyle = '#666';
  ctx.beginPath();
  for (var row = 0; row < rows; row++) {
    ctx.moveTo(0, row * tilesheet.tileHeight);
    ctx.lineTo(w, row * tilesheet.tileHeight);
  }
  for (var col = 0; col < cols; col++) {
    ctx.moveTo(col * tilesheet.tileWidth, 0);
    ctx.lineTo(col * tilesheet.tileWidth, h);
  }
  ctx.stroke();
  ctx.restore();
};

/**
 * Sort renderable items based on their y coordinate position.
 * See Array.sort for compare function details.
 * @static
 * @param {object} a
 * @param {object} b
 * @param {number}
 */
Renderer.depthSort = function (a, b) {
  return (a.y - b.y);
};
