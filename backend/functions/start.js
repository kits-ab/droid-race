const raceDao = require("../dao/race-dao")

module.exports.start = (event, context, callback) => {
	raceDao.start(process.env.RACE_TABLE, Date.now())
		.then(() => {
			const response = {
				statusCode: 200,
				headers: { "Access-Control-Allow-Origin": "*" }
			}
			callback(null, response)
		})
}
