/**
 * @param {url}    imageURL      Source url for image to load.
 * @param {object} tileSheetData Description of tiles specified in tile-data file.
 * @param {number} tileWidth     Width of tiles in pixels.
 * @param {number} tileHeight    Height of tiles in pixels.
 */
function TileSheet (imageURL, tileSheetData, tileWidth, tileHeight) {
  this.tileWidth = tileWidth;
  this.tileHeight = tileHeight;
  this.imageLoaded = false;
  this.image = new Image();
  this._data = tileSheetData;

  //load image
  //need this so we don't try to draw 
  this.image.onload = (function () {
    this.imageLoaded = true;
  }).bind(this);
  this.image.src = imageURL;
}

/**
 * Return tile data for a tile specified using its property name,
 * specfied on the tile description object.
 * @param {string} name
 * @return {object}
 */
TileSheet.prototype.getTileDataByName = function (name) {
  return this._data[name];
};

/**
 * Return tile data for a tile specified using its shortname, the
 * character used in the layout map.
 * @param {string} shortname
 * @return {object}
 */
TileSheet.prototype.getTileDataByShortName = function (shortname) {
  for (var propName in this._data) {
    if (this._data[propName].shortname === shortname) {
      return this._data[propName];
    }
  }
};
