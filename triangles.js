// Constants
const height = window.innerHeight;
const width = window.innerWidth;
const TRIANGLE_DIM = 50;
const INTERVAL = 300;

// Derived values
const triangleHeight = Math.sqrt(3/4) * TRIANGLE_DIM;
const gridWidth = Math.ceil(width / TRIANGLE_DIM);
const gridHeight = Math.ceil(height / triangleHeight);

let triangleMaker;

const svg = document.getElementById('svg');
svg.setAttribute("width", width);
svg.setAttribute("height", height);
svg.setAttribute("onclick", "clearInterval(triangleMaker)");

const grid = createGrid();

let currentTriangle = randomTriangle();
drawTriangle(currentTriangle, "white");

triangleMaker = setInterval(addTriangle, INTERVAL);

showGrid(grid);


function createGrid() {
  var grid = {}
  var y = 0;
  var j = 0;
  while ( y < height ) {
    var x = j % 2 === 0 ? 0 : -TRIANGLE_DIM / 2;
    var i = 0;
    while ( x < width ) {
      var upVerts = [ x + " " + y,
        (x - TRIANGLE_DIM / 2) + " " + (y + triangleHeight),
        (x + TRIANGLE_DIM / 2) + " " + (y + triangleHeight) ];
      var downVerts = [ x + " " + y,
        (x + TRIANGLE_DIM) + " " + y,
        (x + TRIANGLE_DIM / 2) + " " + (y + triangleHeight) ];
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
      x += TRIANGLE_DIM;
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
      drawTriangle(triangle, "white");
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
    // Need to check if there is anywhere left to put a triangle.
    return randomTriangle();
  }
}

function addTriangle() {
  var location = currentTriangle.split("-");
  var x = location[0];
  var y = location[1];
  var orientation = location[2];

  var adjacentTriangles = [];
  if (orientation === "up") {
    if ( y % 2 === 0 ) {
      var complicatedOption = Number(x) + "-" + (Number(y) + 1) + "-down";
    } else {
      var complicatedOption = (Number(x) - 1) + "-" + (Number(y) + 1) + "-down";
    }
    adjacentTriangles = [ Number(x) + "-" +  Number(y) + "-down",
      (Number(x) - 1) + "-" +  Number(y) + "-down",
      complicatedOption ];
  } else {
    if ( y % 2 === 0 ) {
      var complicatedOption = ((Number(x) + 1) + "-" + (Number(y) - 1)) + "-up";
    } else {
      var complicatedOption = Number(x) + "-" + (Number(y) - 1) + "-up";
    }
    adjacentTriangles = [ Number(x) + "-" +  Number(y) + "-up",
      (Number(x) + 1) + "-" +  Number(y) + "-up",
      complicatedOption ];
  }

  var availableOptions = adjacentTriangles.filter(function(option) {
    if ( grid[option] ) {
      if ( grid[option].fill === "none" ) {
        return true;
      }
    }
    return false;
  });

  var nextTriangle = availableOptions[Math.floor(Math.random() * availOptions.length)];

  if ( !nextTriangle ) {
    nextTriangle = randomTriangle();
  }

  currentTriangle = nextTriangle;
  drawTriangle(currentTriangle, "white");
}

function drawTriangle(triangle, fill) {
  grid[triangle].fill = fill;

  var svgTriangle = document.createElementNS("http://www.w3.org/2000/svg", "path");
  svgTriangle.setAttribute("d", grid[triangle].path);
  svgTriangle.setAttribute("class", triangle);
  svgTriangle.style.stroke = "black";
  svgTriangle.style['stroke-width'] = "5px";
  svgTriangle.style.fill = fill;
  svg.appendChild(svgTriangle);
}

// Utility function to get the SVG path string from an array of verticies.
function getSVGPathString(verts) {
  var SVGPathString = verts.reduce(function(previous, current) {
    return previous + " L " + current;
  });
  return "M " + SVGPathString + " z";
}
