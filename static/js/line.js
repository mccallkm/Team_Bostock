// Define SVG area dimensions
var svgWidth = 1000;
var svgHeight = 600;

// Define the chart's margins as an object
var margin = {
    top: 60,
    right: 60,
    bottom: 60,
    left: 60
};

// Define dimensions of the chart area
var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;


// Select div, append SVG area to it, and set its dimensions
var svg = d3.select("#line")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);


// Append a group area, then set its margins
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);


// Configure a parseTime function which will return a new Date object from a string
var parseTime = d3.timeParse("%Y");
// var data = [];

// Load data
d3.json("/citation").then(function(cntData) {

    // Throw an error if one occurs
    // if (error) throw error;

    // Print the citation counts
    // console.log(cntData);

    // Format the date and cast the cnt value to a number
    cntData.forEach(function(data) {

        // data.date = parseTime(data.responseDate);
        data.date = data.responseDay;
        data.cnt = +data.citationCnt;
    });

    // Configure a time scale
    // d3.extent returns the an array containing the min and max values for the property specified

    var xLinearScale = d3.scaleLinear()
        .domain(d3.extent(cntData, data => data.date))
        .range([0, chartWidth]);

    // Configure a linear scale with a range between the chartHeight and 0
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(cntData, data => data.cnt), d3.max(cntData, data => data.cnt)]).nice()
        .range([chartHeight, 0]);

    // Create two new functions passing the scales in as arguments
    // These will be used to create the chart's axes
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Configure a line function which will plot the x and y coordinates using our scales
    var drawLine = d3.line()
        .x(data => xLinearScale(data.date))
        .y(data => yLinearScale(data.cnt))
        .curve(d3.curveMonotoneX);

    // Append an SVG path and plot its points using the line function
    chartGroup.append("path")


    // The drawLine function returns the instructions for creating the line
    .attr("d", drawLine(cntData))
        .classed("line", true);

    // Append an SVG group element to the chartGroup, create the left axis inside of it
    chartGroup.append("g")
        .classed("axis", true)
        .call(leftAxis);

    // Append an SVG group element to the chartGroup, create the bottom axis inside of it
    // Translate the bottom axis to the bottom of the page
    chartGroup.append("g")
        .classed("axis", true)
        .attr("transform", "translate(0, " + chartHeight + ")")
        .call(bottomAxis);


    // append circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(cntData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.date))
        .attr("cy", d => yLinearScale(d.cnt))
        .attr("r", "10")
        .attr("fill", "gold")
        .attr("stroke-width", "1")
        .attr("stroke", "black")
});