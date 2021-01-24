'use strict';
const db = uniCloud.database()
const $ = db.command.aggregate
exports.main = async (event, context) => {
	const {
		id,
		user_id,
		page = 1,
		pageSize = 10
	} = event
	let match = {}
	if (id !== '0') {
		match = {
			subject_id: id
		}
	}
	const userInfo = await db.collection('users').doc(user_id).get()
	const collected_ids = userInfo.data[0].collected_ids
	const documents = await db.collection('documents').aggregate()
	.addFields({
		is_collect:$.in(['$_id',collected_ids])
	})
	.match(match).project({
		intro: 0
	}).skip((page - 1) * pageSize).limit(pageSize).end()

	return {
		code: 200,
		msg: 'success',
		data: documents.data
	}
};
