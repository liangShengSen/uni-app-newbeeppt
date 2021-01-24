'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	const res = await db.collection('subjects').get()
	return {
		code: 200,
		msg: 'success',
		data: res.data
	}
};
