'use strict';
const db = uniCloud.database()
const $ = db.command.aggregate
exports.main = async (event, context) => {
	const { user_id, id } = event
	let userInfo = await db.collection('users').doc(user_id).get()
	userInfo = userInfo.data[0]
	let document = await db.collection('documents').aggregate()
	.addFields({
		is_collect:$.in(['$_id',userInfo.collected_ids])
	})
	.match({
		_id:id
	}).end()
	
	return {
		code: 200,
		msg: 'success',
		data: document.data[0]
	}
};
