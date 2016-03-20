
//-----------------------------------------------------------------------------//
/*
 *	Name: 		Graphic
 * 	Abstract: 	NO
 * 	Superclass: n/a
 * 	Subclasses:	Button, LevelPiece
 * 	
 * 	Description: 
 * 	
																																										
	METHODS:

	updatePos	stroke
	pointHit	draw
*/


/**
 * CONSTRUCTOR
 *
 * @return {Graphic}
 */
function Graphic(_img, _tooltip, _x, _y, _w, _h) 
{
	_tooltip = typeof _tooltip != 'undefined' ? _tooltip : "";
	_x = typeof _x != 'undefined' ? _x : 0.0;
	_y = typeof _y != 'undefined' ? _y : 0.0;
	_w = typeof _w != 'undefined' ? _w : (typeof _img != 'undefined' ? _img.width : 0.0);
	_h = typeof _h != 'undefined' ? _h : (typeof _img != 'undefined' ? _img.height : 0.0);
	//
	this.bounds = {
		'x': _x,
		'y': _y,
		'x2': (_x + _w),
		'y2': (_y + _h),
		'centerX': (_x + (_w/2.0)),
		'centerY': (_y + (_h/2.0)),
		'w': _w,
		'h': _h,
	};
	this.centered = true;
	this.image = _img;
	this.tooltip = _tooltip;
	this.active = true;
	//
	return this;
}


/**
 * Update bounds to reflect new xy position
 * 
 * @param {Number} 	_x 		New x
 * @param {Number} 	_y 		New y
 */
Graphic.prototype.updatePos = function(_x, _y) 
{ 
	if(this.centered) {
		_x -= this.bounds.w/2.0;
		_y -= this.bounds.h/2.0;
	}
	this.bounds.x = _x;
	this.bounds.y = _y;
	this.bounds.x2 = (_x + this.bounds.w);
	this.bounds.y2 = (_y + this.bounds.h);
	this.bounds.centerX = (_x + (this.bounds.w/2.0));
	this.bounds.centerY = (_y + (this.bounds.h/2.0));
};


/**
 * Change xy a certain amount
 * 
 * @param {Number} 	_x 		Change in x
 * @param {Number} 	_y 		Change in y
 */
Graphic.prototype.changePos = function(_x, _y) 
{ 
	var x = this.centered ? this.bounds.centerX : this.bounds.x;
	var y = this.centered ? this.bounds.centerY : this.bounds.y;
	this.updatePos(x + _x, y + _y);
};


/**
 * Check if xy exists within bounds
 * 
 * @param {Number} 	_x 		
 * @param {Number} 	_y 		
 * @return {bool} 	TRUE if xy exists in bounds
 */
Graphic.prototype.pointHit = function(_x, _y) 
{
	if(!this.active) {
		return false;
	} 
	return (_x > this.bounds.x && _x < this.bounds.x2 && _y > this.bounds.y && _y < this.bounds.y2);
}


/**
 * Draws bitmap image to Canvas
 *
 */
Graphic.prototype.draw = function() 
{ 
	if(!this.active) {
		return;
	} 
	drawBitmapFitIntoLocation(this.image, this.bounds.x, this.bounds.y, this.bounds.w, this.bounds.h);
}


/**
 * Draw a line along the bounds of the object
 * 
 * @param {string} 	_col 		Draw color	
 * @param {Number} 	_thick	 	Thickness in pixels
 */
Graphic.prototype.stroke = function(_col, _thick) 
{
	_col = typeof _col != 'undefined' ? _col : '#255,0,255';
	_thick = typeof _thick != 'undefined' ? _thick : 1;
	//
	if(!this.active) {
		return;
	} 
	strokeRect(this.bounds.x, this.bounds.y, this.bounds.w, this.bounds.h, _col, _thick);
}





//-----------------------------------------------------------------------------//
/*
 *	Name: 		Button
 * 	Abstract: 	NO
 * 	Superclass: Graphic
 * 	Subclasses:	n/a
 * 	
 * 	Description: A Graphic that is interactable with mouse cursor
 * 	
																																										
	METHODS:

*/



Button.prototype = Object.create( Graphic.prototype );		
Button.prototype.constructor = Button;


/**
 * CONSTRUCTOR
 *
 * @param {function} 	_onClick 		Function to call on mouseclicks	
 * @return {Button}
 */
function Button(_onclick, _img, _tooltip, _x, _y, _w, _h) {
	Graphic.call(this, _img, _tooltip, _x, _y, _w, _h);
	//
	this.centered = false;
	this.onClick = _onclick;
	//
	return this;
}


/** @OVERRIDE **/
Button.prototype.draw = function() 
{
	if(!this.active) {
		return;
	} 
	Graphic.prototype.draw.call(this);
	if(LevelEditor.selectedBrush != null && levObjPics[LevelEditor.selectedBrush.kind] == this.image) {
		this.stroke('#00FFFF', 3);
	} else {
		this.stroke('white', 1);
	}
}