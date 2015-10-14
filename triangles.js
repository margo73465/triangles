var height = window.innerHeight;
var width = window.innerWidth;
var triangleDim = 50;
var triangleHeight = Math.sqrt(3/4) * triangleDim;
var gridWidth = Math.ceil(width / triangleDim * 3 / 2);
var gridHeight = Math.ceil(height / triangleHeight);
var centerX = Math.floor(gridWidth / 2);
var centerY = Math.floor(gridHeight / 2);

var svg = document.getElementsByTagName('svg')[0];
svg.setAttribute("width", width);
svg.setAttribute("height", height);
svg.setAttribute("onclick", "clearInterval(triangleMaker)");

var triangleMaker;
var triangles = [];
var grid = createGrid();
var colors = ["red", "orange", "yellow", "green", "blue", "purple"];

var currentTriangle = {
  gridPoint: grid[centerY][centerX],
  orientation: "left",
  fill: "red"
};

drawTriangle(currentTriangle);

triangleMaker = setInterval(addTriangle, 300);

// showGrid();

function createGrid() {
  var grid = [];
  for (var i = 0; i <= gridHeight; i++) {
    var row = [];
    for (var j = 0; j <= gridWidth; j++) {
      var offset = 0
      if (i > 0) {
        offset = grid[i - 1][0].x - triangleDim / 2;
      }
      var point = {
        left: false,
        right: false,
        id: [i, j],
        x: offset + j * triangleDim,
        y: i * triangleHeight
      };
      row.push(point);
    }
    grid.push(row);
  }

  return grid;
}

function showGrid() {
  var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
  svg.appendChild(g);

  for (var i = 0; i < grid.length; i++) {
    for (var j = 0; j < grid[0].length; j++) {
      var point = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      point.setAttribute("cx", grid[i][j].x);
      point.setAttribute("cy", grid[i][j].y);
      point.setAttribute("r", 3);
      point.setAttribute("id", "grid_" + i);
      point.style.fill = "red";
      g.appendChild(point);

      var text = document.createElementNS("http://www.w3.org/2000/svg", "text")
      text.setAttribute("x", grid[i][j].x);
      text.setAttribute("y", grid[i][j].y);
      text.textContent = "(" + i + ", " + j + ")";
      g.appendChild(text);
    }
  }
}


function addTriangle() {

  var x = currentTriangle.gridPoint.id[0];
  var y = currentTriangle.gridPoint.id[1];

  var options = [];
  if (currentTriangle.orientation === "left") {
    options = [[x, y, "right"], [x + 1, y, "right"], [x, y - 1, "right"]];
  } else {
    options = [[x, y, "left"], [x - 1, y, "left"], [x, y + 1, "left"]];
  }

  var availOptions = options.filter(isInBoundsAndNotPrevious);

  if (availOptions.length === 0) {
    currentTriangle = triangles[Math.floor(Math.random() * triangles.length)];
    addTriangle();
  }

  var nextTriangle = availOptions[Math.floor(Math.random() * availOptions.length)];
  var fillIndex = colors.indexOf(currentTriangle.fill);
  if ( isFilled(nextTriangle) ) {
    fillIndex += 1;
    if ( fillIndex >= colors.length ) {
      fillIndex = 0;
    }
  }
  var x = nextTriangle[0];
  var y = nextTriangle[1];

  if (currentTriangle.orientation === "left") {
    currentTriangle = {
      gridPoint: grid[x][y],
      orientation: "right",
      fill: colors[fillIndex]
    };
    drawTriangle(currentTriangle);
  } else {
    currentTriangle = {
      gridPoint: grid[x][y],
      orientation: "left",
      fill: colors[fillIndex]
    };
    drawTriangle(currentTriangle);
  }
}

function isInBoundsAndNotPrevious(option) {
  var x = option[0];
  var y = option[1];
  var orientation = option[2];

  var inBounds = true;
  var notPrevious = true;

  if ( triangles.length > 1 ) {
    var previousTriangle = triangles[triangles.length - 2];
    var prevX = previousTriangle.gridPoint.id[0];
    var prevY = previousTriangle.gridPoint.id[1];
    var prevOrientation = previousTriangle.orientation;
  }

  if ( grid[x] === undefined ) {
    inBounds = false;
  } else if ( grid[x][y] === undefined ) {
    inBounds = false;
  } else if ( x === prevX && y === prevY && orientation === prevOrientation ) {
    notPrevious = false;
  }

  return inBounds && notPrevious;
}

function isFilled(option) {
  var x = option[0];
  var y = option[1];
  var orientation = option[2];

  var filled = false;

  if ( grid[x][y][orientation] ) {
    filled = true;
  }

  return filled;
}

function drawTriangle(triangle) {
  var rotation;
  if (triangle.orientation === "left") {
    rotation = 0;
    grid[triangle.gridPoint.id[0]][triangle.gridPoint.id[1]].left = true;
  } else {
    rotation = 60;
    grid[triangle.gridPoint.id[0]][triangle.gridPoint.id[1]].right = true;
  }

  var verts = [ {x: triangle.gridPoint.x, y: triangle.gridPoint.y},
    {x: triangle.gridPoint.x - triangleDim / 2, y: triangle.gridPoint.y + triangleHeight},
    {x: triangle.gridPoint.x + triangleDim / 2, y: triangle.gridPoint.y + triangleHeight} ];

  var svgTriangle = document.createElementNS("http://www.w3.org/2000/svg", "path");
  svgTriangle.setAttribute("d", "M " + verts[0].x + " " + verts[0].y + " L " + verts[1].x + " " + verts[1].y + " L " + verts[2].x + " " + verts[2].y + " z");
  svgTriangle.setAttribute("transform", "rotate(" + rotation + ", " + verts[2].x + ", " + verts[2].y + ")")
  svgTriangle.style.stroke = "white";
  svgTriangle.style['stroke-width'] = "5px";
  svgTriangle.style.fill = triangle.fill;
  svg.appendChild(svgTriangle);

  triangles.push(triangle);
}

