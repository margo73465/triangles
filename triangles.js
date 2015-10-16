var height = window.innerHeight;
var width = window.innerWidth;
var triangleDim = 150;
var triangleHeight = Math.sqrt(3/4) * triangleDim;
var gridWidth = Math.ceil(width / triangleDim);
var gridHeight = Math.ceil(height / triangleHeight);

var svg = document.getElementsByTagName('svg')[0];
svg.setAttribute("width", width);
svg.setAttribute("height", height);
svg.setAttribute("onclick", "clearInterval(triangleMaker)");

var triangleMaker;
var grid = createGrid();

var currentTriangle = randomTriangle();
drawTriangle(currentTriangle, "red");

triangleMaker = setInterval(addTriangle, 300);

// showGrid(grid);

function getSVGPathString(verts) {
  var SVGPathString = verts.reduce(function(previous, current) {
    return previous + " L " + current;
  });
  return "M " + SVGPathString + " z";
}

function createGrid() {
  var grid = {}
  var y = 0;
  var j = 0;
  while ( y < height ) {
    var x = j % 2 === 0 ? 0 : -triangleDim / 2;
    var i = 0;
    while ( x < width ) {
      var upVerts = [ x + " " + y,
        (x - triangleDim / 2) + " " + (y + triangleHeight),
        (x + triangleDim / 2) + " " + (y + triangleHeight) ];
      var downVerts = [ x + " " + y,
        (x + triangleDim) + " " + y,
        (x + triangleDim / 2) + " " + (y + triangleHeight) ];
      var up = i + "-" + j + "-up";
      var down = i + "-" + j + "-down";
      grid[up] = {
        fill: "none",
        path: getSVGPathString(upVerts)
      };
      grid[down] = {
        fill: "none",
        path: getSVGPathString(downVerts)
      };
      x += triangleDim;
      i += 1;
    }
    y += triangleHeight;
    j += 1;
  }
  return grid;
}

function showGrid(grid) {
  for ( var triangle in grid ) {
    if ( grid.hasOwnProperty(triangle) ) {
      drawTriangle(triangle, "black");
    }
  }
}

function randomTriangle() {
  var i = Math.floor(Math.random() * gridWidth);
  var j = Math.floor(Math.random() * gridHeight);
  var orientation = Math.random() > 0.5 ? "up" : "down";
  var triangle = i + "-" + j + "-" + orientation;
  if ( grid[triangle].fill === "none" ) {
    return triangle;
  } else {
    return randomTriangle();
  }
}

function addTriangle() {
  var location = currentTriangle.split("-");
  var x = location[0];
  var y = location[1];
  var orientation = location[2];

  var options = [];
  if (orientation === "up") {
    if ( y % 2 === 0 ) {
      var complicatedOption = Number(x) + "-" + (Number(y) + 1) + "-down";
    } else {
      var complicatedOption = (Number(x) - 1) + "-" + (Number(y) + 1) + "-down";
    }
    options = [ Number(x) + "-" +  Number(y) + "-down",
      (Number(x) - 1) + "-" +  Number(y) + "-down",
      complicatedOption ];
  } else {
    if ( y % 2 === 0 ) {
      var complicatedOption = ((Number(x) + 1) + "-" + (Number(y) - 1)) + "-up";
    } else {
      var complicatedOption = Number(x) + "-" + (Number(y) - 1) + "-up";
    }
    options = [ Number(x) + "-" +  Number(y) + "-up",
      (Number(x) + 1) + "-" +  Number(y) + "-up",
      complicatedOption ];
  }

  var availOptions = options.filter(function(option) {
    if ( grid[option] ) {
      if ( grid[option].fill === "none" ) {
        return true;
      }
    }
    return false;
  });

  var nextTriangle = availOptions[Math.floor(Math.random() * availOptions.length)];

  if ( !nextTriangle ) {
    nextTriangle = randomTriangle();
  }

  currentTriangle = nextTriangle;
  drawTriangle(currentTriangle, "red");
}

function drawTriangle(triangle, fill) {
  grid[triangle].fill = fill;

  var svgTriangle = document.createElementNS("http://www.w3.org/2000/svg", "path");
  svgTriangle.setAttribute("d", grid[triangle].path);
  svgTriangle.setAttribute("class", triangle);
  svgTriangle.style.stroke = "white";
  svgTriangle.style['stroke-width'] = "5px";
  svgTriangle.style.fill = fill;
  svg.appendChild(svgTriangle);
}
