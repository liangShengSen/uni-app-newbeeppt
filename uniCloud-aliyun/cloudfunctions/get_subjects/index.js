'use strict';
const db = uniCloud.database()
const $ = db.command.aggregate
exports.main = async (event, context) => {
	const { user_id,type } = event
	let match = {}
	if(type !== 'all') {
		match = {
			current: true
		}
	}
	let  userInfo = await db.collection('users').doc(user_id).get()
	userInfo = userInfo.data[0]
	
	const res = await db.collection('subjects')
	.aggregate()
	.addFields({
		current: $.in(['$_id',$.ifNull([userInfo.subject_ids,[]])])
	}).match(match).end()
	
	return {
		code: 200,
		msg: 'success',
		data: res.data
	}
};
