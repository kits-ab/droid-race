const raceDao = require("../dao/race-dao")
const uuid = require("uuid")

module.exports.create = (event, context, callback) => {
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
				headers: { "Access-Control-Allow-Origin": "*" },
				body: JSON.stringify(race)
			}
			callback(null, response)
		})
}
