module.exports.initControls = (faster, slower, left, right, stop) => {

	process.stdin.setRawMode(true)
	process.stdin.resume()
	process.stdin.setEncoding("utf8")

	process.stdin.on("data", (key) => {
		if (key === "\u0020") { // space
			stop()
		} else if (key === "\u001B\u005B\u0041") { // up
			faster()
		} else if (key === "\u001B\u005B\u0043") { // right
			right()
		} else if (key === "\u001B\u005B\u0042") { // down
			slower()
		} else if (key === "\u001B\u005B\u0044") { // left
			left()
		} else if (key === "\u0003") { // ctrl+c
			process.exit()
		}
	})
}
