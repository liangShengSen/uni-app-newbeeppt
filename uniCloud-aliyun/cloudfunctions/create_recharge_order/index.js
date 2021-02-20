'use strict';
const db = uniCloud.database()
const dbCmd = db.command
exports.main = async (event, context) => {
	let {
		uid,
		id,
		price,
		coins,
		date,
	} = event.queryStringParameters
	await db.collection('uni-id-users').doc(uid).update({
		recharge_orders: dbCmd.unshift({
			id,
			price,
			date
		}),
		balance: dbCmd.inc(Number(coins))
	})

	return {
		code: 0,
		msg: '确认充值',
	}
};
