
// ##################################
// Global Variables
// ##################################

const LIGHTSPEED = 3;
const DASHED_LINE_LENGTH = 5; // must be >1, not sure if decimals do anything
const LASER_TRAIL_LENGTH = 10; 
const LASER_LINE_WIDTH = 3; 


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

// Check to see if polygon encloses point
function encloses(polygon_points, point) {
    // Return true if point is inside polygon
    var n = polygon_points.length;
    var inside = false;
    var p1x = polygon_points[0].x;
    var p1y = polygon_points[0].y;
    var p2x, p2y, xints;
    
    for (var i=0; i < n+1; i++) {
        p2x = polygon_points[i % n].x;
        p2y = polygon_points[i % n].y;
        if (point.y > Math.min(p1y, p2y)) {
            if (point.y < Math.max(p1y,p2y)) { 
                if (point.x < Math.max(p1x,p2x)) {
                    if (p1y != p2y) {
                        xints = (point.y-p1y)*(p2x-p1x)/(p2y-p1y)+p1x;
		    }
                    if (p1x == p2x || point.x < xints) {
                        inside = !inside;
		    }
		}
	    }
	}
        p1x = p2x;
	p1y = p2y;
    }
    return inside
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

// Reflect trajectory line off of a mirror line
function reflect_mirror(line_step, mirror_line) {
    var result = {newX: null,
		  newY: null,
		  intersectX: null,
		  intersectY: null,
		  newDirection: null};
		  
    // Calculate intersection point
    var point = intersection_point(line_step, mirror_line);
    result.intersectX = point.x;
    result.intersectY = point.y;
    
    // Create vectors using intersect as origin
    var remaining_trajectory = [line_step.endX - point.x, 
				line_step.endY - point.y];
    if (remaining_trajectory[0] == 0 && remaining_trajectory[1] == 0){
        // End point is on the mirror line, move it forward
	remaining_trajectory[0] = 0.1 * (line_step.endX - line_step.startX);
	remaining_trajectory[1] = 0.1 * (line_step.endY - line_step.startY);
    }
    var mirror_vector = [mirror_line.endX - mirror_line.startX, 
			 mirror_line.endY - mirror_line.startY];
    
    // Calculate reflection off of mirror
    var delta = reflect_vector(remaining_trajectory, mirror_vector);
    
    // Add delta to intersection point to get result
    result.newX = point.x + delta.x;
    result.newY = point.y + delta.y;

    // Use trig to calculate new direction
    var newAngle = Math.atan2(delta.y, delta.x) * (180/Math.PI);
    result.newDirection = deg_to_dir(newAngle);
    
    return result;
}

// Vector refraction in 2D
function refract_vector(vector, refract_line, refractive_index) {
    // Args: vector = [x1,y1], refract_line = [x2,y2]
    
    // Receives: two vectors represented as arrays (same origin), 
    // and returns new direction and change in position of refracted beam
    // Note: lens is on the right of refract_line vector.
    
    // Snell's law: n1 sin(angle1) = n2 sin(angle2)
    //              angle2 = asin(n1/n2 * sin(angle1))
    
    // Strategy: Use cosine formula to find angle between vectors,
    // and then Snell's law to find new direction.
    
    //console.log("refract_vector start");
    
    var angle1, angle2, n1, n2, sign, insideFormula;
    var angleBetweenVectors, currentAngle, changeInAngle;
    var result = {x: null, y: null, newDirection: null,
		  total_internal_reflection: false};
    
    // Step 1: Use cross product to determine direction of beam
    var cross = cross_product(refract_line, vector);
    if (cross > 0) {
	// Going from space to lens
	n1 = 1;
	n2 = refractive_index;
	sign = -1;
    } else if (cross < 0) {
	// Going from space to lens
	n1 = refractive_index;
	n2 = 1;
	sign = 1;
    } else {
	//console.log("Error: vector and refraction lines are parallel");
	return;
    }
    
    //console.log("cross", cross);
    //console.log("n1", n1);
    //console.log("n2", n2);
    
    // Step 2: Calculate angle between vectors using cosine law
    angleBetweenVectors = angle_between_vectors(refract_line, vector);
    
    //console.log("angleBetweenVectors", angleBetweenVectors  * 180/Math.PI);
    
    // Step3: Calculate angle1 for Snell's law (could be negative)
    angle1 = Math.PI/2 - angleBetweenVectors;
    
    //console.log("angle1", angle1 * 180/Math.PI);
    
    // Step4: Check for total internal reflection
    insideFormula = (n1/n2) * Math.sin(angle1)
    
    //console.log("insideFormula", insideFormula);    
    
    if (Math.abs(insideFormula) > 1) {
	// Not allowed, total internal reflection
	// Reflect like mirror
	result.total_internal_reflection = true;
	return result;
    }
    
    // Step5: Calculate angle2 using Snell's law
    angle2 = Math.asin(insideFormula);
    
    //console.log("angle2", angle2 * 180/Math.PI);
    
    // Step6: Calculate new direction
    changeInAngle = rad_to_deg((angle2 - angle1) * sign);
    currentAngle = rad_to_deg( Math.atan2(vector[1], vector[0]) );
    result.newDirection = deg_to_dir(currentAngle + changeInAngle);
    
    // Step7: Calculate change in position
    var vectorLength = vector_length(vector)
    result.x = vectorLength * Math.cos(deg_to_rad(result.newDirection));
    result.y = vectorLength * Math.sin(deg_to_rad(result.newDirection));
    
    
    
    //console.log("changeInAngle", changeInAngle);
    //console.log("currentAngle", currentAngle);
    //console.log("refract_vector end");
    
    return result;    
}


function refract_through_line(line_step, lens_line, refractive_index) {
    // Note: lens is on the right of LensLine vector.
    var result = {newX: null,
		  newY: null,
		  intersectX: null,
		  intersectY: null,
		  newDirection: null};
		      
    // Calculate intersection point
    var point = intersection_point(line_step, lens_line);
    result.intersectX = point.x;
    result.intersectY = point.y;
    
    //console.log("point (refract_through_line): ", point );
    
    // Create vectors using intersect as origin
    var remaining_trajectory = [line_step.endX - point.x, 
			       line_step.endY - point.y];
    if (remaining_trajectory[0] == 0 && remaining_trajectory[1] == 0){
        // End point is on the mirror line, move it forward
	remaining_trajectory[0] = 0.1 * (line_step.endX - line_step.startX);
	remaining_trajectory[1] = 0.1 * (line_step.endY - line_step.startY);
    }
    var lens_vector = [lens_line.endX - lens_line.startX, 
		       lens_line.endY - lens_line.startY];
		       

    //console.log("remaining_trajectory (refract_through_line): ", remaining_trajectory );
    //console.log("lens_vector (refract_through_line): ", lens_vector );
    
    // Calculate refraction off of lens line
    var delta = refract_vector(remaining_trajectory, lens_vector, refractive_index);
    
    //console.log("delta (refract_through_line): ", delta );
    
    if (delta.total_internal_reflection) {
        result = reflect_mirror(line_step, lens_line);
	//console.log("result (refract_through_line): ", result );
	return result;
    }
    
    // Add delta to intersection point to get result, save new direction
    result.newX = point.x + delta.x;
    result.newY = point.y + delta.y;
    result.newDirection = delta.newDirection;
    
    
    //console.log("result (refract_through_line): ", result );
    
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

// Convert degrees to radians
function deg_to_rad(degrees) {
	return degrees * Math.PI/180;
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
	
	var result = reflect_mirror(line_step, this)
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
// Blocks (Asteroids, walls, etc.)
// ----------------------------------

// === Block =========================
function Block(points, color) {
	// points: array of ordered points that make up the lens
	// refractiveIndex: index of refraction

	this.points = points;
	this.color = color;
	
} 
// draw()
Block.prototype.draw = function () {
	colorPolygon(this.points, this.color);
}



// ----------------------------------
// Cores and Sources
// ----------------------------------

// === Core =========================
function Core(centerX, centerY, radius, color, coreRings) {
	// Args: coreRings = []
	this.centerX = centerX;
	this.centerY = centerY;
	this.radius = radius;
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
		this.coreRings[i].draw(this.centerX, this.centerY);
	}
}


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
	
	this.color = color;
	this.lineWidth = lineWidth;	
}
// updateRING()
CoreRing.prototype.updateRING = function () {
	/* if (this.active){
		this.degreeOffset = (this.degreeOffset + this.frequency) % 360;
		// var radiansOffset = this.degreeOffset * Math.PI/180;
		this.radiusChange = this.amplitude * Math.sin(this.degreeOffset);
	} */
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
		
		lasers.push(laser); // Emit laserbeam
		slot.filled = false;
	}
}
// draw()
CoreRing.prototype.draw = function (centerX, centerY) {
	
	// Draw Ring
	if (this.active) {
		strokeCircle(centerX, centerY, this.radius, this.color, this.lineWidth);
	} else {
		strokeCircleDashed(centerX, centerY, this.radius, this.color, 1);
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
// Laser Beams
// ----------------------------------

// === Beam =========================
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
}
// updateBEAM()
Beam.prototype.updateBEAM = function () {
	if (!this.active){
		this.trail.removeLine();
		if (this.trail.lines.length == 0) {
			return true; // Delete beam
		}
		return false; // Don't delete beam
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
	var point_step = new Point(this.posX, this.posY)
	
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
	
	
	
	// block collisions
	for (var i=0; i < blocks.length; i++) {
		if (encloses(blocks[i].points, point_step)) {
			this.trail.addLine(this.prevX, this.prevY, this.posX, this.posY);
			this.active = false;
			return false;
		}
	}
	
	// no collisions:
	this.trail.addLine(this.prevX, this.prevY, this.posX, this.posY);

	// check for screen exit
	var lastLine = this.trail.lines[0];
	if(lastLine.endX < 0.0 || lastLine.endY < 0.0 || lastLine.endX > canvas.width || lastLine.endY > canvas.height) {
		this.active = false;
		return true; // Delete beam
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


// === LaserBeam =========================
function LaserBeam(posX, posY, speed, angle, trailLength, color, lineWidth) {
	// Call parent constructor	
	Beam.call(this, posX, posY, speed, angle, trailLength, color, lineWidth);		
} // Make it a subclass
LaserBeam.prototype = Object.create(Beam.prototype); 
LaserBeam.prototype.constructor = LaserBeam; 
// updateLASER()
LaserBeam.prototype.updateLASER = function () {
	// Call superclass update
	var bool = this.updateBEAM();
	
	// core collisions
	for (var i=0; i < cores.length; i++) {
		for (var j=0; j < cores[i].coreRings.length; j++)  {
			
			var ring = cores[i].coreRings[j];
			var dist = distance_between_two_points(this.posX, this.posY, 
						cores[i].centerX, cores[i].centerY);
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
					
					return false;
				}
			}
		}
	}
	
	return bool;
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
	var temp = this.lines.shift() //Get rid of oldest line
	// temp is throwaway, not used
}
// draw()
Trail.prototype.draw = function () {
	for(var i=0; i < this.trailLength; i++){
		if (i < this.lines.length) {
			this.lines[i].draw();
		}
	}
}






