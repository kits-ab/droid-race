const aws = require("aws-sdk")

const ddb = new aws.DynamoDB.DocumentClient()

module.exports.create = (raceTable, race) => {
	const params = {
		TableName: raceTable,
		Item: race
	}
	console.log("Creating", { race })
	return new Promise((resolve, reject) => {
		ddb.put(params, (error) => {
			if (error) {
				reject(new Error(error))
			} else {
				resolve(race)
			}
		})
	})
}

module.exports.end = (raceTable, endTime) => {
	return module.exports.list(raceTable)
		.then(races => {
			if (!races || !races.length || !races[0].startTime || races[0].endTime) {
				throw new Error("No race to end")
			}
			const params = {
				TableName: raceTable,
				Key: {
					id: races[0].id
				},
				ExpressionAttributeNames: { "#raceEndTime": "endTime" },
				ExpressionAttributeValues: { ":s": endTime },
				UpdateExpression: "SET #raceEndTime = :s",
				ReturnValues: "ALL_NEW"
			}
			console.log("Ending", { raceId: races[0].id, endTime })
			return new Promise((resolve, reject) => {
				ddb.update(params, (error) => {
					if (error) {
						reject(new Error(error))
					} else {
						resolve()
					}
				})
			})
		})
}

module.exports.list = (raceTable) => {
	const params = {
		TableName: raceTable
	}
	return new Promise((resolve, reject) => {
		ddb.scan(params, (error, result) => {
			if (error) {
				reject(new Error(error))
			} else {
				resolve(result.Items.sort((a, b) => b.createdAt - a.createdAt))
			}
		})
	})
}

module.exports.start = (raceTable, startTime) => {
	return module.exports.list(raceTable)
		.then(races => {
			if (!races || !races.length || races[0].startTime) {
				throw new Error("No race to start")
			}
			const params = {
				TableName: raceTable,
				Key: {
					id: races[0].id
				},
				ExpressionAttributeNames: { "#raceStartTime": "startTime" },
				ExpressionAttributeValues: { ":s": startTime },
				UpdateExpression: "SET #raceStartTime = :s",
				ReturnValues: "ALL_NEW"
			}
			console.log("Starting", { raceId: races[0].id, startTime })
			return new Promise((resolve, reject) => {
				ddb.update(params, (error) => {
					if (error) {
						reject(new Error(error))
					} else {
						resolve()
					}
				})
			})
		})
}
