/* The game code begins here, called from index.html
 */
function main () {
  "use strict";
  //get canvas element and its rendering context
  var layer2 = document.getElementById('layer2');
  var ctx = layer2.getContext('2d');
  var SCREEN_WIDTH = layer2.width;
  var SCREEN_HEIGHT = layer2.height;
  
  var gameRunning = false;
  //buttons are css-styled links
  var startButton = document.getElementById('start-button');
  var saveButton = document.getElementById('save-button');
  var message = document.getElementById('message');

  /*
   * Check for stored position in localStorage, otherwise
   * sprite position from given x and y params.
   */
  function setPositionOrDefault (sprite, x, y) {
    // check if sprite's position is stored
    try {
      var spriteAttrStr = window.localStorage.getItem('spritePos');
    } catch (err) {
      console.log("localStorage not supported.");
    }
    if (!spriteAttrStr) {
      //default start position
      sprite.x = x;
      sprite.y = y;
    } else {
      //got saved position
      var spriteAttr = JSON.parse(spriteAttrStr);
      sprite.x = spriteAttr.x;
      sprite.y = spriteAttr.y;
      message.innerHTML = "Loaded saved game."
    }
  }

  /*
   * SPRITES
   */
  
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
  //
  var sprite1DefaultX = 128;
  var sprite1DefaultY = 384;
  setPositionOrDefault(sprite1, sprite1DefaultX, sprite1DefaultY);

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
  //start off screen left
  bird.x = -bird.width;
  bird.y = 160;
  bird.scaleX = bird.scaleY = 0.4;
  bird.play(0);

  
  /*
   * SCENE GRAPH
   */
  
  var rootNode = new DrawNode();

  var gameScreen = new DrawNode();
  gameScreen.addChild(sprite1);
  gameScreen.addChild(sprite2);
  gameScreen.addChild(bird);
  rootNode.addChild(gameScreen);

  var titleImage = new CanvasImage('./assets/title-background.png');
  var titleScreen = new DrawNode();
  titleScreen.addChild(titleImage);
  rootNode.addChild(titleScreen);

  /*
   * LOAD ASSETS
   * After images are all loaded, render frame once to have something
   * on-screen. This is kinda hacky, you should manage this better.
   * Does *not* start game loop.
   */
  titleImage._img.addEventListener('load', function () {
    rootNode.draw(ctx);
  });
  
  /*
   * GAME LOOP
   * Re-draw objects on layer2 canvas EACH frame.
   */
  function drawFrame () {
    if (gameRunning) {
      window.requestAnimationFrame(drawFrame);
      ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
      updateSprite.checkCollision(sprite1);
      updateSprite.lookAt(sprite2, sprite1);
      updateSprite.moveBird(bird);
      rootNode.draw(ctx);
      checkEndGame(sprite1);
    }
  }

  /*
   * TEST END GAME
   */
  function checkEndGame (sprite) {
    var BOX_SIZE = 50; //size to catch
    if (sprite.x > bird.x &&
        sprite.x < bird.x + BOX_SIZE &&
        sprite.y > bird.y &&
        sprite.y < bird.y + BOX_SIZE) {
      gameRunning = false;
      rootNode.addChild(titleScreen);
      rootNode.draw(ctx);
      window.removeEventListener('keydown', keyListener.onKeyDown, false);
      window.removeEventListener('keyup', keyListener.onKeyUp, false);
      //reset sprites
      bird.x = -bird.width;
      bird.y = 160;
      sprite.play(0);
      sprite.stop();
      sprite.vx = sprite.vy = 0;
      setPositionOrDefault(sprite, sprite1DefaultX, sprite1DefaultY);
      message.innerHTML = "You caught the bird!";
    }
  }
  
  /*
   * BUTTONS
   */

  //the start button removes the title screen,
  //starts the game loop, and adds keyboard event listeners
  startButton.addEventListener('click', startGame);

  function startGame () {
    if (!gameRunning) {
      //remove title screen
      rootNode.removeChild(titleScreen);
      //set dimensions for collision detection
      updateSprite.setCanvasDimensions(SCREEN_WIDTH, SCREEN_HEIGHT);
      //add event listeners for key press, dispatch to sprite1
      keyListener.setActiveSprite(sprite1);
      window.addEventListener('keydown', keyListener.onKeyDown, false);
      window.addEventListener('keyup', keyListener.onKeyUp, false);
      //start the game loop
      gameRunning = true;
      drawFrame();
    }
  }

  //the save button stores the sprite's position on the client
  saveButton.addEventListener('click', function () {
    try {
      var attrStr = JSON.stringify({
        x: sprite1.x,
        y: sprite1.y
      });
      window.localStorage.setItem('spritePos', attrStr);
      message.innerHTML = "Game saved!"
    } catch (err) {
      message.innerHTML = "Unable to save game."
    }
  });
}
