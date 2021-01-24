'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	const collection = db.collection('documents');
	let res = await collection.where({
			version_id: "1000"
		}).skip(1).limit(2).get()
	console.log(JSON.stringify(res.data));
};
