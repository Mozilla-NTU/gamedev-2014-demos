/**
 * A TileMap is a grid that represents the world layout.
 * It contains a 2-dimensional array of TileNodes which are used
 * to render the approriate individual tile image from a tilesheet.
 * The TileMap also has methods for accessing TileNodes using
 * column and row or screen x- and y-coordinates.
 * For convenience, you can fill a TileMap using a layout array,
 * this is a 2-dimensional array filled with character shortnames
 * to specify a tile. See the tilesheet description object for details.
 * @constructor
 * @param {array} layout
 * @param {TileSheet} tilesheet
 */
function TileMap (layout, tilesheet) {
  if (!tilesheet instanceof TileSheet) {
    throw new TypeError("tilesheet param must be a TileSheet");
  }
  this._tilesheet = tilesheet;
  this._tiles = null;

  this.setTilesFromLayout(layout);
}

/**
 * Create the TileMap's tile array by iterating over a 2-dim layout
 * array filled with shortname characters and fill the 2-dim tiles
 * array with the specified TileNodes.
 * @param {array} layout
 */
TileMap.prototype.setTilesFromLayout = function (layout) {
  if (!Array.isArray(layout)) {
    throw new TypeError("layout param must be a 2-dim array");
  }
  this._tiles = new Array(layout.length);

  for (var row = 0; row < layout.length; row++) {
    this._tiles[row] = new Array(layout[row].length);

    for (var col = 0; col < layout[row].length; col++) {
      var shortname = layout[row][col];
      var tiledata = this._tilesheet.getTileDataByShortName(shortname);
      this._tiles[row][col] = new TileNode(tiledata);
    }
  }
};

/**
 * Set a new TileNode at the column/row specified in the TileMap.
 * @param {number} col
 * @param {number} row
 * @param {string} tiletype Property name of tile element specified in data file.
 */
TileMap.prototype.setTile = function (col, row, tiletype) {
  if (row < 0 || row >= this._tiles.length) {
    throw new RangeError("row out of bounds: " + row);
  }
  if (col < 0 || col >= this._tiles[row].length) {
    throw new RangeError("column out of bounds: " + col);
  }
  var tiledata = this._tilesheet.getTileDataByName(tiletype);
  return (this._tiles[row][col] = new TileNode(tiledata));
};

/**
 * Return the TileNode at the given TileMap's column and row.
 * @param {number} col
 * @param {number} row
 * @return {TileNode}
 */
TileMap.prototype.getTile = function (col, row) {
  if (row < 0 || row >= this._tiles.length) {
    throw new RangeError("row out of bounds: " + row);
  }
  if (col < 0 || col >= this._tiles[row].length) {
    throw new RangeError("column out of bounds: " + col);
  }
  return this._tiles[row][col];
};

/**
 * Translate screen coordinate to col/row and return the TileNode.
 * @param {number} x Screen position of x-coordinate.
 * @param {number} y Screen position of y coordinate.
 * @return {TileNode} Or null, if coordinate point is out-of-bounds.
 */
TileMap.prototype.getTileFromCoord = function (x, y) {
  var col = Math.floor(x / this._tilesheet.tileWidth);
  var row = Math.floor(y / this._tilesheet.tileHeight);
  //if out-of-bounds, return nothing
  if (row < 0 || row >= this._tiles.length ||
      col < 0 || col >= this._tiles[row].length) {
    return null;
  } else {
    return this.getTile(col, row);
  }
};

/**
 * Test if the given screen coordinate position is on a walkable tile.
 * @param {number} x Screen position of x-coordinate.
 * @param {number} y Screen position of y-coordinate.
 * @return {boolean} Or null, if coordinate point is out-of-bounds.
 */
TileMap.prototype.isWalkableCoord = function (x, y) {
  var tile = this.getTileFromCoord(x, y);
  if (tile) {
    return tile.isWalkable();
  } else {
    return null;
  }
};

/**
 * Print the TileMap and its TileNodes using the tile's shortname.
 * Useful for debugging.
 * @return {string}
 */
TileMap.prototype.toString = function () {
  var str = '\n';
  for (var row = 0; row < this._tiles.length; row++) {
    for (var col = 0; col < this._tiles[row].length; col++) {
      str += this._tiles[row][col].data.shortname + ' ';
    }
    str += '\n';
  }
  return str;
};


/**
 * A TileNode is used to fill the positions in a TileMap.
 * Each TileNode is different object but references tile data
 * which is shared amoungst similar tiles.
 * @constructor
 * @param {object} tiledata Tile element description specified in the tile-data file.
 */
function TileNode (tiledata) {
  this.data = tiledata;
}

/**
 * Test if the tile is walkable.
 * @return {boolean}
 */
TileNode.prototype.isWalkable = function () {
  return this.data.walkable;
};
