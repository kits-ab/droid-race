const aws = require("aws-sdk")
const iotData = new aws.IotData({ endpoint: process.env.IOT_ENDPOINT })

module.exports.stream = (event, context, callback) => {
	Promise.all(event.Records
		.map(record => aws.DynamoDB.Converter.output({ M: record.dynamodb.NewImage }))
		.map(race => iotData.publish({
			topic: 'droid-race-updates',
			payload: JSON.stringify({
				id: race.id,
				name: race.name,
				createdAt: race.createdAt,
				startTime: race.startTime,
				endTime: race.endTime
			})
		}).promise()))
		.then(() => {
			callback(null, {})
		})
}
