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

	this.tickCount = 0;

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
	
	resetFireButton(); // defined in input.js

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

OptiLevel.prototype.levelFailed = function(){
	
	if(this.levelCompleted()) return false;

	if(this.coresinks.length == 0) return false; // For level editor
	
	// Check cores to see if at least one is filled
	for (var i=0; i < this.cores.length; i++) {
		for (var j=0; j < this.cores[i].coreRings.length; j++)  {
			
			var ring = this.cores[i].coreRings[j];
			
			// Loop through ring's beam slots
			for (var k=0; k < ring.beamSlots.length; k++) { 
				var slot = ring.beamSlots[k];
				if (slot.filled) {
					return false;
				}
			}
		}
	}
	// Check for beams in flight
	if(this.lasers.length != 0) return false;
	
	// Level failed.
	return true;
}

OptiLevel.prototype.emitLasers = function() {
	for (var i=0; i < this.cores.length; i++) {
		this.cores[i].emitLasers();
	}
}

OptiLevel.prototype.resetCores = function() {
	for (var i=0; i < this.cores.length; i++) {
		for (var j=0; j < this.cores[i].coreRings.length; j++)  {
			
			var ring = this.cores[i].coreRings[j];
			
			ring.active = true;
			
			// Loop through ring's beam slots and reactivate them
			for (var k=0; k < ring.beamSlots.length; k++) { 
				var slot = ring.beamSlots[k];
				slot.filled = true;
			}
		}
	}
}

OptiLevel.prototype.resetSinks = function() {
	for (var i=0; i < this.coresinks.length; i++) {
		for (var j=0; j < this.coresinks[i].coreRings.length; j++)  {
			
			var ring = this.coresinks[i].coreRings[j];
			
			ring.active = false;
			
			// Loop through ring's beam slots and reactivate them
			for (var k=0; k < ring.beamSlots.length; k++) { 
				var slot = ring.beamSlots[k];
				slot.filled = false;
			}
		}
	}
}

OptiLevel.prototype.tick = function()
{
	this.tickCount++;
	/* Commented out by Erik on 4/10/2016
	if (this.levelCompleted()) {
		return;
	}
	*/
	
	if (this.levelFailed()) {
		// Reset everything
		resetFireButton();
		this.resetCores();
		this.resetSinks();
		
		// Play level failed
		lvlFailed_sound.currentTime = 0;
		lvlFailed_sound.play();
		//intro_song.pause();
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
	if(background){
		drawBitmapCenteredAtLocationWithRotation(background, canvas.width/2, canvas.height/2, 0);
	} else {
		colorRect(0,0,canvas.width,canvas.height, BACKGROUND_COLOR);
	}

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
	
	// Lenses (outlines)	
	for (var i=0; i < this.lenses.length; i++) {
		this.lenses[i].drawOutline();
	}
	
	// Cores
	for (var i=0; i < this.cores.length; i++) {
		this.cores[i].draw();
	}
	
	// Core Sinks
	for (var i=0; i < this.coresinks.length; i++) {
		// this.coresinks[i].draw();
		// Draw mineral over core
		var pos = this.coresinks[i].getPosition();
		var fakeAng = pos.x+pos.y; // just so they aren't all boring and upright

		if (this.coresinks[i].isFull()) {
			// Draw opened mineral at core position
			if(isBattleGraphicsLevel == false) {
			 	drawBitmapCenteredAtLocationWithRotation(mineral,pos.x,pos.y,fakeAng);
			 } else {
				if(this.coresinks[i].explFrame == undefined ||
					this.coresinks[i].explFrame == null) {
					this.coresinks[i].explFrame = 0;
				} else if(this.tickCount%5 == 0) { // sloewr animation for explosions, because awesome
					this.coresinks[i].explFrame++;
				}
				if(this.coresinks[i].explFrame < ENEMY_EXPL_FRAMES) {
					drawAnimCenteredAtLocationWithRotation(enemyExplosion,pos.x,pos.y,fakeAng,ctx,this.coresinks[i].explFrame);
				}		
			}	
		} else {
			// Draw unopened mineral at core position
			if(isBattleGraphicsLevel == false) {
				drawBitmapCenteredAtLocationWithRotation(mineral_rock,pos.x,pos.y,fakeAng);
			} else {
				drawBitmapCenteredAtLocationWithRotation(imgShipEnemyForGame,pos.x,pos.y,fakeAng);
			}
		}
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
	
	
	// --------------------------
	// Sound Effects and Messages
	// --------------------------
	
	if (this.levelCompleted()) {
		if(lvlFinished_sound.paused && !(intro_song.paused)){
			lvlFinished_sound.currentTime = 0;
			lvlFinished_sound.play();

			stopMusic();
		} else if (lvlFinished_sound.ended) {
			// Reset level pieces
			this.coresinks = []; // Temp solution
			
			// HERE MARCUS!!!!!!			
			
			// RETURN TO MAIN MENU
			//angular.element(document.getElementById('ctrl')).scope().goToCredits();
			leakMenu(); // added by cdeleon, abrupt but gets us back out of the game to pick levels
			
			changeSong(SONG_EERIE);

			//!!!!!!!!!!!!!!!!!!!
		}
	} 
	
	// --------------------------
	// Fire Button (defined in input.js)
	// --------------------------
	
	if(LevelEditor.active == false) {
		drawFireButton();
	}
	
	// --------------------------
	// Level Editor
	// --------------------------
	
	if(LevelEditor.active && LevelEditor.canEdit) {
		editorUpdate();
		if(LevelEditor.mouseOverButton != null) { 
			colorText(LevelEditor.mouseOverButton.tooltip, 15, 15, 'yellow');
		} else {
			colorText("Press E to Test Level, Esc for Main Menu", 15, 15, 'white');
		}
	} else if(LevelEditor.canEdit) {
		colorText("Press E to Toggle Editor", 15, 15, 'white');
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