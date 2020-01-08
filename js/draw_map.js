var draw = function(files) {

  const map_data = files[0],
    lgd_data = files[1];

  const map = topojson.feature(map_data, map_data.objects.simple_lgd);
  console.log(map.features);

  map_svg.selectAll("path.lgd")
    .data(map.features)
      .enter()
    .append("path")
      .attr("class", "lgd")
      .attr("id", d => d.properties.LGDCODE)
      .attr('d', path)
      .on("mouseover", function() {
        d3.select(this).classed("lgd-hover", true);
        d3.select(".line-ghost#" + d3.select(this).attr("id")).classed("line-hover", true);
      })
      .on("mouseout", function() {
        d3.select(this).classed("lgd-hover", false);
        d3.select(".line-ghost#" + d3.select(this).attr("id")).classed("line-hover", false);
      })
      .on("click", function() {
        if (d3.select(this).classed("lgd-click")) {
          draw_line("N92000002");

          d3.select(this).classed("lgd-click", false);
          d3.select(".line-ghost#" + d3.select(this).attr("id")).classed("line-click", false);
        } else {
          d3.selectAll(".lgd-click").classed("lgd-click", false);

          draw_line(d3.select(this).attr("id"));
          console.log(d3.select(this).attr("id"));

          d3.select(this).classed("lgd-click", true);
          d3.select(".line-ghost#" + d3.select(this).attr("id")).classed("line-click", true);
        }
      });

  lgd_data.forEach(function(d) {
    d.year = new Date(d.year, 0);
  });

  var ni_data = lgd_data.filter(d => d.lgd_code === "N92000002");

  var title = chart_svg.append("text")
    .datum(ni_data[0])
    .attr("id", "chart-title")
    .attr("x", 0)
    .attr("dy", "1em")
    .text(d => d.lgd_name);

  chart_svg.append("text")
    .attr("id", "chart-subtitle")
    .attr("x", 0)
    .attr("dy", "3em")
    .text("Population change, mid-year to mid-year, 2002 - 2018. Source: nisra.gov.uk");

  var domain_year = d3.extent(lgd_data, d => d.year),
    domain_change = d3.extent(lgd_data, d => d.change);

  var scale_change = d3.scaleLinear()
    .domain(domain_change)
    .range([height - margin.bottom, margin.top])
    .nice();

  var axis_change = d3.axisLeft()
    .scale(scale_change)
    .ticks(5)
    .tickSize(-width + margin.left + margin.right)
    .tickFormat(d3.format(".1%"));

  var scale_year = d3.scaleTime()
    .domain(domain_year)
    .range([margin.left, width - margin.right]);

  var axis_year = d3.axisBottom()
    .scale(scale_year)
    .tickSize(2)
    .ticks(d3.timeYear.every(1))
    .tickFormat(d => (d.getFullYear() % 5 === 0 ? d.getFullYear() : null));

  chart_svg.append("g")
    .attr("class", "grid")
    .attr("transform",
      `translate(${margin.left}, 0)`)
      .call(axis_change);

  chart_svg.append("g")
    .attr("transform",
      `translate(0, ${height - margin.bottom})`)
    .call(axis_year);

  var line = d3.line()
      .x(function(d) { return scale_year(d.year); })
      .y(function(d) { return scale_change(d.change); })

  var lgd_nest = d3.nest()
    .key(d => d.lgd_code)
    .entries(lgd_data);

  chart_svg.selectAll(".line-ghost")
    .data(lgd_nest).enter()
    .append("path")
    .attr("class", "line-ghost")
    .attr("id", d => d.key)
    .attr("d", d => line(d.values))
    .on("mouseover", function() {
      d3.select(this).classed("line-hover", true);
      d3.select(".lgd#" + d3.select(this).attr("id")).classed("lgd-hover", true);
    })
    .on("mouseout", function() {
      d3.select(this).classed("line-hover", false);
      d3.select(".lgd#" + d3.select(this).attr("id")).classed("lgd-hover", false);
    })
    .on("click", function() {
      if (d3.select(this).classed("line-click")) {
        draw_line("N92000002");

        d3.select(this).classed("line-click", false);
        d3.select(".lgd#" + d3.select(this).attr("id")).classed("lgd-click", false);
      } else {
        d3.selectAll(".line-click").classed("line-click", false);
        d3.selectAll(".lgd-click").classed("lgd-click", false);

        draw_line(d3.select(this).attr("id"));

        d3.select(this).classed("line-click", true);
        d3.select(".lgd#" + d3.select(this).attr("id")).classed("lgd-click", true);
      }

    });

  chart_svg.append("path")
    .datum(ni_data)
    .attr("class", "line")
    .attr("d", line);

  var draw_line = function(lgd) {
    console.log(lgd);
    new_data = lgd_data.filter(d => d.lgd_code === lgd);

    d3.select("#chart-title").text(new_data[0].lgd_name);

    chart_svg.selectAll(".line")
      .datum(new_data)
      .transition()
      .duration(750)
      .attr("d", line);
  }
}
