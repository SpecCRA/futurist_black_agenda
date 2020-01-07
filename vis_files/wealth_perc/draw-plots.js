async function drawPlots() {
	// Access data
	let wealth_data = await d3.csv('./wealth_perc_of_white.csv')

	raceAccessor = d => d.race
	yAccessor = d => +d.perc_values

	races = [
		'white_alone_not_hispanic',
		'hispanic',
		'black_alone'
	]

	console.log(wealth_data[0])

	// Chart Dimensions
	const width = 600
	let dimensions = {
		width: width,
		height: width,
		margin: {
			top: 120,
			bottom: 10,
			right: 120,
			left: 10
		}
	}

	dimensions.boundedWidth = dimensions.width
		- dimensions.margin.right
		- dimensions.margin.left

	dimensions.boundedHeight = dimensions.height
		- dimensions.margin.top
		- dimensions.margin.bottom
    // console.log(dimensions.boundedHeight)
	// console.log(dimensions.boundedWidth)
	// Draw canvas

	const wrapper = d3.select('#wrapper')
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
	yScale = d3.scaleLinear()
		.domain([0, 100])
		.range([dimensions.boundedHeight, 0])

	// console.log(yScale(yAccessor(wealth_data[1])))
	// console.log(d3.extent(wealth_data, yAccessor))

	// Draw Boxes
	
	const whiteBox = bounds.append('rect')
		.attr('x', 0)
		.attr('width', dimensions.boundedWidth)
		.attr('y', yScale(yAccessor(wealth_data[1])))
		.attr('height', dimensions.boundedWidth)
		.attr('fill', '#d9d9d9')
	
	const scaledHispanicValue = dimensions.boundedHeight - yScale(yAccessor(wealth_data[5]))
	console.log(scaledHispanicValue)
	console.log(yScale(yAccessor(wealth_data[5])))

	const hispanicBox = bounds.append('rect')
		.attr('x', yScale(yAccessor(wealth_data[5])))
		.attr('width', scaledHispanicValue)
		.attr('y', yScale(yAccessor(wealth_data[5])))
		.attr('height', scaledHispanicValue)
		.attr('fill', '#8a8a8a')
	
    const scaledBlackValue = dimensions.boundedHeight - yScale(yAccessor(wealth_data[2]))
	const blackBox = bounds.append('rect')
		.attr('x', yScale(yAccessor(wealth_data[2])))
		.attr('width', scaledBlackValue)
		.attr('y', yScale(yAccessor(wealth_data[2])))
		.attr('height', scaledBlackValue)
		.attr('fill', 'black')

	// Text
	
	// const whiteLabel = bounds.append('text')
	// 	.attr('x', dimensions.boundedWidth)
	// 	.attr('y', dimensions.boundedHeight * 0.02)
	// 	.attr('font-size', '13px')
	// 	.text('In 2016, non-Hispanic White households held \n a median net worth of $143,600 in assests.')

}
drawPlots()