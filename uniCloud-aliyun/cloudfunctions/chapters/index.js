'use strict';
const db = uniCloud.database()
const dbCmd = db.command
exports.main = async (event, context) => {
	const { chapter_id } = event
	const res = await db.collection('chapters').where({
		'_id': chapter_id
	}).get()
	return res.data
};
	