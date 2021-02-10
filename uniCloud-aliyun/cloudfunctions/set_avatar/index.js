'use strict';
const uniID = require('uni-id')
exports.main = async function(event, context) {
	const {
		avatar
	} = event
	const payload = await uniID.checkToken(event.uniIdToken)
	if (payload.code) {
		return payload
	}
	const res = await uniID.setAvatar({
		uid: payload.uid,
		avatar
	})
	return res
}
