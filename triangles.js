var height = window.innerHeight,
		width = window.innerWidth,
		center = [width/2, height/2],
		triangle_dim = 50,
		triangle_height = Math.sqrt(3/4) * triangle_dim,
		grid_width = Math.ceil(width/triangle_dim),
		grid_height = Math.ceil(height/triangle_height);

// console.log(grid_height);

var triangle_maker;
var triangle_ids = [];


// Create svg
var svg = document.getElementsByTagName('svg')[0];
svg.setAttribute("width", width);
svg.setAttribute("height", height);
svg.setAttribute("onclick", "clearInterval(triangle_maker)");

var grid = create_grid();
console.log(grid);

x = 10, y = 10;

current_triangle = {
	// id: "left_" + 0,
	// grid_point: grid[Math.floor(grid.length / 3)],
	// grid_point: grid[Math.floor(grid_height / 2)][Math.floor(grid_width / 2)],
	grid_point: grid[x][y],
	left_right: "left"
};

draw_triangle(current_triangle);

// check_update_draw(x, y, "right");
// check_update_draw(x, y - 1, "right");
// check_update_draw(x + 1, y, "right");

// add_triangle();
// add_triangle();
// add_triangle();
// add_triangle();

// x = 4, 20;

// current_triangle = {
// 	// id: 0,
// 	grid_point: grid[x][y],
// 	left_right: "right"
// };

// draw_triangle(current_triangle);

// // var grid_id = current_triangle.grid_point.id;
// check_update_draw(x, y, "left");
// check_update_draw(x, y + 1, "left");
// check_update_draw(x - 1, y, "left");

// add_triangle();
// add_triangle();
// add_triangle();


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
				left_triangle: false,
				right_triangle: false,
				id: [i,j],
				x: offset + j * triangle_dim, //- (triangle_dim * grid_width - width) / 2,
				y: i * triangle_height //- (triangle_height * grid_height - height) / 2
			};
			// draw_triangle({
			// 	id: grid.length + "_up",
			// 	grid_point: point,
			// 	left_right: "left"
			// });
			// draw_triangle({
			// 	//id: grid.length + "_down",
			// 	grid_point: point,
			// 	left_right: "right"
			// });
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
	console.log(current_triangle);
	var direction = Math.floor(Math.random() * 3);
	console.log(direction);

	var x = current_triangle.grid_point.id[0],
			y = current_triangle.grid_point.id[1];

	if (current_triangle.left_right === "left") {
		if (direction === 0) {
			check_update_draw(x, y, "right");
		} else if (direction === 1) {
			check_update_draw(x + 1, y, "right");
		} else if (direction === 2) {
			check_update_draw(x, y - 1, "right");
		}
	} else {
		if (direction === 0) {
			check_update_draw(x, y, "left");
		} else if (direction === 1) {
			check_update_draw(x - 1, y, "left");
		} else if (direction === 2) {
			check_update_draw(x, y + 1, "left");
		}
	}
}

function check_update_draw(x, y, left_right) {
	// var old_id = current_triangle.id;
	if (grid[x][y] === 'undefined') {
		add_triangle();
	} else if (left_right === "left" && grid[x][y].left_triangle === false) {
		current_triangle = {
			// id: old_id + 1,
			grid_point: grid[x][y],
			left_right: "left"
		};
		draw_triangle(current_triangle);
	} else if (left_right === "right" && grid[x][y].right_triangle === false) {
	 	current_triangle = {
			// id: old_id + 1,
			grid_point: grid[x][y],
			left_right: "right"
		};
		draw_triangle(current_triangle);
	} else {
		add_triangle();
	}
}


function draw_triangle(triangle) {

	var rotation, fill;
	if (triangle.left_right === "left") {
		rotation = 0;
		fill = "red"
		triangle.grid_point.left_triangle = true;
	} else {
		rotation = 60;
		fill = "red"
		triangle.grid_point.right_triangle = true;
	}

	var verts = [ {x: triangle.grid_point.x, y: triangle.grid_point.y}, 
								{x: triangle.grid_point.x - triangle_dim / 2, y: triangle.grid_point.y + triangle_height}, 
								{x: triangle.grid_point.x + triangle_dim / 2, y: triangle.grid_point.y + triangle_height} ];

	var svg_triangle = document.createElementNS("http://www.w3.org/2000/svg", "path");
	svg_triangle.setAttribute("d", "M " + verts[0].x + " " + verts[0].y + " L " + verts[1].x
		+ " " + verts[1].y + " L " + verts[2].x + " " + verts[2].y + " z");
	// svg_triangle.setAttribute("id", triangle.id);
	svg_triangle.setAttribute("transform", "rotate(" + rotation + ", " + verts[2].x + ", " + verts[2].y + ")")
	svg_triangle.style.stroke = "white";
	svg_triangle.style['stroke-width'] = "5px"; 
	svg_triangle.style.fill = fill;
	svg.appendChild(svg_triangle);

	// var center_dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
	// center_dot.setAttribute("cx", verts[2].x);
	// center_dot.setAttribute("cy", verts[2].y - height * 2 / 3);
	// center_dot.setAttribute("r", 3);
	// svg.appendChild(center_dot);

}


