'use strict';
const uniID = require('uni-id')
exports.main = async (event, context) => {
	const payload = await uniID.checkToken(event.uniIdToken)
	if (payload.code) {
		return payload
	}
	const res = await uniID.getUserInfo({
		uid: payload.uid,
		field: ['username','nickname','collected_ids','download_ids','gender','email','mobile','avatar','coins']
	})
	return res
};
