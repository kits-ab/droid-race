const sphero = require("sphero")

module.exports.connect = (uuid, timeout, callback) => {
	const spheroClient = sphero(uuid)
	spheroClient.connect(() => {
		console.log("Connected to SPHERO")

		if (timeout < 60) {
			timeout = 60
		}
		spheroClient.setInactivityTimeout(timeout)
		if (callback) {
			callback()
		}
	})

	const move = (speed, direction, callback) => {
		if (speed < 0) {
			speed = 0
		} else if (speed > 255) {
			speed = 255
		}
		if (direction < 0) {
			direction = 0
		} else if (direction > 359) {
			direction = 359
		}

		console.log("move", { speed, direction })
		spheroClient.roll(speed, direction)
		if (callback) {
			callback(speed, direction)
		}
	}

	const onCollision = (callback) => {
		spheroClient.detectCollisions()
		spheroClient.on("collision", () => {
			callback()
		})
	}

	const onData = (callback) => {
		spheroClient.on("dataStreaming", (data) => {
			const xVelocity = Math.abs(data.xVelocity.value[0])
			const yVelocity = Math.abs(data.yVelocity.value[0])
			const velocity = Math.sqrt(xVelocity ^ 2 + yVelocity ^ 2)

			const lat = data.xOdometer.value[0] * 10 // mm
			const long = data.yOdometer.value[0] * 10 // mm

			callback({
				latlng: `${lat},${long}`,
				velocity // mm/s
			})
		})
	}

	const onPowerState = (callback) => {
		const _getPowerState = () => {
			spheroClient.getPowerState((err, data) => {
				if (!err) {
					callback({
						chargeCount: data.chargeCount,
						secondsSinceCharge: data.secondsSinceCharge,
						state: data.batteryState,
						voltage: data.batteryVoltage
					})
				}
			})
		}
		_getPowerState()
		setInterval(_getPowerState, 1000 * 60)
	}

	const setColor = (color) => {
		console.log("setting color", color)
		spheroClient.color(color)
	}

	const stop = (callback) => {
		console.log("stop")
		spheroClient.stop(callback)
	}

	return {
		move, onCollision, onData, onPowerState, setColor, stop
	}
}
