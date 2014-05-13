/* The game code begins here, called from index.html
 */
function main () {
  "use strict";
  //get canvas elements and their rendering contexts
  var layer1 = document.getElementById('layer1'); //tile background
  var layer2 = document.getElementById('layer2'); //tile foreground and sprites
  var ctx1 = layer1.getContext('2d');
  var ctx2 = layer2.getContext('2d');
  
  var sprite1 = new Sprite('./assets/character/guy1.png', character_data.DEFAULT);
  sprite1.x = 128;
  sprite1.y = 384;
  
  var sprite2 = new Sprite('./assets/character/girl1.png', character_data.DEFAULT);
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
  
  var tilesheet = new TileSheet('./assets/tileset/village.png', village_data, 32, 32);
  var tilemap = new TileMap(meadow, tilesheet);

  var renderer = new Renderer();
  renderer.setTileMap(tilemap);
  //renderer.debug = true;

  renderer.add(sprite1);
  renderer.add(sprite2);
  
  /* Draw background on layer1 canvas ONCE on initial load.
   */
  tilesheet.image.addEventListener('load', function () {
    renderer.repaintBackground(ctx1);
  });
  
  /* Main animation loop:
   * Re-draw objects on layer2 canvas EACH frame.
   */
  (function drawFrame () {
    window.requestAnimationFrame(drawFrame);
    ctx2.clearRect(0, 0, layer2.width, layer2.height);
    checkCollision(sprite1);
    lookAt(sprite2, sprite1);
    moveBird(bird);
    renderer.draw(ctx2);
    //draw bird on top of everything
    bird.draw(ctx2, renderer.debug);
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
   * vx/vy properties. Use the midpoint of the bounding-box edges
   * to test for collision with un-walkable tiles.
   * If it collides, apply a small amount of reverse velocity to the
   * sprite to bounce it off the wall.
   */
  function checkCollision (sprite) {
    //bounds
    var left = sprite.x;
    var right = sprite.x + sprite.width;
    var top = sprite.y;
    var bot = sprite.y + sprite.height;
    var centerX = sprite.x + sprite.width/2;
    var centerY = sprite.y + sprite.height/2;

    //if moving right, test mid-right
    if (sprite.vx > 0 && !tilemap.isWalkableCoord(right, centerY)) {
      sprite.vx = -1;
      //if moving left, test mid-left
    } else if (sprite.vx < 0 && !tilemap.isWalkableCoord(left, centerY)) {
      sprite.vx = 1;
    }
    //if moving down, test mid-bottom
    if (sprite.vy > 0 && !tilemap.isWalkableCoord(centerX, bot)) {
      sprite.vy = -1;
      //if moving up, test mid-top
    } else if (sprite.vy < 0 && !tilemap.isWalkableCoord(centerX, top)) {
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
    if (sprite.x > layer2.width) {
      sprite.x = -sprite.width;
      //start at random height on canvas within two edge tiles
      var min = (tilesheet.tileHeight * 2);
      var max = layer2.height - (tilesheet.tileHeight * 2);
      sprite.y = Math.floor(Math.random() * (max - min + 1)) + min;
    }
    sprite.x += 2;
  }
}
