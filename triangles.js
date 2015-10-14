var height = window.innerHeight;
var width = window.innerWidth;
var triangle_dim = 50;
var triangle_height = Math.sqrt(3/4) * triangle_dim;
var grid_width = Math.ceil(width / triangle_dim * 3 / 2);
var grid_height = Math.ceil(height / triangle_height);
var center_x = Math.floor(grid_width / 2);
var center_y = Math.floor(grid_height / 2);

var svg = document.getElementsByTagName('svg')[0];
svg.setAttribute("width", width);
svg.setAttribute("height", height);
svg.setAttribute("onclick", "clearInterval(triangle_maker)");

var triangle_maker;
var triangles = [];
var grid = create_grid();
var colors = ["red", "orange", "yellow", "green", "blue", "purple"];

var current_triangle = {
  grid_point: grid[center_y][center_x],
  orientation: "left",
  fill: "red"
};

draw_triangle(current_triangle);

triangle_maker = setInterval(add_triangle, 300);

// show_grid();

function create_grid() {
  var grid = [];
  for (var i = 0; i <= grid_height; i++) {
    var row = [];
    for (var j = 0; j <= grid_width; j++) {
      var offset = 0
      if (i > 0) {
        offset = grid[i - 1][0].x - triangle_dim / 2;
      }
      var point = {
        left: false,
        right: false,
        id: [i, j],
        x: offset + j * triangle_dim,
        y: i * triangle_height
      };
      row.push(point);
    }
    grid.push(row);
  }

  return grid;
}

function show_grid() {
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


function add_triangle() {

  var x = current_triangle.grid_point.id[0];
  var y = current_triangle.grid_point.id[1];

  var options = [];
  if (current_triangle.orientation === "left") {
    options = [[x, y, "right"], [x + 1, y, "right"], [x, y - 1, "right"]];
  } else {
    options = [[x, y, "left"], [x - 1, y, "left"], [x, y + 1, "left"]];
  }

  var avail_options = options.filter(is_in_bounds);

  if (avail_options.length === 0) {
    current_triangle = triangles[Math.floor(Math.random() * triangles.length)];
    add_triangle();
    return;
  }

  var next_triangle = avail_options[Math.floor(Math.random() * avail_options.length)];
  var fill_index = colors.indexOf(current_triangle.fill);
  if ( is_filled(next_triangle) ) {
    fill_index += 1;
    if ( fill_index >= colors.length ) {
      fill_index = 0;
    }
  }
  var x = next_triangle[0];
  var y = next_triangle[1];

  if (current_triangle.orientation === "left") {
    current_triangle = {
      grid_point: grid[x][y],
      orientation: "right",
      fill: colors[fill_index]
    };
    draw_triangle(current_triangle);
  } else {
    current_triangle = {
      grid_point: grid[x][y],
      orientation: "left",
      fill: colors[fill_index]
    };
    draw_triangle(current_triangle);
  }
}

function is_in_bounds(option) {
  var x = option[0];
  var y = option[1];
  var orientation = option[2];

  var in_bounds = true;

  if ( grid[x] === undefined ) {
    in_bounds = false;
  } else if ( grid[x][y] === undefined ) {
    in_bounds = false;
  }

  return in_bounds;
}

function is_filled(option) {
  var x = option[0];
  var y = option[1];
  var orientation = option[2];

  var filled = false;

  if ( grid[x][y][orientation] ) {
    filled = true;
  }

  return filled;
}

function draw_triangle(triangle) {
  var rotation;
  if (triangle.orientation === "left") {
    rotation = 0;
    grid[triangle.grid_point.id[0]][triangle.grid_point.id[1]].left = true;
  } else {
    rotation = 60;
    grid[triangle.grid_point.id[0]][triangle.grid_point.id[1]].right = true;
  }

  var verts = [ {x: triangle.grid_point.x, y: triangle.grid_point.y},
    {x: triangle.grid_point.x - triangle_dim / 2, y: triangle.grid_point.y + triangle_height},
    {x: triangle.grid_point.x + triangle_dim / 2, y: triangle.grid_point.y + triangle_height} ];

  var svg_triangle = document.createElementNS("http://www.w3.org/2000/svg", "path");
  svg_triangle.setAttribute("d", "M " + verts[0].x + " " + verts[0].y + " L " + verts[1].x + " " + verts[1].y + " L " + verts[2].x + " " + verts[2].y + " z");
  svg_triangle.setAttribute("transform", "rotate(" + rotation + ", " + verts[2].x + ", " + verts[2].y + ")")
  svg_triangle.style.stroke = "white";
  svg_triangle.style['stroke-width'] = "5px";
  svg_triangle.style.fill = triangle.fill;
  svg.appendChild(svg_triangle);

  triangles.push(triangle);
}

