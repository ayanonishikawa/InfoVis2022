d3.csv("https://ayanonishikawa.github.io/InfoVis2022/W08/task2_data.csv")
    .then(data => {
        var arrayData=[];
        console.log("ok14-1");
        data.forEach(d => {
            d.x += d.x; d.y += d.y;
            console.log(d.x + "," + d.y);
            arrayData.push([d.x,d.y]);
        });
        console.log("ok11");
        console.log(arrayData);
        var config = {
            parent: '#drawing_region',
            width: 500,
            height: 300,
            margin: { top: 50, right: 10, bottom: 70, left: 120 },
        };
        const bar_plot = new ScatterPlot(config, data, arrayData);
        bar_plot.update();
    })
    .catch(error => {
        console.log(error);
    });

class ScatterPlot {
    constructor(config, data, arrayData) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 256,
            margin: config.margin || { top: 10, right: 10, bottom: 10, left: 10 }
        }
        this.data = data;
        this.arrayData=arrayData;
        console.log(typeof(this.arrayData));
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
        const xmax = d3.max(self.arrayData, d => d[1]);
        self.xscale.domain([xmin, xmax]);

        self.yscale.domain(self.arrayData.map(d => d[0]));

        self.render();
    }

    render() {
        let self = this;

        // Draw bars
        self.chart.selectAll("circle")
            .data(self.arrayData)
            .enter()
            .append("circle")
            .attr("x", 0)
            .attr("y", d => self.yscale(d[0]))
            .attr("width", d => self.xscale(d[1]))
            .attr("height", self.yscale.bandwidth());

        self.xaxis_group
            .call(self.xaxis);

        self.yaxis_group
            .call(self.yaxis);
    }
}

d3.select('#reverse')
    .on('click', d => {
        self.arrayData.reverse();
        bar_plot.update();
    });

d3.select('#descend')
    .on('click', d => {
        self.arrayData.sort((a, b) => b[1] - a[1]);
        bar_plot.update();
    });

d3.select('#ascend')
    .on('click', d => {
        self.arrayData.sort((a, b) => a[1] - b[1]);
        bar_plot.update();
    });