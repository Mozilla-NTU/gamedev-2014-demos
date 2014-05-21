function CanvasImage (url) {
  this.x = 0;
  this.y = 0;
  this.width = 0;
  this.height = 0;
  //transforms
  this.rotation = 0;
  this.scaleX = 1;
  this.scaleY = 1;
  
  this.isLoaded = false;
  this._img = new Image();
  this._img.onload = (function () {
    this.isLoaded = true;
    this.width = this._img.width;
    this.height = this._img.height;
  }).bind(this);
  this._img.src = url;
}

CanvasImage.prototype.draw = function (ctx) {
  if (this.isLoaded) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.scale(this.scaleX, this.scaleY);
    ctx.drawImage(this._img, 0, 0, this.width, this.height);
    ctx.restore();
  }
};
