
// ##################################
// Global Variables
// ##################################

const LIGHTSPEED = 2;
const DASHED_LINE_LENGTH = 20; // must be >1, not sure if decimals do anything



// ##################################
// Helper Functions
// ##################################

// crosses
// surrounds

// Dot product of two vectors
function dot_product(a,b) {
	// Args: a = [x1,y1], b = [x2,y2]
	var n = 0, lim = Math.min(a.length,b.length);
	for (var i = 0; i < lim; i++) n += a[i] * b[i];
	return n;
}

// Cross product of two vectors
function cross_product(a,b) {
	// Args: a = [x1,y1], b = [x2,y2]
	// Note: order matters, returns a x b
	var result = a[0] * b[1] - a[1] * b[0];
	return result;
}

// Angle between two vectors
function angle_between_vectors(a,b) {
	// Args: a = [x1,y1], b = [x2,y2]
	var result; 
	result = dot_product(a,b) / (vector_length(a) * vector_length(b));
	result = Math.acos(result);
	return result;
}

// Vector Length
function vector_length(vector) {
	// Args: vector = [x1,y1]
	var n = 0, result;
	
	for (var i = 0; i < vector.length; i++) {
	    n += Math.pow(vector[i],2);
	}
	
	result = Math.sqrt(n);
		
	return result;
}

// Normalize a vector
function normalize(vector) {
	// Args: vector = [x1,y1]
	var vectorLength, result = [];
	
	vectorLength = vector_length(vector);
		
	for (var i = 0; i < vector.length; i++) {
	    result.push(vector[i] / vectorLength);
	}
	
	return result;
}

// Distance between two points
function distance_between_two_points(x0, y0, x1, y1) {
    var deltaX = x1 - x0;
    var deltaY = y1 - y0;
    return Math.hypot(deltaX, deltaY);
    
}

// Helper for function intersect()
function ccw(A,B,C) {  
        return Boolean( (C[1]-A[1]) * (B[0]-A[0]) > (B[1]-A[1]) * (C[0]-A[0]) ); 
}

// Line intersection test
function lines_intersect(L1, L2) {
    // Return true if lines L1 and L2 intersect
    var A = [L1.startX, L1.startY];
    var B = [L1.endX, L1.endY];    
    
    var C = [L2.startX, L2.startY];
    var D = [L2.endX, L2.endY];   
     
    return Boolean(ccw(A,C,D) != ccw(B,C,D) && ccw(A,B,C) != ccw(A,B,D));
}

// Intersection point
function intersection_point(line1, line2) {
    // Returns point of intersection between two Line objects
        
   var line1StartX = line1.startX; 
   var line1StartY = line1.startY; 
   var line1EndX = line1.endX; 
   var line1EndY = line1.endY;
   var line2StartX = line2.startX; 
   var line2StartY = line2.startY;
   var line2EndX = line2.endX;
   var line2EndY = line2.endY;
   
    // FROM THE INTERWEBS!!! http://jsfiddle.net/justin_c_rounds/Gd2S2/
    // if the lines intersect, the result contains the x and y of the intersection (treating the lines as infinite) and booleans for whether line segment 1 or line segment 2 contain the point
    var denominator, a, b, numerator1, numerator2, result = {
        x: null,
        y: null,
        onLine1: false,
        onLine2: false
    };
    denominator = ((line2EndY - line2StartY) * (line1EndX - line1StartX)) - 
		      ((line2EndX - line2StartX) * (line1EndY - line1StartY));

    if (denominator == 0) {
        return result;
    }
    a = line1StartY - line2StartY;
    b = line1StartX - line2StartX;
    numerator1 = ((line2EndX - line2StartX) * a) - ((line2EndY - line2StartY) * b);
    numerator2 = ((line1EndX - line1StartX) * a) - ((line1EndY - line1StartY) * b);
    a = numerator1 / denominator;
    b = numerator2 / denominator;

    // if we cast these lines infinitely in both directions, they intersect here:
    result.x = line1StartX + (a * (line1EndX - line1StartX));
    result.y = line1StartY + (a * (line1EndY - line1StartY));

        // it is worth noting that this should be the same as:
        // x = line2StartX + (b * (line2EndX - line2StartX));
        // y = line2StartX + (b * (line2EndY - line2StartY));
        
    // if line1 is a segment and line2 is infinite, they intersect if:
    if (a > 0 && a < 1) {
        result.onLine1 = true;
    }
    // if line2 is a segment and line1 is infinite, they intersect if:
    if (b > 0 && b < 1) {
        result.onLine2 = true;
    }
    

    // if line1 and line2 are segments, they intersect if both of the above are true
    return result;
}

// Vector reflection in 2D
function reflect_vector(vector, mirror_line) {
    // Args: vector = [x1,y1], mirror_line = [x2,y2]
    
    // Receives: two vectors represented as arrays (same origin), 
    // Returns: point, mirror of 'vector' around 'mirror_line'.
    
    var nhat, result = {x: null, y: null};
    nhat = normalize(mirror_line); // Normalized mirror line
    
    result.x = 2 * dot_product(vector, nhat) * nhat[0] - vector[0];
    result.y = 2 * dot_product(vector, nhat) * nhat[1] - vector[1];
    
    return result;    
}

// Vector refraction in 2D
function refract_vector(vector, refract_Line, refractiveIndex) {
    // Args: vector = [x1,y1], refract_Line = [x2,y2]
    
    // Receives: two vectors represented as arrays (same origin), 
    // and returns new position and change in direction of refracted beam
    // Note: lens is on the right of refract_Line vector.
    
    var angleBetweenVectors, angle1, angle2, n1, n2, sign, sintheta;
    var result = {change_in_direction: null, total_internal_reflection: false};
    
    // Strategy: Use cosine formula to find angle between vectors,
    // and then Snell's law to find new direction.
    
    // Step 1: Use cross product to determine direction of beam
    var cross = cross_product(refract_Line, vector);
    if (cross > 0) {
	// Going from lens to space
	n1 = refractiveIndex;
	n2 = 1;
	sign = 1;
    } else if (cross < 0) {
	// Going from space to lens
	n1 = 1;
	n2 = refractiveIndex;
	sign = -1;
    } else {
	console.log("Error: vector and refraction lines are parallel");
	return;
    }
    
    // Step 2: Calculate angle between vectors using cosine law
    angleBetweenVectors = angle_between_vectors(refract_Line, vector);
    
    // Step3: Calculate angle1 for Snell's law
    angle1 = Math.PI/2 - angleBetweenVectors;
    
    // Step4: Calculate angle2 using Snell's law
    angle2 = Math.asin((n1/n2) * Math.sin(angle1));
    
    // Step5: Check for total internal reflection
    sintheta = sign * (angle2 - angle1) * 180/Math.PI;
    if (Math.abs(sintheta) > 1) {
	// Not allowed, total internal reflection
	result.total_internal_reflection = true;
	return result;
    }
    
    // Step6: Calculate change in angle (radians)
    change_in_direction = (sintheta);
    
    console.log("refract_vector!");
    console.log("n1", n1);
    console.log("n2", n2);
    console.log("cross", cross);
    console.log("angleBetweenVectors", angleBetweenVectors);
    console.log("angle1", angle1);
    console.log("inside", (n1/n2) * Math.sin(angle1));
    console.log("angle2", angle2);
    console.log("change_in_direction", change_in_direction);
    
    return result;    
}

// Convert angle in degrees to direction (0-360)
function deg_to_dir(angle) {
	while (angle < 0){
		angle += 360;
	}
	return angle % 360;
}

// Convert radians to degrees
function rad_to_deg(radians) {
	return radians * 180/Math.PI;
}


// ##################################
// Classes (Prototype Constructors)
// ##################################


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

// intersects()
Line.prototype.intersects = function (line) { 
	// receives line object and tests intersection
	return Boolean(intersect(this, line))
}	
// draw()
Line.prototype.draw = function () {
	colorLine(this.startX, this.startY, 
		 this.endX, this.endY, 
		 this.color, this.lineWidth);
}

// === MirrorLine =========================
function MirrorLine(startX, startY, endX, endY, color, lineWidth) {
	// Call parent constructor	
	Line.call(this, startX, startY, endX, endY, color, lineWidth);				
} // Make it a subclass
MirrorLine.prototype = Object.create(Line.prototype); 
MirrorLine.prototype.constructor = MirrorLine; 
// move()
MirrorLine.prototype.move = function (deltaX, deltaY) {
	// TO DO
}
// reflect()
MirrorLine.prototype.reflect = function (line_step) {
	var result = {newX: null,
		      newY: null,
		      intersectX: null,
		      intersectY: null,
		      newDirection: null};
	// Calculate intersection point
	var point = intersection_point(this, line_step);
	
	result.intersectX = point.x;
	result.intersectY = point.y;
	
	if (point.onLine1 && point.onLine2) {
	
		// Create vectors using intersect as origin, and calculate reflection
		var remainingTrajectory = [line_step.endX - point.x, 
					   line_step.endY - point.y];
		var mirrorLine = [this.endX - point.x, this.endY - point.y];
		var delta = reflect_vector(remainingTrajectory, mirrorLine);
		// Add delta to origin to get result
		result.newX = point.x + delta.x;
		result.newY = point.y + delta.y;
		
		// Use trig to calculate new direction
		var newAngle = Math.atan2(delta.y, delta.x) * (180/Math.PI);
		result.newDirection = deg_to_dir(newAngle);

	} else {
		
		// Use full lines as vectors
		var trajectory = [line_step.endX - line_step.startX, 
				  line_step.endY - line_step.startY];
		var mirrorLine = [this.endX - this.startX, this.endY - this.startY];
		var delta = reflect_vector(trajectory, mirrorLine);
		
		// Use trig to find new direction of propagation
		result.newDirection = (Math.atan2(delta.y, delta.x) * (180/Math.PI)) % 360;
		
		// Choose a point slightly off mirror in new direction of propagation
		result.newX = point.x + .001 * Math.cos(result.newDirection * Math.PI/180);
		result.newY = point.y + .001 * Math.sin(result.newDirection * Math.PI/180);

	}
	
	return result;
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
		console.log("Error: 'points' has odd number of elements");
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
// intersects()
LensLine.prototype.intersects = function (line) { 
	// receives line object and tests intersection
	return Boolean(intersect(this, line))
}
// refract()
LensLine.prototype.refract = function (line_step) {

	console.log("line_step: ", line_step );	

	// Note: lens is on the right of LensLine vector.
	var result = {newX: null,
		      newY: null,
		      intersectX: null,
		      intersectY: null,
		      newDirection: null};
	// Calculate intersection point
	var point = intersection_point(this, line_step);
	
	result.intersectX = point.x;
	result.intersectY = point.y;
	var remainingTrajectory = [line_step.endX - point.x, 
				   line_step.endY - point.y];
	
	// Calculate new direction
	var trajectory = [line_step.endX - line_step.startX, 
			  line_step.endY - line_step.startY];
	var refractLine = [this.endX - this.startX, this.endY - this.startY];
	var refraction = refract_vector(trajectory, refractLine, 
				   this.refractiveIndex);
				   
	if (refraction.total_internal_reflection) {
		// reflect beam like a mirror
	} else {
		// refract beam like a lens
		result.newDirection = line_step.direction + refraction.change_in_direction;
	}
	
	
	if (remainingTrajectory > 0) {
		result.newX = point.x + (remainingTrajectory * 
					Math.cos(result.newDirection * Math.PI/180));
		result.newY = point.y + (remainingTrajectory * 
					Math.sin(result.newDirection * Math.PI/180));

	} else {
		
		// Choose a point in new direction of propagation
		result.newX = point.x + .001 * Math.cos(result.newDirection * Math.PI/180);
		result.newY = point.y + .001 * Math.sin(result.newDirection * Math.PI/180);

	}
	
	console.log("Lens result: ", result );	
	
	return result;
}	


// === Lens =========================
function Lens(points, refractiveIndex, color) {
	// points: array of ordered points that make up the lens
	// refractiveIndex: index of refraction
	
	this.refractiveIndex = refractiveIndex;	
	this.lensLines = [];
	this.color = color;
	
	// Convert ponts to LensLines
	for (var i=0; i < points.length; i++) {	
		var startX = points[i].x;
		var startY = points[i].y;
		var endX = points[(i+1) % points.length].x;
		var endY = points[(i+1) % points.length].y;
		
		var lensLine = new LensLine(startX, startY, endX, endY, this.refractiveIndex);
		this.lensLines.push(lensLine);
	}
	
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


// ----------------------------------
// Laser Beams
// ----------------------------------

// === Beam =========================
function Beam(posX, posY, speed, angle, trailLength, color, lineWidth) {

	this.posX = posX;
	this.posY = posY;
	this.speed = speed;
	this.direction = deg_to_dir(angle);
	this.active = true; // boolean	
	
	this.trail = new Trail(trailLength, color, lineWidth);
	
	// Previous state
	this.prevX = posX;
	this.prevY = posY;
	this.prevDirection = this.direction;
}
// updateBEAM()
Beam.prototype.updateBEAM = function () {
	if (!this.active){
		return false;
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
	
	// mirror collisions 
	for (var i=0; i < mirrors.length; i++) {
	
		if(lines_intersect(mirrors[i], line_step)){
			
			// Reflect off of mirror
			reflection = mirrors[i].reflect(line_step);
			
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
			
			return false; // Only one collision event
		}
	}
	
	
	// lens collisions
	for (var i=0; i < lenses.length; i++) {
		var lensLines = lenses[i].lensLines;
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
				
				return false; // Only one collision event
				
			}
		}
	}
	
	// other object collisions
	
	// no collisions:
	this.trail.addLine(this.prevX, this.prevY, this.posX, this.posY);

	// check for screen exit
	var lastLine = this.trail.lines[0];
	if(lastLine.endX < 0.0 || lastLine.endY < 0.0 || lastLine.endX > canvas.width || lastLine.endY > canvas.height) {
		this.active = false;
		return true;
	}

	return false;
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




// ----------------------------------
// Cores and Sources
// ----------------------------------

// === Core =========================
function Core(centerX, centerY, innerRadius, outerRadius, color, coreRings) {
	// Args: coreRings = []
	this.centerX = centerX;
	this.centerY = centerY;
	this.innerRadius = innerRadius;
	this.outerRadius = outerRadius;
	this.color = color;
	this.coreRings = coreRings; // an array of CoreRing objects
}
// updateCORE()
Core.prototype.updateCORE = function () {

	for (var i=0; i < this.coreRings.length; i++) {	
		this.coreRings[i].updateRING();	 // update each ring
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
// explode()
Core.prototype.explode = function () {
	for (var i=0; i < this.coreRings.length; i++) {
		var ring = this.coreRings[i];
		if (ring.isActive()) {
			ring.deactivate();
			// fire laser beam
			
			// TODO
		} else {
			ring.activate();
		}
	}
}
// absorb()
Core.prototype.absorb = function (beam) {
	var absorbed = false;
	for (var i=0; i < this.coreRings.length; i++) {
		var ring = this.coreRings[i];
		if (!(ring.isActive()) && beam.color == ring.color) {
			ring.activate();
			return;
		}
	}
	if (!absorbed) {
		// broken core
		// TO DO
		return;
	}
}
// encloses()
Core.prototype.encloses = function (x, y) {
	// Call helper function
	var dist = distance_between_two_points(this.centerX, this.centerY, x, y);
	return Boolean(this.outerRadius - dist > 0);
}
// draw()
Core.prototype.draw = function () {
	
	// Core circle
	colorCircle(this.centerX, this.centerY, this.innerRadius, this.color);
	
	// Core levels
	for(var i=0; i < this.coreRings.length; i++){
		var ring = this.coreRings[i];
		if (ring.isActive()) {
			ring.draw(this.centerX, this.centerY);
		}
	}
}


// === CoreRing =========================
function CoreRing(radius, frequency, amplitude, color, lineWidth) {
	this.radius = radius;
	this.frequency = frequency;
	this.amplitude = amplitude;
	this.radiusChange = 0; 
	this.degreeOffset = 0; // 0-359 degrees
	this.active = false;
	
	this.color = color;
	this.lineWidth = lineWidth;	
}
// updateRING()
CoreRing.prototype.updateRING = function () {
	if (this.active){
		this.degreeOffset = (this.degreeOffset + this.frequency) % 360;
		// var radiansOffset = this.degreeOffset * Math.PI/180;
		this.radiusChange = this.amplitude * Math.sin(this.degreeOffset);
	}
}
// isActive()
CoreRing.prototype.isActive = function () {
	return this.active;
}
// activate()
CoreRing.prototype.activate = function () {
	this.active = true;
}
// deactivate()
CoreRing.prototype.deactivate = function () {
	this.active = false;
}
// draw()
CoreRing.prototype.draw = function (centerX, centerY) {
	var rad = this.radius + this.radiusChange;
	strokeCircle(centerX, centerY, rad, this.color, this.lineWidth);
}




