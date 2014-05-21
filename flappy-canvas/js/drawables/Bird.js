(function(exports) {
  'use strict';

  var ANIMATION_FRAMES = 14;
  var ANIMATION_SPEED = 0.02; // frames per milli

  var BIRD_WIDTH = 183;
  var BIRD_HEIGHT = 168;
  var SHEET_WIDTH = 918;
  var SHEET_HEIGHT = 506;

  function Bird(ctx, image, x, y) {
    SpriteSheet.call(this, ctx, image, BIRD_WIDTH, BIRD_HEIGHT, x, y,
      SHEET_WIDTH, SHEET_HEIGHT, ANIMATION_FRAMES, ANIMATION_SPEED);

    this.velocity = 0;
    this.terminalVelocity = 0.7;
    this.terminalFlap = 1.7;
    this.flapPower = 1.7;
    this.gravity = .003;

    // translate to center of bird for rotation purposes
    this.translateToX = ~~(this.x + (this.width / 2));
    this.halfWidth = ~~(this.width / 2);
    this.halfHeight = ~~(this.height / 2);

    if ('ontouchstart' in window) {
      window.addEventListener('touchstart', this.flap.bind(this));
    } else {
      window.addEventListener('mousedown', this.flap.bind(this));
    }
  }

  Bird.prototype = Object.create(Drawable.prototype);

  Bird.prototype.flap = function() {
    this.velocity -= this.flapPower;
    if (this.velocity < -this.terminalFlap) {
      this.velocity = -this.terminalFlap;
    }
  };

  Bird.prototype.update = function(delta, deltaAll) {
    SpriteSheet.prototype.update.call(this, delta, deltaAll);
    this.oldY = this.y;
    this.velocity += this.gravity * delta;
    if (this.velocity > this.terminalVelocity) {
      this.velocity = this.terminalVelocity;
    }

    this.y = Math.floor(this.y + (this.velocity * delta));
    if (this.y > Game.height) {
      this.y = Game.height;
    } else if (this.y < -this.height) {
       this.y = -this.height;
    }
  };

  Bird.prototype.draw = function() {
    this.ctx.clearRect(this.x-10, this.oldY-10, this.width+20, this.height+20);
    this.ctx.save();
    this.ctx.translate(this.translateToX, this.y + this.halfHeight);
    this.ctx.rotate(this.velocity);
    SpriteSheet.prototype.draw.call(this, -this.halfWidth, -this.halfHeight);
    this.ctx.restore();
  };

  exports.Bird = Bird;
})(this);

