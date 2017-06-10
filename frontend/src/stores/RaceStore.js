import uuid from "uuid"
import { action, computed, observable } from "mobx"
import Race from "./Race"

export default class RaceStore {
	@observable races = []

	constructor() {
		this.apiEndpoint = process.env.API_ENDPOINT
	}

	@computed get results() {
		return this.races
			.filter((r) => r.endTime)
			.sort((a, b) => a.time - b.time)
	}

	@computed get top20() {
		return this.results.slice(0, 20)
	}

	@computed get currentRace() {
		const sorted = this.races.sort((a, b) => b.createdAt - a.createdAt)
		return sorted && sorted.length ? sorted[0] : null
	}

	@action.bound
	async createRace(name, email) {
		const race = new Race(this, uuid.v4(), name, email)
		this.races.splice(0, 0, race)
		await fetch(`${this.apiEndpoint}/races`,
			{ method: "POST", body: JSON.stringify(race.json) })
	}

	@action.bound
	async loadRaces() {
		const result = await fetch(`${this.apiEndpoint}/races`)
		const fetchedRaces = await result.json()
		fetchedRaces.forEach(json => this.updateRaceFromJson(json))
	}

	@action.bound
	updateRaceFromJson(json) {
		if (json) {
			let race = this.races.find(race => race.id === json.id)
			if (race) {
				race.json = json
			} else {
				race = new Race(this, json.id, json.name, json.email, json.createdAt, json.startTime, json.endTime)
				this.races.push(race)
			}
		}
	}
}
