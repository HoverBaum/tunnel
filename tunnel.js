/**
*	A simple tunnel game.
*	By HoverBaum
*
*/

//Intervall that will call tick.
var interval = null;

var player = null;
var playerSpeed = 7;

//Representation of the path through which the player travels.
var path = [];

//Pixel tickness, or hight of block of tunnel.
var thickness = 10;

//Starting width of the tunnel.
var baseWidth = 200;

//Which index of the path is currently at the bottom of the screen.
var index = 0;

//The canvas.
cv = null;

/**
*	Starts the game.
*	Initializes everything.
*/
function startGame() {
	window.onkeydown = keyDownHandler;
	window.onkeyup = keyUpHandler;
	generatePlayer();
	generateInitialTunnel();
	interval = setInterval(tick, 25);
	cv = document.getElementById('canvas');
	
	//Draw the first frame.
	drawFrame();
}

/**
*	Generates the player Entity and saves it as player.
*/
function generatePlayer() {
	var height = thickness * 5;
	var width = height / 3;
	var x = window.innerWidth / 2 - width / 2;
	var y = window.innerHeight - height;
	var color = 'green';
	player = new Entity(x, y, width, height, color);
	player.right = false;
	player.left = false;
}

/**
*	Generates the initial part of the tunnel which is straight.
*/
function generateInitialTunnel() {
	var center = window.innerWidth / 2;
	for(var i = 0; i < 15; i++) {
		var elm = new Entity(center - baseWidth / 2, window.innerHeight - i * thickness, baseWidth, thickness, 'black');
		path.push(elm);
	}
	for(var i = 0; i < window.innerHeight / thickness; i++) {
		discoverPath();
	}
}

/**
*	The tick of the game, called often.
*/
function tick() {
	handleMovements();
	discoverPath();
	drawFrame();
	checkCollision();
	index++;
	document.getElementById('distance').innerHTML = index;
}

/**
*	Discovers (generates) the next block of the path.
*/
function discoverPath() {
	var last = path[path.length - 1];
	var rand = Math.random();
	var x = last.x;
	if(rand < 0.5) {
		x -= thickness;
	} else {
		x += thickness;
	}
	var y = last.y - thickness;
	var color = 'black';
	var width = baseWidth - index/20;
	var height = thickness;
	var elm = new Entity(x, y, width, height, color);
	path.push(elm);
}

/**
*	Checks if the player collides with the tunnel.
*	The player can collide with the player.height/thickness next elements on the path from the current index.
*/
function checkCollision() {
	var range = Math.round(player.height / thickness) + 1;
	for(var i = index; i < index+range; i++) {
		if(path[i] === undefined) break;
		if(player.x <= path[i].x || player.x + player.width >= path[i].x + path[i].width) {
			
			//collision is happening.
			console.log("your lost");
			clearInterval(interval);
		}
	}
}

/**
*	Check if user is moving and move player accordingly.
*/
function handleMovements() {
	if(player.right) {
		player.x += playerSpeed;
		if(player.x+player.width > window.innerWidth) {
			player.x = window.innerWidth-player.width;
		}
	}
	if(player.left) {
		player.x -= playerSpeed;
		if(player.x < 0) {
			player.x = 0;
		}
	}
}

/**
*	Paints the current state unto the canvas.
*/
function drawFrame() {
	cv.width = window.innerWidth;
	cv.height = window.innerHeight;
	var ctx = cv.getContext('2d');
	
	//Draw player.
	ctx.fillStyle = player.color;
	ctx.fillRect(player.x, player.y, player.width, player.height);
	
	//Draw the path.
	var range = Math.round(window.innerHeight / thickness) + 1;
	for(var i = index; i < index+range; i++) {
		if(path[i] === undefined) break;
		var elm = path[i];
		ctx.fillStyle = elm.color;
		var y = window.innerHeight - (i-index) * thickness;		
		
		//The path saves where we shouldn't fill, so draw left and right from it.
		ctx.fillRect(0, y, elm.x, thickness);
		ctx.fillRect(elm.x+elm.width, y, window.innerWidth-elm.x-elm.width, thickness);
	}
}

/**
*	Constructor function for an entitiy.
*/
function Entity(xStart, yStart, width, height, color) {
	this.x = xStart;
	this.y = yStart;
	this.width = width;
	this.height = height;
	this.color = color;
}

function keyDownHandler(e) {
	if(e.keyCode === 65 || e.keyCode === 37) {
		player.left = true;
 	}else if(e.keyCode === 68 || e.keyCode === 39) {
		player.right = true;
	}
}
function keyUpHandler(e) {
	if(e.keyCode === 65 || e.keyCode === 37) {
		player.left = false;
 	}else if(e.keyCode === 68 || e.keyCode === 39) {
		player.right = false;
	}
}