var updateSprite = {
  screenWidth: 0,
  screenHeight: 0
};

updateSprite.setCanvasDimensions = function (width, height) {
  updateSprite.screenWidth = width;
  updateSprite.screenHeight = height;
};

/* Determine the directional movement of a sprite by examining its
 * vx/vy properties. Use the sprite's bounding-box edges to test
 * for collision with the edge of the canvas.
 * If it collides, apply a small amount of reverse velocity to the
 * sprite to bounce it off the wall.
 */
updateSprite.checkCollision = function (sprite) {
  //test right boundary
  if (sprite.vx > 0 && (sprite.x + sprite.width) >= updateSprite.screenWidth) {
    sprite.vx = -1;
    //test left boundary
  } else if (sprite.vx < 0 && sprite.x < 0) {
    sprite.vx = 1;
  }
  //test bottom boundary
  if (sprite.vy > 0 && (sprite.y + sprite.height) >= updateSprite.screenHeight) {
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
updateSprite.lookAt = function (spriteA, spriteB) {
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
updateSprite.moveBird = function (sprite) {
  //check for screen wrap
  if (sprite.x > updateSprite.screenWidth) {
    sprite.x = -sprite.width;
    //start at random height on canvas within two edge tiles
    var tileHeight = 32;
    var min = (tileHeight * 2);
    var max = updateSprite.screenHeight - (tileHeight * 2);
    sprite.y = Math.floor(Math.random() * (max - min + 1)) + min;
  }
  sprite.x += 2;
}
