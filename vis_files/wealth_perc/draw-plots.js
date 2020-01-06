async function drawPlots() {
	// Access data
	let wealth_data = await d3.csv('./wealth_perc_of_white.csv')

	console.log(wealth_data[0])
}
drawPlots()