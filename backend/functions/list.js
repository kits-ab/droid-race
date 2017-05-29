const raceDao = require("../dao/race-dao")

module.exports.list = (event, context, callback) => {
	raceDao.list(process.env.RACE_TABLE)
		.then(races => {
			const response = {
				statusCode: 200,
				headers: { "Access-Control-Allow-Origin": "*" },
				body: JSON.stringify(races.map(race => ({
					id: race.id,
					name: race.name,
					createdAt: race.createdAt,
					startTime: race.startTime,
					endTime: race.endTime
				})))
			}
			callback(null, response)
		})
}
