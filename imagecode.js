var levObjPics = [];

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

function loadImageForTileCode(levObjCode, fileName) {
  levObjPics[levObjCode] = document.createElement("img");
  beginLoadingImage(levObjPics[levObjCode],fileName);
}

function loadImages() {

  var imageList = [
    /* {varName:logoImage, theFile:"logo.png"},*/ // for loading non-level parts
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
      loadImageForTileCode(imageList[i].levPartType, imageList[i].theFile);
    } else {
      beginLoadingImage(imageList[i].varName, imageList[i].theFile);
    } // end of else
  } // end of for imageList

} // end of function loadImages

function drawBitmapCenteredAtLocationWithRotation(graphic, atX, atY,withAngle) {
  ctx.save(); // allows us to undo translate movement and rotate spin
  ctx.translate(atX,atY); // sets the point where our graphic will go
  ctx.rotate(withAngle); // sets the rotation
  ctx.drawImage(graphic,-graphic.width/2,-graphic.height/2); // center, draw
  ctx.restore(); // undo the translation movement and rotation since save()
}

function drawBitmapFitIntoLocation(graphic, atX, atY, targetWid, targetHei) {
  ctx.drawImage(graphic, // image (source)
                          0,0, // source corner
                          graphic.width,graphic.height, // source dimensions
                          atX,atY, // dest corner
                          targetWid, targetHei // dest dimensions
                          );
}