var data;
d3.csv("https://ayanonishikawa.github.io/InfoVis2022/W04/vitaminC_ranking.csv")
    .then(data => {
        data.forEach(d => { d.label = d.name; d.value = +d.amount; 
        console.log(d.label+","+d.value)});
        console.log("ok6");
    })
    .catch(error => {
        console.log(error);
    });

var svg = d3.select('#drawing_region');
update( data );

function update(data) {
    let padding = 10;
    let height = 20;
    svg.selectAll("rect")
        .data(data)
        .join("rect")
        .attr("x", padding)
        .attr("y", (d,i) => padding + i * ( height + padding ))
        .attr("width", d => d)
        .attr("height", height);
}

d3.select('#reverse')
    .on('click', d => {
        data.reverse();
        update(data);
    });