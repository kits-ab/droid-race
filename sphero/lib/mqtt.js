const fs = require("fs")
const mqtt = require("mqtt")
const path = require("path")

module.exports.connect = (endpoint, thingName, callback) => {
	const mqttClient = mqtt.connect({
		ca: fs.readFileSync(path.join(__dirname, "../../.cert", "root.crt")),
		cert: fs.readFileSync(path.join(__dirname, "../../.cert", thingName, "cert.pem")),
		clientId: thingName,
		hostname: endpoint,
		key: fs.readFileSync(path.join(__dirname, "../../.cert", thingName, "private.key")),
		port: 8883,
		protocol: "mqtts"
	})

	mqttClient.on("connect", () => {
		console.log("Connected to MQTT")
		mqttClient.subscribe(`$aws/things/${thingName}/shadow/update/delta`)
		if (callback) {
			callback()
		}
	})

	const onMessage = (callback) => {
		mqttClient.on("message", (topic, message) => {
			const msg = JSON.parse(new Buffer(message, "base64").toString("ascii"))
			if (msg && msg.state) {
				callback(msg.state)
			}
		})
	}

	const _publishState = (state) => {
		mqttClient.publish(`$aws/things/${thingName}/shadow/update`, JSON.stringify({ state }))
	}

	const publishDesiredState = (state) => {
		if (state === null || Object.keys(state).length) {
			_publishState({ desired: state })
		}
	}

	const publishReportedState = (state) => {
		if (Object.keys(state).length) {
			_publishState({ reported: state })
		}
	}

	return {
		onMessage,
		publishDesiredState,
		publishReportedState
	}
}
