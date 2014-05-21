function Collider(bird, pipes) {
  this.bird = bird;
  this.pipes = pipes;

  this.leftX = this.bird.x - this.bird.width / 2;
  this.rightX = this.bird.x + this.bird.width / 2;
}

Collider.prototype.checkCollision = function() {
  for (var i = 0; i < this.pipes.length; i++) {
    var pipe = this.pipes[i];
    var pipeRightX = pipe.x + pipe.width;
    // make sure bird is horizontally inside pipes
    if ( ((pipe.x > this.leftX && pipe.x < this.rightX) ||
          (pipeRightX > this.leftX && pipeRightX < this.rightX))) {
      // check if bird is vertically inside pipes
      if (this.bird.y > pipe.y || this.bird.y < pipe.y - pipe.gapHeight) {
        pipe.color = 'red';
      }
    }
  }
};

