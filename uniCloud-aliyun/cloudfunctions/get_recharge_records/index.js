'use strict';
const uniID = require('uni-id')
exports.main = async (event, context) => {
	let {
		uniIdToken
	} = event
	const payload = await uniID.checkToken(uniIdToken)
	if (payload.code) {
		return payload
	}
	const res = await uniID.getUserInfo({
		uid: payload.uid,
		field: ['recharge_orders']
	})
	return res
};
