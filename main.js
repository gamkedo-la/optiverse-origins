
var canvas;
var ctx;

// ##################################
// Global Variables
// ##################################

const LENS_COLOR = '#EAEAFB';
const MIRROR_COLOR = 'gray';
const BACKGROUND_COLOR = "#191616"
const BLOCK_COLOR = '#303030';

const DASHED_CIRCLE_ARC_NUMBER = 40;
const DASHED_CIRCLE_ARC_LENGTH = 5;

// ##################################
// ON LOAD
// ##################################

window.onload = function() {
	loadImages();

	canvas = document.getElementById('gameCanvas');
	ctx = canvas.getContext('2d');
	colorRect(0,0,canvas.width,canvas.height, BACKGROUND_COLOR);
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
// Game elements
// ##################################

var mirrors = [], blocks = [], lenses = [], cores = [], beams = [], lasers = [], 
	      points = [];


// Mirrors
var mirrorLineWidth = 6;
var mirror1 = new MirrorLine(100, 50, 700, 50, MIRROR_COLOR, mirrorLineWidth);
var mirror2 = new MirrorLine(100, 50, 0, 500, MIRROR_COLOR, mirrorLineWidth);
var mirror3 = new MirrorLine(0, 500, 700, 500, MIRROR_COLOR, mirrorLineWidth);
var mirror4 = new MirrorLine(700, 500, 700, 0, MIRROR_COLOR, mirrorLineWidth);

mirrors = [mirror1,mirror2,mirror3,mirror4];


// Blocks
var p1 = new Point(50, 450);
var p2 = new Point(100, 450);
var p3 = new Point(100, 500);
var p4 = new Point(50, 500);
points = [p1, p2, p3, p4];
var block1 = new Block(points, BLOCK_COLOR);

//Accumulate
blocks = [block1];  


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

//Accumulate
lenses = [lens1, lens2, lens3];

//Cores


var dash1 = 2;
var CR1 = new CoreRing(20, [0], 'red', 3);
var arr1 = [CR1];
var core1 = new Core(200, 400, 7, 'red', arr1);

var dash2 = 5;
var CR2 = new CoreRing(25, [90], 'green', 5);
var arr2 = [CR2];
var core2 = new Core(150, 300, 10, 'green', arr2);

var dash3 = 10;
var CR3r = new CoreRing(45, [45], 'purple', 3);
var CR3b = new CoreRing(40, [210], 'blue', 5);
var arr3 = [CR3b, CR3r];
var core3 = new Core(600, 300, 10, 'purple', arr3);

//CR1.active = true;
//CR2.active = true;
//CR3r.active = true;
//CR3b.active = true;

//Accumulate
cores = [core2, core1, core3];


var trailLength = 10;
var dashLineWidth = 2;

var beam1 = new LaserBeam(650,325, LIGHTSPEED, 180, trailLength, 'red', dashLineWidth);
var beam2 = new LaserBeam(650,375, LIGHTSPEED, 180, trailLength, 'red', dashLineWidth);
var beam3 = new LaserBeam(650,425, LIGHTSPEED, 180, trailLength, 'red', dashLineWidth);
var beam4 = new LaserBeam(650,475, LIGHTSPEED, 180, trailLength, 'red', dashLineWidth);


var beam5 = new LaserBeam(400,150, LIGHTSPEED, -15, trailLength, 'red', dashLineWidth);
var beam6 = new LaserBeam(400,150, LIGHTSPEED, -10, trailLength, 'green', dashLineWidth);
var beam7 = new LaserBeam(400,150, LIGHTSPEED, -5, trailLength, 'blue', dashLineWidth);
var beam8 = new LaserBeam(400,150, LIGHTSPEED, 0, trailLength, 'purple', dashLineWidth);


lasers = [beam1, beam2, beam3, beam4, beam5, beam6, beam7, beam8];


// ##################################
// Gameplay
// ##################################

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
	
	// Beams
	var expBeamsIndex = [];
	for (var i=0; i < beams.length; i++) {
		if(beams[i].updateBEAM()) {
			expBeamsIndex.push(i); 
		}
	}
	// Disregard all expired beams
	for (var i=expBeamsIndex.length-1; i >= 0; i--) {
		beams.splice(expBeamsIndex[i], 1);
	}
	
	// LaserBeams
	var expBeamsIndex = [];
	for (var i=0; i < lasers.length; i++) {
		if(lasers[i].updateLASER()) {
			expBeamsIndex.push(i); 
		}
	}
	// Disregard all expired beams
	for (var i=expBeamsIndex.length-1; i >= 0; i--) {
		lasers.splice(expBeamsIndex[i], 1);
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
	colorRect(0,0,canvas.width,canvas.height, BACKGROUND_COLOR);

	openingSequenceHandler();
	if( isOpeningBlockingGameplay() ) {
		return; // skip other gameplay stuff for now if doing opening
	}

	// Level pieces
	for (var i=0; i < currentLevel.pieces.length; i++) {
		currentLevel.pieces[i].draw();
	}
	
	// Blocks	
	for (var i=0; i < blocks.length; i++) {
		blocks[i].draw();
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
	
	// LaserBeams
	for (var i=0; i < lasers.length; i++) {
		lasers[i].draw();
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

function strokeCircleDashed(centerX, centerY, radius, drawColor, lineWidth) {
	ctx.strokeStyle = drawColor;
	ctx.lineWidth = lineWidth;
	
	var step = 2 * Math.PI / DASHED_CIRCLE_ARC_NUMBER
	
	for (i = 0; i < DASHED_CIRCLE_ARC_NUMBER; i++) { 
		ctx.beginPath();
		ctx.arc(centerX, centerY, radius, i*step, i*step + step/DASHED_CIRCLE_ARC_LENGTH);
		ctx.stroke();
	}
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