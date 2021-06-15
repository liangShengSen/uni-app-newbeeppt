'use strict';
const db = uniCloud.database()
const $ = db.command.aggregate
const uniID = require('uni-id')
exports.main = async (event, context) => {
	const {
		uniIdToken,
		subject,
		page = 1,
		pageSize = 10
	} = event
	let match = {}
	if (subject !== '全部') {
		match = {
			subject
		}
	}
	const payload = await uniID.checkToken(uniIdToken)
	let collected_ids = []
	if (payload.code === 0) { // 登录态
		collected_ids = payload.userInfo.collected_ids || []
	}
	const res = await db.collection('documents').aggregate().addFields({
		is_collect: $.in(['$_id', collected_ids])
	}).match(match).skip((page - 1) * pageSize).limit(pageSize).end()

	return {
		code: 0,
		msg: 'success',
		data: res.data
	}
};
