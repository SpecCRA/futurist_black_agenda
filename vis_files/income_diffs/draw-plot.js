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
		height: width * 0.6,
		margin: {
			top: 35,
			right: 80,
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
    
    const yAxis = bounds.append('g')
        .call(yAxisGenerator)

    const xAxisGenerator = d3.axisBottom()
        .scale(xScale)
        .ticks(5)
    
    const xAxis = bounds.append('g')
        .call(xAxisGenerator)
            .style('transform', `translateY(${
                dimensions.boundedHeight
            }px)`)

    // Annotations amd Title
    
    
}
drawPlots()