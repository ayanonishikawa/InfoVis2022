var data;
d3.csv("https://ayanonishikawa.github.io/InfoVis2022/W04/vitaminC_ranking.csv")
    .then(data => {
        data.forEach(d => {
            d.label = d.name; d.value = +d.amount;
            console.log(d.label + "," + d.value)
        });
        this.data=data;
        console.log("ok10");
    })
    .catch(error => {
        console.log(error);
    });

var width = 500;
var height = 300;
var margin = { top: 50, right: 10, bottom: 70, left: 120};
console.log(data.value);

var svg = d3.select('#drawing_region');

var chart = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

const inner_width = width - margin.left - margin.right;
const inner_height = height - margin.top - margin.bottom;

// Initialize axis scales
const xscale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.value)])
    .range([0, inner_width]);

const yscale = d3.scaleBand()
    .domain(data.map(d => d.label))
    .range([0, inner_height])
    .paddingInner(0.1);

// Initialize axes
const xaxis = d3.axisBottom(xscale)
    .ticks(5)
    .tickSizeOuter(0);

const yaxis = d3.axisLeft(yscale)
    .tickSizeOuter(0);

// Draw the axis
const xaxis_group = chart.append('g')
    .attr('transform', `translate(0, ${inner_height})`)
    .call(xaxis);

const yaxis_group = chart.append('g')
    .call(yaxis);

update(data);

function update(data) {
    svg.selectAll("rect")
        .data(data)
        .join("rect")
        .attr("x", 0)
        .attr("y", d => yscale(d.label))
        .attr("width", d => xscale(d.value))
        .attr("height", yscale.bandwidth());
}

d3.select('#reverse')
    .on('click', d => {
        data.reverse();
        update(data);
    });

d3.select('#descend')
    .on('click', d => {
        data.reverse();
        update(data);
    });

d3.select('#ascend')
    .on('click', d => {
        data.reverse();
        update(data);
    });