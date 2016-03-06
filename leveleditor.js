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
const LEVELPART_ENUM_KINDS = (levPartEnum++);

const UI_BUTTON_PIXEL_SIZE = 40;

var isInEditor = false;
var editorMouseOverItem = NO_SELECTION;
var editorSelectedBrush = NO_SELECTION;

function toggleEditor() {
	isInEditor = !isInEditor;
}

function editorMouseClicked() {
	if(editorMouseOverItem != NO_SELECTION) {
		editorSelectedBrush = editorMouseOverItem;
	}
}

function editorUpdate() { // can contain logic, too
	// logic code for editor
	if(mouseX > canvas.width-UI_BUTTON_PIXEL_SIZE) {
		editorMouseOverItem = Math.floor( mouseY / UI_BUTTON_PIXEL_SIZE ); 
		if(editorMouseOverItem < 0 || editorMouseOverItem > LEVELPART_DELETE) {
			editorMouseOverItem = NO_SELECTION;
		}
	} else {
		editorMouseOverItem = NO_SELECTION;
	}

	// draw code for editor
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
	if(editorSelectedBrush != NO_SELECTION && editorMouseOverItem == NO_SELECTION) {
		drawBitmapCenteredAtLocationWithRotation(levObjPics[editorSelectedBrush],
													mouseX,mouseY, 0);
	}
	colorText("Editor state debug output (placeholder)", 15, 15, 'white');
}