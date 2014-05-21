function Pipe(game, stage) {
  this.game = game;
  this.stage = stage;

  this.width = 100;
  this.height = 50 + (Math.random() * 120);

  this.x = this.game.width;
  this.y = this.game.height - this.height;

  this.velocityX = -200;

  this.color = 'green';

  this.active = false;

  this.gapHeight = 150;
}

Pipe.prototype.animate = function() {
  this.active = true;
}

Pipe.prototype.update = function(delta) {
  if (this.active === true) {
    this.x = this.x + (this.velocityX * (delta / 1000));
    if (this.x < -this.width) {
      this.recycle();
    }
  }
};

Pipe.prototype.recycle = function() {
  this.height = 50 + (Math.random() * 120);
  this.y = this.game.height - this.height;
  this.color = 'green';
  this.x = this.game.width;
};

Pipe.prototype.draw = function(ctx) {
  ctx.fillStyle = this.color;
  ctx.fillRect(this.x, this.y, this.width, this.height);
  ctx.fillRect(this.x, 0, this.width, this.y - this.gapHeight);
};
