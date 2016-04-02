
var levPartEnum = 0;
const NO_SELECTION = -1;
const LEVELPART_ASTEROID = (levPartEnum++);
const LEVELPART_CORE = (levPartEnum++);
const LEVELPART_LENS = (levPartEnum++);
const LEVELPART_LENS2 = (levPartEnum++);
const LEVELPART_LENS3 = (levPartEnum++);
const LEVELPART_MIRROR = (levPartEnum++);
const LEVELPART_SOURCE = (levPartEnum++);
const LEVELPART_WALL = (levPartEnum++);
const LEVELPART_DELETE = (levPartEnum++);
const LEVELPART_EXPORT = (levPartEnum++);
const LEVELPART_IMPORT = (levPartEnum++);
const LEVELPART_ENUM_KINDS = (levPartEnum++);

const BTN_SIZE = 40;



// Transformation scripts
LevelEditor.trScripts = {

	"none": function(_dx, _dy) {},
	"cornerGrab": function(_dx, _dy) {
		LevelEditor.bounds.x2 = mouseX;
		LevelEditor.bounds.y2 = mouseY;
		LevelEditor.bounds.w = LevelEditor.bounds.x2 - LevelEditor.bounds.x;
		LevelEditor.bounds.h = LevelEditor.bounds.y2 - LevelEditor.bounds.y;
		LevelEditor.refitUI();
	},
	"panelGrab": function(_dx, _dy) {
		LevelEditor.bounds.x += _dx
		LevelEditor.bounds.x2 += _dx
		LevelEditor.bounds.y += _dy;
		LevelEditor.bounds.y2 += _dy;
		LevelEditor.refitUI();
	},
	"possiblePieceGrab": function(_dx, _dy) {
		if(_dx != 0 || _dy != 0) {
			LevelEditor.trScript = LevelEditor.trScripts.pieceGrab;
			LevelEditor.trScript(_dx, _dy);
		}
	},
	"pieceGrab": function(_dx, _dy) {
		LevelEditor.selectedPiece.changePos(_dx, _dy);
	}, 
	"possiblePieceRotate": function(_dx, _dy) {
		if(_dx != 0 || _dy != 0) {
			LevelEditor.trScript = LevelEditor.trScripts.pieceRotate;
			LevelEditor.trScript(_dx, _dy);
		}
	},
	"pieceRotate": function(_dx, _dy) {

		var angle1 = Math.atan2( mouseY - LevelEditor.selectedPiece.bounds.centerY, 
								mouseX - LevelEditor.selectedPiece.bounds.centerX);
		var angle2 = Math.atan2( LevelEditor.lastMouseY - LevelEditor.selectedPiece.bounds.centerY, 
								 LevelEditor.lastMouseX - LevelEditor.selectedPiece.bounds.centerX);

		LevelEditor.selectedPiece.changeRotation(angle1-angle2);
	}

};





function editorUpdate() 
{
	LevelEditor.mousePositionUpdate();
	LevelEditor.drawLevelPieces();
	LevelEditor.drawInterface();
}



//-----------------------------------------------------------------------------//
/*
 *	(STATIC)
 *	Name: 		LevelEditor 
 * 	Description: Lets the user design and store levels
 * 	
																																										
	METHODS:

	setup		selectBrush

*/

function LevelEditor() {}

//--------------------
//
// 		MEMBERS
//
//----------------
//
//
LevelEditor.active = false;
LevelEditor.pieces = [];
//
// Location and dimensions
LevelEditor.bounds = {
	'x': 650.0,
	'y': 60.0,
	'w': 125.0,
	'h': 400.0,
	'x2': 0,
	'y2': 0
};
LevelEditor.bounds.x2 = LevelEditor.bounds.x + LevelEditor.bounds.w;
LevelEditor.bounds.y2 = LevelEditor.bounds.y + LevelEditor.bounds.h; 
//
// Style
LevelEditor.marginX = 15;
LevelEditor.marginY = 18;
LevelEditor.paddingX = 15;
LevelEditor.paddingY = 20;
LevelEditor.panelSenseZone = 5;
LevelEditor.cornerSize = 10;
//
// Buttons/Interactables
LevelEditor.LEButtons = [];
LevelEditor.miscButtons = [];
LevelEditor.corner = null;
LevelEditor.rotSymbol = null;
LevelEditor.plusSign = null;
LevelEditor.minusSign = null;
LevelEditor.mouseOverButton = null;
LevelEditor.mouseOverPieces = [];
LevelEditor.mouseOverIndex = 0;
LevelEditor.selectedBrush = null;
LevelEditor.selectedPiece = null;
// 
// States
LevelEditor.inPanel = false;
LevelEditor.overflow = false;
LevelEditor.settingRotation = false;
LevelEditor.deleting = false;
//
LevelEditor.lastMouseX = 0.0;
LevelEditor.lastMouseY = 0.0;

LevelEditor.tooltipText = "";
LevelEditor.trScript = LevelEditor.trScripts.none;


			




//--------------------
//
// 	  OPERATION
//
//----------------
//
//
LevelEditor.setup = function() {
	// Pieces
	for(var key in LevelEditor.buttonScripts) {
		var btn = LevelEditor.buttonScripts[key];
		LevelEditor.LEButtons.push(new Button(btn.command, levObjPics[btn.imagecode], btn.tooltip, 
												0.0, 0.0, BTN_SIZE, BTN_SIZE));
	}
	// Resizing-handle
	var tmpCanvas = document.createElement('canvas');
	var tmpCtx = tmpCanvas.getContext('2d');
	tmpCanvas.width = LevelEditor.cornerSize;
	tmpCanvas.height = LevelEditor.cornerSize;
	tmpCtx.fillStyle = "#505050";
	tmpCtx.fillRect(0,0,LevelEditor.cornerSize,LevelEditor.cornerSize);
	tmpCtx.strokeStyle = 'white';
	tmpCtx.strokeRect(0,0,LevelEditor.cornerSize,LevelEditor.cornerSize);
	LevelEditor.corner = new Button(function() {
		LevelEditor.trScript = LevelEditor.trScripts.cornerGrab;
	}, tmpCanvas, "resize panel");
	//
	// Misc UI
	LevelEditor.rotSymbol = new Button(null, LevelEditorRotSymbol);
	LevelEditor.rotSymbol.active = false;
	//
	LevelEditor.plusSign = new Button(function() {LevelEditor.selectedPiece.changeRotation(0.1);}, LevelEditorPlusSign, "rotate CW");
	LevelEditor.plusSign.active = false;
	LevelEditor.minusSign = new Button(function() {LevelEditor.selectedPiece.changeRotation(-0.1);}, LevelEditorMinusSign, "rotate CCW");
	LevelEditor.minusSign.active = false;
	LevelEditor.miscButtons.push(LevelEditor.plusSign);
	LevelEditor.miscButtons.push(LevelEditor.minusSign);
	//
	LevelEditor.refitUI();	
}
//
LevelEditor.toggle = function() {
	LevelEditor.active = !LevelEditor.active;
	LevelEditor.selectedPiece = null;
	if(LevelEditor.active) {
		var typesNotHandled = [].concat(currentLevel.lasers, currentLevel.blocks, currentLevel.mirrors, currentLevel.cores, currentLevel.coresinks, currentLevel.sprites);
		// Handled: currentLevel.lenses, TMP handled: currentLevel.beams
		currentLevel = new OptiLevel.init();
		currentLevel.addManyOpticsPieces(typesNotHandled);
	} else {
		for(var i in LevelEditor.pieces) {
			var piece = LevelEditor.pieces[i];
			if(piece.kind == "lens") {
				var points = make_points_lens_1(piece.bounds.centerX, piece.bounds.centerY, rad_to_deg(piece.rotation));
				currentLevel.addOpticsPiece(new Lens(points, 1.3, LENS_COLOR));
			}
		}

	}
}



//--------------------
//
// 	  EVENTS
//
//----------------
//
//
LevelEditor.mouseClicked = function(_evt) {
	LevelEditor.mouseDragStart();
	//
	if(LevelEditor.mouseOverButton != null && !LevelEditor.settingRotation) { 
		LevelEditor.mouseOverButton.onClick(_evt); 											// Clicked one of the buttons in the tool panel
	} else if(LevelEditor.inPanel) {
		LevelEditor.trScript = LevelEditor.trScripts.panelGrab;		// Clicked somewhere on the panel background
	} else if(LevelEditor.deleting) {
		editorDeleteNearestToMouse();
		if(!_evt.shiftKey) {
			LevelEditor.deleting = false;
			LevelEditor.selectedBrush = null;
		}
	} else if(LevelEditor.selectedBrush != null) {
		if(LevelEditor.settingRotation) {
			LevelEditor.pieces.push(LevelEditor.selectedBrush);
			//currentLevel.addOpticsPiece(LevelEditor.selectedBrush);
			LevelEditor.selectedBrush = null;
		}
		LevelEditor.settingRotation = !LevelEditor.settingRotation;
	} else if(LevelEditor.mouseOverPieces.length > 0) {
		if(LevelEditor.mouseOverIndex >= LevelEditor.mouseOverPieces.length) {
			LevelEditor.mouseOverIndex = 0;
		}
		var candidate = LevelEditor.mouseOverPieces[LevelEditor.mouseOverIndex++];
		if(LevelEditor.selectedPiece != candidate) {
			LevelEditor.selectedPiece = candidate;
			LevelEditor.minusSign.active = true;
			LevelEditor.plusSign.active = true;
			LevelEditor.rotSymbol.active = true;

		} else {
			LevelEditor.trScript = LevelEditor.trScripts.possiblePieceGrab;
		}
	} else if(LevelEditor.selectedPiece != null) {
		LevelEditor.trScript = LevelEditor.trScripts.possiblePieceRotate;
	}
}
//
LevelEditor.mousePositionUpdate = function() {
	LevelEditor.mouseOverButton = null;
	LevelEditor.mouseOverPieces = [];
	//
	// Check if mouse is over the editor panel
	var x2 = LevelEditor.bounds.x2 + LevelEditor.panelSenseZone;
	var y2 = LevelEditor.bounds.y2 + LevelEditor.panelSenseZone;
	var inBoundsX = mouseX > LevelEditor.bounds.x && mouseX < x2;
	var inBoundsY = mouseY > LevelEditor.bounds.y && mouseY < y2;
	LevelEditor.inPanel = inBoundsX && inBoundsY;
	if(LevelEditor.inPanel) { 	// Check resizing handle
		if(LevelEditor.corner.pointHit( mouseX, mouseY )) {
			LevelEditor.mouseOverButton = LevelEditor.corner;
			return;
		}
		//
		// Check the tool buttons
		for(var i=0; i < LevelEditor.LEButtons.length; i++) {
			if(LevelEditor.LEButtons[i].pointHit( mouseX, mouseY )) {
				LevelEditor.mouseOverButton = LevelEditor.LEButtons[i];
				return;
			}
		}
	} else {
		for(var i=0; i < LevelEditor.pieces.length; i++) {
			if(LevelEditor.pieces[i].pointHit( mouseX, mouseY )) {
				LevelEditor.mouseOverPieces.push(LevelEditor.pieces[i]);
			}
		}
		if(LevelEditor.mouseOverPieces.length == 0) {
			for(var i=0; i < LevelEditor.miscButtons.length; i++) {
				if(LevelEditor.miscButtons[i].pointHit( mouseX, mouseY )) {
					LevelEditor.mouseOverPieces.push(LevelEditor.miscButtons[i]);
					break;
				}
			}	
		}
		if(LevelEditor.mouseOverButton == null) {
			if(LevelEditor.minusSign.pointHit( mouseX, mouseY )) {
				LevelEditor.mouseOverButton = LevelEditor.minusSign;
			} else if(LevelEditor.plusSign.pointHit( mouseX, mouseY )) {
				LevelEditor.mouseOverButton = LevelEditor.plusSign;
			}
		}
	}
	//
	// Handle brush movement/rotation
	if(LevelEditor.selectedBrush != null) {
		if(LevelEditor.settingRotation) {
			LevelEditor.selectedBrush.updateRotation(Math.atan2( mouseY - LevelEditor.selectedBrush.bounds.centerY, 
															mouseX - LevelEditor.selectedBrush.bounds.centerX ));
		} else {
			LevelEditor.selectedBrush.updatePos(mouseX, mouseY);
		}
	}
	//
	// Call the transformationscript
	var deltaMouseX = mouseX - LevelEditor.lastMouseX;
	var deltaMouseY = mouseY - LevelEditor.lastMouseY;
	LevelEditor.trScript(deltaMouseX, deltaMouseY);
	//
	// Remember mouse movement
	LevelEditor.lastMouseX = mouseX;
	LevelEditor.lastMouseY = mouseY;
}



//-------------------------
//
// 	  MOUSE DRAGGING
//
//---------------------
//
//
LevelEditor.mouseDragStart = function() 
{
	canvas.addEventListener('mouseup', LevelEditor.mouseDragEnd);
}
//
LevelEditor.mouseDragEnd = function() 
{
	if(LevelEditor.trScript == LevelEditor.trScripts.possiblePieceGrab || LevelEditor.trScript == LevelEditor.trScripts.possiblePieceRotate) {
		LevelEditor.selectedPiece = null;
	}
	LevelEditor.trScript = LevelEditor.trScripts.none;
	canvas.removeEventListener('mouseup', LevelEditor.mouseDragEnd);
}
//
/**
 * Looks at the dimensions of the panel and fits in the buttons accordingly
 *
 */
LevelEditor.refitUI = function()
{
	// Cap panel xy to avoid leaving the canvas
	LevelEditor.bounds.x = Math.min(canvas.width-LevelEditor.marginX, LevelEditor.bounds.x);
	LevelEditor.bounds.y = Math.min(canvas.height-LevelEditor.marginY, LevelEditor.bounds.y);
	LevelEditor.bounds.x2 = LevelEditor.bounds.x + LevelEditor.bounds.w;
	LevelEditor.bounds.y2 = LevelEditor.bounds.y + LevelEditor.bounds.h;
	//
	// Figure what space we have to work with
	var x = LevelEditor.bounds.x + LevelEditor.marginX;
	var y = LevelEditor.bounds.y + LevelEditor.marginY;
	var spanX = LevelEditor.bounds.w - (LevelEditor.marginX);
	var columnSpacing = BTN_SIZE + LevelEditor.paddingX;
	var rowSpacing = BTN_SIZE + LevelEditor.paddingY;
	var rowCtr = Math.floor((LevelEditor.bounds.h-LevelEditor.marginY) / rowSpacing);
	var itemsPerRow = Math.floor(spanX / columnSpacing);
	// Start fitting the buttons
	for(var i=0; i < LevelEditor.LEButtons.length;) { 
		LevelEditor.LEButtons[i].updatePos(x,y);
		LevelEditor.LEButtons[i].active = rowCtr > 0;
		i++;
		if(i % itemsPerRow == 0) { 	// Skip to next row
			rowCtr--;
			x = LevelEditor.bounds.x + LevelEditor.marginX;
			y += rowSpacing;
		} else { 					// Skip to next column
			x += columnSpacing; 
		}
	}
	LevelEditor.overflow = rowCtr <= 0;
	// Snap resize handle to bottom right of panel
	LevelEditor.corner.updatePos(
		LevelEditor.bounds.x2-(LevelEditor.cornerSize/2), LevelEditor.bounds.y2-(LevelEditor.cornerSize/2));
}



//--------------------
//
// 	  DRAW
//
//----------------
//
//
LevelEditor.drawLevelPieces = function() {
	for(var p in LevelEditor.pieces) {
		LevelEditor.pieces[p].draw();
	}
}
//
LevelEditor.drawInterface = function() {
	// Background
	colorRect(LevelEditor.bounds.x, LevelEditor.bounds.y, LevelEditor.bounds.w,LevelEditor.bounds.h, 'grey');
	var panelStrokeColor = LevelEditor.trScript == LevelEditor.trScripts.cornerGrab ? "#00FFFF" : 'white';
	strokeRect(LevelEditor.bounds.x, LevelEditor.bounds.y, LevelEditor.bounds.w,LevelEditor.bounds.h, panelStrokeColor, 2);
	// Level Editing Buttons
	for(var i=0; i < LevelEditor.LEButtons.length; i++) {
		LevelEditor.LEButtons[i].draw();
	}
	// Resizing handle
	drawSimple(LevelEditor.corner);
	if(LevelEditor.overflow) { 	// Indicate overflow visually by adding "..." next to the handle
		var w = 5;
		var x = LevelEditor.corner.bounds.x - (w*6);
		for(var i=0; i < 3; i++) {
			colorRect(x, LevelEditor.corner.bounds.y, w, w, 'black');
			x += w*2;
		}
	}
	//
	if(LevelEditor.selectedPiece != null) {
		LevelEditor.selectedPiece.stroke();	
		var x = LevelEditor.selectedPiece.bounds.x;
		var y = LevelEditor.selectedPiece.bounds.y2 + 6;
		LevelEditor.minusSign.updatePos(x, y);
		x += LevelEditor.selectedPiece.bounds.w / 2.0;
		y += LevelEditor.minusSign.bounds.h / 2.0;
		LevelEditor.rotSymbol.updatePos(x, y);
		x += (LevelEditor.selectedPiece.bounds.w / 2.0) - LevelEditor.plusSign.bounds.w;
		y = LevelEditor.selectedPiece.bounds.y2 + 6;
		LevelEditor.plusSign.updatePos(x, y);
		LevelEditor.minusSign.draw();
		LevelEditor.rotSymbol.draw();
		LevelEditor.plusSign.draw();
	}
	//
	LevelEditor.mouseOverButton != null && LevelEditor.mouseOverButton.stroke('red', 2);
	LevelEditor.drawBrush();
	LevelEditor.refreshTooltip();
}
//
LevelEditor.drawBrush = function()
{
	if(LevelEditor.selectedBrush != null) { 
		!LevelEditor.settingRotation && LevelEditor.selectedBrush.updatePos(mouseX, mouseY);
		LevelEditor.selectedBrush.draw();
		//
		LevelEditor.settingRotation && colorLine(LevelEditor.selectedBrush.bounds.centerX, LevelEditor.selectedBrush.bounds.centerY, mouseX, mouseY, 'yellow', 3)
	}
}
//
LevelEditor.refreshTooltip = function()
{
	if(LevelEditor.mouseOverButton != null) {
		LevelEditor.tooltipText = LevelEditor.mouseOverButton.tooltip;	
	} else if(LevelEditor.selectedBrush == null) {
		LevelEditor.tooltipText = "select object from panel to place";	
	} else if(!LevelEditor.settingRotation) {
		LevelEditor.tooltipText = "click to place object, will be able to set rotation next";
	} else {
		LevelEditor.tooltipText = "click to set rotation of last placed object";
	}

	colorText(LevelEditor.tooltipText, 15, 15, 'white');
}



//--------------------
//
// 	HELPER TOOLS
//
//----------------
//
//
function distToMouse(fromX,fromY) {
	var dx = fromX - mouseX;
	var dy = fromY - mouseY;
	return Math.sqrt( dx*dx + dy*dy );
}
//
function editorDeleteNearestToMouse() {
	var closestIdx = NO_SELECTION;
	var closestDist = 999999.0;

	for(var i=LevelEditor.pieces.length-1;i>=0;i--) {
		var distTo = distToMouse( LevelEditor.pieces[i].bounds.x, LevelEditor.pieces[i].bounds.y )

		if(distTo < closestDist) {
			closestIdx = i;
			closestDist = distTo;
		}
	}

	if(closestIdx != NO_SELECTION) {
		LevelEditor.pieces.splice(closestIdx, 1);
	}
}
//
function SaveToTextfield() {
	levelText = document.getElementById('levelTextfield');
	levelText.value = JSON.stringify(LevelEditor.pieces);
	//levelText.value = currentLevel.toString();
}
//
function LoadTextfield() {
	LevelEditor.selectedPiece = null;
	LevelEditor.pieces = [];
	//currentLevel = OptiLevel.init();
	levelText = document.getElementById('levelTextfield');
	try {
        var pieces = JSON.parse(levelText.value);
        for(var i in pieces) {
        	var optic = null;
        	if(pieces[i].kind == "lens") {
        		var pointsData = LevelEditor.makePoints(make_points_lens_1);
				optic = new Lens(pointsData.points, 1.3, LENS_COLOR);
				optic.bounds = pointsData.bounds;
        	} else continue;
    		optic.updatePos(pieces[i].bounds.x, pieces[i].bounds.y, true);
			var lp = new LevelPiece(optic);
			lp.updateRotation(pieces[i].rotation);
			lp.refitBounds();
			LevelEditor.pieces.push(lp);
        }
    }catch(e){
        alert("invalid level data in text box below game");
        console.log(e);
    }
}




LevelEditor.makePoints = function(_maker) 
{
	var points = _maker(5,80,0);
	//
	// Find bounds
	var top = points[0].y;
	var left = points[0].x;
	var bottom = points[0].y;
	var right = points[0].x;
	for(var i in points) {
		top = Math.min(top, points[i].y);
		left = Math.min(left, points[i].x);
		bottom = Math.max(bottom, points[i].y);
		right = Math.max(right, points[i].x);
	}
	// Shift to top left aligned
	for(var i in points) {
		points[i].x -= left;
		points[i].y -= top;
	}
	bottom -= top;
	right -= left;

	return { 
		"points": points, 
		"bounds": {	
			"x":0, "y":0, 
			"x2":right, "y2":bottom,
			"centerX": right/2, "centerY": bottom/2, 
			"w":right, "h":bottom
		} 
	};
}



//----------------------------------------------------------------------------
//----------------------------------------------------------------------------


LevelEditor.buttonScripts = {

	/*
	"asteroid": {
		"index": 0,
		"tooltip": "asteroid",
		"imagecode": LEVELPART_ASTEROID,
		"command": function() {
			LevelEditor.selectBrush(Asteroid);
		}
	},
	"core": {
		"index": 1,
		"tooltip": "core",
		"imagecode": LEVELPART_CORE,
		"command": function() {
			LevelEditor.selectBrush(Core);
		}
	},
	"lens": {
		"index": 2,
		"tooltip": "lens",
		"imagecode": LEVELPART_LENS,
		"command": function() {
			LevelEditor.selectBrush(Lens_);
		}
	},
	"lens2": {
		"index": 3,
		"tooltip": "lens2",
		"imagecode": LEVELPART_LENS2,
		"command": function() {
			LevelEditor.selectBrush(Lens2);
		}
	},
	"lens3": {
		"index": 4,
		"tooltip": "lens3",
		"imagecode": LEVELPART_LENS3,
		"command": function() {
			LevelEditor.selectBrush(Lens3);
		}
	},
	"mirror": {
		"index": 5,
		"tooltip": "mirror",
		"imagecode": LEVELPART_MIRROR,
		"command": function() {
			LevelEditor.selectBrush(Mirror);
		}
	},
	"source": {
		"index": 6,
		"tooltip": "source",
		"imagecode": LEVELPART_SOURCE,
		"command": function() {
			LevelEditor.selectBrush(Source);
		}
	},
	"wall": {
		"index": 7,
		"tooltip": "wall",
		"imagecode": LEVELPART_WALL,
		"command": function() {
			LevelEditor.selectBrush(Wall);
		}
	},
	*/
	"lens": {
		"index": 0,
		"tooltip": "lens_1",
		"imagecode": LEVELPART_LENS,
		"command": function() {
			var pointsData = LevelEditor.makePoints(make_points_lens_1);
			var lens_1 = new Lens(pointsData.points, 1.3, LENS_COLOR);
			lens_1.bounds = pointsData.bounds;
			LevelEditor.selectedBrush = new LevelPiece(lens_1);
			LevelEditor.selectedBrush.refitBounds();
		}
	},
	/*
	"block": {
		"index": 1,
		"tooltip": "light blocking object",
		"imagecode": LEVELPART_ASTEROID,
		"command": function() {
			LevelEditor.selectedBrush = LevelEditor.createBlockPiece();
		}
	},
	*/
	"delete": {
		"index": 8,
		"tooltip": "click to delete nearest part (hold SHIFT to stay in delete mode)",
		"imagecode": LEVELPART_DELETE,
		"command": function() {
			LevelEditor.deleting = true;
			LevelEditor.selectedPiece = null;
			LevelEditor.selectedBrush = {
				"draw": function() {
					drawBitmapCenteredAtLocationWithRotation(levObjPics[LEVELPART_DELETE], mouseX, mouseY, 0.0);
				},
				"updatePos": function() {}
			};
		}
	},
	"export": {
		"index": 9,
		"tooltip": "click to update text below game to be current layout",
		"imagecode": LEVELPART_EXPORT,
		"command": SaveToTextfield
	},
	"import": {
		"index": 10,
		"tooltip": "click to load layout from text below the game",
		"imagecode": LEVELPART_IMPORT,
		"command": LoadTextfield
	}
};













//-----------------------------------------------------------------------------//
/*
 *	Name: 		LevelPiece
 * 	
 * 	Description: Placeholder for a future OpticsPiece
 * 																		
*/




LevelPiece.prototype = Object.create( Graphic.prototype );		
LevelPiece.prototype.constructor = LevelPiece;	



/**
 * CONSTRUCTOR
 *
 * @return {LevelPiece}
 */
function LevelPiece(_opticsPiece) 
{
	Graphic.call(this);
	this.bounds = _opticsPiece.bounds;

	//--------------------
	//
	// 		MEMBERS
	//
	//----------------
	//
	//
	this.selected = false;
	this.image = document.createElement('canvas');
	this.opticsPiece = _opticsPiece;
	this.kind = this.opticsPiece.kind;
	//
	
	var mainCtx = ctx;
	ctx = this.image.getContext('2d');
	this.image.width = this.bounds.w;
	this.image.height = this.bounds.h;
	//colorRect(0,0,this.bounds.w,this.bounds.h, "red");
	this.opticsPiece.draw();
	ctx = mainCtx;
	//
	return this;
}


LevelPiece.prototype.refitBounds = function()
{
	var maxDim = Math.max(this.bounds.w, this.bounds.h);
	this.bounds = {
		'x': this.bounds.x,
		'y': this.bounds.y,
		'x2': (this.bounds.x + maxDim),
		'y2': (this.bounds.y + maxDim),
		'centerX': (this.bounds.x + (maxDim/2.0)),
		'centerY': (this.bounds.y + (maxDim/2.0)),
		'w': maxDim,
		'h': maxDim,
	};
}




/**
 * Creates and returns a clone
 * 
 * @return {LevelPiece}
 */
LevelPiece.prototype.clone = function()
{
	
}


/**
 * Draw to global Canvas
 * 
 */
LevelPiece.prototype.draw = function() 
{ 
	drawBitmapCenteredAtLocationWithRotation(this.image, this.bounds.centerX, this.bounds.centerY, this.rotation);
};

