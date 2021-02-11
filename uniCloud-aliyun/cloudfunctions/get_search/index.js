'use strict';
const db = uniCloud.database()
const $ = db.command.aggregate
const uniID = require('uni-id')
exports.main = async (event, context) => {
	const {
		uniIdToken,
		value
	} = event
	const payload = await uniID.checkToken(uniIdToken)
	let collected_ids = []
	if (payload.code === 0) {
		collected_ids = payload.userInfo.collected_ids
	}
	const documents = await db.collection('subject_documents').aggregate()
	.addFields({
		is_collect:$.in(['$_id',collected_ids])
	}).match({
		title: new RegExp(value)
	}).limit(500)
	.end()

	return {
		code: 0,
		msg: 'success',
		data: documents.data
	}
};
