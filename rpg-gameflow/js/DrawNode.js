/**
 * Contains a list of child elements that implement the `.draw(ctx)` method.
 */
function DrawNode () {
  this._children = [];
}

DrawNode.prototype.addChild = function (child) {
  if (child && typeof child.draw === 'function') {
    this._children.push(child);
  } else {
    throw new TypeError("addChild: child does not implement the draw method.");
  }
};

DrawNode.prototype.removeChild = function (child) {
  var idx = this._children.indexOf(child);
  if (idx > -1) {
    return this._children.splice(idx, 1)[0];
  }
};

DrawNode.prototype.draw = function (ctx) {
  for (var i = 0, len = this._children.length; i < len; i++) {
    this._children[i].draw(ctx);
  }
};
