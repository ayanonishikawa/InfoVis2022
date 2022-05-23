d3.csv("https://ayanonishikawa.github.io/InfoVis2022/W04/vitaminC_ranking.csv")
    .then(data => {
        data.forEach(d => {
            d.label = d.name; d.value = +d.amount;
            console.log(d.label + "," + d.value)
        });
        console.log("8");
        var config = {
            parent: '#drawing_region',
            width: 800,
            height: 600,
            margin: { top: 50, right: 10, bottom: 70, left: 120 }
        };
        const pie_plot = new PiePlot(config, data);
        pie_plot.update();
    })
    .catch(error => {
        console.log(error);
    });

class PiePlot {
    constructor(config, data) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 256,
            margin: config.margin || { top: 10, right: 10, bottom: 10, left: 10 }
        }
        this.data = data;
        this.radius = Math.min(config.width, config.height) / 2-10;
        this.init();
    }

    init() {
        let self = this;
        self.svg = d3.select(self.config.parent)
            .attr('width', self.config.width)
            .attr('height', self.config.height);

        self.chart = self.svg.append('g')
            .attr('transform', `translate(${self.config.width / 2}, ${self.config.height / 2})`);

        self.pie = d3.pie()
            .value(d => d.value);

        self.arc = d3.arc()
            .innerRadius(0)
            .outerRadius(self.radius);

        self.text = d3.arc()
            .outerRadius(self.radius*0.6)
            .innerRadius(self.radius*0.6);
    }

    update() {
        let self = this;
        self.render();
    }

    render() {
        let self = this;

        // Draw bars
        self.chart.selectAll('pie')
            .data(self.pie(self.data))
            .enter()
            .append('path')
            .attr('d', self.arc)
            .attr('fill', 'black')
            .attr('stroke', 'white')
            .style('stroke-width', '2px');

        self.chart.selectAll('pie')
            .data(self.pie(self.data))
            .enter()
            .append("text")
            .attr("fill", "white")
            .attr("transform", function (d) { return "translate(" + self.text.centroid(d) + ")"; })
            .attr("dy", "5px")
            .attr("font", "7px")
            .attr("text-anchor", "middle")
            .text(function (d) { console.log("label="+d.data.label); return d.data.label; });
    }
}