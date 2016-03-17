//-----------------------------------------------------------------------------//
/*
 *	Name: 		Level
 * 	Abstract: 	NO
 * 	Superclass: n/a
 * 	Subclasses:	n/a
 * 	
 * 	Description: Describes a level object
 * 	
																																										
	METHODS:

	create

																			
*/


/**
 * CONSTRUCTOR
 *
 * @return {Level}
 */
function Level() 
{

	//--------------------
	//
	// 		MEMBERS
	//
	//----------------
	//
	//
	this.pieces = [];
	this.editorPiecesDescr = [];

	return this;
}


/**
 * CONSTRUCTOR that takes arguments
 * 
 * @param {array} 	_pieces		Array of parts from the Level Editor
 */
Level.init = function(_pieces)
{
	_pieces = typeof _pieces != 'undefined' ? _pieces : [];
	//
	var instance = new Level();
	//
	/*
	for(var i=0; i < _pieces.length; i++) {
		var pData = _pieces[i];
		var part = Level.ClassRouter[pData["kind"]].init( pData["x"], pData["y"], pData["ang"] );
		instance.parts.push(part);
	}
	*/
	instance.pieces = _pieces;
	return instance;
}


// STATIC
Level.ClassRouter = [
	Asteroid,
	Core_,
	Lens,
	Lens2,
	Lens3,
	Mirror,
	Source,
	Wall
]





//-----------------------------------------------------------------------------//
/*
 *	Name: 		LevelPiece
 * 	Abstract: 	YES
 * 	Superclass: n/a
 * 	Subclasses:	Asteroid, Core, Lens, Lens2, Lens3, Mirror, Source, Wall
 * 	
 * 	Description: Describes a level piece
 * 	

																																										
	METHODS:

	init 		draw 		update
	clone 		updatePos	stop
		 		
																			
*/


/**
 * CONSTRUCTOR
 *
 * @return {LevelPiece}
 */
function LevelPiece() 
{

	//--------------------
	//
	// 		MEMBERS
	//
	//----------------
	//
	//
	this.x = 0.0;
	this.y = 0.0;
	this.rotation = 0.0;
	//
	this.kind = -1;


	return this;
}

/**
 * CONSTRUCTOR that takes arguments
 * 
 * @param {Image} 	_kind	Initial Image 
 * @param {Number} 	_x 		Initial x
 * @param {Number} 	_y 		Initial y
 * @param {Number} 	_rot 	Initial rotation
 * @return {LevelPiece}
 */
LevelPiece.init = function(_kind, _x, _y, _rot, _instance)
{
	_x = typeof _x != 'undefined' ? _x : 0.0;
	_y = typeof _y != 'undefined' ? _y : 0.0;
	_rot = typeof _rot != 'undefined' ? _rot : 0.0;
	_instance = typeof _instance != 'undefined' ? _instance : new LevelPiece();
	//
	_instance.x = _x;
	_instance.y = _y;
	_instance.rotation = _rot;
	//
	_instance.kind = _kind;

	return _instance;
}

/**
 * Creates and returns a clone
 * 
 * @return {LevelPiece}
 */
LevelPiece.prototype.clone = function()
{
	var instance = this.constructor.init(this.x, this.y, this.rotation);
	return instance;
}


/**
 * Draw to global Canvas
 * 
 */
LevelPiece.prototype.draw = function() 
{ 
	drawBitmapCenteredAtLocationWithRotation(levObjPics[this.kind], this.x, this.y, this.rotation);
};



/**
 * Update position
 * 
 */
LevelPiece.prototype.updatePos = function(_x, _y) 
{ 
	this.x = _x;
	this.y = _y;
};



/**
 * Update frame
 * 
 */
LevelPiece.prototype.update = function() 
{ 

};



/**
 * Stop all activity
 * 
 */
LevelPiece.prototype.stop = function() 
{ 

};





//-----------------------------------------------------------------------------//
/*
 *	Name: 		Asteroid
 * 	Abstract: 	NO
 * 	Superclass: LevelPiece
 * 	Subclasses:	n/a
 * 	
 * 	Description: Asteroid type
 * 	

																																										
	METHODS:

																				
*/


Asteroid.prototype = Object.create( LevelPiece.prototype );		
Asteroid.prototype.constructor = Asteroid;						


/**
 * CONSTRUCTOR
 *
 * @return {Asteroid}
 */
function Asteroid() 
{
	LevelPiece.call(this);

	return this;
}

/* @OVERRIDE */
Asteroid.init = function(_x, _y, _rot)
{
	var instance = new Asteroid();
	//
	LevelPiece.init.call(this, LEVELPART_ASTEROID, _x, _y, _rot, instance);

	return instance;
}






//-----------------------------------------------------------------------------//
/*
 *	Name: 		Core_
 * 	Abstract: 	NO
 * 	Superclass: LevelPiece
 * 	Subclasses:	n/a
 * 	
 * 	Description: Core_ type
 * 	

																																										
	METHODS:

																				
*/


Core_.prototype = Object.create( LevelPiece.prototype );		
Core_.prototype.constructor = Core_;						


/**
 * CONSTRUCTOR
 *
 * @return {Core_}
 */
function Core_() 
{
	LevelPiece.call(this);

	return this;
}

/* @OVERRIDE */
Core_.init = function(_x, _y, _rot)
{
	var instance = new Core_();
	//
	LevelPiece.init.call(this, LEVELPART_CORE, _x, _y, _rot, instance);

	return instance;
}





//-----------------------------------------------------------------------------//
/*
 *	Name: 		Lens
 * 	Abstract: 	NO
 * 	Superclass: LevelPiece
 * 	Subclasses:	n/a
 * 	
 * 	Description: Lens type
 * 	

																																										
	METHODS:

																				
*/


Lens.prototype = Object.create( LevelPiece.prototype );		
Lens.prototype.constructor = Lens;						


/**
 * CONSTRUCTOR
 *
 * @return {Lens}
 */
function Lens() 
{
	LevelPiece.call(this);

	return this;
}

/* @OVERRIDE */
Lens.init = function(_x, _y, _rot)
{
	var instance = new Lens();
	//
	LevelPiece.init.call(this, LEVELPART_LENS, _x, _y, _rot, instance);

	return instance;
}





//-----------------------------------------------------------------------------//
/*
 *	Name: 		Lens2
 * 	Abstract: 	NO
 * 	Superclass: LevelPiece
 * 	Subclasses:	n/a
 * 	
 * 	Description: Lens2 type
 * 	

																																										
	METHODS:

																				
*/


Lens2.prototype = Object.create( LevelPiece.prototype );		
Lens2.prototype.constructor = Lens2;						


/**
 * CONSTRUCTOR
 *
 * @return {Lens2}
 */
function Lens2() 
{
	LevelPiece.call(this);

	return this;
}

/* @OVERRIDE */
Lens2.init = function(_x, _y, _rot)
{
	var instance = new Lens2();
	//
	LevelPiece.init.call(this, LEVELPART_LENS2, _x, _y, _rot, instance);

	return instance;
}





//-----------------------------------------------------------------------------//
/*
 *	Name: 		Lens3
 * 	Abstract: 	NO
 * 	Superclass: LevelPiece
 * 	Subclasses:	n/a
 * 	
 * 	Description: Lens3 type
 * 	

																																										
	METHODS:

																				
*/


Lens3.prototype = Object.create( LevelPiece.prototype );		
Lens3.prototype.constructor = Lens3;						


/**
 * CONSTRUCTOR
 *
 * @return {Lens3}
 */
function Lens3() 
{
	LevelPiece.call(this);

	return this;
}

/* @OVERRIDE */
Lens3.init = function(_x, _y, _rot)
{
	var instance = new Lens3();
	//
	LevelPiece.init.call(this, LEVELPART_LENS3, _x, _y, _rot, instance);

	return instance;
}





//-----------------------------------------------------------------------------//
/*
 *	Name: 		Mirror
 * 	Abstract: 	NO
 * 	Superclass: LevelPiece
 * 	Subclasses:	n/a
 * 	
 * 	Description: Mirror type
 * 	

																																										
	METHODS:

																				
*/


Mirror.prototype = Object.create( LevelPiece.prototype );		
Mirror.prototype.constructor = Mirror;						


/**
 * CONSTRUCTOR
 *
 * @return {Mirror}
 */
function Mirror() 
{
	LevelPiece.call(this);

	return this;
}

/* @OVERRIDE */
Mirror.init = function(_x, _y, _rot)
{
	var instance = new Mirror();
	//
	LevelPiece.init.call(this, LEVELPART_MIRROR, _x, _y, _rot, instance);
	//
	// Calculate how to mimic the look of the mirror PNG file
	var mirror_hardcoded_height = 46.0;
	var startY = _y - (mirror_hardcoded_height/2.0);
	var endY = _y + (mirror_hardcoded_height/2.0);
	var startPoint = rotatePointAroundPoint(_x, startY, _x, _y, _rot);
	var endPoint = rotatePointAroundPoint(_x, endY, _x, _y, _rot);
	instance.mirrorLine = new MirrorLine(startPoint[0], startPoint[1], endPoint[0], endPoint[1], 'gray', mirrorLineWidth);
	//
	return instance;
}

/* @OVERRIDE */
Mirror.prototype.draw = function() 
{ 
	this.mirrorLine.draw();
};



//-----------------------------------------------------------------------------//
/*
 *	Name: 		Source
 * 	Abstract: 	NO
 * 	Superclass: LevelPiece
 * 	Subclasses:	n/a
 * 	
 * 	Description: Source type
 * 	

																																										
	METHODS:

																				
*/


Source.prototype = Object.create( LevelPiece.prototype );		
Source.prototype.constructor = Source;						


/**
 * CONSTRUCTOR
 *
 * @return {Source}
 */
function Source() 
{

	LevelPiece.call(this);

	//--------------------
	//
	// 		MEMBERS
	//
	//----------------
	//
	//
	this.beam = null;


	return this;
}

/* @OVERRIDE */
Source.init = function(_x, _y, _rot)
{
	var instance = new Source();
	//
	LevelPiece.init.call(this, LEVELPART_SOURCE, _x, _y, _rot, instance);

	return instance;
}


/* @OVERRIDE */
Source.prototype.update = function() 
{ 
	LevelPiece.prototype.update.call(this);
	//
	// Check if a new beam is needed
	if(this.beam == null || !this.beam.active) {
		this.beam = new Beam(this.x, this.y, LIGHTSPEED, rad_to_deg(this.rotation), trailLength, 'red', dashLineWidth);
		beams.push(this.beam);
	}
};


/* @OVERRIDE */
Source.prototype.stop = function()
{
	LevelPiece.prototype.stop.call(this);
	//
	this.beam = null;
}



//-----------------------------------------------------------------------------//
/*
 *	Name: 		Wall
 * 	Abstract: 	NO
 * 	Superclass: LevelPiece
 * 	Subclasses:	n/a
 * 	
 * 	Description: Wall type
 * 	

																																										
	METHODS:

																				
*/


Wall.prototype = Object.create( LevelPiece.prototype );		
Wall.prototype.constructor = Wall;						


/**
 * CONSTRUCTOR
 *
 * @return {Wall}
 */
function Wall() 
{
	LevelPiece.call(this);

	return this;
}

/* @OVERRIDE */
Wall.init = function(_x, _y, _rot)
{
	var instance = new Wall();
	//
	LevelPiece.init.call(this, LEVELPART_WALL, _x, _y, _rot, instance);

	return instance;
}







/**
 * Finds out where a point moves if its plane gets rotated
 * 
 * @param {Number} x Point x
 * @param {Number} y Point y
 * @param {Number} ox Origo point x
 * @param {Number} oy Origo point y
 * @param {Number} angle Rotation angle
 * @return {Array} An array with X at pos 0 and Y at pos 1
 */
rotatePointAroundPoint = function( x, y, ox, oy, angle ) {
		
		var pX;
		var pY;
		
		//angle = angle * Math.PI / 180.0;
		
		/*							 _							_		 _	   _
		 * 							|							 |		|		|
		 * 							|	cos angle	-sin angle	 |		|	x	|
		 * 	Apply rotation matrix	|							 |	X	|		|
		 * 							|	sin angle	cos angle	 |		|	y	|
		 * 							|							 |		|		|
		 * 							 Ð							Ð		 Ð	   Ð
		 * 
		 * but adjust origo so that it exists at the given rotation point, ie x-ox and y-oy.
		 * Then, move it back, ie +ox and +oy.
		 * 
		 */
		pX = Math.cos(angle) * (x-ox) - Math.sin(angle) * (y-oy) + ox;
		pY = Math.sin(angle) * (x-ox) + Math.cos(angle) * (y-oy) + oy;
		
		return [pX,pY];
		
};
