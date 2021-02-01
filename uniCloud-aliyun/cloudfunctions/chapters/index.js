'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	const collection = db.collection('chapters');
	const res = await collection.where({
		'book.id':'10002'
	}).get()
	return res.data
};
