'use strict';
const db = uniCloud.database()
const uniID = require('uni-id')
exports.main = async (event, context) => {
	const { subject_ids = [] } = event
	const payload = await uniID.checkToken(event.uniIdToken)
	if (payload.code) {
		return payload
	}
	await db.collection('uni-id-users').doc(payload.userInfo._id).update({
		subject_ids
	})
	return {
		code: 0,
		msg: '设置成功'
	}
};
