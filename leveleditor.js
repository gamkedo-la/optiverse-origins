
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
LevelEditor.mouseOverPiece = null;
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
	LevelEditor.rotSymbol = new Graphic(LevelEditorRotSymbol);
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
		// If we just entered editor mode, import current level data as editor data
		LevelEditor.pieces = editorLevel.pieces;
		for(var i in LevelEditor.pieces) {
			LevelEditor.pieces[i].stop();
		}
		if(LevelEditor.pieces.length > 0) {
			SaveToTextfield();
		}
		editorLevel = Level.init();
	} else {
		// If we just exited editor mode, use editor data to create new level
		editorLevel = Level.init(LevelEditor.pieces);
		LevelEditor.pieces = [];
		// Register mirrors
		// mirrors = [mirror1,mirror2,mirror3,mirror4];
		for(var i=0; i < editorLevel.pieces.length; i++) {
			if(editorLevel.pieces[i].constructor.name == 'Mirror') {
				mirrors.push(editorLevel.pieces[i].mirrorLine);
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
			LevelEditor.trScript = LevelEditor.trScripts.possiblePieceGrab;
		}
	} else if(LevelEditor.selectedPiece != null) {
		LevelEditor.trScript = LevelEditor.trScripts.possiblePieceRotate;
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
		var piece = LevelEditor.pieces[p];
		drawBitmapCenteredAtLocationWithRotation(levObjPics[piece.kind], piece.bounds.centerX, piece.bounds.centerY, piece.rotation);
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
	LevelEditor.pieces = [];
	LevelEditor.selectedPiece = null;
	try{
        var pData = JSON.parse(levelText.value);
        for(var i in pData) {
        	var className = Level.ClassRouter[pData[i].kind];
        	LevelEditor.pieces.push(new className.init( pData[i].bounds.x, pData[i].bounds.y, pData[i].rotation ));
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
			LevelEditor.selectedPiece = null;
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



