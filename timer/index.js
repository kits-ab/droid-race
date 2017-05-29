const stdio = require("stdio")
const sensors = require("./lib/sensors")
const mqtt = require("./lib/mqtt")

const options = stdio.getopt({
	endpoint: {
		mandatory: true,
		args: 1
	},
	thingName: {
		mandatory: true,
		args: 1
	}
})

const mqttClient = mqtt.connect(options.endpoint, options.thingName)
const sensorClient = sensors.init()

sensorClient.onStartSensor((data) => {
	mqttClient.publishReportedState(data)
})

sensorClient.onEndSensor((data) => {
	mqttClient.publishReportedState(data)
})
