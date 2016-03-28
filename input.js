
var mouseX = 0;
var mouseY = 0;
var mouseClicked_bool = false;
var selectedObject = null;

const KEYCODE_E = 69;
const KEYCODE_O = 79;


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
	for (var i=0; i < lenses.length; i++) {
		if(lenses[i].encloses(mouseX, mouseY)) {
			selectedObject = lenses[i];
		}
	}
	for (var i=0; i < mirrors.length; i++) {
		if(mirrors[i].encloses(mouseX, mouseY)) {
			selectedObject = mirrors[i];
			console.log("mirror selected");
		}
	}
	
	// Check for click on cores
	for (var i=0; i < cores.length; i++) {
		core = cores[i];
		if (core.encloses(mouseX, mouseY)){
			core.emitLasers();
		}
	}
}
function handleMouseUp(evt) {
	if(LevelEditor.active) {
		LevelEditor.mouseUp(evt);
		return; // bypass any gameplay interactions while in editor
	}
	
	mouseClicked_bool = false;
	selectedObject = null;
}

function keyPressed(evt) {
  var anyValidKeyPressed = true;
  switch(evt.keyCode) {
  	case KEYCODE_E:
  		LevelEditor.toggle();
  		break;
  	case KEYCODE_O:
  		startOpening();
  		break;
  	default: // to allow any non-game key actions to affect browser
  		anyValidKeyPressed = false;
  		break;
  }
  if(anyValidKeyPressed) {
  	evt.preventDefault(); // without this, keys affect the browser
  }
}
