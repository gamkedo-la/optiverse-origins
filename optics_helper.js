
// ##################################
// Helper Functions
// ##################################

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

// Translate Point objects
function translate_points(points, deltaX, deltaY) {
    for (var i=0; i < points.length; i++) {
	points[i].x += deltaX;
	points[i].y += deltaY;
    }
    return points;
}

// Rotate Points around origin
function rotate_around_origin(points, angle) {
    // Calculates rotation of point around origin using angle.
    // angle in degrees
    var s = Math.sin(deg_to_rad(angle));
    var c = Math.cos(deg_to_rad(angle));
    
    for (var i=0; i < points.length; i++) {
	var newX = (points[i].x * c  - points[i].y * s);
	var newY = (points[i].x * s  + points[i].y * c);
	points[i].x = newX;
	points[i].y = newY;
    }
    
    return points;
    
}

// Turn position arrays into Point objects
function positions_to_points(positions) {
    var points = [];
    for (var i=0; i < positions.length; i++) {
	var pos = positions[i];
	var point = new Point(pos[0], pos[1]);
	points.push(point);
    }
    return points;
}

// Create box around line
function create_outline_box(startX, startY, endX, endY) {
    var angle, d = MIRROR_LINE_BOX_WIDTH / 2; 
    
    // Find angle
    angle = Math.atan2(endY - startY, endX - startX) + Math.PI/2;
    var deltaX = d * Math.cos(angle);
    var deltaY = d * Math.sin(angle);
    
    // calculate points
    var p1, p2, p3, p4;
    p1 = new Point(startX + deltaX, startY + deltaY);
    p2 = new Point(startX - deltaX, startY - deltaY);
    p3 = new Point(endX + deltaX, endY + deltaY);
    p4 = new Point(endX - deltaX, endY - deltaY);
    
    var points = [p1,p2,p3,p4];
    
    return points;
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


