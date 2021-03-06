
var canvas;
var ctx;

var currentLevel = OptiLevel.init();
var level = {};
var series = {};

// ##################################
// Global Variables
// ##################################

const LENS_COLOR = '#EAEAFB';
const LENS_OUTLINE_COLOR = 'black';
const LENS_OUTLINE_COLOR_SEL = '#EAEAFB';
const LENS_OUTLINE_LINEWIDTH_SEL = 5;
const MIRROR_COLOR = 'gray';
const MIRROR_LINEWIDTH = 4;
const MIRROR_LINEWIDTH_SEL = 6;
const BACKGROUND_COLOR = "#191616"
const BLOCK_COLOR = '#040404';

const DASHED_CIRCLE_ARC_NUMBER = 40;
const DASHED_CIRCLE_ARC_LENGTH = 5;
const RING_ARROW_HEAD_LENGTH = 10;
const RING_ARROW_HEAD_WIDTH = 5;
const RING_ARROW_HEAD_LINE_WIDTH = 1;

// ##################################
// ON LOAD
// ##################################
var reflect_sound = null
window.onload = function() {
	loadImages();

	canvas = document.getElementById('gameCanvas');
	ctx = canvas.getContext('2d');

	CutSceneCanvas = document.getElementById('cutSceneCanvas');
   	Cutctx = CutSceneCanvas.getContext('2d');

	colorRect(0,0,canvas.width,canvas.height, BACKGROUND_COLOR);
	colorText("Loading images...", 15, 15, 'white');

	menu_ctrl = document.getElementById("menuCtrl");	
	
	
	reflect_sound = document.getElementById("reflect"); 
	refract_sound = document.getElementById("refract");
	lvlFinished_sound = document.getElementById("lvlFinished"); 
	lvlFailed_sound = document.getElementById("lvlFailed"); 
	
	prepSongs(); // now in jukebox.js

}

function loadingDoneSoStartGame() { // so that game and input won't start until images load
	var framesPerSecond = 30;
	
	loadGameElements();
	
	setInterval(function() {
			currentLevel.tick();
			currentLevel.draw();	
		}, 1000/framesPerSecond);

	LevelEditor.setup();

	setupOpeningAnimTick();
      
	document.addEventListener("keydown", keyPressed);
      
	canvas.addEventListener('mousedown', handleMouseClick);
	canvas.addEventListener('mouseup', handleMouseUp);
	      
	canvas.addEventListener('mousemove', updateMousePos); 
}


// ##################################
// Game elements
// ##################################



function loadGameElements() {

	// TO DO
	
}


// ##################################
// Gameplay
// ##################################

var editorLevel = OptiLevel.init([]);

// ##################################
// DRAW functions
// ##################################


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


function strokePolygon(points, drawColor, lineWidth) {
	ctx.strokeStyle = drawColor;
	ctx.lineWidth = lineWidth;
	ctx.beginPath();
	
	ctx.moveTo(points[0].x, points[0].y);
	for(var i=1; i < points.length; i++){
		ctx.lineTo(points[i].x, points[i].y);
	}
	ctx.closePath();
	ctx.stroke();
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

function colorRect(leftX, topY, width, height, drawColor, context) {
	if(!context)
		context = ctx

	context.fillStyle = drawColor;
	context.fillRect(leftX, topY, width, height);
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

function calculateArrowHead(centerX, centerY, direction) {
	var result = {leftX: null, leftY: null, 
		      rightX: null, rightY: null, 
		      forwardX: null, forwardY: null};
	var length = RING_ARROW_HEAD_LENGTH, width = RING_ARROW_HEAD_WIDTH;
	var angle = deg_to_rad(direction);
	
	result.forwardX = centerX + length * Math.cos(angle);
	result.forwardY = centerY + length * Math.sin(angle);
	result.leftX = centerX + width * Math.cos(angle - Math.PI/2);
	result.leftY = centerY + width * Math.sin(angle - Math.PI/2);
	result.rightX = centerX + width * Math.cos(angle + Math.PI/2);
	result.rightY = centerY + width * Math.sin(angle + Math.PI/2);
	
	return result;
}

function colorArrowHead(centerX, centerY, direction, fillColor) {
	// Calculate arrow dimensions
	var arrow = calculateArrowHead(centerX, centerY, direction);	
	
	// Draw arrow
	ctx.fillStyle = fillColor;
	
	ctx.beginPath();
	ctx.moveTo(arrow.leftX, arrow.leftY);
	ctx.lineTo(arrow.forwardX, arrow.forwardY);
	ctx.lineTo(arrow.rightX, arrow.rightY);
	ctx.closePath();
	
	ctx.fill();
}

function strokeArrowHead(centerX, centerY, direction, drawColor) {
	// Calculate arrow dimensions
	var arrow = calculateArrowHead(centerX, centerY, direction);
	
	// Draw arrow
	ctx.strokeStyle = drawColor;
	ctx.lineWidth = RING_ARROW_HEAD_LINE_WIDTH;
	
	ctx.beginPath();
	ctx.moveTo(arrow.leftX, arrow.leftY);
	ctx.lineTo(arrow.forwardX, arrow.forwardY);
	ctx.lineTo(arrow.rightX, arrow.rightY);
	
	ctx.stroke();
}