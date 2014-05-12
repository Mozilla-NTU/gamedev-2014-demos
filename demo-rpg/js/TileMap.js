/**
 * A TileMap is filled with TileNodes.
 * @param {object} tiledata Tile description specified in the tile-data file.
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


/***********************/


/**
 * @param {array} layout
 * @param {TileSheet} tilesheet
 */
function TileMap (layout, tilesheet) {
  if (!tilesheet instanceof TileSheet) {
    throw new TypeError("tilesheet param must be a TileSheet");
  }
  this._tilesheet = tilesheet;
  this._tiles = [];

  this.setTilesFromLayout(layout);
}

/**
 * Iterate over layout 2-dim array filled with shortnames and
 * fill the tiles 2-dim array with TileNodes.
 * @param {array} layout
 */
TileMap.prototype.setTilesFromLayout = function (layout) {
  if (!Array.isArray(layout)) {
    throw new TypeError("layout param must be a 2-dim array");
  }
  for (var y=0; y < layout.length; y++) {
    this._tiles[y] = [];
    for (var x=0; x < layout[y].length; x++) {
      var shortname = layout[y][x];
      var tiledata = this._tilesheet.getTileDataByShortName(shortname);
      this._tiles[y][x] = new TileNode(tiledata);
    }
  }
};

/*
 * TILE NODE ACCESSORS
 */

/**
 * @param {number} x        Column
 * @param {number} y        Row
 * @param {string} tiletype Property name of tile specified in tile-data file.
 */
TileMap.prototype.setTile = function (x, y, tiletype) {
  if (y < 0 || y >= this._tiles.length) {
    throw new RangeError("y out of bounds: " + y);
  }
  if (x < 0 || x >= this._tiles[y].length) {
    throw new RangeError("x out of bounds: " + x);
  }
  var tiledata = this._tilesheet.getTileDataByName(tiletype);
  return this._tiles[y][x] = new TileNode(tiledata);
};

/**
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
 * Translate screen coordinate to col/row and return tile.
 * @param {number} x Position of x-coordinate.
 * @param {number} y Position of y coordinate.
 * @return {TileNode} Or null if coordinate point is out-of-bounds.
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
 * @param {number} x
 * @param {number} y
 * @return {boolean} Or null if coordinate point is out-of-bounds.
 */
TileMap.prototype.isWalkableCoord = function (x, y) {
  var tile = this.getTileFromCoord(x, y);
  if (tile) {
    return tile.isWalkable();
  } else {
    return null;
  }
}

/**
 * @return {string}
 */
TileMap.prototype.toString = function () {
  var str = '\n';
  for (var y=0; y < this._tiles.length; y++) {
    for (var x=0; x < this._tiles[y].length; x++) {
      str += this._tiles[y][x].data.shortname + ' ';
    }
    str += '\n';
  }
  return str;
};
