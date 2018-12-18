var year = 2008;
var width = 1500;
var height = 750;

// bind the data
d3.csv("data/eu-gdp.csv", function(data){
    var yearData = []; // contains the data for all nations for 1 year
    yearData = getData(year);
    
    var radiusScale = d3.scaleSqrt().domain([1,16000000]).range([5,100]);
    var colors = d3.scaleLinear().domain([5000,10000,50000,500000,1000000,5000000,16000000]).range(["red","orange","green","cyan","lightblue","steelblue","blue"]);

    // Create the svg
    var svg = d3.select("#chart-3")
        .append("svg")
        .attr("height", height)
        .attr("width", width)
            .append("g")
            .attr("id", "bubbles")
            .attr("transform", "translate(0,0)");

    // Initialize the group that shows the nation and it's gdp when a circle is hovered
    var gdpTxt = d3.select("#chart-3 svg")
        .append("g")
            .attr("transform", "translate(80,100)")
            .attr("id", "gdpGroup");
    
    // text that contains the name of the selected nation
    gdpTxt.append("text")
        .attr("id", "gdpNation")
        .attr("font-size", "3em")
        .text("Select a Nation");
    // text that contains the gdp of the selected nation
    gdpTxt.append("text")
        .attr("id", "gdpValue")
        .attr("transform", "translate(0,50)")
        .attr("font-size", "2em")
        .text("");

    // initialize the buttons that change the year
    var yearToggle = d3.select("#chart-3 svg")
        .append("g")
            .attr("id", "yearToggle")
            .attr("transform", function(d){ return "translate(50," + (height/2) + ")"; });

    // create the text that shows the selected year
    yearToggle.append("text")
        .attr("id", "yearCounter")
        .attr("font-size", "2em")
        .text(year);

    // the triangle-up
    yearToggle.append("path")
        .attr("d", d3.symbol().size(500).type(d3.symbolTriangle))
        .attr("transform", "translate(35,-50)")
        .on("click", function(d){ plusYear(d); });
    // the triangle-down
    yearToggle.append("path")
        .attr("d", d3.symbol().size(500).type(d3.symbolTriangle))
        .attr("transform", "translate(35,30) rotate(180)")
        .on("click", function(d){ minusYear(d); });

    // begin of the simulation
    var simulation = d3.forceSimulation()
        .force("x", d3.forceX(width / 2).strength(0.05))
        .force("y", d3.forceY(height / 2).strength(0.05))
        .force("collide", d3.forceCollide(function(d){ return radiusScale(parseInt(d.Value)); }));
    
    // creates the groups that contains the circles
    var circlesGroup = svg.selectAll(".nation")
        .data(yearData)
        .enter()
            .append("g")
            .attr("class", "nation")
            .attr("id", function(d,i){ return "circle" + i; })
            .on("mouseover", function(d,i){ onBubbleHover(d,i); })
            .on("mouseout", function(d,i){ onBubbleOut(d,i); });

    // create the circles
    var circles = circlesGroup.append("circle")
                .attr("r", function(d){ return radiusScale(parseInt(d.Value)); })
                .attr("fill", function(d){ return colors(parseInt(d.Value)); });
    // create the text with the name of the nation when selected
    var circleText = circlesGroup.append("text")
        .text(function(d){ return d.GEO; })
        .attr("display", "none");

    // add ticks to simulation to update the data
    simulation.nodes(yearData)
        .on("tick", ticked);

    // updates the data to simulation
    function ticked(){
        circles
            .attr("cx", function(d){ return d.x; })
            .attr("cy", function(d){ return d.y; });

        circleText
            .attr("x", function(d){ return d.x - radiusScale(parseInt(d.Value)); })
            .attr("y", function(d){ return d.y; });
    }

    // triggers when a circle is hovered
    function onBubbleHover(d,i){
        var selBubble = "#circle" + i 
        var selTxt = selBubble + " text";
        svg.select(selTxt).attr("display", "block");

        gdpTxt.select("#gdpNation").text(d.GEO);
        gdpTxt.select("#gdpValue").text(d.Value + " M. Euros");

        svg.select(selBubble).raise();
    }
    // triggers when the cursor leave the circle
    function onBubbleOut(d,i){
        var selTxt = "#circle" + i + " text";
        d3.select(selTxt).attr("display", "none");
    }

    // triggers when add a year from the yearToggle
    // update all the data to the new year
    function plusYear(d){
        if (year < 2017) {
            year++;
            yearToggle.select("#yearCounter")
                .text(year);
            
            // sort the DOM of the circles(so the data can pass right)
            for(var k = 0; k < yearData.length; k++){
                var selected = "#circle" + k;
                svg.select(selected)
                    .raise();
            }
            
            yearData = getData(year); // update the data

            // update the data to the the text of the circles (yt - text inside the bubbles)
            var yt = d3.select("#chart-3 svg #bubbles").selectAll("text")
                .data(yearData);
            // update the data to the circles (c - circle)
            svg.selectAll(".nation")
                .data(yearData);

            var c = svg.selectAll("circle")
                .data(yearData);

                c.exit().remove(); // removes circles that their data no longer exist
                c.enter().append("circle") // create new circles from new data
                    .attr("r", 0);

                // start of a new simulation
                var newsimulation = d3.forceSimulation()
                    .force("x", d3.forceX(width / 2).strength(0.05))
                    .force("y", d3.forceY(height / 2).strength(0.05))
                    .force("collide", d3.forceCollide(function(d){ return radiusScale(parseInt(d.Value)); }));
                
                    newsimulation.nodes(yearData)
                    .on("tick", tickedUpdate);

                // updates the ticks
                function tickedUpdate(){
                    c
                        .attr("cx", function(d){ return d.x; })
                        .attr("cy", function(d){ return d.y; });

                    yt
                        .attr("x", function(d){ return d.x - radiusScale(parseInt(d.Value)); })
                        .attr("y", function(d){ return d.y; });
                }
                c.transition()
                    .duration(1500)
                    .attr("r", function(d){ return radiusScale(parseInt(d.Value)); });

            

                yt.exit().remove();
                yt.enter().append("text")
                    .text(function(d){ return d.GEO; });

                
        }
    }
    // same functionality as the plusYear() but for the previous year instead
    function minusYear(d){
        if (year > 2008) {
            year--;
            yearToggle.select("#yearCounter")
                .text(year);

            // sort the DOM of the circles(so the data can pass right)
            for(var k = 0; k < yearData.length; k++){
                var selected = "#circle" + k;
                svg.select(selected)
                    .raise();
            }
            
            yearData = getData(year);

            var yt = d3.select("#chart-3 svg #bubbles").selectAll("text")
                .data(yearData);

            svg.selectAll(".nation")
                .data(yearData);

            var c = svg.selectAll("circle")
                .data(yearData)

                c.exit().remove();
                c.enter().append("circle")
                    .attr("r", 0);

                var newsimulation = d3.forceSimulation()
                    .force("x", d3.forceX(width / 2).strength(0.05))
                    .force("y", d3.forceY(height / 2).strength(0.05))
                    .force("collide", d3.forceCollide(function(d){ return radiusScale(parseInt(d.Value)); }));
                
                    newsimulation.nodes(yearData)
                    .on("tick", tickedUpdate);


                function tickedUpdate(){
                    c
                        .attr("cx", function(d){ return d.x; })
                        .attr("cy", function(d){ return d.y; });

                    yt
                        .attr("x", function(d){ return d.x - radiusScale(parseInt(d.Value)); })
                        .attr("y", function(d){ return d.y; });
                }
                c.transition()
                    .duration(1500)
                    .attr("r", function(d){ return radiusScale(parseInt(d.Value)); });

            

                yt.exit().remove();
                yt.enter().append("text")
                    .text(function(d){ return d.GEO; });
        }
    }

    // find the data of the selected year and parse them to an array
    // than returns the array
    function getData(year){
        var yearData = [];
        for(var i = 0, k = 0; i < data.length; i++){
            if (parseInt(data[i].TIME,10) === year) {
                yearData[k] = data[i];
                k++;
            }
        }
        return yearData;
    }
});

/*  
---------- Testing Console ----------
    console.log(data);
    console.log(data[0]);
    console.log(data[0].GEO);
    console.log(data.length);
    console.log(yearData); 
*/