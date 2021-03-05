'use strict';
const db = uniCloud.database()
const dbCmd = db.command
exports.main = async (event, context) => {
	const { chapter_id } = event
	const res = await db.collection('test_documents').where({
		"book.value":"6040bddec092750001744841"
	}).update({
		'book.name':'六年级下册'
	})
	return res
};