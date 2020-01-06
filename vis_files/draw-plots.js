async function drawPlots() {
	// Access data
	let pop_data = await d3.csv('./pop_perc_estimate.csv')
	let wealth_data = await d3.csv('./wealth_perc_of_white.csv')
	let income_data = await d3.csv('./income_diffs.csv')

	console.log(pop_data[0])
	console.log(wealth_data[0])
	console.log(income_data[0])
}
drawPlots()