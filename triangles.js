var height = window.innerHeight,
		width = window.innerWidth,
		center = [width/2, height/2],
		triangle_dim = 30,
		triangle_height = Math.sqrt(3/4) * triangle_dim,
		grid_width = Math.ceil(width/triangle_dim),
		grid_height = Math.ceil(height/triangle_height);

console.log(grid_height);

var triangle_maker;
var triangle_ids = [];
var grid = create_grid();
var current_triangle;

// Create svg
var svg = document.getElementsByTagName('svg')[0];
svg.setAttribute("width", width);
svg.setAttribute("height", height);
svg.setAttribute("onclick", "clearInterval(triangle_maker)");


function create_grid() {
	var grid = [];

	for (var i = 0; i < grid_width; i++) {
		for (var j = 0; j < grid_height; j++) {
			if (j % 2 === 0) {
				var point = {
					up_triangle: false,
					down_triangle: false,
					id: grid.length,
					x: i * triangle_dim - (triangle_dim * grid_width - width) / 2,
					y: j * triangle_height - (triangle_height * grid_height - height) / 2
				};
			} else {
				var point = {
					up_triangle: false,
					down_triangle: false,
					id: grid.length,
					x: triangle_dim / 2 + i * triangle_dim - (triangle_dim * grid_width - width) / 2,
					y: j * triangle_height - (triangle_height * grid_height - height) / 2
				};
			}
			grid.push(point);
		}
	}

	return grid;
}

function show_grid() {
	var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
	svg.appendChild(g);

	for (var i = 0; i < grid.length; i++) {
		var point = document.createElementNS("http://www.w3.org/2000/svg", "circle");
		point.setAttribute("cx", grid[i].x);
		point.setAttribute("cy", grid[i].y);
		point.setAttribute("r", 1);
		point.setAttribute("id", "grid_" + i);
		g.appendChild(point);
	}
}


function add_triangle() {
	console.log(current_triangle);
	var direction = Math.floor(Math.random() * 3);
	console.log(direction);

	var id = current_triangle.grid_point.id;

	if (current_triangle.up_down === "up") {
		if (direction === 0) {
			check_update_draw(id, "down");
		} else if (direction === 1) {
			check_update_draw(id - 1, "down");
		} else if (direction === 2) {
			check_update_draw(id - grid_height - 1, "down");
		}
	} else {
		if (direction === 0) {
			check_update_draw(id, "up");
		} else if (direction === 1) {
			check_update_draw(id + 1, "up");
		} else if (direction === 2) {
			check_update_draw(id + grid_height + 1, "up");
		}
	}
}

function check_update_draw(grid_id, up_down) {
	var old_id = current_triangle.id;
	if (grid[grid_id] === 'undefined') {
		add_triangle();
	} else if (up_down === "down" && grid[grid_id].down_triangle === false) {
		current_triangle = {
			id: old_id + 1,
			grid_point: grid[grid_id],
			up_down: "down"
		};
		draw_triangle(current_triangle);
	} else if (up_down === "up" && grid[grid_id].up_triangle === false) {
	 	current_triangle = {
			id: old_id + 1,
			grid_point: grid[grid_id],
			up_down: "up"
		};
		draw_triangle(current_triangle);
	} else {
		add_triangle();
	}
}


function draw_triangle(triangle) {

	var height;
	if (triangle.up_down === "up") {
		height = -triangle_height; // Negative b/c coordinates in SVG start in top left
		triangle.grid_point.up_triangle = true;
	} else {
		height = triangle_height;
		triangle.grid_point.down_triangle = true;
	}

	var verts = [ {x: triangle.grid_point.x, y: triangle.grid_point.y}, 
								{x: triangle.grid_point.x + triangle_dim, y: triangle.grid_point.y}, 
								{x: triangle.grid_point.x + triangle_dim / 2, y: triangle.grid_point.y + height} ];

	var svg_triangle = document.createElementNS("http://www.w3.org/2000/svg", 'path');
	svg_triangle.setAttribute("d", "M " + verts[0].x + " " + verts[0].y + " L " + verts[1].x
		+ " " + verts[1].y + " L " + verts[2].x + " " + verts[2].y + " z");
	svg_triangle.setAttribute("id", triangle.id);
	// svg_triangle.style.stroke = "white";
	// svg_triangle.style['stroke-width'] = "5px"; 
	svg_triangle.style.fill = "red";
	svg.appendChild(svg_triangle);

}

show_grid();

current_triangle = {
	id: 0,
	grid_point: grid[Math.floor(grid.length / 3)],
	up_down: "down"
};

draw_triangle(current_triangle);
var grid_id = current_triangle.grid_point.id;
check_update_draw(grid_id, "up");
check_update_draw(grid_id + 1, "up");
check_update_draw(grid_id + grid_height + 1, "up");

// add_triangle();
// add_triangle();
// add_triangle();
// add_triangle();

current_triangle = {
	id: 0,
	grid_point: grid[Math.floor(grid.length * 2 / 3)],
	up_down: "up"
};

draw_triangle(current_triangle);
var grid_id = current_triangle.grid_point.id;
check_update_draw(grid_id, "down");
check_update_draw(grid_id - 1, "down");
check_update_draw(grid_id - grid_height - 1, "down");

// add_triangle();
// add_triangle();
// add_triangle();


// triangle_maker = setInterval(add_triangle, 300);


