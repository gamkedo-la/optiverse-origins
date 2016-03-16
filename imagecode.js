var levObjPics = [];

var imgShipLarge = document.createElement("img");
var imgShipAnimSmall = document.createElement("img");

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
    {varName:imgShipLarge, theFile:"spaceshiphd.png"}, // for loading non-level parts
    {varName:imgShipAnimSmall, theFile:"spaceshipspritesheet.png"}, // for loading non-level parts

    // this format loads level parts (and editor UI buttons)
    {levPartType:LEVELPART_ASTEROID, theFile:"asteroid.png"},
    {levPartType:LEVELPART_CORE, theFile:"core.png"},
    {levPartType:LEVELPART_LENS, theFile:"lens.png"},
    {levPartType:LEVELPART_LENS2, theFile:"lens2.png"},
    {levPartType:LEVELPART_LENS3, theFile:"lens3.png"},
    {levPartType:LEVELPART_MIRROR, theFile:"mirror.png"},
    {levPartType:LEVELPART_SOURCE, theFile:"source.png"},
    {levPartType:LEVELPART_WALL, theFile:"wall.png"},
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

function drawBitmapCenteredAtLocationWithRotation(graphic, atX, atY,withAngle) {
  ctx.save(); // allows us to undo translate movement and rotate spin
  ctx.translate(atX,atY); // sets the point where our graphic will go
  ctx.rotate(withAngle); // sets the rotation
  try {
    ctx.drawImage(graphic,-graphic.width/2,-graphic.height/2); // center, draw
  } catch(err) {
    console.log(err);
  }
  ctx.restore(); // undo the translation movement and rotation since save()
}

function drawAnimCenteredAtLocationWithRotation(graphic, atX, atY,withAngle) {
  ctx.save();
  ctx.translate(atX,atY);
  ctx.rotate(withAngle);
  var spriteDim = graphic.height; // note: assuming square images in horizontal strip
  var frameMax = graphic.width/spriteDim;
  var frameNow = animTick % frameMax;
  ctx.drawImage(graphic,
    frameNow*spriteDim,0,
    spriteDim,spriteDim,
    -spriteDim/2,-spriteDim/2,    
    spriteDim,spriteDim);
  ctx.restore();
}

function drawBitmapFitIntoLocation(graphic, atX, atY, targetWid, targetHei) {
  ctx.drawImage(graphic, // image (source)
                          0,0, // source corner
                          graphic.width,graphic.height, // source dimensions
                          atX,atY, // dest corner
                          targetWid, targetHei // dest dimensions
                          );
}

function drawSimple(source) {
  ctx.drawImage(source.image, source['bounds'].x, source['bounds'].y);
}