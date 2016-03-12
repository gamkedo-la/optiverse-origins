
var canvas;
var ctx;

// ##################################
// ON LOAD
// ##################################

window.onload = function() {
	loadImages();

	canvas = document.getElementById('gameCanvas');
	ctx = canvas.getContext('2d');
	colorRect(0,0,canvas.width,canvas.height,'black');
	colorText("Loading images...", 15, 15, 'white');

}

function loadingDoneSoStartGame() { // so that game and input won't start until images load
	var framesPerSecond = 30;
	setInterval(function() {
			moveEverything();
			drawEverything();	
		}, 1000/framesPerSecond);

  setupOpeningAnimTick();

  document.addEventListener("keydown", keyPressed);

  canvas.addEventListener('mousedown', handleMouseClick);
	
  canvas.addEventListener('mousemove', updateMousePos); 
}


// ##################################
// Gameplay
// ##################################



// Mirrors
var mirrorLineWidth = 6;
var mirror1 = new MirrorLine(100, 100, 700, 100, 'gray', mirrorLineWidth);
var mirror2 = new MirrorLine(100, 100, 0, 500, 'gray', mirrorLineWidth);
var mirror3 = new MirrorLine(0, 500, 700, 500, 'gray', mirrorLineWidth);
var mirror4 = new MirrorLine(700, 500, 700, 0, 'gray', mirrorLineWidth);

var mirrors = [mirror1,mirror2,mirror3,mirror4];


//Cores

var dashLineWidth = 2;

var pos1x = 50;
var pos1y = 50;
var angle1 = 45;
var dash1 = 2;
var CR1 = new CoreRing(20, .04, 1, 'red', 3);
CR1.activate();
var arr1 = [CR1];
var core1 = new Core(pos1x, pos1y, 7, 20, 'red', arr1);


var pos2x = 200;
var pos2y = 300;
var angle2 = 0;
var dash2 = 5;
var CR2 = new CoreRing(25, .08, 1, 'green', 5);
CR2.activate();
var arr2 = [CR2];
var core2 = new Core(pos2x, pos2y, 10, 20, 'green', arr2);

var pos3x = 250;
var pos3y = 50;
var angle3 = 90;
var dash3 = 10;
var CR3r = new CoreRing(20, .04, 1, 'red', 3);
CR3r.activate();
var CR3b = new CoreRing(40, .1, 1, 'blue', 5);
CR3b.activate();
var arr3 = [CR3b, CR3r];
var core3 = new Core(pos3x, pos3y, 10, 20, 'purple', arr3);

trailLength = 10;

var beam1 = new Beam(350,300, LIGHTSPEED, 0, trailLength, 'red', dashLineWidth);
var beam2 = new Beam(150,300, LIGHTSPEED, 90, trailLength, 'green', dashLineWidth);
var beam3 = new Beam(150,300, LIGHTSPEED, 315, trailLength, 'purple', dashLineWidth);


//Accumulate

var cores = [core2, core1, core3];
var beams = [beam1, beam2, beam3];

var currentLevel = Level.init([]);


function moveEverything() {
	
	// ---------------------
	// Level parts
	// ---------------------
	for (var i=0; i < currentLevel.parts.length; i++) {
		currentLevel.parts[i].update();
	}

	// ---------------------
	// Beams
	// ---------------------
	//
	// Update all beams and check if they have expired
	var expBeamsIndex = [];
	for (var i=0; i < beams.length; i++) {
		if(beams[i].updateBEAM()) {
			expBeamsIndex.push(i); 
		}
	}
	// Disregard all expired beams
	for (var i=0; i < expBeamsIndex.length; i++) {
		beams.splice(expBeamsIndex[i], 1);
	}
	
	// ---------------------
	// Mouse tractor beam 
	// ---------------------
	
	
	// ---------------------
	// CORES
	// ---------------------
	// update core rings
	for (var i=0; i < cores.length; i++) {
		cores[i].updateCORE();
	}
}

function zoomInOnShip(lerpVal) {
	var shipStartW = imgShipAnimSmall.height; // using height since square anims strip
	var shipEndW = imgShipLarge.width;
	var shipStartX = canvas.width/2;

	var shipStartH = imgShipAnimSmall.height;
	var shipEndH = imgShipLarge.height;
	var shipEndX = canvas.width;

	var shipDrawW = (1.0-lerpVal) * shipStartW + lerpVal * shipEndW;
	var shipDrawH = (1.0-lerpVal) * shipStartH + lerpVal * shipEndH;
	var shipDrawX = (1.0-lerpVal) * shipStartX + lerpVal * shipEndX;

	drawBitmapFitIntoLocation(imgShipLarge, shipDrawX-shipDrawW/2, canvas.height/2-shipDrawH/2,
		shipDrawW,shipDrawH);
}

// ##################################
// DRAW
// ##################################

function drawEverything() {
	// next line blanks out the screen with black
	colorRect(0,0,canvas.width,canvas.height,'black');

	openingSequenceHandler();
	if( isOpeningBlockingGameplay() ) {
		return; // skip other gameplay stuff for now if doing opening
	}

	// Level parts
	for (var i=0; i < currentLevel.parts.length; i++) {
		currentLevel.parts[i].draw();
	}

	// Cores
	for (var i=0; i < cores.length; i++) {
		cores[i].draw();
	}
	
	
	// Beams
	for (var i=0; i < beams.length; i++) {
		beams[i].draw();
	}
	
	// Mirrors

	for (var i=0; i < mirrors.length; i++) {
		mirrors[i].draw();
	}

	if(isInEditor) {
		editorUpdate();
	} else {
		colorText("Press E to toggle editor (can't save or play yet)", 15, 15, 'white');
	}
}

// Draws line on canvas from (x0, y0) to (x1, y1)
function colorLine(x0, y0, x1, y1, drawColor, lineWidth) {
	ctx.strokeStyle = drawColor;
	ctx.lineWidth = lineWidth;
	
	ctx.beginPath();
	ctx.moveTo(x0, y0);
	ctx.lineTo(x1, y1);
	ctx.stroke();
	ctx.lineCap="round";
}


function colorCircle(centerX, centerY, radius, drawColor) {
	ctx.fillStyle = drawColor;
	ctx.beginPath();
	ctx.arc(centerX, centerY, radius, 0, Math.PI*2,true);
	ctx.fill();
}

function strokeCircle(centerX, centerY, radius, drawColor, lineWidth) {
	ctx.strokeStyle = drawColor;
	ctx.lineWidth = lineWidth;
	
	ctx.beginPath();
	ctx.arc(centerX, centerY, radius, 0, Math.PI*2,true);
	ctx.stroke();
}

function colorRect(leftX, topY, width, height, drawColor) {
	ctx.fillStyle = drawColor;
	ctx.fillRect(leftX, topY, width, height);
}

function strokeRect(leftX, topY, width, height, drawColor, lineWidth) {
	ctx.strokeStyle = drawColor;
	ctx.lineWidth = lineWidth;
	ctx.beginPath();
	ctx.rect(leftX, topY, width, height);
	ctx.stroke();
}

function colorText(showWords, textX, textY, fillColor) {
  ctx.fillStyle = fillColor;
  ctx.fillText(showWords, textX, textY);
}