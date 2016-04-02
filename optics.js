
// ##################################
// Global Variables
// ##################################

const LIGHTSPEED = 5;
const LIGHTSPEED_DASHED = 4;
const DASHED_LINE_LENGTH = 5; // must be >1, not sure if decimals do anything
const DASHED_LINE_WIDTH = 1; 
const LASER_TRAIL_LENGTH = 10; 
const LASER_LINE_WIDTH = 3; 
const MIRROR_LINE_BOX_WIDTH = 20; 

const LENS_INDEX_REF = 1.3

// ##################################
// Classes (Prototype Constructors)
// ##################################

//-----------------------------------------------------------------------------//
/*
 *	Name: 		OpticsPiece
 * 	Abstract: 	YES
 * 	Superclass: Graphic
 * 	Subclasses:	Line, Beam, LaserBeam, etc.
 * 	
 * 	Description:	Describes a level object
 * 
//-----------------------------------------------------------------------------*/	

OpticsPiece.prototype = Object.create( Graphic.prototype );		
OpticsPiece.prototype.constructor = OpticsPiece;	

function OpticsPiece(kind) {
	Graphic.call(this);
	this.kind = kind;
	this.selected = false;
}
OpticsPiece.prototype.updatePiece = function () {
}


//-----------------------------------------------------------------------------//
/*
 *	Name: 		MoveablePiece
 * 	Abstract: 	YES
 * 	Superclass:     OpticsPiece
 * 	Subclasses:	MirrorLine, Lens, etc.
 * 	
 * 	Description:	Describes a level object
 * 
//-----------------------------------------------------------------------------*/	

MoveablePiece.prototype = Object.create( OpticsPiece.prototype );		
MoveablePiece.prototype.constructor = MoveablePiece;	

function MoveablePiece(kind, outlinePoints, centerX, centerY) {
	OpticsPiece.call(this, kind);
	this.outlinePoints = outlinePoints;
	this.centerX = centerX;
	this.centerY = centerY;
}
MoveablePiece.prototype.encloses = function (x, y) {
	var point = new Point(x, y);
	return encloses(this.outlinePoints, point);
}
MoveablePiece.prototype.moveTo = function (newCenterX, newCenterY) {
	// default
	this.centerX = newCenterX;
	this.centerY = newCenterY;
}



// ----------------------------------
// Points
// ----------------------------------

function Point(x, y) {
	this.x = x;
	this.y = y;
}


// ----------------------------------
// Lines
// ----------------------------------

// === Line =========================
function Line(startX, startY, endX, endY, color, lineWidth) {
	this.color = color;
	this.lineWidth = lineWidth;
	this.startX = startX;
	this.startY = startY;
	this.endX = endX;
	this.endY = endY;
}
// draw()
Line.prototype.draw = function () {
	colorLine(this.startX, this.startY, 
		 this.endX, this.endY, 
		 this.color, this.lineWidth);
}


// ----------------------------------
// Mirrors
// ----------------------------------

// === MirrorLine =========================
MirrorLine.prototype = Object.create( MoveablePiece.prototype );		
MirrorLine.prototype.constructor = MirrorLine;
// constructor
function MirrorLine(startX, startY, endX, endY, color, lineWidth) {
	this.color = color;
	this.lineWidth = lineWidth;
	this.startX = startX;
	this.startY = startY;
	this.endX = endX;
	this.endY = endY;
	
	// Create border for movement
	var centerX, centerY;
	centerX = (startX + endX) / 2;
	centerY = (startY + endY) / 2;
	// Temporary patch
	var points = create_outline_box(startX, startY, endX, endY);
	MoveablePiece.call(this, "mirror", points, centerX, centerY);
} 
// moveTo()
MirrorLine.prototype.moveTo = function (newCenterX, newCenterY) {
	var deltaX = newCenterX - this.centerX;
	var deltaY = newCenterY - this.centerY;
	
	// Move all points by delta
	this.centerX = newCenterX;
	this.centerY = newCenterY;
	this.startX += deltaX;
	this.startY += deltaY;
	this.endX += deltaX;
	this.endY += deltaY;
	for (var i = 0; i < this.outlinePoints.length; i++) {
		var point = this.outlinePoints[i];
		point.x += deltaX;
		point.y += deltaY;
	}
	
}
// reflect()
MirrorLine.prototype.reflect = function (line_step) {
	
	var result = reflect_mirror(line_step, this)
	return result;
}
// draw()
MirrorLine.prototype.draw = function () {
	colorLine(this.startX, this.startY, 
		 this.endX, this.endY, 
		 this.color, this.lineWidth);
}



/* TO DO
// === MirrorLineGroup =========================
function MirrorLineGroup(centerX, centerY, color, lineWidth) {
	this.color = color;
	this.lineWidth = lineWidth;
	this.mirrorLines = [];
	this.centerX = centerX;
	this.centerY = centerY;
}
// setLines()
MirrorLineGroup.prototype.setLines = function (points) {
	// Receives a set of x,y coordinates for a series of lines
	// relative to centerX and centerY
	if (points.length%2 != 0 || points.length < 4) {
		//console.log("Error: 'points' has odd number of elements");
	}
	var startX = points[0];
	var startY = points[1];
	var endX;
	var endY;
	var mirror;
	
	for(i=1; i < points.length/2; i++){
		endX = points[2*i];
		endY = points[2*i + 1];
		mirror = new MirrorLine(startX, startY, endX, endY, 
				    this.color, this.lineWidth);
		startX = endX;
		startY = endY;
		
		this.mirrorLines.push(mirror);	
	}
}
// draw()
MirrorLineGroup.prototype.draw = function () {
	for(var i=0; i < this.mirrorLines.length; i++){
		this.mirrorLines[i].draw();
	}
}
*/



// ----------------------------------
// Lenses
// ----------------------------------

// === LensLine =========================
function LensLine(startX, startY, endX, endY, refractiveIndex) {
	// Lens lines go clockwise around lens, lens is on the right of vector.
	this.startX = startX;
	this.startY = startY;
	this.endX = endX;
	this.endY = endY;
	this.refractiveIndex = refractiveIndex;
}
// refract()
LensLine.prototype.refract = function (line_step) {
	// Note: lens is on the right of LensLine vector.
	var result = refract_through_line(line_step, this, this.refractiveIndex);
	return result;
}	


// === Lens =========================
Lens.prototype = Object.create( MoveablePiece.prototype );		
Lens.prototype.constructor = Lens;
// constructor
function Lens(points, refractiveIndex, color) {
	// points: array of ordered points that make up the lens
	// refractiveIndex: index of refraction
	
	this.outlinePoints = points;
	this.refractiveIndex = refractiveIndex;	
	this.color = color;
	
	this.poinstToLensLines(this.outlinePoints);
	
	// Find center point
	var maxX = points[0].x, minX = points[0].x;
	var maxY = points[0].y, minY = points[0].y;
	for (var i = 1; i < points.length; i++) {
		maxX = Math.max(maxX, points[i].x);
		minX = Math.min(minX, points[i].x);
		maxY = Math.max(maxY, points[i].y);
		minY = Math.min(minY, points[i].y);
	}
	
	var centerX = (maxX + minX) / 2;
	var centerY = (maxY + minY) / 2;
	
	MoveablePiece.call(this, "lens", points, centerX, centerY);
	
} 
// poinstToLensLines()
Lens.prototype.poinstToLensLines = function (points) {
	// Convert ponts to LensLines
	this.lensLines = [];
	for (var i=0; i < points.length; i++) {	
		var startX = points[i].x;
		var startY = points[i].y;
		var endX = points[(i+1) % points.length].x;
		var endY = points[(i+1) % points.length].y;
		
		var lensLine = new LensLine(startX, startY, endX, endY, this.refractiveIndex);
		this.lensLines.push(lensLine);
	}
}
// moveTo()
Lens.prototype.moveTo = function (newCenterX, newCenterY) {
	var deltaX = newCenterX - this.centerX;
	var deltaY = newCenterY - this.centerY;
	
	// Move all points by delta
	this.centerX = newCenterX;
	this.centerY = newCenterY;
	this.startX += deltaX;
	this.startY += deltaY;
	this.endX += deltaX;
	this.endY += deltaY;
	for (var i = 0; i < this.outlinePoints.length; i++) {
		var point = this.outlinePoints[i];
		point.x += deltaX;
		point.y += deltaY;
	}
	this.poinstToLensLines(this.outlinePoints);
	//
	Graphic.prototype.updatePos.call(this, this.centerX, this.centerY);
}
// draw()
Lens.prototype.draw = function () {
	var points = [];
	for(var i=0; i < this.lensLines.length; i++){
		var point = new Point(this.lensLines[i].startX, this.lensLines[i].startY);
		points.push(point);
	}
	colorPolygon(points, this.color);
}


// ----------------------------------
// Blocks (Asteroids, walls, etc.)
// ----------------------------------

// === Block =========================
Block.prototype = Object.create( OpticsPiece.prototype );		
Block.prototype.constructor = Block;
// constructor
function Block(points, color) {
	// points: array of ordered points that make up the lens
	// refractiveIndex: index of refraction

	this.points = points;
	this.color = color;
	
	OpticsPiece.call(this, "block");
	
} 
// draw()
Block.prototype.draw = function () {
	colorPolygon(this.points, this.color);
}



// ----------------------------------
// Cores
// ----------------------------------

// === Core =========================
Core.prototype = Object.create( OpticsPiece.prototype );		
Core.prototype.constructor = Core;
// constructor
function Core(centerX, centerY, radius, color, coreRings) {
	// Args: coreRings = []
	this.centerX = centerX;
	this.centerY = centerY;
	this.radius = radius;
	this.color = color;
	this.coreRings = coreRings; // an array of CoreRing objects
	
	OpticsPiece.call(this, "core");
}
// updatePiece() *override*
Core.prototype.updatePiece = function () {
	this.updateCORE();
}
// updateCORE()
Core.prototype.updateCORE = function () {
	// update each ring
	for (var i=0; i < this.coreRings.length; i++) {	
		this.coreRings[i].updateRING(this.centerX, this.centerY);	 
	}	
}
// isFull()
Core.prototype.isFull = function () {
	for (var i=0; i < this.coreRings.length; i++) {
		if (!(this.coreRings[i].isActive())) {
			return false;
		}
	}
	return true;
}
// emitLasers()
Core.prototype.emitLasers = function () {
	for (var i=0; i < this.coreRings.length; i++) {
		var ring = this.coreRings[i];
		if (ring.active ) {
			ring.emitLasers(this.centerX, this.centerY);
		}
	}
}
// encloses()
Core.prototype.encloses = function (x, y) {
	var dist = distance_between_two_points(this.centerX, this.centerY, 
						x, y);
	for (var i=0; i < this.coreRings.length; i++) {
		var ring = this.coreRings[i];
		if(dist <= ring.radius){
			return true;
		}
	}
	return false;
}
// draw()
Core.prototype.draw = function () {
	
	// Core circle
	colorCircle(this.centerX, this.centerY, this.radius, this.color);
	
	// Core levels
	for(var i=0; i < this.coreRings.length; i++){
		this.coreRings[i].draw(this.centerX, this.centerY, this.kind);
	}
}

// === CoreSink =========================
CoreSink.prototype = Object.create( Core.prototype );		
CoreSink.prototype.constructor = CoreSink;
// constructor
function CoreSink(centerX, centerY, radius, color, coreRings) {
	Core.call(this, centerX, centerY, radius, color, coreRings);
	OpticsPiece.call(this, "sink");
}


// ----------------------------------
// Core Rings
// ----------------------------------

// === CoreRing =========================
function CoreRing(radius, angles, active, color, lineWidth) {
	this.radius = radius;
	
	// Keep track of filled/empty beams in Core Ring
	this.active = active;
	this.beamSlots = [];
	for (var i=0; i < angles.length; i++) {
		var slot = {direction: deg_to_dir(angles[i]),
			    filled: active}
		this.beamSlots.push(slot);
	}
	
	this.dashedLineInterval = DASHED_LINE_LENGTH * 2;
	this.countdown = this.dashedLineInterval;
	
	this.color = color;
	this.lineWidth = lineWidth;	
}
// Clone type constructor
CoreRing.init = function(_org) 
{
	var instance = new CoreRing(_org.radius, [], _org.active, _org.color, _org.lineWidth);
	instance.beamSlots = _org.beamSlots;
	//
	return instance;
}
// updateRING()
CoreRing.prototype.updateRING = function (centerX, centerY) {
	
	if (this.active == false) {
		return;
	}
	
	this.countdown--;
	if (this.countdown <= 0) {
		// emit dashed line
		for (var i=0; i < this.beamSlots.length; i++) {
			var slot = this.beamSlots[i];
			var distance = this.radius + RING_ARROW_HEAD_LENGTH;
			var spawnX = centerX + distance * Math.cos(deg_to_rad(slot.direction));
			var spawnY = centerY + distance * Math.sin(deg_to_rad(slot.direction));
			var dash = new Beam(spawnX, spawnY, LIGHTSPEED_DASHED, slot.direction, 
						DASHED_LINE_LENGTH, this.color, DASHED_LINE_WIDTH)
			
			currentLevel.addOpticsPiece(dash); // Emit laserbeam
		}
		// reset countdown
		this.countdown = this.dashedLineInterval;
	}
	
}
CoreRing.prototype.emitLasers = function (centerX, centerY) {
	this.active = false;
	for (var i=0; i < this.beamSlots.length; i++) {
		// fire laser beam
		var slot = this.beamSlots[i];
		var distance = this.radius + RING_ARROW_HEAD_LENGTH;
		var spawnX = centerX + distance * Math.cos(deg_to_rad(slot.direction));
		var spawnY = centerY + distance * Math.sin(deg_to_rad(slot.direction));
		var laser = new LaserBeam(spawnX, spawnY, LIGHTSPEED, slot.direction, 
					LASER_TRAIL_LENGTH, this.color, LASER_LINE_WIDTH)
		
		currentLevel.addOpticsPiece(laser); // Emit laserbeam
		slot.filled = false;
	}
}
// draw()
CoreRing.prototype.draw = function (centerX, centerY, kind) {
	
	// Draw Ring
	if (this.active) {
		strokeCircle(centerX, centerY, this.radius, this.color, this.lineWidth);
	} else {
		strokeCircleDashed(centerX, centerY, this.radius, this.color, 1);
	}
	
	if (kind == "sink") {
		return // core sinks don't have arrows
	}
	
	// Draw arrows
	for (var i=0; i < this.beamSlots.length; i++) {
		var slot = this.beamSlots[i];
		
		var arrowX = centerX + this.radius * Math.cos(deg_to_rad(slot.direction));
		var arrowY = centerY + this.radius * Math.sin(deg_to_rad(slot.direction));
		
		if (slot.filled) { // beam slot is filled
			// Draw filled arrow in that direction
			colorArrowHead(arrowX, arrowY, slot.direction, this.color)
		} else {
			// Draw empty arrow in that direction
			strokeArrowHead(arrowX, arrowY, slot.direction, this.color)
		}
	}
}




// ----------------------------------
// Beams
// ----------------------------------

// === Beam =========================
Beam.prototype = Object.create( OpticsPiece.prototype );		
Beam.prototype.constructor = Beam;
// constructor
function Beam(posX, posY, speed, angle, trailLength, color, lineWidth) {

	this.posX = posX;
	this.posY = posY;
	this.speed = speed;
	this.direction = deg_to_dir(angle);
	this.active = true; // boolean	
	
	this.color = color;
	this.trail = new Trail(trailLength, color, lineWidth);
	
	// Previous state
	this.prevX = posX;
	this.prevY = posY;
	this.prevDirection = this.direction;
	
	OpticsPiece.call(this, "beam");
}
// updatePiece() *override*
Beam.prototype.updatePiece = function () {
	this.updateBEAM();
}
// updateBEAM()
Beam.prototype.updateBEAM = function () {
	if (!this.active){
		this.trail.removeLine();
		return;
	}
	
	// Update previous info
	this.prevX = this.posX;
	this.prevY = this.posY;
	this.prevDirection = this.direction;
	
	// Calculate new position
	this.posX += this.getSpeedX();
	this.posY += this.getSpeedY();
	
	// create line of most recent step
	var line_step = {startX: this.prevX, 
		      startY: this.prevY,
		      endX: this.posX, 
		      endY: this.posY, 
		      direction: this.direction};
		      
	// create point of most recent step
	var point_step = new Point(this.posX, this.posY);
	
	// mirror collisions 
	for (var i=0; i < currentLevel.mirrors.length; i++) {
	
		if(lines_intersect(currentLevel.mirrors[i], line_step)){
			
			// Reflect off of mirror
			reflection = currentLevel.mirrors[i].reflect(line_step);
			
			// Add line to intersection point
			this.trail.addLine(this.prevX, this.prevY, 
				reflection.intersectX, reflection.intersectY);
			
			// Add line from intersection to new position			
			this.trail.addLine(reflection.intersectX, 
					   reflection.intersectY,
					   reflection.newX,
					   reflection.newY);
				
			// Save values
			this.posX = reflection.newX;
			this.posY = reflection.newY;
			this.direction = deg_to_dir(reflection.newDirection);		
			
			return; // Only one collision event
		}
	}
	
	
	// lens collisions
	for (var i=0; i < currentLevel.lenses.length; i++) {
		var lensLines = currentLevel.lenses[i].lensLines;
		for (var j=0; j < lensLines.length; j++)  {
			if(lines_intersect(lensLines[j], line_step)){
				// Refract off of lens
				refraction = lensLines[j].refract(line_step);
				
				// Add line to intersection point
				this.trail.addLine(this.prevX, this.prevY, 
					refraction.intersectX, refraction.intersectY);
				
				// Add line from intersection to new position			
				this.trail.addLine(refraction.intersectX, 
						   refraction.intersectY,
						   refraction.newX,
						   refraction.newY);
					
				// Save values
				this.posX = refraction.newX;
				this.posY = refraction.newY;
				this.direction = deg_to_dir(refraction.newDirection);		
				
				return; // Only one collision event
				
			}
		}
	}
	
	
	
	// block collisions
	for (var i=0; i < currentLevel.blocks.length; i++) {
		if (encloses(currentLevel.blocks[i].points, point_step)) {
			this.trail.addLine(this.prevX, this.prevY, this.posX, this.posY);
			this.active = false;
			return;
		}
	}
	
	// no collisions:
	this.trail.addLine(this.prevX, this.prevY, this.posX, this.posY);
	return;
	
}
// expired()
Beam.prototype.expired = function () {
	// Does beam have a trail?
	if (this.trail.lines.length <= 0) {
		return true; // No trail, beam is expired
	}
	// Is beam trail on the screen?
	for( var i = 0; i < this.trail.lines.length; i++) {
		line = this.trail.lines[i];	
		
		// Is start point on screen?
		if((line.startX > 0.0 && line.startX < canvas.width) &&
		   (line.startY > 0.0 && line.startY < canvas.height)) {	
			return false; // part of trail is on screen, beam is active
		}
		// Is end point on screen?
		if((line.endX > 0.0 && line.endX < canvas.width) &&
		   (line.endY > 0.0 && line.endY < canvas.height)) {	
			return false; // part of trail is on screen, beam is active
		}
	}
	// If no part of trail is on screen, beam is expired
	return true;
}
// getSpeedX()
Beam.prototype.getSpeedX = function () {
	var speedX = this.speed * Math.cos(this.direction * Math.PI/180);
	return speedX;
}
// getSpeedY()
Beam.prototype.getSpeedY = function () {
	var speedY = this.speed * Math.sin(this.direction * Math.PI/180);
	return speedY;
}
Beam.prototype.draw = function () {
	this.trail.draw();
}


// === LaserBeam =========================
LaserBeam.prototype = Object.create(Beam.prototype); 
LaserBeam.prototype.constructor = LaserBeam; 
function LaserBeam(posX, posY, speed, angle, trailLength, color, lineWidth) {
	// Call parent constructor	
	Beam.call(this, posX, posY, speed, angle, trailLength, color, lineWidth);
	OpticsPiece.call(this, "laser"); // Overrides Beam call to superclass
} 
// updatePiece() *override*
LaserBeam.prototype.updatePiece = function () {
	this.updateLASER();
}
// updateLASER()
LaserBeam.prototype.updateLASER = function () {
	// Call superclass update
	var bool = this.updateBEAM();
	
	if (!this.active){
		return;
	}
	
	// core collisions
	for (var i=0; i < currentLevel.cores.length; i++) {
		for (var j=0; j < currentLevel.cores[i].coreRings.length; j++)  {
			
			var ring = currentLevel.cores[i].coreRings[j];
			var dist = distance_between_two_points(this.posX, this.posY, 
						currentLevel.cores[i].centerX, currentLevel.cores[i].centerY);
			if(dist > ring.radius || this.color != ring.color){
				continue;
			}
			
			// Loop through ring's beam slots
			for (var k=0; k < ring.beamSlots.length; k++) { 
				var slot = ring.beamSlots[k];
				if (!slot.filled) {
					// Beam is absorbed
					slot.filled = true; // fill beam slot
					ring.active = true; // activate ring
					this.active = false; // deactivate laser
					
					return;
				}
			}
		}
	}
	
	// coreSink collisions
	for (var i=0; i < currentLevel.coresinks.length; i++) {
		for (var j=0; j < currentLevel.coresinks[i].coreRings.length; j++)  {
			
			var ring = currentLevel.coresinks[i].coreRings[j];
			var dist = distance_between_two_points(this.posX, this.posY, 
						currentLevel.coresinks[i].centerX, currentLevel.coresinks[i].centerY);
			if(dist > ring.radius || this.color != ring.color){
				continue;
			}
			
			// Loop through ring's beam slots
			for (var k=0; k < ring.beamSlots.length; k++) { 
				var slot = ring.beamSlots[k];
				if (!slot.filled) {
					// Beam is absorbed
					slot.filled = true; // fill beam slot
					ring.active = true; // activate ring
					this.active = false; // deactivate laser
					
					return;
				}
			}
		}
	}
}

// ----------------------------------
// Trails
// ----------------------------------

// === Trail =========================
function Trail(trailLength, color, lineWidth) {
	this.trailLength = trailLength;
	this.color = color;
	this.lineWidth = lineWidth;

	this.lines = [];
}
// addLine()
Trail.prototype.addLine = function (startX, startY, endX, endY) {
	var line = new Line(startX, startY, endX, endY, this.color, this.lineWidth);
	this.lines.push(line);
	while (this.lines.length > this.trailLength){
		this.removeLine();
	}
}
// removeLine()
Trail.prototype.removeLine = function () {
	if (this.lines.length > 0) {
		var temp = this.lines.shift() //Get rid of oldest line
		// temp is throwaway, not used
	}
}
// draw()
Trail.prototype.draw = function () {
	for(var i=0; i < this.trailLength; i++){
		if (i < this.lines.length) {
			this.lines[i].draw();
		}
	}
}






// ##################################
// Functions for making pieces
// ##################################

// ----------------------------------
// Make Lenses
// ----------------------------------

// biconvex
function make_points_lens_1(centerX, centerY, angle) {	
	var positions = [
		[ -4.90 , 75 ], 
		[ -7.66 , 70 ], 
		[ -10.19 , 65 ], 
		[ -12.48 , 60 ], 
		[ -14.55 , 55 ], 
		[ -16.42 , 50 ], 
		[ -18.09 , 45 ], 
		[ -19.57 , 40 ], 
		[ -20.86 , 35 ], 
		[ -21.97 , 30 ], 
		[ -22.90 , 25 ], 
		[ -23.66 , 20 ], 
		[ -24.25 , 15 ], 
		[ -24.67 , 10 ], 
		[ -24.92 , 5 ], 
		[ -25.00 , 0 ], 
		[ -24.92 , -5 ], 
		[ -24.67 , -10 ], 
		[ -24.25 , -15 ], 
		[ -23.66 , -20 ], 
		[ -22.90 , -25 ], 
		[ -21.97 , -30 ], 
		[ -20.86 , -35 ], 
		[ -19.57 , -40 ], 
		[ -18.09 , -45 ], 
		[ -16.42 , -50 ], 
		[ -14.55 , -55 ], 
		[ -12.48 , -60 ], 
		[ -10.19 , -65 ], 
		[ -7.66 , -70 ], 
		[ -4.90 , -75 ], 
		[ 4.90 , -75 ], 
		[ 7.66 , -70 ], 
		[ 10.19 , -65 ], 
		[ 12.48 , -60 ], 
		[ 14.55 , -55 ], 
		[ 16.42 , -50 ], 
		[ 18.09 , -45 ], 
		[ 19.57 , -40 ], 
		[ 20.86 , -35 ], 
		[ 21.97 , -30 ], 
		[ 22.90 , -25 ], 
		[ 23.66 , -20 ], 
		[ 24.25 , -15 ], 
		[ 24.67 , -10 ], 
		[ 24.92 , -5 ], 
		[ 25.00 , 0 ], 
		[ 24.92 , 5 ], 
		[ 24.67 , 10 ], 
		[ 24.25 , 15 ], 
		[ 23.66 , 20 ], 
		[ 22.90 , 25 ], 
		[ 21.97 , 30 ], 
		[ 20.86 , 35 ], 
		[ 19.57 , 40 ], 
		[ 18.09 , 45 ], 
		[ 16.42 , 50 ], 
		[ 14.55 , 55 ], 
		[ 12.48 , 60 ], 
		[ 10.19	, 65 ],	
		[ 7.66 , 70 ], 
		[ 4.90 , 75 ]
				]; 
	
	// make points
	var points = positions_to_points(positions);
	// rotate points
	points = rotate_around_origin(points, angle);
	// translate points
	points = translate_points(points, centerX, centerY);
	
	return points;
}


// planoconvex
function make_points_lens_2(centerX, centerY, angle) {
	var positions = [
		[ -4.90 , 75 ], 
		[ -4.90 , -75 ], 
		[ 4.90 , -75 ], 
		[ 7.66 , -70 ], 
		[ 10.19 , -65 ], 
		[ 12.48 , -60 ], 
		[ 14.55 , -55 ], 
		[ 16.42 , -50 ], 
		[ 18.09 , -45 ], 
		[ 19.57 , -40 ], 
		[ 20.86 , -35 ], 
		[ 21.97 , -30 ], 
		[ 22.90 , -25 ], 
		[ 23.66 , -20 ], 
		[ 24.25 , -15 ], 
		[ 24.67 , -10 ], 
		[ 24.92 , -5 ], 
		[ 25.00 , 0 ], 
		[ 24.92 , 5 ], 
		[ 24.67 , 10 ], 
		[ 24.25 , 15 ], 
		[ 23.66 , 20 ], 
		[ 22.90 , 25 ], 
		[ 21.97 , 30 ], 
		[ 20.86 , 35 ], 
		[ 19.57 , 40 ], 
		[ 18.09 , 45 ], 
		[ 16.42 , 50 ], 
		[ 14.55 , 55 ], 
		[ 12.48 , 60 ], 
		[ 10.19	, 65 ],	
		[ 7.66 , 70 ], 
		[ 4.90 , 75 ]
				]; 
	
	// make points
	var points = positions_to_points(positions);
	// rotate points
	points = rotate_around_origin(points, angle);
	// translate points
	points = translate_points(points, centerX, centerY);
	
	return points;
}

// biconcave
function make_points_lens_3(centerX, centerY, angle) {
	var positions = [
		[ -25.10 , 75 ], 
		[ -22.34 , 70 ], 
		[ -19.81 , 65 ], 
		[ -17.52 , 60 ], 
		[ -15.45 , 55 ], 
		[ -13.58 , 50 ], 
		[ -11.91 , 45 ], 
		[ -10.43 , 40 ], 
		[ -9.14 , 35 ], 
		[ -8.03 , 30 ], 
		[ -7.10 , 25 ], 
		[ -6.34 , 20 ], 
		[ -5.75 , 15 ], 
		[ -5.33 , 10 ], 
		[ -5.08 , 5 ], 
		[ -5.00 , 0 ], 
		[ -5.08 , -5 ], 
		[ -5.33 , -10 ], 
		[ -5.75 , -15 ], 
		[ -6.34 , -20 ], 
		[ -7.10 , -25 ], 
		[ -8.03 , -30 ], 
		[ -9.14 , -35 ], 
		[ -10.43 , -40 ], 
		[ -11.91 , -45 ], 
		[ -13.58 , -50 ], 
		[ -15.45 , -55 ], 
		[ -17.52 , -60 ], 
		[ -19.81 , -65 ], 
		[ -22.34 , -70 ], 
		[ -25.10 , -75 ], 
		[ 25.10 , -75 ], 
		[ 22.34 , -70 ], 
		[ 19.81 , -65 ], 
		[ 17.52 , -60 ], 
		[ 15.45 , -55 ], 
		[ 13.58 , -50 ], 
		[ 11.91 , -45 ], 
		[ 10.43 , -40 ], 
		[ 9.14 , -35 ], 
		[ 8.03 , -30 ], 
		[ 7.10 , -25 ], 
		[ 6.34 , -20 ], 
		[ 5.75 , -15 ], 
		[ 5.33 , -10 ], 
		[ 5.08 , -5 ], 
		[ 5.00 , 0 ], 
		[ 5.08 , 5 ], 
		[ 5.33 , 10 ], 
		[ 5.75 , 15 ], 
		[ 6.34 , 20 ], 
		[ 7.10 , 25 ], 
		[ 8.03 , 30 ], 
		[ 9.14 , 35 ], 
		[ 10.43 , 40 ], 
		[ 11.91 , 45 ], 
		[ 13.58 , 50 ], 
		[ 15.45 , 55 ], 
		[ 17.52 , 60 ], 
		[ 19.81 , 65 ], 
		[ 22.34 , 70 ], 
		[ 25.10 , 75 ]
				];
	
	// make points
	var points = positions_to_points(positions);
	// rotate points
	points = rotate_around_origin(points, angle);
	// translate points
	points = translate_points(points, centerX, centerY);
	
	return points;
}

// planoconcave
function make_points_lens_4(centerX, centerY, angle) {
	var positions = [
		[ -5 , 75 ], 
		[ -5 , -75 ], 
		[ 25.10 , -75 ], 
		[ 22.34 , -70 ], 
		[ 19.81 , -65 ], 
		[ 17.52 , -60 ], 
		[ 15.45 , -55 ], 
		[ 13.58 , -50 ], 
		[ 11.91 , -45 ], 
		[ 10.43 , -40 ], 
		[ 9.14 , -35 ], 
		[ 8.03 , -30 ], 
		[ 7.10 , -25 ], 
		[ 6.34 , -20 ], 
		[ 5.75 , -15 ], 
		[ 5.33 , -10 ], 
		[ 5.08 , -5 ], 
		[ 5.00 , 0 ], 
		[ 5.08 , 5 ], 
		[ 5.33 , 10 ], 
		[ 5.75 , 15 ], 
		[ 6.34 , 20 ], 
		[ 7.10 , 25 ], 
		[ 8.03 , 30 ], 
		[ 9.14 , 35 ], 
		[ 10.43 , 40 ], 
		[ 11.91 , 45 ], 
		[ 13.58 , 50 ], 
		[ 15.45 , 55 ], 
		[ 17.52 , 60 ], 
		[ 19.81 , 65 ], 
		[ 22.34 , 70 ], 
		[ 25.10 , 75 ]
				];
	
	// make points
	var points = positions_to_points(positions);
	// rotate points
	points = rotate_around_origin(points, angle);
	// translate points
	points = translate_points(points, centerX, centerY);
	
	return points;
}

// meniscus
function make_points_lens_5(centerX, centerY, angle) {
	var positions = [[-5,  80],
			 [ 5,  80],
			 [ 5, -80],
			 [-5, -80],
			 [-6, -85]];
	
	// make points
	var points = positions_to_points(positions);
	// rotate points
	points = rotate_around_origin(points, angle);
	// translate points
	points = translate_points(points, centerX, centerY);
	
	return points;
}

// triangular prism (equilateral)
function make_points_lens_6(centerX, centerY, angle) {
	var positions = [[-80,  58],
			 [  0, -80],
			 [ 80,  58]];
	
	// make points
	var points = positions_to_points(positions);
	// rotate points
	points = rotate_around_origin(points, angle);
	// translate points
	points = translate_points(points, centerX, centerY);
	
	return points;
}

// circular orb
function make_points_lens_7(centerX, centerY, angle) {
	var positions = [[-50,  22],
			 [  0, -50],
			 [ 5, -80]];
	
	// make points
	var points = positions_to_points(positions);
	// rotate points
	points = rotate_around_origin(points, angle);
	// translate points
	points = translate_points(points, centerX, centerY);
	
	return points;
}

// ----------------------------------
// Make Blocks
// ----------------------------------

// large square
function make_points_block_1(centerX, centerY, angle) {
	var positions = [[-50,  50],
			 [ 50,  50],
			 [ 50, -50],
			 [-50, -50]];
	
	// make points
	var points = positions_to_points(positions);
	// rotate points
	points = rotate_around_origin(points, angle);
	// translate points
	points = translate_points(points, centerX, centerY);
	
	return points;
}

// thin rectangle
function make_points_block_2(centerX, centerY, angle) {
	var positions = [[-5,  30],
			 [ 5,  30],
			 [ 5, -30],
			 [-5, -30]];
	
	// make points
	var points = positions_to_points(positions);
	// rotate points
	points = rotate_around_origin(points, angle);
	// translate points
	points = translate_points(points, centerX, centerY);
	
	return points;
}

// small square
function make_points_block_3(centerX, centerY, angle) {
	var positions = [[-20,  20],
			 [ 20,  20],
			 [ 20, -20],
			 [-20, -20]];
	
	// make points
	var points = positions_to_points(positions);
	// rotate points
	points = rotate_around_origin(points, angle);
	// translate points
	points = translate_points(points, centerX, centerY);
	
	return points;
}