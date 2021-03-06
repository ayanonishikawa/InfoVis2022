d3.csv("https://ayanonishikawa.github.io/InfoVis2022/W08/task2_data.csv")
    .then(data => {
        data.forEach( d => { d.x = +d.x; d.y = +d.y; });
        console.log("ok15");
        var config = {
            parent: '#drawing_region',
            width: 400,
            height: 400,
            margin: {top:50, right:50, bottom:100, left:100},
        };
        const line_plot = new LinePlot(config, data);
        line_plot.update();
    })
    .catch(error => {
        console.log(error);
    });

class LinePlot {
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

        self.yscale = d3.scaleLinear()
            .range( [self.inner_height, 0] );

        // Initialize axes
        self.xaxis = d3.axisBottom(self.xscale)
            .ticks(10)

        self.yaxis = d3.axisLeft(self.yscale)
            .ticks(10);

        // Draw the axis
        self.xaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, ${self.inner_height})`);

        self.yaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, 0)`);

        self.line = d3.line()
            .x( d => self.xscale(d.x) )
            .y( d => self.yscale(d.y) );

        // self.chart
        //     .append("text")
        //     .attr("x", self.inner_width/2)
        //     .attr("y", 0)
        //     .attr("text-anchor", "middle")
        //     .text("Chart Title")
        //     .attr("font-size","15pt")
        //     .attr("font-weight", "bold")

        // self.chart
        //     .append("text")
        //     .attr("x", self.inner_width/2)
        //     .attr("y", self.inner_height+self.config.margin.bottom/2)
        //     .attr("text-anchor", "middle")
        //     .attr("font-size","10pt")
        //     .text("X_label");
        
        // self.chart
        //     .append("text")
        //     .attr("x", -self.inner_height/2)
        //     .attr("y", -50)
        //     .attr("transform", "rotate(-90)")
        //     .attr("text-anchor", "middle")
        //     .attr("font-size","10pt")
        //     .text("Y_label");
    }

    update() {
        let self = this;

        const xmin = d3.min( self.data, d => d.x );
        const xmax = d3.max( self.data, d => d.x );
        //self.xscale.domain( [xmin, xmax+20] );

        const ymin = d3.min( self.data, d => d.y );
        const ymax = d3.max( self.data, d => d.y );
        //self.yscale.domain( [ymin, ymax+20] );

        var smaller=0;
        if(xmin<ymin) smaller=xmin;
        else smaller=ymin

        self.xscale.domain( [smaller, xmax] );
        self.yscale.domain( [smaller, ymax] );
        self.render();
    }

    render() {
        let self = this;

        // Draw bars
        self.chart.append("path")
            .attr('d', self.line(self.data))
            .attr('stroke', 'black')
            .attr('fill', 'none');

        self.chart.selectAll("circle")
            .data(self.data)
            .enter()
            .append("circle")
            .attr("cx", self.line.x())
            .attr("cy", self.line.y() )
            .attr("r", 5)
            .attr("fill","black");

        self.xaxis_group
            .call(self.xaxis);

        self.yaxis_group
            .call(self.yaxis);
    }
}