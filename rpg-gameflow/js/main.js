/* The game code begins here, called from index.html
 */
function main () {
  "use strict";
  //get canvas element and its rendering context
  var layer2 = document.getElementById('layer2');
  var ctx = layer2.getContext('2d');
  //minimize calls to the dom
  var SCREEN_WIDTH = layer2.width;
  var SCREEN_HEIGHT = layer2.height;
  
  var sprite1 = new Sprite('./assets/character/guy1.png', {
    cols: 4,
    rows: 4,
    width: 32,
    height: 32,     //"physically" takes up 1 tile
    cellWidth: 32,
    cellHeight: 48, //slight image overflow adds depth
    cellOffsetX: 0,
    cellOffsetY: -16
  });
  sprite1.x = 128;
  sprite1.y = 384;
  
  var sprite2 = new Sprite('./assets/character/girl1.png', {
    cols: 4,
    rows: 4,
    width: 32,
    height: 32,
    cellWidth: 32,
    cellHeight: 48,
    cellOffsetX: 0,
    cellOffsetY: -16
  });
  sprite2.x = 256;
  sprite2.y = 352;

  var bird = new Sprite('./assets/character/birdie.png', {
    cols: 14,
    rows: 1,
    width: 183,
    height: 168
  });
  //start off screen
  bird.x = -bird.width;
  bird.y = 160;
  bird.scaleX = bird.scaleY = 0.4;
  bird.play(0);

  //anything in the render list must implement the `.draw(ctx)` method.
  var rootNode = new DrawNode();

  

  var titleImage = new CanvasImage('./assets/title-background.png');
  rootNode.addChild(titleImage);
  
  var titleScreen = new DrawNode();
  titleScreen.addChild(titleImage);

  var gameScreen = new DrawNode();
  gameScreen.addChild(sprite1);
  gameScreen.addChild(sprite2);
  gameScreen.addChild(bird);
  
  /* Main animation loop:
   * Re-draw objects on layer2 canvas EACH frame.
   */
  (function drawFrame () {
    window.requestAnimationFrame(drawFrame);
    ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    checkCollision(sprite1);
    lookAt(sprite2, sprite1);
    moveBird(bird);

    rootNode.draw(ctx);
  }());

  
  /* When an arrow key is pressed:
   * 1. play the sprite's animation sequence associated with that direction, and
   * 2. apply directional velocity for movement.
   * Sprite.play(row) animates the sequence of frames at the specified row in a spritesheet.
   */
  window.addEventListener('keydown', function (event) {
    switch (event.keyCode) {
    case 37: //left
      sprite1.play(1); //spritesheet row
      sprite1.vx = -2;
      break;
    case 38: //up
      sprite1.play(3);
      sprite1.vy = -2;
      break;
    case 39: //right
      sprite1.play(2);
      sprite1.vx = 2;
      break;
    case 40: //down
      sprite1.play(0);
      sprite1.vy = 2;
      break;
    }
  }, false);

  /* When the arrow key is released, stop animation and movement.
   */
  window.addEventListener('keyup', function () {
    sprite1.stop();
    sprite1.vx = 0;
    sprite1.vy = 0;
  }, false);


  /* Determine the directional movement of a sprite by examining its
   * vx/vy properties. Use the sprite's bounding-box edges to test
   * for collision with the edge of the canvas.
   * If it collides, apply a small amount of reverse velocity to the
   * sprite to bounce it off the wall.
   */
  function checkCollision (sprite) {
    //test right boundary
    if (sprite.vx > 0 && (sprite.x + sprite.width) >= SCREEN_WIDTH) {
      sprite.vx = -1;
      //test left boundary
    } else if (sprite.vx < 0 && sprite.x < 0) {
      sprite.vx = 1;
    }
    //test bottom boundary
    if (sprite.vy > 0 && (sprite.y + sprite.height) >= SCREEN_HEIGHT) {
      sprite.vy = -1;
      //test top boundary
    } else if (sprite.vy < 0 && sprite.y < 0) {
      sprite.vy = 1;
    }
  }

  /* Gives the appearance that spriteA is looking at spriteB.
   * If spriteB is moving past spriteA's x or y position, play a single
   * frame on spriteA's spritesheet to switch the animation sequence.
   */
  function lookAt (spriteA, spriteB) {
    if (spriteB.vy > 0 && spriteB.y >= spriteA.y) {
      spriteA.play(0); //down animation
      spriteA.stop();
    } else if (spriteB.vy < 0 && spriteB.y < spriteA.y) {
      spriteA.play(3); //up animation
      spriteA.stop();
    }
    if (spriteB.vx > 0 && spriteB.x >= spriteA.x) {
      spriteA.play(2); //right animation
      spriteA.stop();
    } else if (spriteB.vx < 0 && spriteB.x < spriteA.x) {
      spriteA.play(1); //left animation
      spriteA.stop();
    }
  }

  /* This function is called every frame and simply moves the
   * sprite horizontally across the entire length of the canvas.
   * When the sprite reaches the end, wrap it around to the
   * beginning, starting at a random y position.
   */
  function moveBird (sprite) {
    //check for screen wrap
    if (sprite.x > SCREEN_WIDTH) {
      sprite.x = -sprite.width;
      //start at random height on canvas within two edge tiles
      var tileHeight = 32;
      var min = (tileHeight * 2);
      var max = SCREEN_HEIGHT - (tileHeight * 2);
      sprite.y = Math.floor(Math.random() * (max - min + 1)) + min;
    }
    sprite.x += 2;
  }
}
