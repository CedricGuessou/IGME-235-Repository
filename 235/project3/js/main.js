"use strict";
const app = new PIXI.Application();


let sceneWidth, sceneHeight;

// aliases
let stage;
let assets;
let swordSprite;

// game variables
let startScene;
let gameScene, knight, scoreLabel, lifeLabel, timerLabel, itemSound, hitSound, enemySound;
let gameOverScene, gameOverScoreLabel;

// Sprites
let shipSprite, ssheet;
let kSheet = [];
let textures = [];

// Input
let keys = [];
let attackBox;
let attackTimer = 0; // Counts how long the attack has been up for
let damageTimer = 0;

let enemies = [];
let score = 0;
let life = 100;
let timer = 0;
let paused = true;
setup();

async function setup() {
    await app.init({ width: 1200, height: 600 });

    // importSprite();

    document.body.appendChild(app.canvas);

    stage = app.stage;
    sceneWidth = app.renderer.width;
    sceneHeight = app.renderer.height;

    // #1 - Create the `start` scene
    startScene = new PIXI.Container();
    stage.addChild(startScene);

    // #2 - Create the main `game` scene and make it invisible
    gameScene = new PIXI.Container();
    gameScene.visible = false;
    stage.addChild(gameScene);

    // #3 - Create the `gameOver` scene and make it invisible
    gameOverScene = new PIXI.Container();
    gameOverScene.visible = false;
    stage.addChild(gameOverScene);

    // #4 - Create labels for all 3 scenes
    createLabelsAndButtons();

    // #5 - Create player
    let knightSprite = await PIXI.Assets.load('media/spaceship.png');
    ssheet = await PIXI.Assets.load('media/knight_walk.png');
    let sample = await PIXI.Assets.load('media/sample_knight.png');

    loadSpriteSheet();
    knight = new Knight(kSheet.faceDown);
    gameScene.addChild(knight);

    swordSprite = await PIXI.Assets.load('media/sword.png');

    // Events for testing
    window.onkeydown = (e) => {
        keys[e.keyCode] = true;
        console.log(e.keyCode);
    }

    window.onkeyup = (e) => {
        keys[e.keyCode] = false;

    }


    // #6 - Load Sounds
   
    // #7 - Load sprite sheet

    // #8 - Start update loop
    app.ticker.add(gameLoop);

    // #9 - Start listening for click events on the canvas

    // Now our `startScene` is visible
    // Clicking the button calls startGame()
}

function createLabelsAndButtons() {
    let buttonStyle = {
        fill: 0xff0000,
        fontSize: 48,
        fontFamily: "Bell MT",
    };

    // 1) Set up startScene
    // 1A) Make top start label
    let startLabel1 = new PIXI.Text("Dungeon Survivor", {
        fill: 0xffffff,
        fontSize: 96,
        fontFamily: "Bell MT",
        stroke: 0xff0000,
        strokeThickness: 6,
    });
    startLabel1.x = 200;
    startLabel1.y = 120;
    startScene.addChild(startLabel1);

    // 1B) Make a middle start label
    /*
    let startLabel2 = new PIXI.Text("Instructions go here", {
        fill: 0xffffff,
        fontSize: 32,
        fontFamily: "Bell MT",
        fontStyle: "italic",
        stroke: 0xff0000,
        strokeThickness: 6,
    })
    startLabel2.x = 185;
    startLabel2.y = 300;
    startScene.addChild(startLabel2);
    */
    // 1C) Make start game button
    let startButton = new PIXI.Text("Click here when you're ready", buttonStyle);
    startButton.x = sceneWidth / 2 - startButton.width / 2;
    startButton.y = sceneHeight - 100;
    startButton.interactive = true;
    startButton.buttonMode = true;
    startButton.on("pointerup", startGame); // startGame is a function reference
    startButton.on("pointerover", (e) => (e.target.alpha = 0.7)); // Concise arrow function with no brackets
    startButton.on("pointerout", (e) => (e.currentTarget.alpha = 1.0)) // Ditto
    startScene.addChild(startButton);

    // 2) Set up gameScene
    let textStyle = {
        fill: 0xffffff,
        fontSize: 30,
        fontFamily: "Bell MT",
    };

    // 2A) Make score label
    scoreLabel = new PIXI.Text("", textStyle);
    scoreLabel.x = 5;
    scoreLabel.y = 5;
    gameScene.addChild(scoreLabel);

    // 2B) Make life label
    lifeLabel = new PIXI.Text("", textStyle);
    lifeLabel.x = 5;
    lifeLabel.y = 30;
    gameScene.addChild(lifeLabel);
    decreaseLifeBy(0);

    // 3) Set up `gameOverScene`
    // 3A) Make game over text
    let gameOverText = new PIXI.Text("Game Over!\n        :-O", {
        fill: 0xffffff,
        fontSize: 64,
        fontFamily: "Bell MT",
        stroke: 0xff0000,
        strokeThickness: 6,
    });
    gameOverText.x = sceneWidth / 2 - gameOverText.width / 2;
    gameOverText.y = sceneHeight / 2 - 160;
    gameOverScene.addChild(gameOverText);

    // Initialize game over score text
    gameOverScoreLabel = new PIXI.Text("Your final score: " + score, {
        fill: 0xffffff,
        fontSize: 36,
        fontFamily: "Futura",
        stroke: 0xff0000,
        strokeThickness: 6,
    });
    gameOverScoreLabel.x = sceneWidth / 2 - gameOverScoreLabel.width / 2;
    gameOverScoreLabel.y = sceneHeight / 2;
    gameOverScene.addChild(gameOverScoreLabel);

    increaseScoreBy(0);

    // 3B) Make "play again?" button
    let playAgainButton = new PIXI.Text("Play Again?", buttonStyle);
    playAgainButton.x = sceneWidth / 2 - playAgainButton.width / 2;
    playAgainButton.y = sceneHeight - 100;
    playAgainButton.interactive = true;
    playAgainButton.buttonMode = true;
    playAgainButton.on("pointerup", startGame); // startGame is a function reference
    playAgainButton.on("pointerover", (e) => (e.target.alpha = 0.7)); // concise arrow function with no brackets
    playAgainButton.on("pointerout", (e) => (e.currentTarget.alpha = 1.0)); // ditto
    gameOverScene.addChild(playAgainButton);
}

function startGame() {
    app.renderer.background.color = 0x964B00;

    console.log("startGame called");
    startScene.visible = false;
    gameOverScene.visible = false;
    gameScene.visible = true;
    score = 0;
    life = 100;
    increaseScoreBy(0);
    decreaseLifeBy(0);
    // loadLevel();

    // Attack box
    attackBox = new PIXI.Graphics();

    attackBox = PIXI.Sprite.from(swordSprite);
    // attackBox.rect(0, 0, 90, 100);
    // attackBox.fill(0xffffff);
    attackBox.anchor.set(.5);
    attackBox.scale.set(.75);
    gameScene.addChild(attackBox);
    attackBox.visible = false;


    // Generate enemies

    
    for (let i = 0; i < 4; i++) {
        spawnEnemy();
    }


    // Unpause the game which allows the gameLoop and events to be active
    setTimeout(() => {
        paused = false;
    }, 50);
}

function increaseScoreBy(value) {
    score += value;
    scoreLabel.text = `Score: ${score}`;
    gameOverScoreLabel.text = `Your final score: ${score}`;
}

function decreaseLifeBy(value) {
    life -= value;
    life = parseInt(life); // convert to integer
    lifeLabel.text = `Life: ${life}%`;
}

function gameLoop() {
    if (paused) return; // keep this commented out for now

    // #1 - Calculate "delta time"
    let dt = 1 / app.ticker.FPS;
    if (dt > 1 / 12) dt = 1 / 12;

    // #2 - Move knight
    knight.movement(keys);

    // Attack
    if(keys["75"]){  // If space bar is being pressed
        if(paused) return;
        attackBox.visible = true;
       
        // After implementing a state machine for animation make sure
        // to change this so that the box spawns infront of the direction the 
        // knight is facing
        // attackBox.x = knight.x + knight.width;
        // attackBox.y = knight.y;

        attackTimer++;

        if(attackTimer >= 10){   // Attack will have maximum of 60 active frames
            attackBox.visible = false;
        }
        else{
            for(let enemy of enemies)
            if(rectsIntersect(attackBox, enemy)){
                console.log("Attack");
                enemy.health--;
                console.log(enemy.health);
            }
        }
    }
    else{
        attackBox.visible = false;
        attackTimer = 0;
    }
    
    

    // #3 - Move enemies

    // Track the player
    if(enemies.length > 0){
        for (let i = 0; i < enemies.length; i++) {
            enemies[i].follow(knight);
        }
    }

    // #4 - Move something


    // #5 - Check for Collisions
    // If the knight is take damage and get 4 seconds of i-frames
    
    if(damageTimer == 0){
        for(let enemy of enemies){
            if(rectsIntersect(knight, enemy)){
                console.log("Bam");
                knight.health -= 5;
                decreaseLifeBy(5);
                console.log("HP: " + knight.health);
                damageTimer++;
            }
        }
    }    // 4 seconds of i-frames
    else if(damageTimer > 0 && damageTimer < 240){
        damageTimer++;
    }
    else{
        damageTimer = 0;
    }

    /*
    for(let enemy of enemies){
        if(rectsIntersect(knight, enemy) && damageTimer < 240){
            if(damageTimer == 0){
                console.log("Bam");
                knight.health--;
            }
            damageTimer++;
            console.log("HP: " + knight.health);
        }
        else{
            damageTimer = 0;
        }

        
    }
        */

    if(enemies.length > 0 ){enemies.forEach(enemyDead)}
    /*
    for (let c of circles) {
        // #5A Circles and bullets
        for (let b of bullets) {
            if (rectsIntersect(c, b)) {
                fireballSound.play();
                createExplosion(c.x, c.y, 64, 64);
                gameScene.removeChild(c);
                c.isAlive = false;
                gameScene.removeChild(b);
                b.isAlive = false;
                increaseScoreBy(1);
                break;
            }
        }

        // #5B Circles and ship
        if (c.isAlive && rectsIntersect(c, ship)) {
            hitSound.play();
            gameScene.removeChild(c);
            c.isAlive = false;
            decreaseLifeBy(20);
        }
    }
    */
   
    // #6 - Now do some clean up
    
    // #6A Cleanup bullets
    enemies = enemies.filter((e) => e.health > 0);

    if(enemies.length < 3){
        for(let i = 0; i < 5; i++){
            spawnEnemy();
        }
    }
    /*
    // # 6B Cleanup circles
    circles = circles.filter((c) => c.isAlive);

    // #6C Get rid of explosions
    explosions = explosions.filter((e) => e.playing);
    */

    // #7 - Is game over?
    if (life <= 0) {
        end();
        return; // return here so we skip #8 below
    }

    // #8 - Keep spawning enemies
    
}

async function importSprite() {
    shipSprite = await Assets.load('media/spaceship.png');
}

function loadSpriteSheet(){
    // Fix this sprite
    let sheet = new PIXI.Texture.from('media/knight_walk.png');
    let w = 24;
    let h = 33;
    let offx = 4;
    let offy = 7;
    for(let i = 0; i < 8; i++){
        for(let j = 0; j < 4; j++){
            let frame = new PIXI.Texture({
                source: sheet,
                frame: new PIXI.Rectangle((j * w) + offx, (offy * (i + 1)) + (h * i), w, h),
            });
            textures.push(frame);
        }
    }
    
    kSheet["faceUp"] = [textures[4]];

    kSheet["faceLeft"] = [textures[8]];

    kSheet["faceDown"] = [textures[0]];

    kSheet["faceRight"] = [textures[12]];

    kSheet["walkUp"] = [
        textures[20], textures[21], textures[22], textures[23]
    ];

    kSheet["walkLeft"] = [
        textures[24], textures[25], textures[26], textures[27]
    ];

    kSheet["walkDown"] = [
        textures[16], textures[17], textures[18],  textures[19]
    ];

    kSheet["walkRight"] = [
        textures[28], textures[29], textures[30], textures[31]
    ];


    /*
    kSheet["faceUp"] = [
        new PIXI.Texture(sheet, new PIXI.Rectangle(offx, offy, w, h))
    ];

    kSheet["faceLeft"] = [
        new PIXI.Texture(sheet, new PIXI.Rectangle(offx, (offy * 2) + h, w, h))
    ];

    kSheet["faceDown"] = [
        new PIXI.Texture(sheet, new PIXI.Rectangle(offx, (offy * 3) + h, w, h))
    ];

    kSheet["faceRight"] = [
        new PIXI.Texture(sheet, new PIXI.Rectangle(offx, (offy * 4) + h, w, h))
    ];

    kSheet["walkUp"] = [
        new PIXI.Texture(sheet, new PIXI.Rectangle(offx, (offy * 6) + (h * 5), w, h)),
        new PIXI.Texture(sheet, new PIXI.Rectangle(offx + w, (offy * 6) + (h * 5), w, h)),
        new PIXI.Texture(sheet, new PIXI.Rectangle(offx + (w * 2), (offy * 6) + (h * 5), w, h)),
        new PIXI.Texture(sheet, new PIXI.Rectangle(offx + (w * 3), (offy * 6) + (h * 5), w, h))

    ];

    kSheet["walkLeft"] = [
        new PIXI.Texture(sheet, new PIXI.Rectangle(offx, (offy * 7) + (h * 6), w, h)),
        new PIXI.Texture(sheet, new PIXI.Rectangle(offx + w, (offy * 7) + (h * 6), w, h)),
        new PIXI.Texture(sheet, new PIXI.Rectangle(offx + (w * 2), (offy * 7) + (h * 6), w, h)),
        new PIXI.Texture(sheet, new PIXI.Rectangle(offx + (w * 3), (offy * 7) + (h * 6), w, h))

    ];

    kSheet["walkDown"] = [
        new PIXI.Texture(sheet, new PIXI.Rectangle(offx, (offy * 5) + (h * 4), w, h)),
        new PIXI.Texture(sheet, new PIXI.Rectangle(offx + w, (offy * 5) + (h * 4), w, h)),
        new PIXI.Texture(sheet, new PIXI.Rectangle(offx + (w * 2), (offy * 5) + (h * 4), w, h)),
        new PIXI.Texture(sheet, new PIXI.Rectangle(offx + (w * 3), (offy * 5) + (h * 4), w, h))

    ];

    kSheet["walkRight"] = [
        new PIXI.Texture(sheet, new PIXI.Rectangle(offx, (offy * 8) + (h * 7), w, h)),
        new PIXI.Texture(sheet, new PIXI.Rectangle(offx + w, (offy * 8) + (h * 7), w, h)),
        new PIXI.Texture(sheet, new PIXI.Rectangle(offx + (w * 2), (offy * 8) + (h * 7), w, h)),
        new PIXI.Texture(sheet, new PIXI.Rectangle(offx + (w * 3), (offy * 8) + (h * 7), w, h))

    ];
    */

    
}

function end() {
    paused = true;

    // Clear out level
    enemies.forEach((c) => gameScene.removeChild(c));
    enemies = [];

    app.view.onclick = null; // Disable the onclick event

    gameOverScene.visible = true;
    gameScene.visible = false;
}


// bounding box collision detection - it compares PIXI.Rectangles
function rectsIntersect(a,b){
    var ab = a.getBounds();
    var bb = b.getBounds();
    return ab.x + ab.width > bb.x && 
           ab.x < bb.x + bb.width && 
           ab.y + ab.height > bb.y && 
           ab.y < bb.y + bb.height;
}

function magnitude(object){
    let result = Math.pow(object.x, 2) + Math.pow(object.y, 2);
    result = Math.sqrt(result);
    return result;
}

function spawnEnemy(){
    let enemy = new Enemy();

    enemy.x = Math.floor(Math.random() * sceneWidth);
    enemy.y = Math.floor(Math.random() * sceneHeight)
    // enemy.anchor.set(.5);  // Add this when you make sprite
    gameScene.addChild(enemy);
    enemies.push(enemy);
}

function enemyDead(enemy){
    if(enemy.health <= 0){
        enemy.visible = false
        increaseScoreBy(5);
    }
}
