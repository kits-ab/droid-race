import AWSMqtt from "aws-mqtt-client"
import React from "react"
import { inject, observer } from "mobx-react"
import Race from "./components/race/Race"
import ResultList from "./components/resultlist/ResultList"
import RaceForm from "./components/raceform/RaceForm"
import "./App.css"

@inject("raceStore") @observer
export default class App extends React.Component {

	componentWillMount() {
		const mqttClient = new AWSMqtt({
			accessKeyId: process.env.IOT_ACCESS_KEY_ID,
			secretAccessKey: process.env.IOT_SECRET_ACCESS_KEY,
			endpointAddress: process.env.IOT_ENDPOINT,
			region: 'eu-west-1'
		});

		mqttClient.on('connect', () => {
			mqttClient.subscribe('droid-race-updates');
		});

		mqttClient.on('message', (topic, message) => {
			const m = JSON.parse(message.toString())
			this.props.raceStore.updateRaceFromJson(m);
		});
	}

	render() {
		return (
			<div className="app">
				<div>
					<Race />
					<RaceForm />
				</div>
				<ResultList />
			</div>
		)
	}
}
