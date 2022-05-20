d3.csv("https://ayanonishikawa.github.io/InfoVis2022/W04/vitaminC_ranking.csv")
    .then(data => {
        data.forEach(d => {
            d.label = d.name; d.value = +d.amount;
            console.log(d.label + "," + d.value)
        });
        console.log("ok6");
        var config = {
            parent: '#drawing_region',
            width: 500,
            height: 300,
            margin: { top: 50, right: 10, bottom: 70, left: 120 },
        };
        const bar_plot = new BarPlot(config, data);
        bar_plot.update();
    })
    .catch(error => {
        console.log(error);
    });

class BarPlot {
    constructor(config, data) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 256,
            margin: config.margin || { top: 10, right: 10, bottom: 10, left: 10 }
        }
        this.data = data;
        this.init();
    }

    init() {
        let self = this;
        self.svg = d3.select(self.config.parent)
            .attr('width', self.config.width)
            .attr('height', self.config.height);

        self.chart = self.svg.append('g')
            .attr('transform', `translate(${self.config.margin.left}, ${self.config.margin.top})`);
        self.inner_width = self.config.width - self.config.margin.left - self.config.margin.right;
        self.inner_height = self.config.height - self.config.margin.top - self.config.margin.bottom;
        console.log(self.inner_width + "," + self.inner_height);

        // Initialize axis scales
        self.xscale = d3.scaleLinear()
            .range([0, self.inner_width]);

        self.yscale = d3.scaleBand()
            .range([0, self.inner_height])
            .paddingInner(0.1);

        // Initialize axes
        self.xaxis = d3.axisBottom(self.xscale)
            .ticks(10)
            .tickSizeOuter(0);

        self.yaxis = d3.axisLeft(self.yscale)
            .tickSizeOuter(0);

        // Draw the axis
        self.xaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, ${self.inner_height})`);

        self.yaxis_group = self.chart.append('g');

        self.chart
            .append("text")
            .attr("x", self.config.margin.left)
            .attr("y", -20)
            .attr("text-anchor", "middle")
            .text("Vitamin C content of vegetables")
            .attr("font-size", "12pt")
            .attr("font-weight", "bold")
            .style("textDecoration", "underline");

        self.chart
            .append("text")
            .attr("x", self.inner_width / 2)
            .attr("y", self.inner_height + self.config.margin.bottom / 2)
            .attr("text-anchor", "middle")
            .attr("font-size", "8pt")
            .attr("font-weight", "bold")
            .text("Vitamine C mg/100g");
    }

    update() {
        let self = this;

        const xmin = 0;
        const xmax = d3.max(self.data, d => d.value);
        self.xscale.domain([xmin, xmax]);

        self.yscale.domain(self.data.map(d => d.label));

        self.render();
    }

    render() {
        let self = this;

        // Draw bars
        self.chart.selectAll("rect")
            .data(self.data)
            .enter()
            .append("rect")
            .attr("x", 0)
            .attr("y", d => self.yscale(d.label))
            .attr("width", d => self.xscale(d.value))
            .attr("height", self.yscale.bandwidth());

        self.xaxis_group
            .call(self.xaxis);

        self.yaxis_group
            .call(self.yaxis);
    }
}
d3.select('#reverse')
    .on('click', d => {
        this.data.reverse();

    });

d3.select('#descend')
    .on('click', d => {
        this.data.reverse();
        update(data);
    });

d3.select('#ascend')
    .on('click', d => {
        this.data.reverse();
        update(data);
    });