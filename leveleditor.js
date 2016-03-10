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

const UI_BUTTON_PIXEL_SIZE = 40;

var isInEditor = false;

var editorMouseOverItem = NO_SELECTION;
var editorSelectedBrush = NO_SELECTION;
var editorNextClickSetsAngleOfIdx = NO_SELECTION;

var levelPiecesList = [];

function levelObjClass(atX, atY, ofKind, inRot) {
	this.x = atX;
	this.y = atY;
	this.kind = ofKind;
	this.ang = inRot;
}

function toggleEditor() {
	isInEditor = !isInEditor;
	if(isInEditor) {
		levelPiecesList = currentLevel.getJSON();
		if(levelPiecesList.length > 0) {
			SaveToTextfield();
		}
		currentLevel = Level.init();
	} else {
		currentLevel = Level.init(levelPiecesList);
	}
}

function distToMouse(fromX,fromY) {
	var dx = fromX - mouseX;
	var dy = fromY - mouseY;
	return Math.sqrt( dx*dx + dy*dy );
}

function editorDeleteNearestToMouse() {
	var closestIdx = NO_SELECTION;
	var closestDist = 999999.0;

	for(var i=levelPiecesList.length-1;i>=0;i--) {
		var distTo = distToMouse( levelPiecesList[i].x, levelPiecesList[i].y )

		if(distTo < closestDist) {
			closestIdx = i;
			closestDist = distTo;
		}
	}

	if(closestIdx != NO_SELECTION) {
		levelPiecesList.splice(closestIdx, 1);
	}
}

function SaveToTextfield() {
	levelText = document.getElementById('levelTextfield');
	levelText.value = JSON.stringify(levelPiecesList);
}
function LoadTextfield() {
	levelText = document.getElementById('levelTextfield');
	try{
        levelPiecesList = JSON.parse( levelText.value );
    }catch(e){
        alert("invalid level data in text box below game");
    }
}


function editorMouseClicked() {
	if(editorMouseOverItem != NO_SELECTION) {

		if(editorMouseOverItem == LEVELPART_EXPORT) {
			SaveToTextfield();
		} else if(editorMouseOverItem == LEVELPART_IMPORT) {
			LoadTextfield();
			currentLevel = Level.init();
		} else {
			editorSelectedBrush = editorMouseOverItem;
		}
		editorNextClickSetsAngleOfIdx = NO_SELECTION; // resets angle setting if piece changed

	} else if(editorSelectedBrush == LEVELPART_DELETE) {
		editorDeleteNearestToMouse();
	} else if(editorSelectedBrush == NO_SELECTION) {
		return;
	} else {
		if(editorNextClickSetsAngleOfIdx == NO_SELECTION) {
			editorNextClickSetsAngleOfIdx = levelPiecesList.length;
			levelPiecesList.push( new levelObjClass(mouseX, mouseY,
				editorSelectedBrush,
				Math.random()*Math.PI * 2.0) );
		} else {
			editorNextClickSetsAngleOfIdx = NO_SELECTION;
		}
	}
}

function editorMousePositionUpdate() {
	if(mouseX > canvas.width-UI_BUTTON_PIXEL_SIZE) {
		editorMouseOverItem = Math.floor( mouseY / UI_BUTTON_PIXEL_SIZE ); 
		if(editorMouseOverItem < 0 || editorMouseOverItem >= LEVELPART_ENUM_KINDS) {
			editorMouseOverItem = NO_SELECTION;
		}
	} else {
		editorMouseOverItem = NO_SELECTION;
	}
	if(editorMouseOverItem == NO_SELECTION && editorNextClickSetsAngleOfIdx != NO_SELECTION) {
		levelPiecesList[editorNextClickSetsAngleOfIdx].ang =
			Math.atan2(mouseY - levelPiecesList[editorNextClickSetsAngleOfIdx].y,
						mouseX - levelPiecesList[editorNextClickSetsAngleOfIdx].x);
	}
}

function editorDrawLevelObj() {
	for(var i=0;i<levelPiecesList.length;i++) {
		drawBitmapCenteredAtLocationWithRotation(levObjPics[levelPiecesList[i].kind],
									levelPiecesList[i].x,levelPiecesList[i].y,
									levelPiecesList[i].ang);
	}
}

function editorDrawInterface() {
	var xCoord = canvas.width-UI_BUTTON_PIXEL_SIZE;
	for(var i=0;i<LEVELPART_ENUM_KINDS;i++) {
		var yCoord = UI_BUTTON_PIXEL_SIZE*i;
		if(editorSelectedBrush == i) {
			colorRect(xCoord, yCoord, UI_BUTTON_PIXEL_SIZE,UI_BUTTON_PIXEL_SIZE, '#00ffff');
		} else if(editorMouseOverItem == i) {
			strokeRect(xCoord, yCoord, UI_BUTTON_PIXEL_SIZE,UI_BUTTON_PIXEL_SIZE, 'red', 4);
		} else {
			strokeRect(xCoord, yCoord, UI_BUTTON_PIXEL_SIZE,UI_BUTTON_PIXEL_SIZE, 'white', 1);
		}

		drawBitmapFitIntoLocation(levObjPics[i],
			xCoord, yCoord,
			UI_BUTTON_PIXEL_SIZE,UI_BUTTON_PIXEL_SIZE);
	}
	var stepText = "select object from sidebar to place";

	if(editorNextClickSetsAngleOfIdx != NO_SELECTION) {
		colorLine(levelPiecesList[editorNextClickSetsAngleOfIdx].x,
				  levelPiecesList[editorNextClickSetsAngleOfIdx].y,
				  mouseX, mouseY, 'yellow', 3)
		stepText = "click to set rotation of last placed object";
	} else if(editorSelectedBrush != NO_SELECTION && editorMouseOverItem == NO_SELECTION) {
		stepText = "click to place object, will be able to set rotation next";
		drawBitmapCenteredAtLocationWithRotation(levObjPics[editorSelectedBrush],
													mouseX,mouseY, 0);
	}
	if(editorSelectedBrush == LEVELPART_DELETE) { // selected
		stepText = "click to delete nearest part";
	}
	if(editorMouseOverItem == LEVELPART_EXPORT) { // merely hovering, since action on click
		stepText = "click to update text below game to be current layout";
	}
	if(editorMouseOverItem == LEVELPART_IMPORT) { // merely hovering, since action on click
		stepText = "click to load layout from text below the game";
	}

	colorText(stepText, 15, 15, 'white');
}

function editorUpdate() {
	editorMousePositionUpdate();

	editorDrawLevelObj();

	editorDrawInterface();
}