import AWSMqtt from "aws-mqtt-client"
import React from "react"
import "./App.css"
import Race from "./components/race"
import ResultList from "./components/resultlist"
import RaceForm from "./components/raceform"
import { inject, observer } from "mobx-react"

@inject("raceStore") @observer
export default class App extends React.Component {

	componentWillMount() {
		const mqttClient = new AWSMqtt({
			accessKeyId: 'AKIAJLFUF2J6ZMMPZKXA',
			secretAccessKey: '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',
			endpointAddress: 'a1mwbl2w3pece2.iot.eu-west-1.amazonaws.com',
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
