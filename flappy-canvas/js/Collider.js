(function(exports) {
  'use strict';

  function Collider(subject) {
    this.subject = subject;
    this.objects = [];

    this.threshold = 200;
    this.timeSinceLastCheck = 0;
  }

  Collider.prototype.addObject = function(obj) {
    this.objects.push(obj);
  };

  Collider.prototype.update = function(delta) {
    this.timeSinceLastCheck += delta;
    if (this.timeSinceLastCheck > this.threshold) {
      this.timeSinceLastCheck -= this.threshold;

      this.subject.y2 = this.subject.y + this.subject.height;
      this.subject.x2 = this.subject.x + this.subject.width;

      var sub = this.subject;
      for (var i = 0; i < this.objects.length; i++) {
        var obj = this.objects[i];
        if (obj.x < sub.x2 && obj.y < sub.y2) {
          Game.endGame();
          return;
        }
      }
    }
  };


  exports.Collider = Collider;
})(this);
