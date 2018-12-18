var width = 1200;
var height = 450;

// Create the svg
d3.select("#chart-1")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
        .append("g")
        .attr("id", "pointgroup")
        .attr("width", width)
        .attr("height", height)
        .attr("transform", "translate(0,20)");

//link to data source: http://www.statistics.gr/el/statistics/-/publication/SEL15/-
//GDP - ΑΕΠ (1995-2017 Greece)
d3.tsv("data/gr-gdp.tsv", function(data){
    var yearScale = [1995,1996,1997,1998,1999,2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017];
    var yearlyData = [data[21][yearScale[0]],data[21][yearScale[1]],data[21][yearScale[2]],data[21][yearScale[3]],data[21][yearScale[4]],data[21][yearScale[5]],data[21][yearScale[6]],data[21][yearScale[7]],data[21][yearScale[8]],data[21][yearScale[9]],data[21][yearScale[10]],data[21][yearScale[11]],data[21][yearScale[12]],data[21][yearScale[13]],data[21][yearScale[14]],data[21][yearScale[15]],data[21][yearScale[16]],data[21][yearScale[17]],data[21][yearScale[18]],data[21][yearScale[19]],data[21][yearScale[20]],data[21][yearScale[21]],data[21][yearScale[22]]];

    // the value axis text
    d3.select("#pointgroup").append("g")
        .attr("id", "value-axis")
        .selectAll("text")
        .data([0,50,100,150,200,250,300])
        .enter()
            .append("text")
            .attr("y", function(d){ return 305 + (-d)})
            .text(function(d){return d; });

    // the bar in right of the value axis
    d3.select("#pointgroup").append("rect")
        .attr("id", "value-bar")
        .attr("transform", "translate(0,-10)")
        .attr("width", 3)
        .attr("height", 340)
        .attr("x", 30)
        .attr("y", 0);

    // the points on the graph  
    d3.select("#pointgroup").append("g")
        .attr("id", "points")
        .attr("transform", "translate(30,0)")
        .selectAll("circle")
        .data(yearlyData)
        .enter()
            .append("circle")
            .attr("id", function(d,i){ return "circle" + (1995+ i); })
            .attr("fill", "lightseagreen")
            .attr("cx", function(d,i){ return i * 50 + 30; })
            .attr("cy", 280)
            .attr("r", 5)
            .transition()
                .duration(1500)
                .attr("cy", function(d){ return 300 + (-d); });

    // the bar above the years axis
    d3.select("#pointgroup").append("rect")
        .attr("id", "years-bar")
        .attr("width", function(){ return yearlyData.length * 50 + 20; })
        .attr("height", 3)
        .attr("x", 10)
        .attr("y", 310);

    // the years axis text
    d3.select("#pointgroup").append("g")
        .attr("id", "years-axis")
        .attr("transform", "translate(30,0)")
        .selectAll("text")
        .data(yearScale)
        .enter()
            .append("text")
            .attr("x", function(d,i){ return i * 50 + 10; })
            .attr("y", 330)
            .text(function(d){ return d; });
});

// ---------- Testing Console ----------
// console.log(data);
// console.log(data[21]);
// console.log(data[21][2017]);