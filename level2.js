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

	this.beams = [];   //1
	this.lasers = [];  //2
	this.blocks = [];  //3
	this.mirrors = []; //4
	this.lenses = [];  //5
	this.cores = [];   //6
	

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

OptiLevel.addOpticsPiece = function(piece)
{
	if(piece.type == "beam") {
	} else if (piece.type == "laser") {
	} else if (piece.type == "block") {
	} else if (piece.type == "mirror") {
	} else if (piece.type == "lens") {
	} else if (piece.type == "core") {
	} else if (piece.type == "other") {
	} else {
		console.log("Unrecognized OpticsPiece type: ", piece);
	}
}

OptiLevel.tick = function()
{
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


OptiLevel.draw = function()
{
	// Loop through all level pieces and call their draw function
	// (Take this from main.js)
}