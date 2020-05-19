// Constants
const height = window.innerHeight;
const width = window.innerWidth;
const TRIANGLE_DIM = 50;
const INTERVAL = 300;

// Derived values
const triangleHeight = Math.sqrt(3/4) * TRIANGLE_DIM;
const gridWidth = Math.ceil(width / TRIANGLE_DIM) * 2;
const gridHeight = Math.ceil(height / triangleHeight);

// Named interval for adding triangles. Stored here so it can be cancelled on click.
let triangleMaker;

const svg = document.getElementById('svg');
svg.setAttribute("width", width);
svg.setAttribute("height", height);
svg.setAttribute("onclick", "clearInterval(triangleMaker)");

const grid = createGrid();

let currentTriangle = randomTriangle();

triangleMaker = setInterval(addTriangle, INTERVAL);

function createGrid() {
  const grid = [];
  let y = 0;
  for ( let i = 0; i < gridHeight; i++ ) {
    let x = 0;
    const row = [];
    for ( let j = 0; j < gridWidth; j++ ) {
      const triangle = { row: i, column: j };
      if ( (j % 2 === 0 && i % 2 === 0) || (j % 2 === 1 && i % 2 === 1 )) {
        triangle.orientation = "up";
        triangle.vertices = [ x + " " + y,
          (x - TRIANGLE_DIM / 2) + " " + (y + triangleHeight),
          (x + TRIANGLE_DIM / 2) + " " + (y + triangleHeight) ];
      } else {
        triangle.orientation = "down";
        triangle.vertices = [ x - TRIANGLE_DIM / 2 + " " + y,
          (x + TRIANGLE_DIM / 2) + " " + y,
          x + " " + ( y + triangleHeight)];
      }
      triangle.path = getSVGPathString(triangle.vertices);
      triangle.fill = "white";
      triangle.on = false;
      triangle.svg = drawTriangle(triangle);
      x += TRIANGLE_DIM / 2;
      row.push(triangle);
    }
    grid.push(row);
    y += triangleHeight;
  }
  return grid;
}

function showGrid(grid) {
  for ( let i = 0; i < grid.length; i++ ) {
    for ( let j = 0; j < grid[i].length; j++) {
      grid[i][j].on = true;
    }
  }
}

function randomTriangle() {
  const i = Math.floor(Math.random() * gridHeight);
  const j = Math.floor(Math.random() * gridWidth);
  return grid[i][j];
}

function toggleTriangle(triangle) {
  if ( triangle.on ) {
    triangle.svg.style.opacity = 0;
    triangle.on = false;
  } else {
    triangle.svg.style.opacity = 1;
    triangle.on = true;
  }
}

function addTriangle() {
  toggleTriangle(currentTriangle);

  const row = currentTriangle.row;
  const column = currentTriangle.column;
  const orientation = currentTriangle.orientation;

  const adjacentTriangles = [ grid[row][column + 1], grid[row][column - 1] ];
  if (orientation === "up") {
    if ( grid[row + 1] ) adjacentTriangles.push(grid[row + 1][column]);
  } else {
    if ( grid[row - 1] ) adjacentTriangles.push(grid[row - 1][column]);
  }

  const availableOptions = adjacentTriangles.filter(function(option) {
    if ( option ) {
      if ( option.on !== currentTriangle.on ) {
        return option;
      }
    }
  });

  let nextTriangle = availableOptions[Math.floor(Math.random() * availableOptions.length)];

  if ( !nextTriangle ) {
    nextTriangle = randomTriangle();
  }

  currentTriangle = nextTriangle;
}

// Adds the triangle to the SVG AND returns a reference to the SVG element.
function drawTriangle(triangle) {
  const svgTriangle = document.createElementNS("http://www.w3.org/2000/svg", "path");
  svgTriangle.setAttribute("d", triangle.path);
  svgTriangle.setAttribute("class", "triangle");
  svgTriangle.style.stroke = "black";
  svgTriangle.style['stroke-width'] = "5px";
  svgTriangle.style.fill = triangle.fill;
  if ( !triangle.on ) {
    svgTriangle.style.opacity = 0;
  }
  svg.appendChild(svgTriangle);
  return svgTriangle;
}

// Utility function to get the SVG path string from an array of verticies.
function getSVGPathString(verts) {
  const SVGPathString = verts.reduce(function(previous, current) {
    return previous + " L " + current;
  });
  return "M " + SVGPathString + " z";
}
