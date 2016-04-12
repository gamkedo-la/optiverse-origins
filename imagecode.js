var levObjPics = [];

var imgShipLarge = document.createElement("img");
var imgShipAnimSmall = document.createElement("img");
var imgShipAnimSmallThrust = document.createElement("img");

var imgShipAnimEnemy = document.createElement("img");
var imgShipEnemyForGame = document.createElement("img");

var imgPortalLeftBG = document.createElement("img");
var imgPortalRightFG = document.createElement("img");

var enemyExplosion = document.createElement("img");
const ENEMY_EXPL_FRAMES = 16;
isBattleGraphicsLevel = true;

var LevelEditorRotSymbol = document.createElement("img");
var LevelEditorPlusSign = document.createElement("img");
var LevelEditorMinusSign = document.createElement("img");
var mineral_rock = document.createElement("img");
var mineral = document.createElement("img");
var bg1 = document.createElement("img");
var bg2 = document.createElement("img");
var bg3 = document.createElement("img");
var bg4 = document.createElement("img");


var fireButtonWaiting = document.createElement("img");
var fireButtonPressed = document.createElement("img");

var picsToLoad = 0;

function countLoadedImageAndLaunchIfReady() {
  picsToLoad--;
  if(picsToLoad == 0) { // last image loaded?
    loadingDoneSoStartGame();
  }
}

function beginLoadingImage(imgVar, fileName) {
  imgVar.onload=countLoadedImageAndLaunchIfReady;
  imgVar.src="images/"+fileName;
}

function loadImageForLevPartCode(levObjCode, fileName) {
  levObjPics[levObjCode] = document.createElement("img");
  beginLoadingImage(levObjPics[levObjCode],fileName);
}

function loadImages() {

  var imageList = [
  // for loading non-level parts
    {varName:imgShipLarge, theFile:"spaceshiphd.png"},
    {varName:imgShipAnimSmall, theFile:"spaceshipspritesheet.png"},
    {varName:imgShipAnimSmallThrust, theFile:"spaceshipthrust.png"},
    {varName:imgShipAnimEnemy, theFile:"enemy_ship.png"},
    {varName:imgShipEnemyForGame, theFile:"enemy_ship_ingame.png"},

    {varName:imgPortalLeftBG, theFile:"portal_left.png"},
    {varName:imgPortalRightFG, theFile:"portal_right.png"},

    {varName:LevelEditorRotSymbol, theFile:"symbolRot.png"},
    {varName:LevelEditorPlusSign, theFile:"btn_plussign.png"},
    {varName:LevelEditorMinusSign, theFile:"btn_minussign.png"},
    {varName:mineral_rock, theFile:"minerals_rock.png"},
    {varName:mineral, theFile:"minerals.png"},

    {varName:bg1, theFile:"background_1_purple.jpg"},
    {varName:bg2, theFile:"background_2_purple.jpg"},
    {varName:bg3, theFile:"background_3_red.jpg"},
    {varName:bg4, theFile:"background_4_blue.jpg"},

    {varName:enemyExplosion, theFile:"explosion.png"},

    {varName:fireButtonWaiting, theFile:"button.png"},
    {varName:fireButtonPressed, theFile:"button_lit.png"},

    // this format loads level parts (and editor UI buttons)
    {levPartType:LEVELPART_ASTEROID, theFile:"asteroid.png"},
    {levPartType:LEVELPART_CORE, theFile:"core.png"},
    {levPartType:LEVELPART_LENS1, theFile:"lens1.png"},
    {levPartType:LEVELPART_LENS2, theFile:"lens2.png"},
    {levPartType:LEVELPART_LENS3, theFile:"lens3.png"},
    {levPartType:LEVELPART_LENS4, theFile:"lens4.png"},
    {levPartType:LEVELPART_LENS5, theFile:"lens5.png"},
    {levPartType:LEVELPART_LENS6, theFile:"lens6.png"},
    {levPartType:LEVELPART_LENS7, theFile:"lens7.png"},
    {levPartType:LEVELPART_MIRROR, theFile:"mirror.png"},
    {levPartType:LEVELPART_SOURCE, theFile:"source.png"},
    {levPartType:LEVELPART_WALL1, theFile:"wall1.png"},
    {levPartType:LEVELPART_WALL2, theFile:"wall2.png"},
    {levPartType:LEVELPART_WALL3, theFile:"wall3.png"},
    {levPartType:LEVELPART_DELETE, theFile:"delete.png"},
    {levPartType:LEVELPART_EXPORT, theFile:"export.png"},
    {levPartType:LEVELPART_IMPORT, theFile:"import.png"}
    ];

  picsToLoad = imageList.length;

  for(var i=0;i<imageList.length;i++) {
    if(imageList[i].levPartType != undefined) {
      loadImageForLevPartCode(imageList[i].levPartType, imageList[i].theFile);
    } else {
      beginLoadingImage(imageList[i].varName, imageList[i].theFile);
    } // end of else
  } // end of for imageList

} // end of function loadImages

function drawBitmapCenteredAtLocationWithRotation(graphic, atX, atY,withAngle, context) {
  if(!context)
    context = ctx;
  context.save(); // allows us to undo translate movement and rotate spin
  context.translate(atX,atY); // sets the point where our graphic will go
  context.rotate(withAngle); // sets the rotation
  try {
    context.drawImage(graphic,-graphic.width/2,-graphic.height/2); // center, draw
  } catch(err) {
    console.log(err);
  }
  context.restore(); // undo the translation movement and rotation since save()
}

function drawAnimCenteredAtLocationWithRotation(graphic, atX, atY,withAngle, context, frameNum) {
  if(!context)
    context = ctx;

  if(frameNum == null || frameNum == undefined) {
    frameNum = animTick;
  }
  
  context.save();
  context.translate(atX,atY);
  context.rotate(withAngle);
  var spriteDim = graphic.height; // note: assuming square images in horizontal strip
  var frameMax = graphic.width/spriteDim;
  var frameNow = frameNum % frameMax;
  context.drawImage(graphic,
    frameNow*spriteDim,0,
    spriteDim,spriteDim,
    -spriteDim/2,-spriteDim/2,    
    spriteDim,spriteDim);
  context.restore();
}

function drawBitmapFitIntoLocation(graphic, atX, atY, targetWid, targetHei, context) {
  
  if(!context) 
    context = ctx;
  
  context.drawImage(graphic, // image (source)
                          0,0, // source corner
                          graphic.width,graphic.height, // source dimensions
                          atX,atY, // dest corner
                          targetWid, targetHei // dest dimensions
                          );
}

function drawSimple(source) {
  ctx.drawImage(source.image, source['bounds'].x, source['bounds'].y);
}