'use strict';
const db = uniCloud.database()
const $ = db.command.aggregate
exports.main = async (event, context) => {
	const {
		value,
		user_id,
	} = event
	const userInfo = await db.collection('users').doc(user_id).get()
	const collected_ids = userInfo.data[0].collected_ids
	const documents = await db.collection('subject_documents').aggregate()
	.addFields({
		is_collect:$.in(['$_id',collected_ids])
	}).match({
		title: new RegExp(value)
	}).limit(500)
	.end()

	return {
		code: 200,
		msg: 'success',
		data: documents.data
	}
};
