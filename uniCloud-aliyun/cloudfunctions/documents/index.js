'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	const collection = db.collection('documents');
	let res = await collection.where({book_id: '10001'}).update({
	  term: '2',
	})
	console.log(res);
};
