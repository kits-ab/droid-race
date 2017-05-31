import React from "react"
import { action, observable } from "mobx"
import { inject, observer } from "mobx-react"
import "./RaceForm.css"

@inject("raceStore") @observer
export default class RaceForm extends React.Component {
	@observable nameValue = ""
	@observable emailValue = ""

	createRace = () => {
		this.props.raceStore.createRace(this.nameValue, this.emailValue)
		this.resetInputValues()
	}

	@action.bound
	onChangeName = (e) => {
		this.nameValue = e.target.value;
	}

	@action.bound
	onChangeEmail = (e) => {
		this.emailValue = e.target.value;
	}

	@action.bound
	resetInputValues = () => {
		this.nameValue = ""
		this.emailValue = ""
	}

	render() {
		return (
			<div className="race-form">
				<div>
					<label>Namn</label>
					<input onChange={this.onChangeName} type="text" value={this.nameValue} />
				</div>
				<div>
					<label>E-post</label>
					<input onChange={this.onChangeEmail} type="text" value={this.emailValue} />
				</div>
				<p><a className="c-button" onClick={this.createRace} type="button">Ny tävlande</a></p>
			</div>
		)
	}
}
