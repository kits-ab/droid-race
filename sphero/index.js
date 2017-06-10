require("dotenv").config({ path: "../.env" })

const keyboard = require("./lib/keyboard")
const mqtt = require("./lib/mqtt")
const sphero = require("./lib/sphero")

const mqttClient = mqtt.connect(process.env.IOT_ENDPOINT, "bb-8", () => {
	mqttClient.publishDesiredState(null)
	mqttClient.publishReportedState({ color: "white", direction: 0, speed: 0 })
})
const spheroClient = sphero.connect(process.env.SPHERO_UUID, 300, () => {
	spheroClient.setColor("white")
})

let direction = 0
const directionIncrement = 45
let speed = 0
const speedIncrement = 20

const _colorFromSpeed = (speed) => {
	if (speed <= 50) {
		return "lime"
	} else if (speed <= 100) {
		return "aqua"
	} else if (speed <= 150) {
		return "yellow"
	} else if (speed <= 200) {
		return "fuchsia"
	} else {
		return "red"
	}
}

const _faster = () => {
	let newSpeed = speed + speedIncrement
	if (newSpeed > 255) {
		newSpeed = 255
	}
	mqttClient.publishDesiredState({ color: _colorFromSpeed(newSpeed), speed: newSpeed })
}

const _slower = () => {
	let newSpeed = speed - speedIncrement
	if (newSpeed < 0) {
		newSpeed = 0;
	}
	mqttClient.publishDesiredState({ color: _colorFromSpeed(newSpeed), speed: newSpeed })
}

const _left = () => {
	let newDirection = direction - directionIncrement
	if (newDirection < 0) {
		newDirection = 360 + newDirection
	}
	mqttClient.publishDesiredState({ direction: newDirection })
}

const _right = () => {
	let newDirection = direction + directionIncrement
	if (newDirection > 359) {
		newDirection = 360 - newDirection
	}
	mqttClient.publishDesiredState({ direction: newDirection })
}

const _stop = () => {
	mqttClient.publishDesiredState({ color: "white", speed: 0 })
}

mqttClient.onMessage((state) => {
	const reported = {}
	let shouldMove = false

	if (state.hasOwnProperty("color")) {
		spheroClient.setColor(state.color)
		reported.color = state.color
	}

	if (state.hasOwnProperty("speed")) {
		speed = state.speed
		reported.speed = speed
		shouldMove = true
	}

	if (state.hasOwnProperty("direction")) {
		direction = state.direction
		reported.direction = direction
		shouldMove = true
	}

	if (state.hasOwnProperty("speed") && speed === 0) {
		spheroClient.stop(() => {
			spheroClient.setColor("white")
		})
	}

	if (shouldMove) {
		spheroClient.move(speed, direction)
	}

	mqttClient.publishReportedState(reported)
})

keyboard.initControls(_faster, _slower, _left, _right, _stop)
