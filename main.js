
var canvas;
var ctx;

// ##################################
// Global Variables
// ##################################

const LENS_COLOR = 'white';
const MIRROR_COLOR = 'gray';

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

	LevelEditor.setup();

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
var mirror1 = new MirrorLine(100, 50, 700, 50, MIRROR_COLOR, mirrorLineWidth);
var mirror2 = new MirrorLine(100, 50, 0, 500, MIRROR_COLOR, mirrorLineWidth);
var mirror3 = new MirrorLine(0, 500, 700, 500, MIRROR_COLOR, mirrorLineWidth);
var mirror4 = new MirrorLine(700, 500, 700, 0, MIRROR_COLOR, mirrorLineWidth);

var mirrors = [mirror1,mirror2,mirror3,mirror4];


// Lenses

// Square
var pa1 = new Point(100, 190);
var pa2 = new Point(400, 190);
var pa3 = new Point(400, 210);
var pa4 = new Point(100, 210);
points = [pa1, pa2, pa3, pa4];
var lens1 = new Lens(points, 1.3, LENS_COLOR);

// Prism
var pb1 = new Point(400, 250);
var pb2 = new Point(500, 110);
var pb3 = new Point(600, 250);
points = [pb1, pb2, pb3];
var lens2 = new Lens(points, 1.3, LENS_COLOR);

// Lens
var pc1 = new Point(525, 300);
var pc2 = new Point(550, 300);
var pc3 = new Point(565, 350);
var pc4 = new Point(575, 400);
var pc5 = new Point(565, 450);
var pc6 = new Point(550, 500);
var pc7 = new Point(525, 500);
var pc8 = new Point(510, 450);
var pc9 = new Point(500, 400);
var pc10 = new Point(510, 350);
points = [pc1, pc2, pc3, pc4, pc5, pc6, pc7, pc8, pc9, pc10];
var lens3 = new Lens(points, 1.3, LENS_COLOR);

var lenses = [lens1, lens2, lens3];

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


var beam1 = new Beam(650,325, LIGHTSPEED, 180, trailLength, 'red', dashLineWidth);
var beam2 = new Beam(650,375, LIGHTSPEED, 180, trailLength, 'red', dashLineWidth);
var beam3 = new Beam(650,425, LIGHTSPEED, 180, trailLength, 'red', dashLineWidth);
var beam4 = new Beam(650,475, LIGHTSPEED, 180, trailLength, 'red', dashLineWidth);


var beam5 = new Beam(400,150, LIGHTSPEED, -15, trailLength, 'red', dashLineWidth);
var beam6 = new Beam(400,150, LIGHTSPEED, -10, trailLength, 'green', dashLineWidth);
var beam7 = new Beam(400,150, LIGHTSPEED, -5, trailLength, 'blue', dashLineWidth);
var beam8 = new Beam(400,150, LIGHTSPEED, 0, trailLength, 'purple', dashLineWidth);

//Accumulate

var cores = [core2, core1, core3];
var beams = [beam1, beam2, beam3, beam4, beam5, beam6, beam7, beam8];

var currentLevel = Level.init([]);


function moveEverything() {
	
	// ---------------------
	// Level parts
	// ---------------------
	for (var i=0; i < currentLevel.pieces.length; i++) {
		currentLevel.pieces[i].update();
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

	// Level pieces
	for (var i=0; i < currentLevel.pieces.length; i++) {
		currentLevel.pieces[i].draw();
	}
	
	// Lenses	
	for (var i=0; i < lenses.length; i++) {
		lenses[i].draw();
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

	if(LevelEditor.active) {
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

// Draws polygon on canvas
function colorPolygon(points, drawColor) {
	ctx.fillStyle = drawColor;
	ctx.beginPath();
	
	ctx.moveTo(points[0].x, points[0].y);
	for(var i=1; i < points.length; i++){
		ctx.lineTo(points[i].x, points[i].y);
	}
	ctx.closePath();
	ctx.fill();
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