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
  var gameRunning = false;
  //buttons are css-styled links
  var startButton = document.getElementById('start-button');
  var saveButton = document.getElementById('save-button');
  var message = document.getElementById('message');

  /*
   * Set up sprites
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

  function startSpritePosition (sprite) {
    // check if sprite's position is stored
    try {
      var spriteAttrStr = window.localStorage.getItem('spritePos');
    } catch (err) {
      console.log("localStorage not supported.");
    }
    if (!spriteAttrStr) {
      //default position
      sprite.x = 128;
      sprite.y = 384;
    } else {
      //saved position
      var spriteAttr = JSON.parse(spriteAttrStr);
      sprite.x = spriteAttr.x;
      sprite.y = spriteAttr.y;
      message.innerHTML = "Loaded saved game."
    }
  }

  startSpritePosition(sprite1); //will use to reset
  
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

  
  /*
   * Set up scene graph
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
   * initial draw after title image load, does not start game loop
   */
  titleImage._img.addEventListener('load', function () {
    //drawFrame();
    rootNode.draw(ctx);
  });
  
  /* Main animation loop:
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

  function checkEndGame (sprite) {
    var BOX_SIZE = 50; //size to catch
    if (sprite.x > bird.x &&
        sprite.x < bird.x + BOX_SIZE &&
        sprite.y > bird.y &&
        sprite.y < bird.y + BOX_SIZE) {
      gameRunning = false;
      rootNode.addChild(titleScreen);
      rootNode.draw(ctx);
      message.innerHTML = "You caught the bird!";
      window.removeEventListener('keydown', keyListener.onKeyDown, false);
      window.removeEventListener('keyup', keyListener.onKeyUp, false);
      //reset sprites
      bird.x = -bird.width;
      bird.y = 160;
      sprite.play(0);
      sprite.stop();
      sprite.vx = sprite.vy = 0;
      startSpritePosition(sprite);
    }
  }
  
  /*
   * Set up buttons
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
