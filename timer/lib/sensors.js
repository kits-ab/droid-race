const onoff = require("onoff")

module.exports.init = () => {
	let isRunning = false

	const startSensor = new onoff.Gpio(5, "in", "both")
	const endSensor = new onoff.Gpio(6, "in", "both")
	const startLed = new onoff.Gpio(14, "out")
	const endLed = new onoff.Gpio(15, "out")

	process.on("SIGINT", () => {
		startSensor.unexport()
		endSensor.unexport()
		startLed.unexport()
		endLed.unexport()
	})

	const onStartSensor = (callback) => {
		startSensor.watch((err, value) => {
			if (!isRunning && !value) {
				isRunning = true
				startLed.writeSync(1)
				endLed.writeSync(0)
				callback()
			}
		})
	}

	const onEndSensor = (callback) => {
		endSensor.watch((err, value) => {
			if (isRunning && !value) {
				isRunning = false
				startLed.writeSync(0)
				endLed.writeSync(1)
				callback()
			}
		})
	}

	return {
		onStartSensor, onEndSensor
	}
}
