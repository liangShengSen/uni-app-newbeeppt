'use strict';
const uniID = require('uni-id')
exports.main = async (event, context) => {
	const payload = await uniID.checkToken(event.uniIdToken)
	if (payload.code) {
		return payload
	}
	const res = await uniID.getUserInfo({
		uid: payload.uid,
		field: ['username', 'nickname', 'gender', 'email', 'mobile', 'avatar', 'balance', 'download_total',
			'collected_total'
		]
	})
	return res
};
