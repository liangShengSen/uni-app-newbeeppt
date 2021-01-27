'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	const collection = db.collection('subject_documents');
	const res = await collection.where({
		subject:'数学'
	}).count()
	console.log(res);
	return res.data
};
