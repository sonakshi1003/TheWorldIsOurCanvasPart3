var canvas;
var drawing = [];
var currentline;
var r,g,b;
var database;
var isDrawing = false;

function setup() {
  canvas = createCanvas(400,400);
  //executing function start line only when mouse is pressed inside then the canvas
  canvas.mousePressed(startLine);
  canvas.mouseReleased(endLine);
  canvas.parent('canvasContainer');
  database = firebase.database();
//defining save button
  saveButton = select('#saveButton');
  saveButton.mousePressed(saveDrawing);
//defining clear button
  clearButton = select('#clearButton');
  clearButton.mousePressed(clearDrawing);

  var ref = database.ref('drawings');
  ref.on("value",getDrawing);
}
function draw() {
  background(0); 
  //changing colour across the canvas
  r=map(mouseX, 0, width, 255, 0);
  g=map(mouseX, 0, width, 204, 255);
  b=map(mouseX, 0, width, 0,0);
  //defining value of each point of the line drawn
  if(isDrawing === true){
    var point = {
      x : mouseX,
      y : mouseY
    };
    //making a current path consisting these points
    currentline.push(point);
  }
  // drawing the line
  for(var j = 0;j<drawing.length;j++){
    var line = drawing[j];
    beginShape();
    for(var i = 0;i<line.length;i++){
      stroke(r,g,b);
      strokeWeight(4);
      noFill();
      vertex(line[i].x, line[i].y);
    }
    endShape();
  }
}
// function which will make a new line whenever mouse is pressed
function startLine(){
  currentline = [];
  drawing.push(currentline);
  isDrawing = true;
}
//and end it when it is released
function endLine(){
  isDrawing = false;
}
//saving drawing on the database
function saveDrawing(){
  var ref = database.ref('drawings');
  var data = {
    name:name,
    drawing:drawing
  };
  ref.push(data);
}
//getting the values of drawings and saving them in links
function getDrawing(data){
  //clear the listing
  var Elist = selectAll('.listing');
   for(var i = 0;i<Elist.length;Elist++){
     Elist[i].remove();
   }
  //making the listing
  var drawings = data.val();
  var keys = Object.keys(drawings);
  for(var i = 0;i<keys.length;i++){
    var key = keys[i];
    var li = createElement('li','');
    li.class('listing');
    var ahref = createA('#',key);
    ahref.mousePressed(showDrawing);
    ahref.parent(li);
    li.parent('drawingList');
  }
}
// showing the drawing when the link are pressed
function showDrawing(){
  var key = this.html();
  var ref = database.ref('drawings/'+key);
  ref.once('value',function(data){
    var Adrawing = data.val();
    drawing = Adrawing.drawing;
    console.log(Adrawing);
  });
}
function clearDrawing(){
  drawing = [];
}
//canvasContainer,clearButton , saveButton and the drawingList are made in the index file

