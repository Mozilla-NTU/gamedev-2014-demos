/**
 * Contains a list of child elements that implement the `.draw(ctx)` method.
 */
function DrawNode () {
  this.children = [];
}

DrawNode.prototype.addChild = function (child) {
  if (child && typeof child.draw === 'function') {
    this.children.push(child);
  } else {
    throw new TypeError("addChild: child does not implement the draw method.");
  }
};

DrawNode.prototype.removeChild = function (child) {
  var idx = this.children.indexOf(child);
  if (idx > -1) {
    return this.children.splice(idx, 1)[0];
  }
};

DrawNode.prototype.draw = function (ctx) {
  for (var i = 0, len = this.children.length; i < len; i++) {
    this.children[i].draw(ctx);
  }
};
