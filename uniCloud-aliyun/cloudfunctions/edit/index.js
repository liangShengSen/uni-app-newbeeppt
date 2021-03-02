'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	const res = await db.collection('chapters').where({
		'_id': '603db513d6547d0001b10678'
	}).get()
	let options = res.data[0].options
	options.forEach(item => {
		item.value = item._id
		delete item._id
	})
	const result = await db.collection('chapters').where({
		'_id': '603db513d6547d0001b10678'
	}).update({
		options
	})
	return result
};