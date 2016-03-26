
var mouseX = 0;
var mouseY = 0;

const KEYCODE_E = 69;
const KEYCODE_O = 79;


function updateMousePos(evt) {
	var rect = canvas.getBoundingClientRect();
	var root = document.documentElement;
	mouseX = evt.clientX - rect.left - root.scrollLeft;
	mouseY = evt.clientY - rect.top - root.scrollTop;
}

function handleMouseClick(evt) {
	if(LevelEditor.active) {
		LevelEditor.mouseClicked(evt);
		return; // bypass any gameplay interactions while in editor
	}

	// Check for click on cores
	for (var i=0; i < cores.length; i++) {
		core = cores[i];
		if (core.encloses(mouseX, mouseY)){
			core.emitLasers();
		}
	}
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
