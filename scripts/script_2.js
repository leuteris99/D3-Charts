var width = 1200;
var height = 450;

// Create the svg
d3.select("#chart-2")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
        .append("g")
        .attr("id", "bargroup")
        .attr("width", width)
        .attr("height", height)
        .attr("transform", "translate(0,20)");

// link the data
d3.tsv("data/gr-unemployment.tsv",function(data){
    // the value axis text
    d3.select("#bargroup").append("g")
        .attr("id", "value-axis")
        .selectAll("text")
        .data([0,5,10,15,20,25,30])
        .enter()
            .append("text")
            .attr("y", function(d){ return 305 + (-d*10)})
            .text(function(d){return d + "%"; });

    // the bar in right of the value axis
    d3.select("#bargroup").append("rect")
        .attr("id", "value-bar")
        .attr("transform", "translate(0,-10)")
        .attr("width", 3)
        .attr("height", 340)
        .attr("x", 40)
        .attr("y", 0);

    // the bar above the years axis
    d3.select("#bargroup").append("rect")
        .attr("id", "years-bar")
        .attr("width", function(){ return yearlyData(data).length * 80 + 20; })
        .attr("height", 3)
        .attr("x", 10)
        .attr("y", 310);

    // the years axis text
    d3.select("#bargroup").append("g")
        .attr("id", "years-axis")
        .attr("transform", "translate(30,0)")
        .selectAll("text")
        .data(yearlyData(data))
        .enter()
            .append("text")
            .attr("x", function(d,i){ return i * 80 + 30; })
            .attr("y", 330)
            .text(function(d,i){ return i + 2004; });

    // create the on cursor hover text
    d3.select("#bargroup").append("g")
        .attr("id", "bars-percent-text")
        .selectAll("text")
        .data(yearlyData(data))
        .enter()
            .append("text")
            .attr("id", function(d,i){ return "percent" + i; })
            .attr("x", function(d,i){ return i * 80 + 65; })
            .attr("y", function(d){ return 300 - d*10.5; })
            .attr("display", "none")
            .text(function(d){ return trimDecimals(d,2); });


    // create the bars
    d3.select("#bargroup").append("g")
    .attr("id", "bars")
    .selectAll("rect")
    .data(yearlyData(data))
    .enter()
        .append("rect")
        .attr("id", function(d,i){ return "rect" + i; })
        .attr("width", 25)
        .attr("height", 10)
        .attr("y", 300)
        .attr("x", function(d,i){ return i * 80 + 65;})
        .attr("opacity", "1")
        .attr("fill", "crimson")
        .on("mouseover", function(d,i){ return onBarHover(i); })
        .on("mouseout", function(d,i){ return onBarOut(i); })
        .transition()
            .duration(1500)
            .attr("height", function(d){ return d*10 +10; })
            .attr("y", function(d){ return 300 - d*10; });
});

// takes the monthly data find the yearly average and parse it to an array
function yearlyData(d){
    var months = [];
    var yearD = [];
    for( var k = 0; k < 14; k++){
        var total = 0;
        for(var j = 0; j < 12; j++){
            months[j] = d[(k * 12) + j]["Ποσοστό ανεργίας"];
            total += parseInt(months[j],10);
        }        
        yearD[k] = total / 12;
    }
    return yearD;
}

// trim the number to the decimal of your choise
function trimDecimals(num,decimal){
    var dec = 1;
    for(var i = 0; i < decimal; i++){
        dec *= 10;
    }
    var round = Math.round(num * dec);
    round /= dec;
    return round;
}

// triggers when the cursor is hoverin a bar
function onBarHover(i){
    var selectedTxt = "#percent" + i;
    var selectedBar = "#bargroup #bars #rect" + i;
    d3.select(selectedTxt)
        .attr("display", "block");

    d3.select(selectedBar)
        .attr("opacity", "0.8");
}
//triggers when the cursor is leaving a bar
function onBarOut(i){
    var selectedTxt = "#percent" + i;
    var selectedBar = "#bargroup #bars #rect" + i;
    d3.select(selectedTxt)
        .attr("display", "none");

    d3.select(selectedBar)
    .attr("opacity", "1");
}

/* 
---------- Testing Console ----------

console.log(yearlyData(data));
console.log(data[(2005-2004) * 12 + 2]);

console.log(data[0]["Ημερομηνία"]);
console.log(data);
*/