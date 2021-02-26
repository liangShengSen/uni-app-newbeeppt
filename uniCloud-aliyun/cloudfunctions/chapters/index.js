'use strict';
const db = uniCloud.database()
const dbCmd = db.command
exports.main = async (event, context) => {
	const { stage_id, subject_id, version_id } = event
	const res = await db.collection('books').where({
		'stage._id': stage_id,
		'subject._id': subject_id,
		'version._id': version_id
	}).orderBy('order','asc').get()
	return res.data
	// let res = await db.collection('books').update({
	//   grade: dbCmd.remove()
	// })
	// return res
};
	