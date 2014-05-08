(function(exports) {
  'use strict';

  function Obstacle(ctx, image, x) {
    Drawable.call(this, ctx, image);

    this.height = this.generateRandomHeight();
    this.width = 120;

    this.x = x || (Game.width + this.width);
    this.y = Game.height - this.height;

    this.speed = -0.4;
  }

  Obstacle.prototype = Object.create(Drawable);

  Obstacle.prototype.generateRandomHeight = function() {
    var lowerLimit = Game.height / 4;
    return utils.getRandomInt(lowerLimit, lowerLimit + (Game.height / 2));
  };

  Obstacle.prototype.update = function(delta, deltaAll) {
    this.lastX = this.x;
    this.x = Math.floor(this.x + delta * this.speed);
    if (this.x > Game.width) {
      this.offscreen = true;
      return;
    }
    this.offscreen = false;

    if (this.x + this.width < 0) {
      this.height = this.generateRandomHeight();
      this.x = Game.width + this.width;
      this.y = Game.height - this.height;
    }
  };

  Obstacle.prototype.draw = function() {
    if (this.offscreen) {
      return;
    }
    this.ctx.clearRect(this.lastX, this.y, this.width, this.height);
    this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  };

  exports.Obstacle = Obstacle;
})(this);

