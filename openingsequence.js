var animTick = 0;

const OPENING_SMALL_ANIM_STEPS = 20;
const OPENING_ZOOM_STEPS = 20;
const OPENING_SEQUENCE_OFF = -1;

const OPENING_SEQUENCE_START_ANIM = 0;
const OPENING_SEQUENCE_ZOOM_TO_SIDE = 1;
const OPENING_SEQUENCE_SHOWING = 2;

var openingSequence = OPENING_SEQUENCE_OFF;

const CUTSCENE_SHIP_ZOOM = 0;
const CUTSCENE_PORTAL_FLEE = 1;
var cutscenePlaying = CUTSCENE_PORTAL_FLEE;

function advanceShipZoomStep() {
	switch(openingSequence) {
		case OPENING_SEQUENCE_START_ANIM:
			if(animTick >= OPENING_SMALL_ANIM_STEPS) {
  				openingSequence++;
  				animTick = 0;
  			}
  			break;
		case OPENING_SEQUENCE_ZOOM_TO_SIDE:
			if(animTick >= OPENING_ZOOM_STEPS) {
  				openingSequence++;
  			}
  			break;
  	}
}

function setupOpeningAnimTick() {
	var animFPS = 15;
	setInterval(function() {
			animTick++;	
			switch(cutscenePlaying) {
				case CUTSCENE_SHIP_ZOOM:
					advanceShipZoomStep();
					break;
				case CUTSCENE_PORTAL_FLEE:
					
					break;
			}
		}, 1000/animFPS);
}

function startOpening() {
	openingSequence = OPENING_SEQUENCE_START_ANIM;
  	animTick = 0;
}

function openingSequenceHandler() {
	switch(cutscenePlaying) {
		case CUTSCENE_SHIP_ZOOM:
			shipZoomDraw();
			break;
		case CUTSCENE_PORTAL_FLEE:
			portalFleeDraw();
			break;
	}
}

function portalFleeDraw() {
	var formationStaggerX = -90;
	var formationStaggerY = 90;
	var animTickCap = 40;
	var cappedAnimTick = (animTick > animTickCap ? animTickCap : animTick);
	var gapBehindPlayer = 160;
	var portalX = canvas.width*0.7;

	var enemyShipSpeed = 10;
	var playerShipSpeed = 12;

	drawBitmapCenteredAtLocationWithRotation(imgShipAnimEnemy,
						cappedAnimTick * enemyShipSpeed+formationStaggerX - gapBehindPlayer, canvas.height/2-formationStaggerY, Math.PI*0.5, Cutctx);
	drawBitmapCenteredAtLocationWithRotation(imgShipAnimEnemy,
						cappedAnimTick * enemyShipSpeed - gapBehindPlayer, canvas.height/2, Math.PI*0.5, Cutctx);
	drawBitmapCenteredAtLocationWithRotation(imgShipAnimEnemy,
						cappedAnimTick * enemyShipSpeed+formationStaggerX - gapBehindPlayer, canvas.height/2+formationStaggerY, Math.PI*0.5, Cutctx);

	drawBitmapCenteredAtLocationWithRotation(imgPortalLeftBG,
						portalX, canvas.height/2, 0, Cutctx);
	drawBitmapCenteredAtLocationWithRotation(imgShipAnimSmallThrust,
						animTick * playerShipSpeed, canvas.height/2, 0, Cutctx);
	drawBitmapCenteredAtLocationWithRotation(imgPortalRightFG,
						portalX+125, canvas.height/2, 0, Cutctx);
}

function shipZoomDraw() {
	switch(openingSequence) {
		case OPENING_SEQUENCE_START_ANIM:
			drawAnimCenteredAtLocationWithRotation(imgShipAnimSmall,
				canvas.width/2, canvas.height/2, 0, Cutctx);
			break;
		case OPENING_SEQUENCE_ZOOM_TO_SIDE:
			zoomInOnShip(animTick / OPENING_ZOOM_STEPS, Cutctx);
			break;
		case OPENING_SEQUENCE_SHOWING:
			drawBitmapCenteredAtLocationWithRotation(imgShipLarge, canvas.width, canvas.height/2, 0, Cutctx);
			break;
	}
}

function isOpeningBlockingGameplay() {
	if(cutscenePlaying == CUTSCENE_PORTAL_FLEE) {
		return false;
	}

	return openingSequence != OPENING_SEQUENCE_OFF && openingSequence != OPENING_SEQUENCE_SHOWING;
}

function zoomInOnShip(lerpVal, onCtx) {
	var shipStartW = imgShipAnimSmall.height; // using height since square anims strip
	var shipEndW = imgShipLarge.width;
	var shipStartX = canvas.width/2;

	var shipStartH = imgShipAnimSmall.height;
	var shipEndH = imgShipLarge.height;
	var shipEndX = canvas.width;

	var shipDrawW = (1.0-lerpVal) * shipStartW + lerpVal * shipEndW;
	var shipDrawH = (1.0-lerpVal) * shipStartH + lerpVal * shipEndH;
	var shipDrawX = (1.0-lerpVal) * shipStartX + lerpVal * shipEndX;

	drawBitmapFitIntoLocation(imgShipLarge, shipDrawX-shipDrawW/2, canvas.height/2-shipDrawH/2,
		shipDrawW,shipDrawH,onCtx);

}
