async function drawPlots() {
	// Access data
	let income_data = await d3.csv('./income_diffs.csv')

	console.log(income_data[0])
}
drawPlots()