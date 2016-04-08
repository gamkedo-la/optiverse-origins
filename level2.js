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

	this.beams = [];   
	this.lasers = [];  
	this.blocks = [];  
	this.mirrors = []; 
	this.lenses = [];  
	this.cores = []; 
	this.coresinks = [];   
	this.sprites = [];
	

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

OptiLevel.prototype.addOpticsPiece = function(piece)
{
	if(piece.kind == "beam") {
		this.beams.push(piece);
	} else if (piece.kind == "laser") {
		this.lasers.push(piece);
	} else if (piece.kind == "block") {
		this.blocks.push(piece);
	} else if (piece.kind == "mirror") {
		this.mirrors.push(piece);
	} else if (piece.kind == "lens") {
		this.lenses.push(piece);
	} else if (piece.kind == "core") {
		this.cores.push(piece);
	} else if (piece.kind == "sink") {
		this.coresinks.push(piece);
	} else if (piece.kind == "sprites") {
		this.sprites.push(piece);
	} else {
		console.log("Unrecognized OpticsPiece kind: ", piece.kind);
		console.log("for Optics element: ", piece);
		return;
	}
}

OptiLevel.prototype.addManyOpticsPieces = function(pieces)
{
	for (var i=0; i < pieces.length; i++ ) {
		this.addOpticsPiece(pieces[i]);
	}
}

OptiLevel.prototype.removeOpticsPiece = function(piece)
{
	var arr, index = null;
	
	// Find correct list
	if(piece.kind == "beam") {
		arr = this.beams;
	} else if (piece.kind == "laser") {
		arr = this.lasers;
	} else if (piece.kind == "block") {
		arr = this.blocks;
	} else if (piece.kind == "mirror") {
		arr = this.mirrors;
	} else if (piece.kind == "lens") {
		arr = this.lenses;
	} else if (piece.kind == "core") {
		arr = this.cores;
	} else if (piece.kind == "sprites") {
		arr = this.sprites;
	} else {
		console.log("Unrecognized OpticsPiece kind: ", piece.kind);
		console.log("for Optics element: ", piece);
		return;
	}
	
	// Find index of piece
	for (var i=0; i < arr.length; i++) {
		if (arr[i] == piece) {
			index = i
			break;
		}
	}
	
	// Remove piece from array
	if (index) {
		arr.splice(index, 1);
	} else {
		console.log("Could not remove OpticsPiece, not in OptiLevel arrays: ", piece);
	}
}

OptiLevel.prototype.levelCompleted = function(){
	if(this.coresinks.length == 0) return false; // Added by Andreas while testing level editor
	for (var i=0; i < this.coresinks.length; i++) {
		for (var j=0; j < this.coresinks[i].coreRings.length; j++)  {
			
			var ring = this.coresinks[i].coreRings[j];
			
			// Loop through ring's beam slots
			for (var k=0; k < ring.beamSlots.length; k++) { 
				var slot = ring.beamSlots[k];
				if (!slot.filled) {
					return false;
				}
			}
		}
	}
	return true;
}

OptiLevel.prototype.tick = function()
{

	if (this.levelCompleted()) {
		return;
	}
	
	// ---------------------
	// Level parts
	// ---------------------
	for (var i=0; i < this.pieces.length; i++) {
		currentLevel.pieces[i].update();
	}

	// ---------------------
	// Beams
	// ---------------------
	//
	// Update all beams and check if they have expired
	
	// Beams
	for (var i = this.beams.length-1; i >= 0; i--) {
		var beam = this.beams[i];
		
		beam.updatePiece();
		
		if (beam.expired()) {
			this.beams.splice(i, 1);
		}
	}
	
	// LaserBeams
	for (var i = this.lasers.length-1; i >= 0; i--) {
		var laser = this.lasers[i];
		
		laser.updatePiece();
		
		if (laser.expired()) {
			this.lasers.splice(i, 1);
		}
	}
	
	
	// ---------------------
	// CORES
	// ---------------------
	// update core rings
	for (var i=0; i < this.cores.length; i++) {
		this.cores[i].updatePiece();
	}
}


OptiLevel.prototype.draw = function()
{
	// next line blanks out the screen with black
	colorRect(0,0,canvas.width,canvas.height, BACKGROUND_COLOR);
	colorRect(0,0,canvas.width,canvas.height, BACKGROUND_COLOR, Cutctx);

	openingSequenceHandler();
	if( isOpeningBlockingGameplay() ) {
		return; // skip other gameplay stuff for now if doing opening
	}

	// Level pieces
	for (var i=0; i < editorLevel.pieces.length; i++) {
		editorLevel.pieces[i].draw();
	}
	
	// Blocks	
	for (var i=0; i < this.blocks.length; i++) {
		this.blocks[i].draw();
	}	
	
	// Lenses	
	for (var i=0; i < this.lenses.length; i++) {
		this.lenses[i].draw();
	}	
	
	// Cores
	for (var i=0; i < this.cores.length; i++) {
		this.cores[i].draw();
	}
	
	// Core Sinks
	for (var i=0; i < this.coresinks.length; i++) {
		this.coresinks[i].draw();
	}
	
	// Beams
	for (var i=0; i < this.beams.length; i++) {
		this.beams[i].draw();
	}
	
	// LaserBeams
	for (var i=0; i < this.lasers.length; i++) {
		this.lasers[i].draw();
	}
	
	// Mirrors

	for (var i=0; i < this.mirrors.length; i++) {
		this.mirrors[i].draw();
	}
	
	
	if (this.levelCompleted()) {
		colorText("LEVEL COMPLETED!!!", 15, 15, 'white');
	} 
	else if(LevelEditor.active) {
		editorUpdate();
	} else {
		colorText("Press E to toggle editor (export to text box at the bottom)", 15, 15, 'white');
	}
	
	
	

}



OptiLevel.prototype.toString = function()
{
	var collection = [];
	/*
	for(var i in this.beams) {
		collection.push(JSON.stringify(this.beams[i]));
	}
	*/
	for(var i in this.lasers) {
		collection.push(JSON.stringify(this.lasers[i]));
	}
	for(var i in this.blocks) {
		collection.push(JSON.stringify(this.blocks[i]));
	}
	for(var i in this.mirrors) {
		collection.push(JSON.stringify(this.mirrors[i]));
	}
	for(var i in this.lenses) {
		collection.push(JSON.stringify(this.lenses[i]));
	}
	for(var i in this.cores) {
		collection.push(JSON.stringify(this.cores[i]));
	}
	for(var i in this.coresinks) {
		collection.push(JSON.stringify(this.coresinks[i]));
	}
	for(var i in this.sprites) {
		collection.push(JSON.stringify(this.sprites[i]));
	}
	//
	return "[" + collection.join() + "]";
}