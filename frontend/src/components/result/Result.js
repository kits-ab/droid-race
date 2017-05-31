import React from "react"
import { observer } from "mobx-react"
import "./Result.css"

@observer
export default class Result extends React.Component {

	render() {
		const { race, current } = this.props
		return (
			<tr className={current ? 'is-current' : ''}>
				<td>{ race.place }</td>
				<td>{ race.name }</td>
				<td>{ race.startTimeFormatted }</td>
				<td>{ race.timeFormatted }</td>
			</tr>
		)
	}
}
