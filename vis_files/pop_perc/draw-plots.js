async function drawPlots() {
	// Access data
	let pop_data = await d3.csv('./pop_perc_estimate.csv')
	let income_data = await d3.csv('./income_diffs.csv')

	console.log(pop_data[0])
}
drawPlots()