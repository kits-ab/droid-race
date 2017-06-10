import { computed, observable } from "mobx"

export default class Race {
	@observable name
	@observable email
	@observable startTime
	@observable endTime

	constructor(store, id, name, email, createdAt, startTime, endTime) {
		this.store = store

		this.id = id
		this.name = name
		this.email = email
		this.createdAt = createdAt
		this.startTime = startTime
		this.endTime = endTime
	}

	@computed get place() {
		return this.store.results.findIndex(race => race.id === this.id) + 1
	}

	@computed get time() {
		const startTime = this.startTime || 0
		const endTime = this.startTime ? this.endTime || Date.now() : 0
		return endTime - startTime
	}

	@computed get timeFormatted() {
		const minutes = Math.floor(this.time / (60 * 1000));
		const seconds = Math.floor(this.time % (60 * 1000) / 1000);
		const milliseconds = Math.floor(this.time % 1000 / 100);

		return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}.${milliseconds}`
	}

	@computed get startTimeFormatted() {
		if (this.startTime) {
			const t = new Date(this.startTime + 1000 * 60 * 60 * 2) // time zone
			return t.toISOString().substr(0, 16).replace("T", " ")
		} else {
			return null
		}
	}

	@computed get json() {
		return {
			id: this.id,
			name: this.name,
			email: this.email,
			createdAt: this.createAt,
			startTime: this.startTime,
			endTime: this.endTime
		}
	}

	set json(json) {
		if (json) {
			if (json.hasOwnProperty("name")) {
				this.name = json.name
			}
			if (json.hasOwnProperty("email")) {
				this.email = json.email
			}
			if (json.hasOwnProperty("createdAt")) {
				this.createdAt = json.createdAt
			}
			if (json.hasOwnProperty("startTime")) {
				this.startTime = json.startTime
			}
			if (json.hasOwnProperty("endTime")) {
				this.endTime = json.endTime
			}
		}
	}
}
