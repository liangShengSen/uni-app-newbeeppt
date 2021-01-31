'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	const { user_id } = event
	if(!user_id) {
		return {
			code: 400,
			msg: '缺少用户id'
		}
	}
	const userInfo = await db.collection('users').doc(user_id).get()
	
	return {
		code: 200,
		msg: success,
		data: userInfo.data[0]
	}
};
