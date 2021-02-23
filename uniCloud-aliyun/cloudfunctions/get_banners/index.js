'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	const { position } = event
	const res = await db.collection('banners').where({
		position
	}).orderBy('order','asc').get()
	return {
		code: 0,
		msg: 'success',
		data: res.data
	}
};
