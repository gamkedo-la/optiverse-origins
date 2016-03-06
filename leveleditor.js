var isInEditor = false;

function toggleEditor() {
	isInEditor = !isInEditor;
}

function editorDraw() {
	colorRect(0,0,canvas.width,canvas.height,'red');
	colorText("now in editor (placeholder), mouse at (" +mouseX+", "+mouseY+")" , 15, 15, 'black');
}