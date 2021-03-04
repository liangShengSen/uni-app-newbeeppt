'use strict';
const db = uniCloud.database()
const dbCmd = db.command
exports.main = async (event, context) => {
	const { chapter_id } = event
	const res = await db.collection('test_documents').where({
		"book.value":"6040bddd38aac700017032b5"
	}).remove()
	return res
};