const raceDao = require("../dao/race-dao")

module.exports.end = (event, context, callback) => {
	raceDao.end(process.env.RACE_TABLE, Date.now())
		.then(() => {
			const response = {
				statusCode: 200,
				headers: { "Access-Control-Allow-Origin": "*" }
			}
			callback(null, response)
		})
}
