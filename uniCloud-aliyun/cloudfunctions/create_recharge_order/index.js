'use strict';
const uniID = require('uni-id')
const db = uniCloud.database()
exports.main = async (event, context) => {
	let {
		token,
		id,
		price,
		date,
	} = event.queryStringParameters
	const payload = await uniID.checkToken(token)
	if (payload.code) {
		return payload
	}
	let recharge_orders = payload.userInfo.recharge_orders || []
	recharge_orders.unshift({
		id,
		price,
		date
	})
	await db.collection('uni-id-users').doc(payload.userInfo._id).update({
		recharge_orders
	})
	
	return {
		code: 0,
		msg: 'success'
	}
};
