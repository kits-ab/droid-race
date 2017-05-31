import React from "react"
import { computed, observable } from "mobx"
import { inject, observer } from "mobx-react"
import "./Race.css"

const format = (time) => {
	const minutes = Math.floor(time / (60 * 1000));
	const seconds = Math.floor(time % (60 * 1000) / 1000);
	const milliseconds = Math.floor(time % 1000 / 100);

	return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}.${milliseconds}`
}

@inject("raceStore") @observer
export default class Race extends React.Component {
	@observable dummyCounter = 0

	@computed get time() {
		if (this.props && this.props.raceStore && this.props.raceStore.currentRace) {
			const race = this.props.raceStore.currentRace
			const startTime = race.startTime || 0
			const endTime = race.startTime ? race.endTime || Date.now() : 0
			return format(endTime - startTime + this.dummyCounter - this.dummyCounter)
		} else {
			return '0:00.0'
		}
	}

	componentWillMount() {
		this.timer = setInterval(() => {
			this.dummyCounter++
		}, 100);
	}

	componentWillReceiveProps(next) {
		const { race: currentRace } = this.props
		const { race: nextRace } = next
		if (currentRace.endTime || nextRace.endTime) {
			if (this.timer) {
				clearInterval(this.timer)
				this.timer = null;
			}
			nextRace.startTime = nextRace.startTime + 1
		} else if (nextRace.startTime) {
			this.timer = setInterval(() => {
				nextRace.startTime = nextRace.startTime + 1
			}, 100);
		}
	}

	render() {
		const race = this.props.raceStore.currentRace
		return (
			<div className="race">
				<h3>{ race ? race.name : '–' }</h3>
				<h1>{ this.time }</h1>
			</div>
		)
	}
}
