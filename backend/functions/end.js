const raceDao = require("../dao/race-dao")

module.exports.end = (event, context, callback) => {
	const raceSecret = event.headers ? event.headers.RaceSecret : null
	if (event.headers && (!raceSecret || raceSecret !== process.env.RACE_SECRET)) {
		const response = {
			statusCode: 401,
			headers: { "Access-Control-Allow-Origin": "*" }
		}
		callback(null, response)
	} else {
		raceDao.end(process.env.RACE_TABLE, Date.now())
			.then(() => {
				const response = {
					statusCode: 200,
					headers: { "Access-Control-Allow-Origin": "*" }
				}
				callback(null, response)
			})
	}
}
