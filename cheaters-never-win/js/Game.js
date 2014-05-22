function Game(stage) {
  this.stage = stage;
  this.ctx = stage.getContext('2d');
  this.bird = new Bird(this, this.stage);

  this.height = this.stage.height;
  this.width = this.stage.width;

  this.pipes = [];
  for (var i = 0; i < 3; i++) {
    this.pipes[i] = new Pipe(this, this.stage);
    setTimeout(function(p) {
      p.animate();
    }.bind(this, this.pipes[i]), i * 1000);
  }

  this.collider = new Collider(this.bird, this.pipes);

  this.lastTick = Date.now();
  this.tick();
}

Game.prototype.tick = function() {
  var now = Date.now();
  var delta = now - this.lastTick;
  this.lastTick = now;

  // updating game objects
  this.bird.update(delta);
  this.ctx.clearRect(0, 0, this.stage.width, this.stage.height);

  this.bird.draw(this.ctx);

  for (var i = 0; i < this.pipes.length; i++) {
    this.pipes[i].update(delta);
    this.pipes[i].draw(this.ctx);
  }

  this.collider.checkCollision();

  requestAnimationFrame(this.tick.bind(this));
}

window.addEventListener('DOMContentLoaded', function() {
  new Game(document.getElementById('stage'));
});
