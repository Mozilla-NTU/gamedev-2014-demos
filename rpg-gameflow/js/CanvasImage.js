function CanvasImage (url) {
  this.width = 0;
  this.height = 0;
  this.isLoaded = false;
  this._img = new Image();
  this._img.onload = (function () {
    this.isLoaded = true;
  }).bind(this);
  this._img.src = url;
}

CanvasImage.prototype.draw = function (ctx) {
  if (this.isLoaded) {
    ctx.drawImage(0, 0, this.width, this.height);
  }
};
