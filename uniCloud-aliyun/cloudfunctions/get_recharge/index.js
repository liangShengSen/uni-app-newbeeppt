'use strict';
const uniID = require('uni-id')
const db = uniCloud.database()
exports.main = async (event, context) => {
	const payload = await uniID.checkToken(event.uniIdToken)
	if (payload.code) {
		return payload
	}
	const res = await db.collection('recharge_rules').orderBy('price', 'asc').get()
	return {
		code: 0,
		msg: 'success',
		data: {
			recharges: res.data,
			balance: payload.userInfo.balance
		}

	}
};
