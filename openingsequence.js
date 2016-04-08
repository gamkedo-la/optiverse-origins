var animTick = 0;

const OPENING_SMALL_ANIM_STEPS = 20;
const OPENING_ZOOM_STEPS = 30;
const OPENING_SEQUENCE_OFF = -1;
const OPENING_SEQUENCE_START_ANIM = 0;
const OPENING_SEQUENCE_ZOOM_TO_SIDE = 1;
const OPENING_SEQUENCE_SHOWING = 2;
var openingSequence = OPENING_SEQUENCE_OFF;

function setupOpeningAnimTick() {
	var animFPS = 15;
	setInterval(function() {
			animTick++;	
			switch(openingSequence) {
				case OPENING_SEQUENCE_START_ANIM:
					if(animTick > OPENING_SMALL_ANIM_STEPS) {
		  				openingSequence++;
		  				animTick = 0;
		  			}
		  			break;
				case OPENING_SEQUENCE_ZOOM_TO_SIDE:
					if(animTick > OPENING_ZOOM_STEPS) {
		  				openingSequence++;
		  			}
		  			break;
		  	}
		}, 1000/animFPS);
}

function startOpening() {
	openingSequence = OPENING_SEQUENCE_START_ANIM;
  	animTick = 0;
}

function openingSequenceHandler() {
	switch(openingSequence) {
		case OPENING_SEQUENCE_START_ANIM:
			drawAnimCenteredAtLocationWithRotation(imgShipAnimSmall, canvas.width/2, canvas.height/2, 0, Cutctx);
			break;
		case OPENING_SEQUENCE_ZOOM_TO_SIDE:
			zoomInOnShip(animTick / OPENING_ZOOM_STEPS);
			break;
		case OPENING_SEQUENCE_SHOWING:
			drawBitmapCenteredAtLocationWithRotation(imgShipLarge, canvas.width, canvas.height/2, 0, Cutctx);
			break;
	}
}

function isOpeningBlockingGameplay() {
	return openingSequence != OPENING_SEQUENCE_OFF && openingSequence != OPENING_SEQUENCE_SHOWING;
}