var height = window.innerHeight,
		width = window.innerWidth,
		center = [width/2, height/2],
		triangle_dim = 30,
		triangle_height = Math.sqrt(3/4) * triangle_dim;

var triangle_maker;

// Create svg
var svg = document.getElementsByTagName('svg')[0];
svg.setAttribute("width", width);
svg.setAttribute("height", height);
svg.setAttribute("onclick", "clearInterval(triangle_maker)");


function draw_triangle(verts, id) {

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

function rotate(verts, id) {



	draw_triangle(new_verts, id++);
}

function add_triangle() {
	var existing_triangle = svg.lastChild;
	var d = existing_triangle.getAttribute("d").split(" ");

	var verts = [ {x: d[1], y: d[2]},
								{x: d[4], y: d[5]},
								{x: d[7], y: d[8]} ];

	var rotation_vert = Math.floor(Math.random() * 3);

	var new_triangle = document.createElementNS("http://www.w3.org/2000/svg", 'path')
	new_triangle.setAttribute("d", "M " + verts[0].x + " " + verts[0].y + " L " + verts[1].x
		+ " " + verts[1].y + " L " + verts[2].x + " " + verts[2].y + " z");
	new_triangle.setAttribute("transform", "rotate(60 " + verts[rotation_vert].x + " " + verts[rotation_vert].y + ")");
	new_triangle.style.stroke = "white";
	new_triangle.style["stroke-width"] = "5px";
	new_triangle.style.fill = "red";
	svg.appendChild(new_triangle);

}


function remove_triangle(child, grid_point) {
	console.log(svg);
	console.log(child);
	svg.removeChild(child);
	grid_point.has_square = false;
	grid[grid_point.id] = grid_point;
	draw_random_square(grid);
}

function start_fade_in(svg_element) {
	var opacity = svg_element.getAttribute("opacity");
	
	var fade = setInterval(function() {
			if (svg_element.getAttribute("opacity") >= 0.9) {
				clearInterval(fade);
			}
			fade_in(svg_element);
		}, 10);
}

function fade_in(svg_element, fade) {
	console.log("opacity up!");
	var opacity = svg_element.getAttribute("opacity");
	var new_opacity = Number(opacity) + 0.1;
	svg_element.setAttribute("opacity", new_opacity);
}

function start_fade_out(svg_element) {
	var fade = setInterval(function() {
			if (svg_element.getAttribute("opacity") <= 0.1) {
				clearInterval(fade);
			}
			fade_out(svg_element);
		}, 10);
}

function fade_out(svg_element, fade) {
	console.log("opacity down!")
	var opacity = svg_element.getAttribute("opacity");	
	var new_opacity = Number(opacity) - 0.1;
	svg_element.setAttribute("opacity", new_opacity);
}

var x = center[0], y = center[1];

var verts = [ {x: x, y: y}, 
							{x: x + triangle_dim, y: y}, 
							{x: x + triangle_dim/2, y: y + triangle_height} ];


draw_triangle(verts, "MIDDLE");
// var square = svg.getElementById("MIDDLE");
// setTimeout(start_fade_out, 1000, square);

triangle_maker = setInterval(add_triangle, 300);


