/*
 * Move key events listeners out of the main file.
 */

var keyListener = {
  sprite: null
};

/* Sprite to apply added velocity to.
 */
keyListener.setActiveSprite = function (sprite) {
  keyListener.sprite = sprite;
};

/* When an arrow key is pressed:
 * 1. play the sprite's animation sequence associated with that direction, and
 * 2. apply directional velocity for movement.
 * Sprite.play(row) animates the sequence of frames at the specified row in a spritesheet.
 */
keyListener.onKeyDown = function (event) {
  switch (event.keyCode) {
  case 37: //left
    keyListener.sprite.play(1); //spritesheet row
    keyListener.sprite.vx = -2;
    break;
  case 38: //up
    keyListener.sprite.play(3);
    keyListener.sprite.vy = -2;
    break;
  case 39: //right
    keyListener.sprite.play(2);
    keyListener.sprite.vx = 2;
    break;
  case 40: //down
    keyListener.sprite.play(0);
    keyListener.sprite.vy = 2;
    break;
  }
};

/* When the arrow key is released, stop animation and movement.
 */
keyListener.onKeyUp = function () {
  keyListener.sprite.stop();
  keyListener.sprite.vx = 0;
  keyListener.sprite.vy = 0;
};
