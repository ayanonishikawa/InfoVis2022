d3.csv("https://ayanonishikawa.github.io/InfoVis2022/W06/w06_task1.csv")
    .then( data => {
        data.forEach( d => { d.x = +d.x; d.y = +d.y; });
        console.log("ok5");
        var config = {
            parent: '#drawing_region',
            width: 256,
            height: 256,
            margin: {top:10, right:10, bottom:40, left:40},
        };

        const scatter_plot = new ScatterPlot( config, data );
        scatter_plot.update();
    })
    .catch( error => {
        console.log( error );
    });

class ScatterPlot {

    constructor( config, data ) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 256,
            margin: config.margin || {top:10, right:10, bottom:10, left:10}
        }
        this.data = data;
        this.init();
    }

    init() {
        let self = this;

        self.svg = d3.select( self.config.parent )
            .attr('width', self.config.width)
            .attr('height', self.config.height);

        self.chart = self.svg.append('g')
            .attr('transform', `translate(${self.config.margin.left}, ${self.config.margin.top})`);

        self.inner_width = self.config.width - self.config.margin.left - self.config.margin.right;
        self.inner_height = self.config.height - self.config.margin.top - self.config.margin.bottom;
        console.log(self.inner_width+","+self.inner_height);

        self.xscale = d3.scaleLinear()
            .range( [0, self.inner_width] );

        self.yscale = d3.scaleLinear()
            .range( [self.inner_height, 0] );

        self.xaxis = d3.axisBottom( self.xscale )
            .ticks(10);

        self.yaxis = d3.axisLeft( self.yscale )
            .ticks(10);
        
        self.xaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, ${self.inner_height}+10)`)
            .append("text")
            .attr("x", self.config.margin.left)
            .attr("y", self.inner_height)
            .attr("text-anchor", "middle")
            .text("X_label");
        
        self.yaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, 0)`)
            .append("text")
            .attr("x", 0)
            .attr("y", self.inner_height/2)
            .attr("transform", "rotate(-90)")
            .attr("text-anchor", "middle")
            .text("Y_label");
    }

    update() {
        let self = this;

        const xmin = 0;
        const xmax = d3.max( self.data, d => d.x );
        //self.xscale.domain( [xmin, xmax+20] );

        const ymin = 0;
        const ymax = d3.max( self.data, d => d.y );
        //self.yscale.domain( [ymin, ymax+20] );

        var larger=0;
        if(xmin>xmax) larger=xmin;
        else larger=xmax;

        self.xscale.domain( [xmin, larger+20] );
        self.yscale.domain( [ymin, larger+20] );

        self.render();
    }

    render() {
        let self = this;

        self.chart.selectAll("circle")
            .data(self.data)
            .enter()
            .append("circle")
            .attr("cx", d => self.xscale( d.x ) )
            .attr("cy", d => self.yscale( d.y ) )
            .attr("r", d => d.r );

        self.xaxis_group
            .call( self.xaxis );
            // .append("text")
            // .attr("x", self.config.margin.left)
            // .attr("y", self.inner_height)
            // .attr("text-anchor", "middle")
            // .text("X_label");
        self.yaxis_group
            .call( self.yaxis );
            // .append("text")
            // .attr("x", 0)
            // .attr("y", self.inner_height/2)
            // .attr("transform", "rotate(-90)")
            // .attr("text-anchor", "middle")
            // .text("Y_label");
    }
}