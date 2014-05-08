(function(exports) {
  'use strict';

  function SpriteSheet(ctx, image, width, height, x, y, 
                       sheetWidth, sheetHeight, frameCount, fps) {
    Drawable.call(this, ctx, image, width, height, x, y);
    this.sheetWidth = sheetWidth;
    this.sheetHeight = sheetHeight;
    this.fps = fps || 0.06;

    this.frameCount = frameCount;
    this.framesPerRow = Math.floor(this.sheetWidth / this.width);
    this.currentFrame = 0;
  }

  SpriteSheet.prototype = Object.create(Drawable.prototype);

  SpriteSheet.prototype.update = function(delta, deltaAll) {
    this.currentFrame = Math.floor(this.fps * deltaAll) % this.frameCount;
  };

  SpriteSheet.prototype.draw = function(x, y) {
    var col = Math.floor(this.currentFrame % this.framesPerRow);
    var row = Math.floor(this.currentFrame / this.framesPerRow);
    this.ctx.drawImage(this.image,
      col * this.width, row * this.height,
      this.width, this.height,
      x || this.x, y || this.y,
      this.width, this.height);
  };

  exports.SpriteSheet = SpriteSheet;
})(this);
