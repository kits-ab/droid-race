const Alexa = require("alexa-sdk")
const aws = require("aws-sdk")
const raceDao = require("../dao/race-dao")
const iotData = new aws.IotData({ endpoint: process.env.IOT_ENDPOINT })

const _updateState = (state) => {
	const params = {
		thingName: 'bb-8',
		payload: JSON.stringify({ state: { desired: state } })
	}
	return new Promise((resolve, reject) => {
		iotData.updateThingShadow(params, (err) => {
			err ? reject(err) : resolve()
		})
	})
}

let direction = 0
const directionIncrement = 45
let speed = 0
const speedIncrement = 25

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

const handlers = {
	'AMAZON.HelpIntent': function () {
		this.emit(':ask',
			'The available commands are: faster or slower, left or right, hard left or hard right, stop, turn around and finally hyperspeed',
			'Hey');
	},

	ByeIntent: function () {
		this.emit(':tell', 'Bye bye. May the force be with you')
	},

	FasterIntent: function () {
		speed += speedIncrement
		if (speed > 255) {
			speed = 255
		}
		_updateState({ color: _colorFromSpeed(speed), speed })
			.then(() => { this.emit(':ask', '', 'Hey') });
	},

	HardLeftIntent: function () {
		direction -= directionIncrement * 2
		if (direction < 0) {
			direction = 360 + direction
		}
		_updateState({ direction })
			.then(() => { this.emit(':ask', 'Left', 'Hey') });
	},

	HardRightIntent: function () {
		direction += directionIncrement * 2
		if (direction > 359) {
			direction = 360 - direction
		}
		_updateState({ direction })
			.then(() => { this.emit(':ask', 'Right', 'Hey') });
	},

	HyperSpeedIntent: function () {
		speed = 255
		_updateState({ color: _colorFromSpeed(speed), speed })
			.then(() => { this.emit(':ask', '', 'Hey') });
	},

	LaunchRequest: function () {
		direction = 0
		speed = 0

		_updateState({ color: "white", direction, speed })
			.then(() => raceDao.list(process.env.RACE_TABLE))
			.then(races => {
				let name = 'unknown'
				if (races && races.length) {
					name = races[0].name
				}
				this.attributes.speechOutput = `Welcome to Droid Race ${name}!`
				this.attributes.repromptSpeech = 'For instructions on what you can say, please say help me.'
				this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech)
			})
	},

	LeftIntent: function () {
		direction -= directionIncrement
		if (direction < 0) {
			direction = 360 + direction
		}
		_updateState({ direction })
			.then(() => { this.emit(':ask', 'Left', 'Hey') });
	},

	OkIntent: function () {
		this.emit(':ask', '', 'Hey')
	},

	RightIntent: function () {
		direction += directionIncrement
		if (direction > 359) {
			direction = 360 - direction
		}
		_updateState({ direction })
			.then(() => { this.emit(':ask', 'Right', 'Hey') });
	},

	SlowerIntent: function () {
		speed -= speedIncrement
		if (speed < 0) {
			speed = 0;
		}
		_updateState({ color: _colorFromSpeed(speed), speed })
			.then(() => { this.emit(':ask', '', 'Hey') });
	},

	StopIntent: function () {
		speed = 0
		_updateState({ color: "white", speed })
			.then(() => { this.emit(':ask', 'Stopping', 'Hey') })
	},

	TurnAroundIntent: function () {
		direction += 180
		if (direction > 359) {
			direction = 360 - direction
		}
		_updateState({ direction })
			.then(() => { this.emit(':ask', 'Turning', 'Hey') });
	},

	Unhandled: function () {
		this.emit(':ask', '', 'Hey');
	}
}

module.exports.control = (event, context) => {
	const alexa = Alexa.handler(event, context)
	alexa.registerHandlers(handlers)
	alexa.execute()
}
