'use strict';
const uniID = require('uni-id')
exports.main = async function(event, context) {
	console.log(event);
	const payload = await uniID.checkToken(event.uniIdToken)
	if (payload.code) {
		return payload
	}
	const res = await uniID.updateUser({
		uid: payload.uid,
		nickname: 'Sam',
		gender: 1,
		status: 1,
		collected_ids: [1,3]
	})
	return res
}
