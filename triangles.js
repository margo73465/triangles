var height = window.innerHeight,
		width = window.innerWidth,
		center = [width/2, height/2],
		triangle_dim = 30,
		triangle_height = Math.sqrt(3/4) * triangle_dim;

var triangle_maker;
var triangle_ids = [];

// Create svg
var svg = document.getElementsByTagName('svg')[0];
svg.setAttribute("width", width);
svg.setAttribute("height", height);
svg.setAttribute("onclick", "clearInterval(triangle_maker)");

function add_triangle() {
	var id = Math.floor(Math.random() * triangle_ids.length);
	flip_and_draw(id);
}

function flip_and_draw(id) {
	// console.log("id = " + id);

	var existing_triangle = svg.lastChild;
	// var existing_triangle = svg.getElementById(id);
	var d = existing_triangle.getAttribute("d").split(" ");

	var verts = [ {x: Number(d[1]), y: Number(d[2])},
								{x: Number(d[4]), y: Number(d[5])},
								{x: Number(d[7]), y: Number(d[8])} ];

	var flip_vert_index = Math.floor(Math.random() * 3);
	var flip_vert = verts.splice(flip_vert_index, 1);	
	var opposite_midpoint = find_midpoint(verts);

	var flipped_vert = {
		x: flip_vert[0].x + (opposite_midpoint.x - flip_vert[0].x) * 2,
		y: flip_vert[0].y + (opposite_midpoint.y - flip_vert[0].y) * 2
	};

	verts.push(flipped_vert)
	
	var new_id = id + 1;

	draw_triangle(verts, new_id);
}

function draw_triangle(verts, id) {

	triangle_ids.push(id);

	var triangle = document.createElementNS("http://www.w3.org/2000/svg", 'path');
	triangle.setAttribute("d", "M " + verts[0].x + " " + verts[0].y + " L " + verts[1].x
		+ " " + verts[1].y + " L " + verts[2].x + " " + verts[2].y + " z");
	triangle.setAttribute("id", id);
	triangle.style.stroke = "white";
	triangle.style['stroke-width'] = "5px"; 
	triangle.style.fill = "red";
	svg.appendChild(triangle);

 	// start_fade_in(triangle);
}

function find_midpoint(verts) {
	if (verts.length != 2) {
		console.log("not gonna find more than one midpoint, sorry");
	}

	var mid_x = (verts[0].x + verts[1].x) / 2;
	var mid_y = (verts[0].y + verts[1].y) / 2;

	return {x: mid_x, y: mid_y};
}

function remove_triangle(child, grid_point) {
	console.log(svg);
	console.log(child);
	svg.removeChild(child);
	grid_point.has_square = false;
	grid[grid_point.id] = grid_point;
	draw_random_square(grid);
}

var x = center[0], y = center[1];

var verts = [ {x: x, y: y}, 
							{x: x + triangle_dim, y: y}, 
							{x: x + triangle_dim/2, y: y + triangle_height} ];


draw_triangle(verts, 0);
//rotate_and_draw(0)
// var square = svg.getElementById("MIDDLE");
// setTimeout(start_fade_out, 1000, square);

triangle_maker = setInterval(add_triangle, 300);


