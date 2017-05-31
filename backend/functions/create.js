const raceDao = require("../dao/race-dao")
const uuid = require("uuid")

module.exports.create = (event, context, callback) => {
	// const raceSecret = event.headers.RaceSecret
	// if (!raceSecret || raceSecret !== process.env.RACE_SECRET) {
	// 	const response = {
	// 		statusCode: 401,
	// 		headers: { "Access-Control-Allow-Origin": "*" }
	// 	}
	// 	callback(null, response)
	// } else {
		const data = JSON.parse(event.body)
		const race = {
			id: data.id || uuid.v4(),
			name: data.name,
			email: data.email,
			createdAt: Date.now()
		}
		raceDao.create(process.env.RACE_TABLE, race)
			.then(race => {
				const response = {
					statusCode: 200,
					headers: {
						"Access-Control-Allow-Origin": "*",
						"Access-Control-Allow-Headers": "*"
					},
					body: JSON.stringify(race)
				}
				callback(null, response)
			})
	// }
}
