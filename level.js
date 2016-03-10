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
	this.editorPartsDescr = [];

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
	//
	instance.editorPartsDescr = _partsDescr;

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


/**
 * Get the original JSON code from the level editor
 * 
 */
Level.prototype.getJSON = function() 
{ 
	return this.editorPartsDescr;
};




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
LevelPart.init = function(_imgSrc, _x, _y, _rot, _instance)
{
	_x = typeof _x != 'undefined' ? _x : 0.0;
	_y = typeof _y != 'undefined' ? _y : 0.0;
	_rot = typeof _rot != 'undefined' ? _rot : 0.0;
	_instance = typeof _instance != 'undefined' ? _instance : new LevelPart();
	//
	_instance.x = _x;
	_instance.y = _y;
	_instance.rotation = _rot;
	//
	_instance.setImage(_imgSrc);

	return _instance;
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
	var instance = new Asteroid();
	var imageName = "images/asteroid.png";
	//
	LevelPart.init.call(this, imageName, _x, _y, _rot, instance);

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
	var instance = new Core_();
	var imageName = "images/core.png";
	//
	LevelPart.init.call(this, imageName, _x, _y, _rot, instance);

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
	var instance = new Lens();
	var imageName = "images/lens.png";
	//
	LevelPart.init.call(this, imageName, _x, _y, _rot, instance);

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
	var instance = new Lens2();
	var imageName = "images/lens2.png";
	//
	LevelPart.init.call(this, imageName, _x, _y, _rot, instance);

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
	var instance = new Lens3();
	var imageName = "images/lens3.png";
	//
	LevelPart.init.call(this, imageName, _x, _y, _rot, instance);

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
	var instance = new Mirror();
	var imageName = "images/mirror.png";
	//
	LevelPart.init.call(this, imageName, _x, _y, _rot, instance);

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
	var instance = new Source();
	var imageName = "images/source.png";
	//
	LevelPart.init.call(this, imageName, _x, _y, _rot, instance);

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
	var instance = new Wall();
	var imageName = "images/wall.png";
	//
	LevelPart.init.call(this, imageName, _x, _y, _rot, instance);

	return instance;
}


