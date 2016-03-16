
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
LevelEditor.corner = null;
LevelEditor.mouseOverItem = null;
LevelEditor.selectedBrush = null;
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
		LevelEditor.LEButtons.push(new LEButton(0.0, 0.0, BTN_SIZE, BTN_SIZE, 
			levObjPics[btn.imagecode], btn.command, btn.tooltip));
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
	LevelEditor.corner = new LEButton(0.0, 0.0, LevelEditor.cornerSize,LevelEditor.cornerSize, 
		tmpCanvas, LevelEditor.resizeStart, "resize panel");
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
		mirrors = [mirror2,mirror4]; //[mirror1,mirror2,mirror3,mirror4];
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
	LevelEditor.selectedBrush = new _partClass.init(mouseX, mouseY, 0.0);
}
//
LevelEditor.mouseClicked = function(evt) {
	if(LevelEditor.mouseOverItem != null && !LevelEditor.settingRotation) {
		LevelEditor.mouseOverItem.onClick();
	} else if(LevelEditor.inPanel) {
		LevelEditor.moveStart();
	} else if(LevelEditor.selectedBrush != null && LevelEditor.deleting) {
		editorDeleteNearestToMouse();
		if(!evt.shiftKey) {
			LevelEditor.deleting = false;
			LevelEditor.selectedBrush = null;
		}
	} else {
		if(LevelEditor.settingRotation) {
			LevelEditor.pieces.push(LevelEditor.selectedBrush.clone());
			if(!evt.shiftKey) {
				LevelEditor.selectedBrush = null;
			}
		}
		LevelEditor.settingRotation = !LevelEditor.settingRotation;
	}
}
//
LevelEditor.mousePositionUpdate = function() {
	LevelEditor.mouseOverItem = null;
	//
	var x2 = LevelEditor.bounds.x2 + LevelEditor.panelSenseZone;
	var y2 = LevelEditor.bounds.y2 + LevelEditor.panelSenseZone;
	var inBoundsX = mouseX > LevelEditor.bounds.x && mouseX < x2;
	var inBoundsY = mouseY > LevelEditor.bounds.y && mouseY < y2;
	LevelEditor.inPanel = inBoundsX && inBoundsY;
	if(LevelEditor.inPanel) {
		if(LevelEditor.corner.pointHit( mouseX, mouseY )) {
			LevelEditor.mouseOverItem = LevelEditor.corner;
			return;
		}
		for(var i=0; i < LevelEditor.LEButtons.length; i++) {
			if(LevelEditor.LEButtons[i].pointHit( mouseX, mouseY )) {
				LevelEditor.mouseOverItem = LevelEditor.LEButtons[i];
				return;
			}
		}
	}
	//
	if(LevelEditor.selectedBrush != null) {
		if(LevelEditor.settingRotation) {
			LevelEditor.selectedBrush.rotation = Math.atan2(mouseY - LevelEditor.selectedBrush.y, 
															mouseX - LevelEditor.selectedBrush.x);
		} else {
			LevelEditor.selectedBrush.x = mouseX;
			LevelEditor.selectedBrush.y = mouseY;
		}
	}
	//
	if(LevelEditor.cornerGrab) {
		LevelEditor.bounds.x2 = mouseX;
		LevelEditor.bounds.y2 = mouseY;
		LevelEditor.bounds.w = LevelEditor.bounds.x2 - LevelEditor.bounds.x;
		LevelEditor.bounds.h = LevelEditor.bounds.y2 - LevelEditor.bounds.y;
		//
		LevelEditor.refitUI();
	} else if(LevelEditor.panelGrab) {
		LevelEditor.bounds.x += mouseX - LevelEditor.lastMouseX;
		LevelEditor.bounds.x2 += mouseX - LevelEditor.lastMouseX;
		LevelEditor.bounds.y += mouseY - LevelEditor.lastMouseY;
		LevelEditor.bounds.y2 += mouseY - LevelEditor.lastMouseY;
		//
		LevelEditor.refitUI();
	}
	//
	//
	LevelEditor.lastMouseX = mouseX;
	LevelEditor.lastMouseY = mouseY;
}



//--------------------
//
// 	  BOUNDS
//
//----------------
//
//
LevelEditor.moveStart = function() 
{
	LevelEditor.lastMouseX = mouseX;
	LevelEditor.lastMouseY = mouseY;
	//
	LevelEditor.panelGrab = true;
	canvas.addEventListener('mouseup', LevelEditor.moveEnd);
}
//
LevelEditor.moveEnd = function() 
{
	LevelEditor.panelGrab = false;
	canvas.removeEventListener('mouseup', LevelEditor.moveEnd);
}
//
LevelEditor.resizeStart = function() 
{
	LevelEditor.cornerGrab = true;
	canvas.addEventListener('mouseup', LevelEditor.resizeEnd);
}
//
LevelEditor.resizeEnd = function() 
{
	LevelEditor.cornerGrab = false;
	canvas.removeEventListener('mouseup', LevelEditor.resizeEnd);
}
//
LevelEditor.refitUI = function()
{
	// Cap panel xy
	LevelEditor.bounds.x = Math.min(canvas.width-LevelEditor.marginX, LevelEditor.bounds.x);
	LevelEditor.bounds.y = Math.min(canvas.height-LevelEditor.marginY, LevelEditor.bounds.y);
	LevelEditor.bounds.x2 = LevelEditor.bounds.x + LevelEditor.bounds.w;
	LevelEditor.bounds.y2 = LevelEditor.bounds.y + LevelEditor.bounds.h;
	//
	var x = LevelEditor.bounds.x + LevelEditor.marginX;
	var y = LevelEditor.bounds.y + LevelEditor.marginY;
	var spanX = LevelEditor.bounds.w - (LevelEditor.marginX);
	var columnSpacing = BTN_SIZE + LevelEditor.paddingX;
	var rowSpacing = BTN_SIZE + LevelEditor.paddingY;
	var rowCtr = Math.floor((LevelEditor.bounds.h-LevelEditor.marginY) / rowSpacing);
	var itemsPerRow = Math.floor(spanX / columnSpacing);
	for(var i=0; i < LevelEditor.LEButtons.length;) { 
		LevelEditor.LEButtons[i].updatePos(x,y);
		LevelEditor.LEButtons[i].active = rowCtr > 0;
		i++;
		if(i % itemsPerRow == 0) {
			rowCtr--;
			x = LevelEditor.bounds.x + LevelEditor.marginX;
			y += rowSpacing;
		} else {
			x += columnSpacing;
		}
	}
	LevelEditor.overflow = rowCtr <= 0;
	//
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
		drawBitmapCenteredAtLocationWithRotation(levObjPics[piece.kind], piece.x, piece.y, piece.rotation);
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
		LevelEditor.LEButtons[i].redraw();
	}
	// Resizing
	drawSimple(LevelEditor.corner);
	if(LevelEditor.overflow) {
		var w = 5;
		var x = LevelEditor.corner.bounds.x - (w*6);
		for(var i=0; i < 3; i++) {
			colorRect(x, LevelEditor.corner.bounds.y, w, w, 'black');
			x += w*2;
		}
	}
	// 
	LevelEditor.mouseOverItem && LevelEditor.mouseOverItem.stroke('red', 2);
	LevelEditor.drawBrush();
	LevelEditor.refreshTooltip();
}
//
LevelEditor.drawBrush = function()
{
	if(LevelEditor.selectedBrush != null) { 
		drawBitmapCenteredAtLocationWithRotation(levObjPics[LevelEditor.selectedBrush.kind],
			LevelEditor.selectedBrush.x, LevelEditor.selectedBrush.y, LevelEditor.selectedBrush.rotation);
		//
		LevelEditor.settingRotation && colorLine(LevelEditor.selectedBrush.x, LevelEditor.selectedBrush.y, mouseX, mouseY, 'yellow', 3)
	}
}
//
LevelEditor.refreshTooltip = function()
{
	if(LevelEditor.mouseOverItem != null) {
		LevelEditor.tooltipText = LevelEditor.mouseOverItem.tooltip;	
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
		var distTo = distToMouse( LevelEditor.pieces[i].x, LevelEditor.pieces[i].y )

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
        //LevelEditor.pieces = [];
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
			LevelEditor.selectBrush(Lens);
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
			LevelEditor.selectedBrush = {"x":0.0, "y":0.0, "rotation":0.0, "kind":LEVELPART_DELETE};
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
 *	Name: 		LEButton
 * 	Abstract: 	NO
 * 	Superclass: n/a
 * 	Subclasses:	n/a
 * 	
 * 	Description: A button on the level editor panel
 * 	
																																										
	METHODS:

	pointHit	stroke
				redraw

*/



/**
 * CONSTRUCTOR
 *
 * @return {LEButton}
 */
function LEButton(_x, _y, _w, _h, _img, _onclick, _tooltip) {
	this.bounds = {
		'x': _x,
		'y': _y,
		'x2': (_x + _w),
		'y2': (_y + _h),
		'w': _w,
		'h': _h,
	};
	this.image = _img;
	this.onClick = _onclick;
	this.tooltip = _tooltip;
	this.active = true;
	return this;
}
/**
 * Update position
 * 
 */
LEButton.prototype.updatePos = function(_x, _y) 
{ 
	this.bounds.x = _x;
	this.bounds.y = _y;
	this.bounds.x2 = (_x + this.bounds.w);
	this.bounds.y2 = (_y + this.bounds.h);
};
LEButton.prototype.pointHit = function(_x, _y) 
{
	if(!this.active) {
		return false;
	} 
	return (_x > this.bounds.x && _x < this.bounds.x2 && _y > this.bounds.y && _y < this.bounds.y2);
}
LEButton.prototype.stroke = function(_col, _thick) 
{
	if(!this.active) {
		return;
	} 
	strokeRect(this.bounds.x, this.bounds.y, this.bounds.w, this.bounds.h, _col, _thick);
}
LEButton.prototype.redraw = function() 
{
	if(!this.active) {
		return;
	} 
	drawBitmapFitIntoLocation(this.image, this.bounds.x, this.bounds.y, BTN_SIZE,BTN_SIZE);
	if(LevelEditor.selectedBrush != null && levObjPics[LevelEditor.selectedBrush.kind] == this.image) {
		this.stroke('#00FFFF', 3);
	} else {
		this.stroke('white', 1);
	}
}