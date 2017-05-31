import React from "react"
import { inject, observer } from "mobx-react"
import "./ResultList.css"
import Result from "../result/Result"

@inject("raceStore") @observer
export default class ResultList extends React.Component {

	componentWillMount() {
		this.props.raceStore.loadRaces()
	}

	render() {
		const { raceStore } = this.props
		return (
			<div className="race-list">
				<table>
					<colgroup>
						<col style={{ width: 40 }} />
						<col style={{ width: "100%" }} />
						<col style={{ width: 150 }} />
						<col style={{ width: 80 }} />
					</colgroup>
					<thead>
						<tr>
							<th></th>
							<th>Namn</th>
							<th>Tid</th>
							<th>Resultat</th>
						</tr>
					</thead>
					<tbody>
						{ raceStore.races.length > 0 && raceStore.races[0].endTime ?
							<Result race={raceStore.races[0]} key="lastRace" current /> : null }
						{ raceStore.results.map(race => <Result race={race} key={race.id} />) }
					</tbody>
				</table>
			</div>
		)
	}
}
