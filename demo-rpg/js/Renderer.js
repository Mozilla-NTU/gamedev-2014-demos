/**
 * Manages the render order of drawable items keeping the depth correct.
 * Given a TileMap containing tiles with a background and foreground
 * image, render the background using `repaintBackground`.
 * Tile foreground and drawable items are kept in order and rendered using `draw`.
 */
function Renderer () {
  this._drawableItems = [];
  this._tilemap = null;
  this.debug = false; //display bounding boxes (if supported)
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
 * The renderer handles the tilemap by separating the tile
 * background and foreground drawing steps.
 * @param {TileMap} tilemap
 */
Renderer.prototype.setTileMap = function (tilemap) {
  this._tilemap = tilemap;
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
    for (var y = 0, lenY = tiles.length; y < lenY; y++) {
      for (var x = 0, lenX = tiles[y].length; x < lenX; x++) {
        var bg = tiles[y][x].data.background;
        var offsetX = x * tilesheet.tileWidth;
        var offsetY = y * tilesheet.tileHeight;
        ctx.drawImage(tilesheet.image,
                      bg.x, bg.y, bg.width, bg.height,
                      offsetX, offsetY, bg.width, bg.height);
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
    for (var y = 0, lenY = tiles.length; y < lenY; y++) {
      //check if a drawable item falls within the current row 'band'
      var curScreenY = y * tilesheet.tileHeight;
      var nextScreenY = (y + 1) * tilesheet.tileHeight;
      
      //if so, draw all items located within the current row
      while (i < this._drawableItems.length &&
             this._drawableItems[i].y + tilesheet.tileHeight > curScreenY &&
             this._drawableItems[i].y + tilesheet.tileHeight <= nextScreenY) {
        this._drawableItems[i].draw(ctx, this.debug);
        i++;
      }

      //draw tile foreground, iterate columns
      for (var x = 0, lenX = tiles[y].length; x < lenX; x++) {
        var fg = tiles[y][x].data.foreground;
        if (fg) {
          offsetX = x * tilesheet.tileWidth;
          offsetY = y * tilesheet.tileHeight;
          if (fg.offsetX) offsetX += fg.offsetX;
          if (fg.offsetY) offsetY += fg.offsetY;
          ctx.drawImage(tilesheet.image,
                        fg.x, fg.y, fg.width, fg.height,
                        offsetX, offsetY, fg.width, fg.height);
        }
      }
    }
  }
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
