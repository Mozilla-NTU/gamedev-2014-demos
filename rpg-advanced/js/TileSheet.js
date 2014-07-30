/**
 * This class maps the tilesheet image with its tilesheet data.
 * A tilesheet is a single composite image containing multiple
 * element images that are drawn to the screen individually.
 * The tilesheet data object contains details about specific element
 * images, such as its position within the tilesheet, height, width,
 * offsets, and metadata like names and collision info.
 * @constructor
 * @param {url}    imageURL      Url of tilesheet image to load.
 * @param {object} tileSheetData Information about tile elements within the tilesheet.
 * @param {number} tileWidth     Width of base tile in pixels.
 * @param {number} tileHeight    Height of base tile in pixels.
 */
function TileSheet (imageURL, tileSheetData, tileWidth, tileHeight) {
  this.tileWidth = tileWidth;
  this.tileHeight = tileHeight;
  this.imageLoaded = false;
  this.image = new Image();
  this._data = tileSheetData;

  //load image
  this.image.onload = (function () {
    this.imageLoaded = true;
  }).bind(this);
  this.image.src = imageURL;
}

/**
 * Using the object property name specified in the tilesheet
 * data object, return the data for a tile element.
 * @param {string} name
 * @return {object}
 */
TileSheet.prototype.getTileDataByName = function (name) {
  return this._data[name];
};

/**
 * Using the 'shortname' property that is specified within a
 * tile element description, return the data for a tile element.
 * This is typically the single character used in the layout map.
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
