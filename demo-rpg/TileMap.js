/**
 * A TileMap is filled with TileNodes.
 * @param {object} tiledata Tile description specified in the tile-data file.
 */
function TileNode (tiledata) {
  this.data = tiledata;
}

/**
 * @return {boolean}
 */
TileNode.prototype.isWalkable = function () {
  return this._data.walkable;
};



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
 * @param {number} x Column
 * @param {number} y Row
 * @return {TileNode}
 */
TileMap.prototype.getTile = function (x, y) {
  if (y < 0 || y >= this._tiles.length) {
    throw new RangeError("y out of bounds: " + y);
  }
  if (x < 0 || x >= this._tiles[y].length) {
    throw new RangeError("x out of bounds: " + x);
  }
  return this._tiles[y][x];
};

/**
 * Translate screen coordinate to col/row and return tile.
 * @param {number} coordX Position of x coordinate on screen.
 * @param {number} coordY Position of y coordinate on screen.
 * @return {TileNode}
 */
TileMap.prototype.getTileCoord = function (coordX, coordY) {
  var x = Math.floor(coordX / this._tilesheet.tileWidth);
  var y = Math.floor(coordY / this._tilesheet.tileHeight);
  return this.getTile(x, y);
};
