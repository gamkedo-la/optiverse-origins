
var mouseX = 0;
var mouseY = 0;
var mouseClicked_bool = false;
var selectedObject = null;

const KEYCODE_E = 69;
const KEYCODE_O = 79;
const KEYCODE_ESC = 27;

var fireButtonX=40;
var fireButtonY=30;
var buttonFired = false;

function resetFireButton() {
	buttonFired = false;
}

function mouseIsInFireButtion() {
	var left = fireButtonX - fireButtonWaiting.width/2;
	var right = fireButtonX + fireButtonWaiting.width/2;
	var top = fireButtonY - fireButtonWaiting.height/2;
	var bot = fireButtonY + fireButtonWaiting.height/2;

	return (mouseX < right && mouseY < bot &&
			mouseX > left && mouseY > top);
}

function drawFireButtion() {
	drawBitmapCenteredAtLocationWithRotation( (buttonFired ? fireButtonPressed : fireButtonWaiting),
		fireButtonX,fireButtonY,0);
}

function updateMousePos(evt) {
	var rect = canvas.getBoundingClientRect();
	var root = document.documentElement;
	mouseX = evt.clientX - rect.left - root.scrollLeft;
	mouseY = evt.clientY - rect.top - root.scrollTop;
	
	if(selectedObject) {
		selectedObject.moveTo(mouseX, mouseY);
	}
}

function handleMouseClick(evt) {
	if(LevelEditor.active) {
		LevelEditor.mouseClicked(evt);
		return; // bypass any gameplay interactions while in editor
	}
	
	mouseClicked_bool = true;
	
	// Check for click on moveable objects & add them to slected object
	for (var i=0; i < currentLevel.lenses.length; i++) {
		if(currentLevel.lenses[i].encloses(mouseX, mouseY)) {
			selectedObject = currentLevel.lenses[i];
		}
	}
	for (var i=0; i < currentLevel.mirrors.length; i++) {
		if(currentLevel.mirrors[i].encloses(mouseX, mouseY)) {
			selectedObject = currentLevel.mirrors[i];
		}
	}
	
	// Check for click on cores
	/*for (var i=0; i < currentLevel.cores.length; i++) {
		core = currentLevel.cores[i];
		if (core.encloses(mouseX, mouseY)){
			// Remove all dashed lines in level
			currentLevel.beams = [];		
			
			// Emit laser from all cores
			currentLevel.emitLasers();
		}
	}*/
	if(buttonFired == false && mouseIsInFireButtion()) {
		buttonFired = true;
		// Remove all dashed lines in level
		currentLevel.beams = [];		
		
		// Emit laser from all cores
		currentLevel.emitLasers();
	}
}
function handleMouseUp(evt) {
	if(LevelEditor.active) {
		// LevelEditor.mouseUp(evt);
		return; // bypass any gameplay interactions while in editor
	}
	
	mouseClicked_bool = false;
	selectedObject = null;
}

function keyPressed(evt) {
  var anyValidKeyPressed = true;
  switch(evt.keyCode) {
  	/*case KEYCODE_E: // removed for release -cdeleon
  		if(LevelEditor.canEdit)
  			LevelEditor.toggle();
  		break;
  	case KEYCODE_O:
  		startOpening();
  		break;*/
	case KEYCODE_ESC:
  		leakMenu();
  		break;
  	default: // to allow any non-game key actions to affect browser
  		anyValidKeyPressed = false;
  		break;
  }
  if(anyValidKeyPressed) {
  	evt.preventDefault(); // without this, keys affect the browser
  }
}
