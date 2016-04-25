

const LVL_THB_W = 200;
const LVL_THB_H = 150;
//
var levelsToDraw = [];


function dlCanvas() 
{
	var scFactor = 0.725;
	var scaled_canvas = document.createElement('canvas');
	scaled_canvas.width = canvas.width;
	scaled_canvas.height = canvas.height;
	var tmp_ctx = scaled_canvas.getContext('2d');
	tmp_ctx.drawImage(canvas, 0, 0);
	//
	for(var i=0; i < 5; i++) {
		var tmp_canvas = document.createElement('canvas');
		tmp_canvas.width = scaled_canvas.width * scFactor;
		tmp_canvas.height = scaled_canvas.height * scFactor;
		tmp_ctx = tmp_canvas.getContext('2d');
		tmp_ctx.scale(scFactor,scFactor);
		tmp_ctx.drawImage(scaled_canvas, 0, 0);
		scaled_canvas = tmp_canvas;
	}
	

	var dt = scaled_canvas.toDataURL('image/png');
	/* Change MIME type to trick the browser to downlaod the file instead of displaying it */
	dt = dt.replace(/^data:image\/[^;]*/, 'data:application/octet-stream');
	/* In addition to <a>'s "download" attribute, you can define HTTP-style headers */
	dt = dt.replace(/^data:application\/octet-stream/, 'data:application/octet-stream;headers=Content-Disposition%3A%20attachment%3B%20filename=Canvas.png');

	var lvlName = levelsToDraw.shift();
	var fileName = "";
	for(var sIdx in series) {
		for(var lIdx in series[sIdx]) {
			if(series[sIdx][lIdx] == level[lvlName]) {
				fileName = lIdx;
				break;
			}
		}	
		if(fileName != "") break;
	}
	var element = document.createElement('a');
	element.setAttribute('href', dt);
	element.setAttribute('download', fileName+".png");
	element.style.display = 'none';
	document.body.appendChild(element);
	element.click();
	//document.body.removeChild(element);
	
	if(levelsToDraw.length > 0) {
		menuController.load(menuController.levels[levelsToDraw[0]]);
		fireButtonX=-999;
		setTimeout( dlCanvas, 500 );	
	}
	
};



function startCanvasDownload()
{
	for(var lvlName in menuController.levels) {
		levelsToDraw.push(lvlName);
	}

	menuController.load(menuController.levels[levelsToDraw[0]]);
	fireButtonX=-999;
	setTimeout( dlCanvas, 500 );

	
	
}




//setTimeout( startCanvasDownload, 2000 );



