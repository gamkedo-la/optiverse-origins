
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
LevelEditor.mouseOverPiece = null;
LevelEditor.selectedBrush = null;
LevelEditor.selectedPiece = null;
LevelEditor.grabbedPiece = null;
// 
// States
LevelEditor.inPanel = false;
LevelEditor.panelGrab = false;
LevelEditor.cornerGrab = false;
LevelEditor.overflow = false;
LevelEditor.settingRotation = false;
LevelEditor.deleting = false;
//
LevelEditor.lastMouseX = 0.0;
LevelEditor.lastMouseY = 0.0;

LevelEditor.tooltipText = "";


			




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
	LevelEditor.corner = new Button(LevelEditor.resizePanelStart, tmpCanvas, "resize panel");
	//
	// Misc UI
	var rotSymbol_image = new Image();
	rotSymbol_image.src = "images/symbolRot.png";
	LevelEditor.rotSymbol = new Graphic(rotSymbol_image);
	LevelEditor.rotSymbol.active = false;
	//
	var plusSign_image = new Image();
	plusSign_image.src = "images/btn_plussign.png";
	var minusSign_image = new Image();
	minusSign_image.src = "images/btn_minussign.png";
	LevelEditor.plusSign = new Button(function() {LevelEditor.selectedPiece.changeRotation(0.1);}, plusSign_image, "rotate CW");
	LevelEditor.plusSign.active = false;
	LevelEditor.minusSign = new Button(function() {LevelEditor.selectedPiece.changeRotation(-0.1);}, minusSign_image, "rotate CCW");
	LevelEditor.minusSign.active = false;
	LevelEditor.miscButtons.push(LevelEditor.plusSign);
	LevelEditor.miscButtons.push(LevelEditor.minusSign);
	//
	LevelEditor.refitUI();	
}
//
LevelEditor.toggle = function() {
	LevelEditor.active = !LevelEditor.active;
	if(LevelEditor.active) {
		// If we just entered editor mode, import current level data as editor data
		LevelEditor.pieces = currentLevel.pieces;
		for(var i in LevelEditor.pieces) {
			LevelEditor.pieces[i].stop();
		}
		if(LevelEditor.pieces.length > 0) {
			SaveToTextfield();
		}
		currentLevel = Level.init();
	} else {
		// If we just exited editor mode, use editor data to create new level
		currentLevel = Level.init(LevelEditor.pieces);
		LevelEditor.pieces = [];
		// Register mirrors
		mirrors = [mirror1,mirror2,mirror3,mirror4];
		for(var i=0; i < currentLevel.pieces.length; i++) {
			if(currentLevel.pieces[i].constructor.name == 'Mirror') {
				mirrors.push(currentLevel.pieces[i].mirrorLine);
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
LevelEditor.selectBrush = function(_partClass) 
{
	LevelEditor.selectedBrush = new _partClass.init();
	LevelEditor.selectedBrush.updatePos(mouseX, mouseY);
}
//
LevelEditor.mouseClicked = function(_evt) {
	if(LevelEditor.mouseOverButton != null && !LevelEditor.settingRotation) { 
		LevelEditor.mouseOverButton.onClick(_evt); 		// Clicked one of the buttons in the tool panel
	} else if(LevelEditor.inPanel) {
		LevelEditor.movePanelStart();					// Clicked somewhere on the panel background
	} else if(LevelEditor.deleting) {
		editorDeleteNearestToMouse();
		if(!_evt.shiftKey) {
			LevelEditor.deleting = false;
			LevelEditor.selectedBrush = null;
		}
	} else if(LevelEditor.selectedBrush != null){
		if(LevelEditor.settingRotation) {
			LevelEditor.pieces.push(LevelEditor.selectedBrush.clone());
			if(!_evt.shiftKey) {
				LevelEditor.selectedBrush = null;
			}
		}
		LevelEditor.settingRotation = !LevelEditor.settingRotation;
	} else if(LevelEditor.mouseOverPiece != null) {
		if(LevelEditor.selectedPiece != LevelEditor.mouseOverPiece) {
			LevelEditor.selectedPiece = LevelEditor.mouseOverPiece;
			LevelEditor.minusSign.active = true;
			LevelEditor.plusSign.active = true;
			LevelEditor.rotSymbol.active = true;
		} else {
			LevelEditor.movePieceStart(LevelEditor.selectedPiece);
		}
	} else {
		LevelEditor.selectedPiece = null;
		LevelEditor.minusSign.active = false;
		LevelEditor.plusSign.active = false;
		LevelEditor.rotSymbol.active = false;
	}
}
//
LevelEditor.mousePositionUpdate = function() {
	LevelEditor.mouseOverButton = null;
	LevelEditor.mouseOverPiece = null;
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
				LevelEditor.mouseOverPiece = LevelEditor.pieces[i];
				break;
			}
		}
		if(LevelEditor.mouseOverPiece == null) {
			for(var i=0; i < LevelEditor.miscButtons.length; i++) {
				if(LevelEditor.miscButtons[i].pointHit( mouseX, mouseY )) {
					LevelEditor.mouseOverPiece = LevelEditor.miscButtons[i];
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
	//
	var deltaMouseX = mouseX - LevelEditor.lastMouseX;
	var deltaMouseY = mouseY - LevelEditor.lastMouseY;
	if(LevelEditor.grabbedPiece != null) {
		LevelEditor.grabbedPiece.changePos(deltaMouseX, deltaMouseY);
	}
	//
	if(LevelEditor.cornerGrab) {			// Handle panel resize if ongoing
		LevelEditor.bounds.x2 = mouseX;
		LevelEditor.bounds.y2 = mouseY;
		LevelEditor.bounds.w = LevelEditor.bounds.x2 - LevelEditor.bounds.x;
		LevelEditor.bounds.h = LevelEditor.bounds.y2 - LevelEditor.bounds.y;
		//
		LevelEditor.refitUI();
	} else if(LevelEditor.panelGrab) {		// Handle panel repositioning if ongoing
		LevelEditor.bounds.x += deltaMouseX
		LevelEditor.bounds.x2 += deltaMouseX
		LevelEditor.bounds.y += deltaMouseY;
		LevelEditor.bounds.y2 += deltaMouseY;
		//
		LevelEditor.refitUI();
	}
	//
	//
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
LevelEditor.movePanelStart = function() 
{
	LevelEditor.lastMouseX = mouseX;
	LevelEditor.lastMouseY = mouseY;
	//
	LevelEditor.panelGrab = true;
	canvas.addEventListener('mouseup', LevelEditor.movePanelEnd);
}
//
LevelEditor.movePanelEnd = function() 
{
	LevelEditor.panelGrab = false;
	canvas.removeEventListener('mouseup', LevelEditor.movePanelEnd);
}
//
LevelEditor.resizePanelStart = function() 
{
	LevelEditor.cornerGrab = true;
	canvas.addEventListener('mouseup', LevelEditor.resizePanelEnd);
}
//
LevelEditor.resizePanelEnd = function() 
{
	LevelEditor.cornerGrab = false;
	canvas.removeEventListener('mouseup', LevelEditor.resizePanelEnd);
}
//
LevelEditor.movePieceStart = function(_piece) 
{
	LevelEditor.lastMouseX = mouseX;
	LevelEditor.lastMouseY = mouseY;
	//
	LevelEditor.grabbedPiece = _piece;
	canvas.addEventListener('mouseup', LevelEditor.movePieceEnd);
}
//
LevelEditor.movePieceEnd = function() 
{
	LevelEditor.grabbedPiece = null;
	canvas.removeEventListener('mouseup', LevelEditor.movePieceEnd);
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
		var piece = LevelEditor.pieces[p];
		drawBitmapCenteredAtLocationWithRotation(levObjPics[piece.kind], piece.bounds.centerX, piece.bounds.centerY, piece.rotation);
	}
}
//
LevelEditor.drawInterface = function() {
	// Background
	colorRect(LevelEditor.bounds.x, LevelEditor.bounds.y, LevelEditor.bounds.w,LevelEditor.bounds.h, 'grey');
	var panelStrokeColor = LevelEditor.cornerGrab ? "#00FFFF" : 'white';
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
		drawBitmapCenteredAtLocationWithRotation(LevelEditor.selectedBrush.image,
			LevelEditor.selectedBrush.bounds.centerX, LevelEditor.selectedBrush.bounds.centerY, LevelEditor.selectedBrush.rotation);
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
		LevelEditor.tooltipText = "click to set rotation of last placed object (hold SHIFT to if you want to place more)";
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
}
//
function LoadTextfield() {
	levelText = document.getElementById('levelTextfield');
	try{
        var pData = JSON.parse(levelText.value);
        for(var i in pData) {
        	var className = Level.ClassRouter[pData[i].kind];
        	LevelEditor.pieces.push(new className.init( pData[i].x, pData[i].y, pData[i].rotation ));
        }
    }catch(e){
        alert("invalid level data in text box below game");
    }
}








//----------------------------------------------------------------------------
//----------------------------------------------------------------------------


LevelEditor.buttonScripts = {
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
	"delete": {
		"index": 8,
		"tooltip": "click to delete nearest part (hold SHIFT to stay in delete mode)",
		"imagecode": LEVELPART_DELETE,
		"command": function() {
			LevelEditor.deleting = true;
			LevelEditor.selectedBrush = new Graphic(levObjPics[LEVELPART_DELETE]);
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



