const Gpio = require("onoff").Gpio

module.exports.init = () => {
	let isRunning = false

	const startSensor = new Gpio(5, "in", "both")
	const endSensor = new Gpio(6, "in", "both")
	const startLed = new Gpio(14, "out")
	const endLed = new Gpio(15, "out")

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
				endLed.writeSync(0)
				startLed.writeSync(1)
				callback({
					startSensor: 1,
					endSensor: 0
				})
			}
		})
	}

	const onEndSensor = (callback) => {
		endSensor.watch((err, value) => {
			if (isRunning && !value) {
				isRunning = false
				endLed.writeSync(1)
				startLed.writeSync(0)
				callback({
					startSensor: 0,
					endSensor: 1
				})
			}
		})
	}

	return {
		onStartSensor, onEndSensor
	}
}
