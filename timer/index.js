require("dotenv").config({ path: "../.env" })

const sensors = require("./lib/sensors")
const mqtt = require("./lib/mqtt")

const mqttClient = mqtt.connect(process.env.IOT_ENDPOINT, "timer", () => {
	mqttClient.publishReportedState({ startSensor: 0, endSensor: 0 })
})
const sensorClient = sensors.init()

sensorClient.onStartSensor(() => {
	mqttClient.publishReportedState({ startSensor: 1, endSensor: 0 })
})

sensorClient.onEndSensor(() => {
	mqttClient.publishReportedState({ startSensor: 0, endSensor: 1 })
})
