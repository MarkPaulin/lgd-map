var width = 500,
    height = 400,
    margin = {top: 50, right: 50, bottom: 50, left: 80};

var projection = d3.geoAlbers()
    .center([-2.2, 54.7])
    .rotate([4.4, 0])
    .parallels([50, 60])
    .scale(14500)
    .translate([width / 2, height / 2]);

var path = d3.geoPath()
    .projection(projection);

var canvas_svg = d3.select("#plotArea")
  .append("svg")
    .attr("height", height)
    .attr("width", 2 * width);

var map_svg = canvas_svg.append("g")
    .attr("id", "map");

var chart_svg = canvas_svg.append("g")
    .attr("id", "chart")
    .attr("transform", `translate(${width}, 0)`);

var files = ["data/simple_lgd.json", "data/lgd_change.json"];

var promises = [];

files.forEach(function(p) {
  promises.push(d3.json(p));
});

Promise.all(promises).then(draw);
