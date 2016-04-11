
var levPartEnum = 0;
const NO_SELECTION = -1;
const LEVELPART_ASTEROID = (levPartEnum++);
const LEVELPART_CORE = (levPartEnum++);
const LEVELPART_LENS1 = (levPartEnum++);
const LEVELPART_LENS2 = (levPartEnum++);
const LEVELPART_LENS3 = (levPartEnum++);
const LEVELPART_LENS4 = (levPartEnum++);
const LEVELPART_LENS5 = (levPartEnum++);
const LEVELPART_LENS6 = (levPartEnum++);
const LEVELPART_LENS7 = (levPartEnum++);
const LEVELPART_MIRROR = (levPartEnum++);
const LEVELPART_SOURCE = (levPartEnum++);
const LEVELPART_WALL1 = (levPartEnum++);
const LEVELPART_WALL2 = (levPartEnum++);
const LEVELPART_WALL3 = (levPartEnum++);
const LEVELPART_DELETE = (levPartEnum++);
const LEVELPART_EXPORT = (levPartEnum++);
const LEVELPART_IMPORT = (levPartEnum++);
const LEVELPART_ENUM_KINDS = (levPartEnum++);

const BTN_SIZE = 40;

var noCmd = function() {};


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
	},
	"mouseRotateStart": function() {
		this.onMouseMove = LevelEditor.trScripts.mouseRotate;
		this.onMouseClick = LevelEditor.trScripts.mousePut;
	},
	"mouseRotate": function() {
		var deltaY = mouseY - this.bounds.centerY;
		var deltaX = mouseX - this.bounds.centerX;
		this.updateRotation(Math.atan2( deltaY, deltaX ));
	},
	"mouseMagnet": function() {
		this.updatePos(mouseX, mouseY);
	},
	"mousePut": function() {
		this.onMouseMove = noCmd;
		this.onMouseClick = noCmd;
		LevelEditor.pieces.push(this);
		LevelEditor.selectedBrush = new LevelPiece();
	},
	"startMirror": function() {
		LevelEditor.lastClickX = mouseX;
		LevelEditor.lastClickY = mouseY;
		this.onMouseMove = LevelEditor.trScripts.previewMirror;
		this.onMouseClick = LevelEditor.trScripts.finishMirror;
	},
	"previewMirror": function() {
		colorLine(LevelEditor.lastClickX, LevelEditor.lastClickY, mouseX, mouseY, 'green', 1);
	},
	"finishMirror": function() {
		var x1 = Math.min(LevelEditor.lastClickX, mouseX);
		var y1 = Math.min(LevelEditor.lastClickY, mouseY);
		var x2 = Math.max(LevelEditor.lastClickX, mouseX);
		var y2 = Math.max(LevelEditor.lastClickY, mouseY);
		var mirror = new MirrorLine(LevelEditor.lastClickX-x1, LevelEditor.lastClickY-y1, mouseX-x1, mouseY-y1, MIRROR_COLOR, MIRROR_LINEWIDTH);
		var w = x2-x1;
		var h = y2-y1;
		mirror.bounds = {	
			"x":0, "y":0, 
			"x2":w, "y2":h,
			"centerX": w/2, "centerY": h/2, 
			"w":w, "h":h
		};
		//mirror.points = [new Point(LevelEditor.lastClickX, LevelEditor.lastClickY), new Point(mouseX, mouseY)];
		mirror.points = [new Point(mirror.startX, mirror.startY), new Point(mirror.endX, mirror.endY)];
		var lp = new LevelPiece(mirror, 0);
		lp.updatePos(x1+(w/2), y1+(h/2));
		LevelEditor.pieces.push(lp);	
		LevelEditor.selectedBrush = new LevelPiece();
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

	setup		mouseClicked 			refitUI					makePoints
	toggle		mousePositionUpdate		drawLevelPieces
				mouseDragStart 			drawInterface
				mouseDragEnd 			drawBrush
										refreshTooltip

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
	'y': 40.0,
	'w': 125.0,
	'h': 500.0,
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
LevelEditor.deleting = false;
//
LevelEditor.lastMouseX = 0;
LevelEditor.lastMouseY = 0;
LevelEditor.lastClickX = 0;
LevelEditor.lastClickY = 0;

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
		LevelEditor.selectedBrush = new LevelPiece();
		var typesNotHandled = [].concat(currentLevel.lasers, currentLevel.sprites);
		// Handled: currentLevel.lenses, currentLevel.blocks, currentLevel.mirrors, currentLevel.cores, currentLevel.coresinks  TMP handled: currentLevel.beams
		currentLevel = new OptiLevel.init();
		currentLevel.addManyOpticsPieces(typesNotHandled);
	} else {
		for(var i in LevelEditor.pieces) {
			var piece = LevelEditor.pieces[i];
			var optic = null;
			if(piece.kind == "mirror") {
				var points = piece.opticsPiece.points;
				optic = new MirrorLine(points[0].x, points[0].y, points[1].x, points[1].y, MIRROR_COLOR, MIRROR_LINEWIDTH);
				optic.moveTo(piece.bounds.centerX, piece.bounds.centerY);
			} else {
				var maker = LevelEditor.makeScripts[piece.kind+"_"+piece.subtype];
				optic = maker(piece.bounds.centerX, piece.bounds.centerY, rad_to_deg(piece.rotation));
			}
			currentLevel.addOpticsPiece(optic);
		}
	}
}

LevelEditor.toggleoff = function() {
	LevelEditor.active = false;
	LevelEditor.selectedPiece = null;
	if(LevelEditor.active) {
		LevelEditor.selectedBrush = new LevelPiece();
		var typesNotHandled = [].concat(currentLevel.lasers, currentLevel.sprites);
		// Handled: currentLevel.lenses, currentLevel.blocks, currentLevel.mirrors, currentLevel.cores, currentLevel.coresinks  TMP handled: currentLevel.beams
		currentLevel = new OptiLevel.init();
		currentLevel.addManyOpticsPieces(typesNotHandled);
	} else {
		for(var i in LevelEditor.pieces) {
			var piece = LevelEditor.pieces[i];
			var optic = null;
			if(piece.kind == "mirror") {
				var points = piece.opticsPiece.points;
				optic = new MirrorLine(points[0].x, points[0].y, points[1].x, points[1].y, MIRROR_COLOR, MIRROR_LINEWIDTH);
				optic.moveTo(piece.bounds.centerX, piece.bounds.centerY);
			} else {
				var maker = LevelEditor.makeScripts[piece.kind+"_"+piece.subtype];
				optic = maker(piece.bounds.centerX, piece.bounds.centerY, rad_to_deg(piece.rotation));
			}
			currentLevel.addOpticsPiece(optic);
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
	var shift = _evt.shiftKey;
	//
	if(LevelEditor.mouseOverButton != null) { 
		LevelEditor.mouseOverButton.onClick(_evt); 				// Clicked one of the buttons in the tool panel
	} else if(LevelEditor.inPanel) {
		LevelEditor.trScript = LevelEditor.trScripts.panelGrab;	// Clicked somewhere on the panel background
	} else if(LevelEditor.deleting) {
		editorDeleteNearestToMouse();
		if(!shift) {
			LevelEditor.deleting = false;
			LevelEditor.selectedBrush = new LevelPiece();
		}
	} else if(LevelEditor.selectedBrush.onMouseClick != noCmd) {
		LevelEditor.selectedBrush.onMouseClick.call(LevelEditor.selectedBrush);
	} else if(shift && LevelEditor.selectedPiece != null) {
		LevelEditor.trScript = LevelEditor.trScripts.possiblePieceGrab;
	} else if(LevelEditor.mouseOverPieces.length > 0) {
		if(LevelEditor.mouseOverIndex >= LevelEditor.mouseOverPieces.length) {
			LevelEditor.mouseOverIndex = 0;
		}
		var candidate = LevelEditor.mouseOverPieces[LevelEditor.mouseOverIndex++];
		if(LevelEditor.selectedPiece != candidate) {
			LevelEditor.selectedPiece = candidate;
			if(LevelEditor.selectedPiece.kind != "mirror") {
				LevelEditor.minusSign.active = true;
				LevelEditor.plusSign.active = true;
				LevelEditor.rotSymbol.active = true;
			}
		} else {
			LevelEditor.trScript = LevelEditor.trScripts.possiblePieceGrab;
		}
	} else if(LevelEditor.selectedPiece != null) {
		if(LevelEditor.selectedPiece.kind == "mirror") {
			LevelEditor.selectedPiece = null;
		} else {
			LevelEditor.trScript = LevelEditor.trScripts.possiblePieceRotate;
		}
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
	LevelEditor.selectedBrush.onMouseMove.call(LevelEditor.selectedBrush);
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
	LevelEditor.selectedBrush.draw();
	if(LevelEditor.selectedBrush.onMouseMove == LevelEditor.trScripts.mouseRotate) {
		colorLine(LevelEditor.selectedBrush.bounds.centerX, LevelEditor.selectedBrush.bounds.centerY, mouseX, mouseY, 'yellow', 3)
	}
}
//
LevelEditor.refreshTooltip = function()
{
	/*
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
	*/
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

	
	var levelData = {}
	var name = prompt("Please name your level", "Level Name");
	
	var content = "level['" + name + "'] = "+JSON.stringify(LevelEditor.pieces);
	
	var element = document.createElement('a');
	element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
	element.setAttribute('download', name);
	element.style.display = 'none';
	document.body.appendChild(element);
	element.click();
	document.body.removeChild(element);
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
        	var piece = pieces[i];
        	if(piece.kind == "mirror") {
				//var points = rotate_around_origin(piece.opticsPiece.points, piece.rotation);
				var points = piece.opticsPiece.points;
				var x1 = points[0].x - piece.bounds.x;
				var y1 = points[0].y - piece.bounds.y;
				var x2 = points[1].x - piece.bounds.x;
				var y2 = points[1].y - piece.bounds.y;
				var mirror = new MirrorLine(x1, y1, x2, y2, MIRROR_COLOR, MIRROR_LINEWIDTH);
				mirror.bounds = piece.bounds;
				mirror.points = piece.opticsPiece.points;
				var lp = new LevelPiece(mirror, 0);
				lp.updatePos(piece.bounds.centerX, piece.bounds.centerY);
				//lp.expandBounds();
				LevelEditor.pieces.push(lp);
				continue;
		   	}
        	/*
        	var pointsData = LevelEditor.makePoints(piece.kind+"_"+piece.subtype);
        	if(piece.kind == "lens") {
				optic = new Lens(pointsData.points, LENS_INDEX_REF, LENS_COLOR);
			} else if(piece.kind == "block") {
				optic = new Block(pointsData.points, BLOCK_COLOR);
			} else if(piece.kind == "mirror") {
				points = rotate_around_origin(piece.opticsPiece.points, piece.rotation);
				//pointsData = {"points":points, "bounds":piece.bounds};
				var x1 = points[0].x - piece.bounds.x;
				var y1 = points[0].y - piece.bounds.y;
				var x2 = points[1].x - piece.bounds.x;
				var y2 = points[1].y - piece.bounds.y;
				var mirror = new MirrorLine( x1, y1, x2, y2, MIRROR_COLOR, MIRROR_LINEWIDTH );
				mirror.bounds = piece.bounds;
				mirror.points = piece.opticsPiece.points;
				var lp = new LevelPiece(mirror, 0);
				lp.updatePos(piece.bounds.centerX, piece.bounds.centerY);
				LevelEditor.pieces.push(lp);
				continue;
		   	} else {
		   		continue;
		   	}
		   	*/
			//optic.bounds = pointsData.bounds;	
			//optic.updatePos(piece.bounds.x, piece.bounds.y, true);
			//
			var maker = LevelEditor.makeScripts[piece.kind+"_"+piece.subtype];
			var optic = maker(piece.bounds.w/2,piece.bounds.h/2,0);
			optic.bounds = piece.bounds;
			var lp = new LevelPiece(optic, piece.subtype);
			lp.updateRotation(piece.rotation);
			lp.expandBounds();
			LevelEditor.pieces.push(lp);
        }
    }catch(e){
        alert("invalid level data in text box below game");
        console.log(e);
    }
}

function LoadLevel(LevelStr) {
	LevelEditor.selectedPiece = null;
	LevelEditor.pieces = [];
	//currentLevel = OptiLevel.init();
	levelText = LevelStr
	try {
        var pieces = levelText;
        for(var i in pieces) {
        	var piece = pieces[i];
        	if(piece.kind == "mirror") {
				//var points = rotate_around_origin(piece.opticsPiece.points, piece.rotation);
				var points = piece.opticsPiece.points;
				var x1 = points[0].x - piece.bounds.x;
				var y1 = points[0].y - piece.bounds.y;
				var x2 = points[1].x - piece.bounds.x;
				var y2 = points[1].y - piece.bounds.y;
				var mirror = new MirrorLine(x1, y1, x2, y2, MIRROR_COLOR, MIRROR_LINEWIDTH);
				mirror.bounds = piece.bounds;
				mirror.points = piece.opticsPiece.points;
				var lp = new LevelPiece(mirror, 0);
				lp.updatePos(piece.bounds.centerX, piece.bounds.centerY);
				//lp.expandBounds();
				LevelEditor.pieces.push(lp);
				continue;
		   	}
        	/*
        	var pointsData = LevelEditor.makePoints(piece.kind+"_"+piece.subtype);
        	if(piece.kind == "lens") {
				optic = new Lens(pointsData.points, LENS_INDEX_REF, LENS_COLOR);
			} else if(piece.kind == "block") {
				optic = new Block(pointsData.points, BLOCK_COLOR);
			} else if(piece.kind == "mirror") {
				points = rotate_around_origin(piece.opticsPiece.points, piece.rotation);
				//pointsData = {"points":points, "bounds":piece.bounds};
				var x1 = points[0].x - piece.bounds.x;
				var y1 = points[0].y - piece.bounds.y;
				var x2 = points[1].x - piece.bounds.x;
				var y2 = points[1].y - piece.bounds.y;
				var mirror = new MirrorLine( x1, y1, x2, y2, MIRROR_COLOR, MIRROR_LINEWIDTH );
				mirror.bounds = piece.bounds;
				mirror.points = piece.opticsPiece.points;
				var lp = new LevelPiece(mirror, 0);
				lp.updatePos(piece.bounds.centerX, piece.bounds.centerY);
				LevelEditor.pieces.push(lp);
				continue;
		   	} else {
		   		continue;
		   	}
		   	*/
			//optic.bounds = pointsData.bounds;	
			//optic.updatePos(piece.bounds.x, piece.bounds.y, true);
			//
			var maker = LevelEditor.makeScripts[piece.kind+"_"+piece.subtype];
			var optic = maker(piece.bounds.w/2,piece.bounds.h/2,0);
			optic.bounds = piece.bounds;
			var lp = new LevelPiece(optic, piece.subtype);
			lp.updateRotation(piece.rotation);
			lp.expandBounds();
			LevelEditor.pieces.push(lp);
        }
    }catch(e){
        alert("invalid level data in text box below game");
        console.log(e);
    }
}




LevelEditor.makePoints = function(_maker, _cx, _cy, _cRot) 
{
	_cx = typeof _cx != 'undefined' ? _cx : 0;
	_cy = typeof _cy != 'undefined' ? _cy : 0;
	_cRot = typeof _cRot != 'undefined' ? _cRot : 0;
	//
	var points = _maker(_cx, _cy, _cRot);
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


LevelEditor.makeScripts = {
	"lens_1": function(_cx, _cy, _cRot) {
		return new Lens(make_points_lens_1(_cx, _cy, _cRot), LENS_INDEX_REF, LENS_COLOR);		
	},
	"lens_2": function(_cx, _cy, _cRot) {
		return new Lens(make_points_lens_2(_cx, _cy, _cRot), LENS_INDEX_REF, LENS_COLOR);		
	},
	"lens_3": function(_cx, _cy, _cRot) {
		return new Lens(make_points_lens_3(_cx, _cy, _cRot), LENS_INDEX_REF, LENS_COLOR);		
	},
	"lens_4": function(_cx, _cy, _cRot) {
		return new Lens(make_points_lens_4(_cx, _cy, _cRot), LENS_INDEX_REF, LENS_COLOR);		
	},
	"lens_5": function(_cx, _cy, _cRot) {
		return new Lens(make_points_lens_5(_cx, _cy, _cRot), LENS_INDEX_REF, LENS_COLOR);		
	},
	"lens_6": function(_cx, _cy, _cRot) {
		return new Lens(make_points_lens_6(_cx, _cy, _cRot), LENS_INDEX_REF, LENS_COLOR);		
	},
	"lens_7": function(_cx, _cy, _cRot) {
		return new Lens(make_points_lens_7(_cx, _cy, _cRot), LENS_INDEX_REF, LENS_COLOR);		
	},
	"block_1": function(_cx, _cy, _cRot) {
		return new Block(make_points_block_1(_cx, _cy, _cRot), BLOCK_COLOR);		
	},
	"block_2": function(_cx, _cy, _cRot) {
		return new Block(make_points_block_2(_cx, _cy, _cRot), BLOCK_COLOR);		
	},
	"block_3": function(_cx, _cy, _cRot) {
		return new Block(make_points_block_3(_cx, _cy, _cRot), BLOCK_COLOR);		
	},
	"mirror_0": function(_points) {

	},
	"core_0": function(_cx, _cy, _cRot) { 
		var dash2 = 5;
		var CR2 = new CoreRing(25, [90+_cRot], true, 'green', 5);
		var arr2 = [CR2];
		return new Core(_cx, _cy, 10, 'green', arr2);	
	},
	"sink_0": function(_cx, _cy, _cRot) { 
		var CR1a = new CoreRing(20, [0], false, 'green', 3);
		var arr1a = [CR1a];
		return new CoreSink(_cx, _cy, 7, 'green', arr1a);
	}
	
	// Added to this list. -Erik
	
};


function makeCore(_centerX, _centerY, _diam)
{
	var r = _diam/2;
	var x1 = _centerX - r;
	var y1 = _centerY - r;
	var x2 = _centerX + r;
	var y2 = _centerY + r;
	return [new Point(x1,y1), new Point(x2,y2)];
}


//----------------------------------------------------------------------------
//----------------------------------------------------------------------------


LevelEditor.buttonScripts = {

	// --------------- Added by Erik 1 --------------
	/*
	"source_0": {
		"index": 5,
		"tooltip": "source_0",
		"imagecode": LEVELPART_SOURCE,
		"command": function() {
			var pointsData = LevelEditor.makePoints("source_0");
			var source_0 = new Lens(pointsData.points, LENS_INDEX_REF, LENS_COLOR);
			source_0.bounds = pointsData.bounds;
			LevelEditor.selectedBrush = new LevelPiece(source_0, 0, LevelEditor.trScripts.mouseMagnet, LevelEditor.trScripts.mouseRotateStart);
			LevelEditor.selectedBrush.expandBounds();

		}
	},
	*/
	// --------------- END Added by Erik 1 --------------
	
	"lens_1": {
		"index": 0,
		"tooltip": "lens_1",
		"imagecode": LEVELPART_LENS1,
		"command": function() {
			var pointsData = LevelEditor.makePoints(make_points_lens_1);
			var lens_1 = new Lens(pointsData.points, LENS_INDEX_REF, LENS_COLOR);
			lens_1.bounds = pointsData.bounds;
			LevelEditor.selectedBrush = new LevelPiece(lens_1, 1, LevelEditor.trScripts.mouseMagnet, LevelEditor.trScripts.mouseRotateStart);
			LevelEditor.selectedBrush.expandBounds();

		}
	},
	
	// --------------- Added by Erik 2 --------------
	"lens_2": {
		"index": 11,
		"tooltip": "lens_2",
		"imagecode": LEVELPART_LENS2,
		"command": function() {
			var pointsData = LevelEditor.makePoints(make_points_lens_2);
			var lens_2 = new Lens(pointsData.points, LENS_INDEX_REF, LENS_COLOR);
			lens_2.bounds = pointsData.bounds;
			LevelEditor.selectedBrush = new LevelPiece(lens_2, 2, LevelEditor.trScripts.mouseMagnet, LevelEditor.trScripts.mouseRotateStart);
			LevelEditor.selectedBrush.expandBounds();

		}
	},
	"lens_3": {
		"index": 12,
		"tooltip": "lens_3",
		"imagecode": LEVELPART_LENS3,
		"command": function() {
			var pointsData = LevelEditor.makePoints(make_points_lens_3);
			var lens_3 = new Lens(pointsData.points, LENS_INDEX_REF, LENS_COLOR);
			lens_3.bounds = pointsData.bounds;
			LevelEditor.selectedBrush = new LevelPiece(lens_3, 3, LevelEditor.trScripts.mouseMagnet, LevelEditor.trScripts.mouseRotateStart);
			LevelEditor.selectedBrush.expandBounds();

		}
	},
	"lens_4": {
		"index": 13,
		"tooltip": "lens_4",
		"imagecode": LEVELPART_LENS4,
		"command": function() {
			var pointsData = LevelEditor.makePoints(make_points_lens_4);
			var lens_4 = new Lens(pointsData.points, LENS_INDEX_REF, LENS_COLOR);
			lens_4.bounds = pointsData.bounds;
			LevelEditor.selectedBrush = new LevelPiece(lens_4, 4, LevelEditor.trScripts.mouseMagnet, LevelEditor.trScripts.mouseRotateStart);
			LevelEditor.selectedBrush.expandBounds();

		}
	},
	"lens_5": {
		"index": 14,
		"tooltip": "lens_5",
		"imagecode": LEVELPART_LENS5,
		"command": function() {
			var pointsData = LevelEditor.makePoints(make_points_lens_5);
			var lens_5 = new Lens(pointsData.points, LENS_INDEX_REF, LENS_COLOR);
			lens_5.bounds = pointsData.bounds;
			LevelEditor.selectedBrush = new LevelPiece(lens_5, 5, LevelEditor.trScripts.mouseMagnet, LevelEditor.trScripts.mouseRotateStart);
			LevelEditor.selectedBrush.expandBounds();

		}
	},
	"lens_6": {
		"index": 15,
		"tooltip": "lens_6",
		"imagecode": LEVELPART_LENS6,
		"command": function() {
			var pointsData = LevelEditor.makePoints(make_points_lens_6);
			var lens_6 = new Lens(pointsData.points, LENS_INDEX_REF, LENS_COLOR);
			lens_6.bounds = pointsData.bounds;
			LevelEditor.selectedBrush = new LevelPiece(lens_6, 6, LevelEditor.trScripts.mouseMagnet, LevelEditor.trScripts.mouseRotateStart);
			LevelEditor.selectedBrush.expandBounds();

		}
	},
	"lens_7": {
		"index": 16,
		"tooltip": "lens_7",
		"imagecode": LEVELPART_LENS7,
		"command": function() {
			var pointsData = LevelEditor.makePoints(make_points_lens_7);
			var lens_7 = new Lens(pointsData.points, LENS_INDEX_REF, LENS_COLOR);
			lens_7.bounds = pointsData.bounds;
			LevelEditor.selectedBrush = new LevelPiece(lens_7, 7, LevelEditor.trScripts.mouseMagnet, LevelEditor.trScripts.mouseRotateStart);
			LevelEditor.selectedBrush.expandBounds();

		}
	},
	// --------------- END Added by Erik 2 --------------	
	
	"block_1": {
		"index": 1,
		"tooltip": "block_1",
		"imagecode": LEVELPART_WALL1,
		"command": function() {
			var pointsData = LevelEditor.makePoints(make_points_block_1);
			var block_1 = new Block(pointsData.points, BLOCK_COLOR);
			block_1.bounds = pointsData.bounds;
			LevelEditor.selectedBrush = new LevelPiece(block_1, 1, LevelEditor.trScripts.mouseMagnet, LevelEditor.trScripts.mouseRotateStart);
			LevelEditor.selectedBrush.expandBounds();
		}
	},
	"block_2": {
		"index": 2,
		"tooltip": "block_2",
		"imagecode": LEVELPART_WALL2,
		"command": function() {
			var pointsData = LevelEditor.makePoints(make_points_block_2);
			var block_2 = new Block(pointsData.points, BLOCK_COLOR);
			block_2.bounds = pointsData.bounds;
			LevelEditor.selectedBrush = new LevelPiece(block_2, 2, LevelEditor.trScripts.mouseMagnet, LevelEditor.trScripts.mouseRotateStart);
			LevelEditor.selectedBrush.expandBounds();
		}
	},
	"block_3": {
		"index": 3,
		"tooltip": "block_3",
		"imagecode": LEVELPART_WALL3,
		"command": function() {
			var pointsData = LevelEditor.makePoints(make_points_block_3);
			var block_3 = new Block(pointsData.points, BLOCK_COLOR);
			block_3.bounds = pointsData.bounds;
			LevelEditor.selectedBrush = new LevelPiece(block_3, 3, LevelEditor.trScripts.mouseMagnet, LevelEditor.trScripts.mouseRotateStart);
			LevelEditor.selectedBrush.expandBounds();
		}
	},
	"mirror_0": {
		"index": 4,
		"tooltip": "mirror line stretching between two points",
		"imagecode": LEVELPART_MIRROR,
		"command": function() {
			LevelEditor.selectedBrush = new LevelPiece(null, 0, LevelEditor.trScripts.mouseMagnet, LevelEditor.trScripts.startMirror);
			LevelEditor.selectedBrush.image = LevelEditorPlusSign;
		}
	},
	"core_0": {
		"index": 5,
		"tooltip": "core_0",
		"imagecode": LEVELPART_SOURCE,
		"command": function() {
			var coreData = LevelEditor.makePoints(makeCore, 40, 40, 80);
			var dash2 = 5;
			var CR2 = new CoreRing(25, [90], true, 'green', 5);
			var arr2 = [CR2];
			var core = new Core(40, 40, 10, 'green', arr2);
			core.bounds = coreData.bounds;		
			core.points = [];	
			LevelEditor.selectedBrush = new LevelPiece(core, 0, LevelEditor.trScripts.mouseMagnet, LevelEditor.trScripts.mouseRotateStart);
			LevelEditor.selectedBrush.expandBounds();
		}
	},
	"sink_0": {
		"index": 6,
		"tooltip": "sink_0",
		"imagecode": LEVELPART_CORE,
		"command": function() {
			var coreData = LevelEditor.makePoints(makeCore, 28, 28, 56);
			var CR1a = new CoreRing(20, [0], false, 'green', 3);
			var arr1a = [CR1a];
			var sink = new CoreSink(28, 28, 7, 'green', arr1a);
			sink.bounds = coreData.bounds;		
			sink.points = [];	
			LevelEditor.selectedBrush = new LevelPiece(sink, 0, LevelEditor.trScripts.mouseMagnet, LevelEditor.trScripts.mousePut);
			LevelEditor.selectedBrush.expandBounds();
		}
	},
	"delete": {
		"index": 8,
		"tooltip": "click to delete nearest part (hold SHIFT to stay in delete mode)",
		"imagecode": LEVELPART_DELETE,
		"command": function() {
			if(LevelEditor.selectedPiece != null) {
				LevelEditor.pieces.splice(LevelEditor.pieces.indexOf(LevelEditor.selectedPiece), 1);
				LevelEditor.selectedPiece = null;
			}
			/*
			LevelEditor.deleting = true;
			LevelEditor.selectedPiece = null;
			LevelEditor.selectedBrush = {
				"draw": function() {
					drawBitmapCenteredAtLocationWithRotation(levObjPics[LEVELPART_DELETE], mouseX, mouseY, 0.0);
				},
				"updatePos": function() {}
			};
			*/
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
function LevelPiece(_opticsPiece, _subtype, _onMouseMove, _onMouseClick) 
{
	_opticsPiece = typeof _opticsPiece != 'undefined' ? _opticsPiece : null;
	_onMouseMove  = typeof _onMouseMove  != 'undefined' ? _onMouseMove  : noCmd;
	_onMouseClick = typeof _onMouseClick != 'undefined' ? _onMouseClick : noCmd;
	//
	Graphic.call(this);

	//--------------------
	//
	// 		MEMBERS
	//
	//----------------
	//
	//
	this.selected = false;
	this.opticsPiece = _opticsPiece;
	this.subtype = _subtype;
	//
	this.onMouseMove = _onMouseMove;
	this.onMouseClick = _onMouseClick;
	
	if(_opticsPiece != null) {
		this.kind = _opticsPiece.kind;
		this.bounds = _opticsPiece.bounds;
		var mainCtx = ctx;
		this.image = document.createElement('canvas');
		ctx = this.image.getContext('2d');
		this.image.width = this.bounds.w;
		this.image.height = this.bounds.h;
		//colorRect(0,0,this.bounds.w,this.bounds.h, "red");
		this.opticsPiece.draw();
		ctx = mainCtx;
	} else {
		this.image = null;
	}
	//
	return this;
}


/**
 * Expand bounds so that it fits any type of rotated version (ie w,h = max(w,h))
 * 
 */
LevelPiece.prototype.expandBounds = function()
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



/** @OVERRIDE **/
LevelPiece.prototype.updatePos = function(_x, _y)
{
	if(this.opticsPiece != null && typeof this.opticsPiece.points != 'undefined') {  // for special case: Mirrors
		this.opticsPiece.points = translate_points(this.opticsPiece.points, _x-this.bounds.centerX, _y-this.bounds.centerY);
		//console.log(_x-this.bounds.centerX, _y-this.bounds.centerY);
	}
	//
	Graphic.prototype.updatePos.call(this, _x, _y);
}


/** @OVERRIDE **/
LevelPiece.prototype.updateRotation = function(_angle)
{
	if(this.opticsPiece != null && this.opticsPiece.kind == "mirror") {  // for special case: Mirrors
		this.opticsPiece.points = rotate_around_origin(this.opticsPiece.points, rad_to_deg(_angle-this.rotation));
		this.opticsPiece.moveTo(this.bounds.centerX, this.bounds.centerY);
	}
	//
	Graphic.prototype.updateRotation.call(this, _angle);
}



/**
 * Draw to global Canvas
 * 
 */
LevelPiece.prototype.draw = function() 
{ 
	if(this.image != null) {
		drawBitmapCenteredAtLocationWithRotation(this.image, this.bounds.centerX, this.bounds.centerY, this.rotation);
	}
};

