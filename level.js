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
	this.parts = [];

	return this;
}


/**
 * CONSTRUCTOR that takes arguments
 * 
 * @param {array} 	_parts	Array of parts from the Level Editor
 */
Level.init = function(_partsDescr)
{
	_partsDescr = typeof _partsDescr != 'undefined' ? _partsDescr : [];
	//
	var instance = new Level();
	//
	for(var i=0; i < _partsDescr.length; i++) {
		var pData = _partsDescr[i];
		var part = Level.ClassRouter[pData["kind"]].init( pData["x"], pData["y"], pData["ang"] );
		instance.parts.push(part);
	}

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
 *	Name: 		LevelPart
 * 	Abstract: 	YES
 * 	Superclass: n/a
 * 	Subclasses:	Asteroid, Core, Lens, Lens2, Lens3, Mirror, Source, Wall
 * 	
 * 	Description: Describes a level part
 * 	

																																										
METHODS:

create
draw
setImage
																			
*/


/**
 * CONSTRUCTOR
 *
 * @return {LevelPart}
 */
function LevelPart() 
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
	this.image = new Image();


	return this;
}

/**
 * CONSTRUCTOR that takes arguments
 * 
 * @param {string} 	_imgSrc	Path to image file
 * @param {float} 	_x 		Initial x
 * @param {float} 	_y 		Initial y
 * @param {float} 	_rot 	Initial rotation
 */
LevelPart.init = function(_imgSrc, _x, _y, _rot)
{
	_x = typeof _x != 'undefined' ? _x : 0.0;
	_y = typeof _y != 'undefined' ? _y : 0.0;
	_rot = typeof _rot != 'undefined' ? _rot : 0.0;
	//
	var instance = new LevelPart();
	//
	instance.x = _x;
	instance.y = _y;
	instance.rotation = _rot;
	//
	instance.setImage(_imgSrc);

	return instance;
}



/**
 * Draw to global Canvas
 * 
 */
LevelPart.prototype.draw = function() 
{ 
	drawBitmapCenteredAtLocationWithRotation(this.image, this.x, this.y, this.rotation);
};



/**
 * Set new Image
 * 
 * @param {string} _imgSrc The source of the new Image
 */
LevelPart.prototype.setImage = function( _imgSrc ) 
{ 
	this.image = new Image();
	this.image.src = _imgSrc;
};





//-----------------------------------------------------------------------------//
/*
 *	Name: 		Asteroid
 * 	Abstract: 	NO
 * 	Superclass: LevelPart
 * 	Subclasses:	n/a
 * 	
 * 	Description: Asteroid type
 * 	

																																										
METHODS:

																			
*/


Asteroid.prototype = Object.create( LevelPart.prototype );		
Asteroid.prototype.constructor = Asteroid;						


/**
 * CONSTRUCTOR
 *
 * @return {Asteroid}
 */
function Asteroid() 
{

	LevelPart.call(this);

	//--------------------
	//
	// 		MEMBERS
	//
	//----------------
	//
	//
	


	return this;
}

/**
 * CONSTRUCTOR that takes arguments
 * 
 * @param {float} 	_x 		Initial x
 * @param {float} 	_y 		Initial y
 * @param {float} 	_rot 	Initial rotation
 */
Asteroid.init = function(_x, _y, _rot)
{
	_x = typeof _x != 'undefined' ? _x : 0.0;
	_y = typeof _y != 'undefined' ? _y : 0.0;
	_rot = typeof _rot != 'undefined' ? _rot : 0.0;
	//
	var instance = new Asteroid();
	//
	instance.x = _x;
	instance.y = _y;
	instance.rotation = _rot;
	//
	instance.setImage("images/asteroid.png");

	return instance;
}






//-----------------------------------------------------------------------------//
/*
 *	Name: 		Core_
 * 	Abstract: 	NO
 * 	Superclass: LevelPart
 * 	Subclasses:	n/a
 * 	
 * 	Description: Core_ type
 * 	

																																										
METHODS:

																			
*/


Core_.prototype = Object.create( LevelPart.prototype );		
Core_.prototype.constructor = Core_;						


/**
 * CONSTRUCTOR
 *
 * @return {Core_}
 */
function Core_() 
{

	LevelPart.call(this);

	//--------------------
	//
	// 		MEMBERS
	//
	//----------------
	//
	//
	


	return this;
}

/**
 * CONSTRUCTOR that takes arguments
 * 
 * @param {float} 	_x 		Initial x
 * @param {float} 	_y 		Initial y
 * @param {float} 	_rot 	Initial rotation
 */
Core_.init = function(_x, _y, _rot)
{
	_x = typeof _x != 'undefined' ? _x : 0.0;
	_y = typeof _y != 'undefined' ? _y : 0.0;
	_rot = typeof _rot != 'undefined' ? _rot : 0.0;
	//
	var instance = new Core_();
	//
	instance.x = _x;
	instance.y = _y;
	instance.rotation = _rot;
	//
	instance.setImage("images/core.png");

	return instance;
}





//-----------------------------------------------------------------------------//
/*
 *	Name: 		Lens
 * 	Abstract: 	NO
 * 	Superclass: LevelPart
 * 	Subclasses:	n/a
 * 	
 * 	Description: Lens type
 * 	

																																										
METHODS:

																			
*/


Lens.prototype = Object.create( LevelPart.prototype );		
Lens.prototype.constructor = Lens;						


/**
 * CONSTRUCTOR
 *
 * @return {Lens}
 */
function Lens() 
{

	LevelPart.call(this);

	//--------------------
	//
	// 		MEMBERS
	//
	//----------------
	//
	//
	


	return this;
}

/**
 * CONSTRUCTOR that takes arguments
 * 
 * @param {float} 	_x 		Initial x
 * @param {float} 	_y 		Initial y
 * @param {float} 	_rot 	Initial rotation
 */
Lens.init = function(_x, _y, _rot)
{
	_x = typeof _x != 'undefined' ? _x : 0.0;
	_y = typeof _y != 'undefined' ? _y : 0.0;
	_rot = typeof _rot != 'undefined' ? _rot : 0.0;
	//
	var instance = new Lens();
	//
	instance.x = _x;
	instance.y = _y;
	instance.rotation = _rot;
	//
	instance.setImage("images/lens.png");

	return instance;
}





//-----------------------------------------------------------------------------//
/*
 *	Name: 		Lens2
 * 	Abstract: 	NO
 * 	Superclass: LevelPart
 * 	Subclasses:	n/a
 * 	
 * 	Description: Lens2 type
 * 	

																																										
METHODS:

																			
*/


Lens2.prototype = Object.create( LevelPart.prototype );		
Lens2.prototype.constructor = Lens2;						


/**
 * CONSTRUCTOR
 *
 * @return {Lens2}
 */
function Lens2() 
{

	LevelPart.call(this);

	//--------------------
	//
	// 		MEMBERS
	//
	//----------------
	//
	//
	


	return this;
}

/**
 * CONSTRUCTOR that takes arguments
 * 
 * @param {float} 	_x 		Initial x
 * @param {float} 	_y 		Initial y
 * @param {float} 	_rot 	Initial rotation
 */
Lens2.init = function(_x, _y, _rot)
{
	_x = typeof _x != 'undefined' ? _x : 0.0;
	_y = typeof _y != 'undefined' ? _y : 0.0;
	_rot = typeof _rot != 'undefined' ? _rot : 0.0;
	//
	var instance = new Lens2();
	//
	instance.x = _x;
	instance.y = _y;
	instance.rotation = _rot;
	//
	instance.setImage("images/lens2.png");

	return instance;
}





//-----------------------------------------------------------------------------//
/*
 *	Name: 		Lens3
 * 	Abstract: 	NO
 * 	Superclass: LevelPart
 * 	Subclasses:	n/a
 * 	
 * 	Description: Lens3 type
 * 	

																																										
METHODS:

																			
*/


Lens3.prototype = Object.create( LevelPart.prototype );		
Lens3.prototype.constructor = Lens3;						


/**
 * CONSTRUCTOR
 *
 * @return {Lens3}
 */
function Lens3() 
{

	LevelPart.call(this);

	//--------------------
	//
	// 		MEMBERS
	//
	//----------------
	//
	//
	


	return this;
}

/**
 * CONSTRUCTOR that takes arguments
 * 
 * @param {float} 	_x 		Initial x
 * @param {float} 	_y 		Initial y
 * @param {float} 	_rot 	Initial rotation
 */
Lens3.init = function(_x, _y, _rot)
{
	_x = typeof _x != 'undefined' ? _x : 0.0;
	_y = typeof _y != 'undefined' ? _y : 0.0;
	_rot = typeof _rot != 'undefined' ? _rot : 0.0;
	//
	var instance = new Lens3();
	//
	instance.x = _x;
	instance.y = _y;
	instance.rotation = _rot;
	//
	instance.setImage("images/lens3.png");

	return instance;
}





//-----------------------------------------------------------------------------//
/*
 *	Name: 		Mirror
 * 	Abstract: 	NO
 * 	Superclass: LevelPart
 * 	Subclasses:	n/a
 * 	
 * 	Description: Mirror type
 * 	

																																										
METHODS:

																			
*/


Mirror.prototype = Object.create( LevelPart.prototype );		
Mirror.prototype.constructor = Mirror;						


/**
 * CONSTRUCTOR
 *
 * @return {Mirror}
 */
function Mirror() 
{

	LevelPart.call(this);

	//--------------------
	//
	// 		MEMBERS
	//
	//----------------
	//
	//
	


	return this;
}

/**
 * CONSTRUCTOR that takes arguments
 * 
 * @param {float} 	_x 		Initial x
 * @param {float} 	_y 		Initial y
 * @param {float} 	_rot 	Initial rotation
 */
Mirror.init = function(_x, _y, _rot)
{
	_x = typeof _x != 'undefined' ? _x : 0.0;
	_y = typeof _y != 'undefined' ? _y : 0.0;
	_rot = typeof _rot != 'undefined' ? _rot : 0.0;
	//
	var instance = new Mirror();
	//
	instance.x = _x;
	instance.y = _y;
	instance.rotation = _rot;
	//
	instance.setImage("images/mirror.png");

	return instance;
}





//-----------------------------------------------------------------------------//
/*
 *	Name: 		Source
 * 	Abstract: 	NO
 * 	Superclass: LevelPart
 * 	Subclasses:	n/a
 * 	
 * 	Description: Source type
 * 	

																																										
METHODS:

																			
*/


Source.prototype = Object.create( LevelPart.prototype );		
Source.prototype.constructor = Source;						


/**
 * CONSTRUCTOR
 *
 * @return {Source}
 */
function Source() 
{

	LevelPart.call(this);

	//--------------------
	//
	// 		MEMBERS
	//
	//----------------
	//
	//
	


	return this;
}

/**
 * CONSTRUCTOR that takes arguments
 * 
 * @param {float} 	_x 		Initial x
 * @param {float} 	_y 		Initial y
 * @param {float} 	_rot 	Initial rotation
 */
Source.init = function(_x, _y, _rot)
{
	_x = typeof _x != 'undefined' ? _x : 0.0;
	_y = typeof _y != 'undefined' ? _y : 0.0;
	_rot = typeof _rot != 'undefined' ? _rot : 0.0;
	//
	var instance = new Source();
	//
	instance.x = _x;
	instance.y = _y;
	instance.rotation = _rot;
	//
	instance.setImage("images/source.png");

	return instance;
}





//-----------------------------------------------------------------------------//
/*
 *	Name: 		Wall
 * 	Abstract: 	NO
 * 	Superclass: LevelPart
 * 	Subclasses:	n/a
 * 	
 * 	Description: Wall type
 * 	

																																										
METHODS:

																			
*/


Wall.prototype = Object.create( LevelPart.prototype );		
Wall.prototype.constructor = Wall;						


/**
 * CONSTRUCTOR
 *
 * @return {Wall}
 */
function Wall() 
{

	LevelPart.call(this);

	//--------------------
	//
	// 		MEMBERS
	//
	//----------------
	//
	//
	


	return this;
}

/**
 * CONSTRUCTOR that takes arguments
 * 
 * @param {float} 	_x 		Initial x
 * @param {float} 	_y 		Initial y
 * @param {float} 	_rot 	Initial rotation
 */
Wall.init = function(_x, _y, _rot)
{
	_x = typeof _x != 'undefined' ? _x : 0.0;
	_y = typeof _y != 'undefined' ? _y : 0.0;
	_rot = typeof _rot != 'undefined' ? _rot : 0.0;
	//
	var instance = new Wall();
	//
	instance.x = _x;
	instance.y = _y;
	instance.rotation = _rot;
	//
	instance.setImage("images/wall.png");

	return instance;
}


