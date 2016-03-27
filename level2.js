//-----------------------------------------------------------------------------//
/*
 *	Name: 		OptiLevel
 * 	Abstract: 	NO
 * 	Superclass:	n/a
 * 	Subclasses:	n/a
 * 	
 * 	Description: Describes a level object
 * 				
*/


/**
 * CONSTRUCTOR
 *
 * @return {OptiLevel}
 */
function OptiLevel() 
{

	//--------------------
	// MEMBERS
	//--------------------

	this.mirrors = []; 
	this.blocks = []; 
	this.lenses = [];
	this.cores = []; 
	this.beams = []; 
	this.lasers = []; 

	return this;
}


/**
 * CONSTRUCTOR that takes arguments
 * 
 * @param {array} 	_pieces		Array of parts from the Level Editor
 */
OptiLevel.init = function(_pieces)
{
	_pieces = typeof _pieces != 'undefined' ? _pieces : [];
	//
	var instance = new OptiLevel();
	
	instance.pieces = _pieces;
	return instance;
}

OptiLevel.tick = function()
{
	// Loop through all level pieces and call their update function
	// (Take this from main.js)
}

OptiLevel.addOpticsPiece = function(piece)
{
	if()
}


OptiLevel.draw = function()
{
	// Loop through all level pieces and call their draw function
	// (Take this from main.js)
}