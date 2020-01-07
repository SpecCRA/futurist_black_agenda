async function drawPlots() {
	// Access data
	let income_data = await d3.csv('./income_diffs.csv')

    // console.log(income_data[0])
    const dateParser = d3.timeParse('%Y')
	const dateAccessor = d => dateParser(d.year)
	const whiteAccessor = d => +d.white_diff 
	const blackAccessor = d => +d.black_diff
	const hispanicAccessor = d => +d.hispanic_diff

	let maxPoint = whiteAccessor(_.maxBy(income_data, whiteAccessor))
	let minPoint = blackAccessor(_.minBy(income_data, blackAccessor))
	let minPoint2 = _.minBy(income_data, hispanicAccessor)

    // console.log(minPoint)
    // console.log("max point")
	// console.log(maxPoint)
	// console.log(minPoint2)

	// Chart Dimensions
	const width = 900
	let dimensions = {
		width: width,
		height: width * 0.5,
		margin: {
			top: 100,
			right: 150,
			bottom: 50,
			left: 50,
		},
	}

	dimensions.boundedWidth = dimensions.width
		- dimensions.margin.left
		- dimensions.margin.right
	dimensions.boundedHeight = dimensions.height
		- dimensions.margin.top
		- dimensions.margin.bottom

	// Draw Canvas

	const wrapper = d3.select("#wrapper")
		.append('svg')
			.attr('width', dimensions.width)
			.attr('height', dimensions.height)

	const bounds = wrapper.append('g')
		.style('transform', `translate(${
			dimensions.margin.left
		}px, ${
			dimensions.margin.top
		}px)`)

	// Create Scales
	
	const xScale = d3.scaleTime()
		.domain(d3.extent(income_data, dateAccessor))
		.range([0, dimensions.boundedWidth])
        
    const yScale = d3.scaleLinear()
        .domain([minPoint, maxPoint])
        .range([dimensions.boundedHeight, 0])

    // Draw shading for below average income

    const belowAvgPlacement = yScale(0)
    const belowAvgPoints = bounds.append('rect')
        .attr('x', 0)
        .attr('width', dimensions.boundedWidth)
        .attr('y', belowAvgPlacement)
        .attr('height', dimensions.boundedHeight - belowAvgPlacement)
        .attr('fill', '#d9d9d9')

    // Draw Lines
    // const lineGenerator = d3.line()
    //     .x(d => xScale(dateAccessor(d)))
    //     .y(d => yScale(whiteAccessor(d)))
    
    // console.log(xScale(dateAccessor(income_data[1])))
    // console.log(yScale(whiteAccessor(income_data[1])))
    // const line = bounds.append('path')
    //     .attr('d', lineGenerator(income_data))
    //     .attr('fill', "none")
    //     .attr('stroke', 'black')
    //     .attr('stroke-width', 2)
    
    const drawLines = race => {
        const raceAccessor = d => +d[race]
        const dateParser = d3.timeParse("%Y")
        const xAccessor = d => dateParser(d.year)
            
        const lineGenerator = d3.line()
            .x(d => xScale(xAccessor(d)))
            .y(d => yScale(raceAccessor(d)))
        
        const line = bounds.append('path')
            .attr('d', lineGenerator(income_data))
            .attr('fill', 'none')
            .attr('stroke', 'black')
            .attr('stroke-width', 3)
    }

    const metrics = [
        'white_diff',
        'black_diff',
        'hispanic_diff',
    ]

    metrics.forEach(drawLines)

    // Draw Axes
    
    const yAxisGenerator = d3.axisLeft()
        .scale(yScale)
        .tickFormat(d3.format('.0s'))
        .ticks(5)
        .tickSize(2)
    
    const yAxis = bounds.append('g')
        .call(yAxisGenerator)
        .style('font-family', 'Monteserrat')
        .attr('stroke-opacity', 0.35)

    const xAxisGenerator = d3.axisBottom()
        .scale(xScale)
        .ticks(5)
        .tickSize(0)
    
    const xAxis = bounds.append('g')
        .call(xAxisGenerator)
            .style('transform', `translateY(${
                dimensions.boundedHeight
            }px)`)
        .style('font-family', 'Monteserrat')
        .attr('stroke-opacity', 0.35)

    // Line Labels

    // Grab positions of last points of each line
    let lastDate = dateAccessor(_.first(income_data, dateAccessor))
    console.log(lastDate)

    let lastWhite = whiteAccessor(_.first(income_data, whiteAccessor))
    let lastBlack = blackAccessor(_.first(income_data, blackAccessor))
    let lastHispanic = hispanicAccessor(_.first(income_data, hispanicAccessor))

    const whiteLabel = d3.select('svg')
        .append('text')
        .attr('x', xScale(lastDate) + 55)
        .attr('y', yScale(lastWhite) + 105)
        .style('font-size', '13px')
        .attr('font-family', 'Montserrat')
        .text('White households')

    const blackLabel = d3.select('svg')
        .append('text')
        .attr('x', xScale(lastDate) + 55)
        .attr('y', yScale(lastBlack) + 105)
        .style('font-size', '13px')
        .style('font-family', 'Montserrat')
        .style('font-weight', 'bold')
        .text('Black households')

    const hispanicLabel = d3.select('svg')
        .append('text')
        .attr('x', xScale(lastDate) + 55)
        .attr('y', yScale(lastHispanic) + 105)
        .style('font-size', '13px')
        .style('font-family', 'Montserrat')
        .style('font-weight', 'bold')
        .text('Hispanic households') 

    // Title and text

    const chartTitleTop = d3.select('svg')
        .append('text')
        .attr('x', (width * 0.1))
        .attr('y', (dimensions.height * 0.1))
        .style('font-size', '20px')
        .style('font-family', 'Montserrat')
        .style('font-weight', 'bold')
        .text('Black and Hispanic median household incomes')

    const chartTitleBot = d3.select('svg')
        .append('text')
        .attr('x', (width * 0.1))
        .attr('y', (dimensions.height * 0.1 + 20))
        .style('font-size', '20px')
        .style('font-family', 'Montserrat')
        .text('have always been significiantly below the national median')
    // download as svg

}
drawPlots()

// d3.select("#download")
//     .on("mouseover", writeDownloadLink);

// function writeDownloadLink(){
//     var html = d3.select("svg")
//         .attr("title", "svg_title")
//         .attr("version", 1.1)
//         .attr("xmlns", "http://www.w3.org/2000/svg")
//         .node().parentNode.innerHTML;
    
//     d3.select(this)
//         .attr("href-lang", "image/svg+xml")
//         .attr("href", "data:image/svg+xml;base64,\n" + btoa(html))
//         .on("mousedown", function(){
//             if(event.button != 2){
//                 d3.select(this)
//                     .attr("href", null)
//                     .html("Use right click");
//             }
//         })
//         .on("mouseout", function(){
//             d3.select(this)
//                 .html("Download");
//         });
// 