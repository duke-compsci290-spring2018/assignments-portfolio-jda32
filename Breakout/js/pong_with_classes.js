/*
 * "Constants"
 */
// frames per second to run game
var FPS = 50;
// color for everything
var COLOR = '#0095DD';
// ball specific values
var BALL_IMAGE = 'images/ball.gif';
var BALL_SPEED = 4;
var BALL_SIZE = 15;
// paddle specific values
var PADDLE_SOUND = 'sounds/pong_beep.wav';
var PADDLE_SPEED = 5;
var PADDLE_SIZE = 10;


var reverse = 0;

var start = false;

var obsColor;

var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;

var level = 1;
var won = 0;
var lost = 0;

var bricks = [];
var lives = 3;

var count = 0;
var speed = 0;

var godmode = false;
for(c=0; c<brickColumnCount; c++) {
    bricks[c] = [];
    for(r=0; r<brickRowCount; r++) {
         bricks[c][r] = { x: 0, y: 0, status: 1, po: 0};
    }
}

function resetBricks(){
    for(c=0; c<brickColumnCount; c++) {
        bricks[c] = [];
        for(r=0; r<brickRowCount; r++) {
            var randomNumb = Math.floor(Math.random() * 20);
            bricks[c][r] = {x: 0, y: 0, status: level, po: randomNumb};
        }
    }
}


/*
 * Image and Sound manager
 */
// handle image and sounds loading, really only needed for LOTS or BIG images and sounds
class ResourceManager {
    constructor () {
        this.numImagesLeftToLoad = 0;
        this.numSoundsLeftToLoad = 0;
    }

    // these need to be called BEFORE the game starts so they are loaded and available DURING the game
    loadImage (url) {
        // create actual HTML element and note when it finishes loading
        var img = new Image();
        var self = this;
        img.onload = function () {
            self.numImagesLeftToLoad -= 1;
            console.log(url + ' loaded');
            // reset so it is only counted once (just in case)
            this.onload = null;
        }

        img.onerror = function () {
            console.log('ERROR: could not load ' + url);
        }
        img.src = url;
        this.numImagesLeftToLoad += 1;
        return img;
    }

    loadSound (url) {
        // create actual HTML element and note when it finishes loading
        var snd = new Audio();
        var self = this;
        snd.oncanplay = function () {
            self.numSoundsLeftToLoad -= 1;
            console.log(url + ' loaded');
            // reset so it is only counted once (just in case)
            this.oncanplay = null;
        }
        snd.onerror = function () {
            console.log('ERROR: could not load ' + url);
        }
        snd.src = url;
        this.numSoundsLeftToLoad += 1;
        return snd;
    }

    isLoadingComplete () {
        return this.numImagesLoaded === this.numImagesExpected &&
               this.numSoundsLoaded === this.numSoundsExpected;
    }
}


/*
 * Key and mouse input manager
 */
class InputManager {
    constructor (canvas) {
        this.canvas = canvas;
        this.leftPressed = false;
        this.rightPressed = false;
        this.mouseX = 0;
        this.mouseY = 0;
    }

    get leftPressed () {
        return this._leftPressed;
    }
    get rightPressed () {
        return this._rightPressed;
    }

    set leftPressed (pressed) {
        this._leftPressed = pressed;
    }
    set rightPressed (pressed) {
        this._rightPressed = pressed;
    }

    keyDownHandler (e) {
        if (e.keyCode === 37) {
            this.leftPressed = true;
        }
        else if (e.keyCode === 39) {
            this.rightPressed = true;
        }
        else if (e.keyCode === 32) {
            start =true;
        }
        else if (e.keyCode === 71){
            if (godmode === false){
                godmode = true;
            }
            else{
                godmode = false;
            }
        }
        else if (e.keyCode === 49){
            level = 1;
        }
        else if (e.keyCode === 50){
            level = 2;
        }
        else if (e.keyCode === 51){
            level = 3;
        }
    }

    keyUpHandler (e) {
        if (e.keyCode === 37) {
            this.leftPressed = false;
        }
        else if(e.keyCode === 39) {
            this.rightPressed = false;
        }
    }

    // get the mouse coordinates relative to the canvas rather than the page
    mouseMoveHandler (e) {
        this.mouseX = e.clientX - this.canvas.offsetLeft;
        this.mouseY = e.clientY - this.canvas.offsetTop;
    }

    mouseInBounds () {
        return this.mouseX > 0 && this.mouseX < this.canvas.width &&
               this.mouseY > 0 && this.mouseY < this.canvas.height;
    }
}


/*
 * Generic game element that can move and be drawn on the canvas.
 */
class Sprite {
    constructor (x, y, width, height, dx, dy) {
        this.startX = x;
        this.startY = y;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.dx = dx;
        this.dy = dy;
    }

    get x () {
        return this._x;
    }

    get y () {
        return this._y;
    }

    get dx () {
        return this._dx;
    }

    get dy () {
        return this._dy;
    }

    get nextX () {
        return this._x + this._dx;
    }

    get nextY () {
        return this._y + this._dy;
    }

    get width () {
        return this._width;
    }

    get height () {
        return this._height;
    }


    set x (x) {
        this._x = x;
    }

    set y (y) {
        this._y = y;
    }

    set dx (dx) {
        this._dx = dx;
    }

    set dy (dy) {
        this._dy = dy;
    }

    set width (w) {
        this._width = w;
    }

    set height (h) {
        this._height = h;
    }

    reset () {
        this.x = this.startX;
        this.y = this.startY;
    }

    move (canvas) {
    }

    draw (ctx) {
    }
}

class Ball extends Sprite {
    constructor (image, x, y, size, dx, dy) {
        super(x, y, size, size, dx, dy);
        this.image = image;
    }

    get size () {
        return this.width;
    }

    move () {
        this.x += this.dx + speed;
        this.y += this.dy + speed;
    }

    draw (ctx) {
        if (this.image != null) {
            ctx.drawImage(this.image, this.x, this.y, this.size, this.size);
        }
        else {
            // set features first, so they are active when the rect is drawn
            ctx.beginPath();
            ctx.fillStyle = COLOR;
            ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI*2);
            ctx.fill();
            ctx.closePath();
        }
    }
}



class Paddle extends Sprite {
    constructor (x, y, width, height, dx, dy) {
        super(x, y, width, height, dx, dy);
    }
    move (canvas) {
        if(reverse === 0){
            if (input.rightPressed && this.x < canvas.width - this.width) {
                this.x += this.dx;
            }
            else if (input.leftPressed && this.x > 0) {
                this.x -= this.dx;
            }
            else if (input.mouseInBounds()) {
                this.x = input.mouseX - this.width / 2;
            }
        }
        else{
            if (input.rightPressed && this.x > 0) {
                this.x -= this.dx;
            }
            else if (input.leftPressed && this.x < canvas.width - this.width) {
                this.x += this.dx;
            }
            else if (input.mouseInBounds()) {
                this.x = input.mouseY - this.width / 2;
            }
        }
    }

    draw (ctx) {
        // set features first, so they are active when the rect is drawn
        ctx.fillStyle = COLOR;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

class Score extends Sprite {
    constructor (x, y) {
        super(x, y, 0, 0, 0, 0);
        this.score = 0;
        this.hiScore = 0;
        this.lives = 3;
    }

    draw (ctx) {
        // set features first, so they are active when the text is drawn
        ctx.font = '16px Arial';
        ctx.fillStyle = COLOR;
        ctx.fillText('Score: ' + this.score, this.x, this.y);
        ctx.fillText('LastScore: ' + this.hiScore, this.x + 90, this.y);
        ctx.fillText('Lives: ' + this.lives, game.canvas.width - 50, this.y)
    }

    reset () {
        console.log("Score: " + this.score);
        console.log("Lives: " + lives);
        console.log("Start: " + start);
        if (this.score > this.hiScore && lives === 3 || lives === 0 && start === false) {
            this.hiScore = this.score;
            console.log("LastScore: " + this.hiScore);
        }
        this.score = 0;
        this.lives = 3;
        reverse = 0;
        count = 0;
        speed = 0;
    }

    increment () {
        this.score += 1;
        if (this.score > this.hiScore && lives === 3 && start === false) {
            this.hiScore = this.score;
        }
    }
    loseLife (){
        this.lives -=1;
        this.score -= 5;
    }
}

function drawBricks(ctx) {
    if(start === false && level === 1 && lives === 3){
        obsColor = '#00FF00';
    }
    if(start === false && level === 2 && lives === 3){
        obsColor = '#FFFF00';
    }
    if(start === false && level === 3 && lives === 3){
        obsColor = '#FF0000';
    }
    for(c=0; c<brickColumnCount; c++) {
        for(r=0; r<brickRowCount; r++) {
            if(bricks[c][r].status >= 1) {
                var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
                var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                if(bricks[c][r].status === 1){
                    obsColor = '#00FF00';
                }
                if(bricks[c][r].status === 2){
                    obsColor = '#FFFF00';
                }
                if(bricks[c][r].status === 3){
                    obsColor = '#FF0000';
                }
                if(bricks[c][r].po === 17){
                    obsColor = '#9400D3';
                }
                if(bricks[c][r].po === 18){
                    obsColor = '#FF00FF';
                }
                if(bricks[c][r].po === 19){
                    obsColor = '#000000';
                }
                ctx.fillStyle = obsColor;
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}



/*
 * Game class contains everything about the game and displays in a given canvas
 */
class Game {
    constructor (canvas) {
        // the area in the HTML document where the game will be played
        this.canvas = canvas;
        // the actual object that handles drawing on the canvas
        this.ctx = this.canvas.getContext('2d');
        this.paddleSound = resources.loadSound(PADDLE_SOUND);
        // elements in the game
        this.ball = new Ball(resources.loadImage(BALL_IMAGE),
                             this.canvas.width / 2, this.canvas.height / 2, BALL_SIZE,
                             BALL_SPEED, -BALL_SPEED);
        this.paddle = new Paddle((this.canvas.width)/2, (this.canvas.height - PADDLE_SIZE),
                                 PADDLE_SIZE*6, PADDLE_SIZE, PADDLE_SPEED, 0);
        this.score = new Score(35, 20);
    }

    loop () {
        if (resources.isLoadingComplete()) {
            if(start != true){
                if(lives !=3){
                    this.ctx.font = "20px Arial";
                    this.ctx.fillstyle = "green";
                    //this.ctx.fillText("Press the SPACE bar to continue:", canvas.width/2, canvas.height/2);
                    this.ctx.textAlign = "center";
                }
                else{
                    if(start === false && level === 1 && lives === 3){
                        this.titleText();
                        obsColor = '#00FF00';
                        resetBricks();
                        drawBricks(this.ctx);
                    }
                    if(start === false && level === 2 && lives === 3){
                        this.titleText();
                        obsColor = '#FFA07A';
                        resetBricks();
                        drawBricks(this.ctx);
                    }
                    if(start === false && level === 3 && lives === 3){
                        this.titleText();
                        obsColor = '#FF0000';
                        resetBricks();
                        drawBricks(this.ctx);
                    }
                }
            }
            else{
                this.update();
                this.draw();
            }
        }

    }

    update() {
        this.ball.move(this.canvas);
        this.paddle.move(this.canvas);
        this.checkCollisions(this.canvas);
        // no way to win or lose, it just plays forever!
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ball.draw(this.ctx);
        this.paddle.draw(this.ctx);
        this.score.draw(this.ctx);
        drawBricks(this.ctx);
    }
    
    titleText(){
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.font = "20px Arial";
        this.ctx.fillstyle = "green";
        if(won == 0 && lost == 0){
            this.ctx.fillText("Press the SPACE bar to begin:", canvas.width/2, canvas.height/2);
        }
        else if(won == 0 && lost == 1){
            this.ctx.fillText("LOSER: Press SPACE to try again:", canvas.width/2, canvas.height/2);
        }
        else{
            this.ctx.fillText("WINNER WINNER CHICKEN DINNER", canvas.width/2, canvas.height/2);
        }
        this.ctx.fillText("Press 1,2, or 3 for level:", canvas.width/2, (canvas.height/2) + 40);
        this.ctx.fillText("Current difficulty is: " + level, canvas.width/2, (canvas.height) - 30);
        this.ctx.textAlign = "center";
    }


    checkCollisions() {
        if (this.ball.nextX > this.canvas.width - this.ball.size || this.ball.nextX < 0) {
            this.ball.dx = -this.ball.dx;
        }
        for(c=0; c<brickColumnCount; c++) {
            for(r=0; r<brickRowCount; r++) {
                var b = bricks[c][r];
                if(b.status >= 1) {
                    if(this.ball.nextX > b.x && this.ball.nextX < b.x+brickWidth && this.ball.nextY > b.y && this.ball.nextY < b.y+brickHeight) {
                        this.ball.dy = -this.ball.dy;
                        if(b.po == 18){
                            if(speed <= 1){
                                speed++;
                            }
                            else{
                                speed = 0;
                            }
                        }
                        b.status--;
                        this.score.increment();
                        count++;
                        if(b.po == 17){
                            if (reverse === 0){
                                reverse = 1;
                            }
                            else{
                                reverse = 0;
                            }
                        }
                    }
                }
                if(count === brickColumnCount * brickRowCount * level){
                    lives = 3;
                    won = 1;
                    lost = 0;
                    this.score.reset();
                    this.ball.reset();
                    this.paddle.reset();
                    resetBricks();
                    start = false;
                }
            }
        }
        if (this.ball.nextY < 0) {
            this.ball.dy = -this.ball.dy;
        }
        else if (this.ball.nextY > this.paddle.y &&
                 this.ball.nextX > this.paddle.x && this.ball.nextX < this.paddle.x + this.paddle.width) {
            this.ball.dy = -this.ball.dy;
            this.paddleSound.play();
            this.score.increment();
        }
        
        else if (this.ball.nextY > this.canvas.height && godmode === false) {
            this.ball.reset();
            this.paddle.reset();
            this.score.loseLife();
            
            lives--;
            start = false;
            if(lives == 0){
                won = 0;
                lost = 1;
                this.score.reset();
                resetBricks();
                start = false;
                lives = 3;
            }
        }
        else if(this.ball.nextY > this.canvas.height && godmode === true){
            this.ball.dy = -this.ball.dy;
        }
    }
}


/*
 * Setup classes
 */
var canvas = document.getElementById('canvas2');
var resources = new ResourceManager();
var input = new InputManager(canvas);
var game = new Game(canvas);

/*
 * Setup input responses
 */
// respond to both keys and mouse movements
document.addEventListener('keydown', event => input.keyDownHandler(event), false);
document.addEventListener('keyup', event => input.keyUpHandler(event), false);
document.addEventListener('mousemove', event => input.mouseMoveHandler(event), false);

/*
 * Game loop
 */
// NOT IDEAL --- just starts when the everthing is done loading, not necessarily when the user is ready

setInterval(function() {
        game.loop();
}, 1000/FPS);
