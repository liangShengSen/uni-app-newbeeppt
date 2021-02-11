'use strict';
const db = uniCloud.database()
const $ = db.command.aggregate
const uniID = require('uni-id')
exports.main = async (event, context) => {
	const {
		uniIdToken,
		type
	} = event
	const payload = await uniID.checkToken(uniIdToken) // 判断是否登录
	let res = null
	if (payload.code === 0) { // token校验成功，登录态
		let {
			userInfo
		} = payload
		let match = {}
		if(type !== 'all') {
			match.current = true
		}
		res = await db.collection('subjects')
			.aggregate()
			.addFields({
				current: $.in(['$id', $.ifNull([userInfo.subject_ids, []])])
			}).match(match).end()
	}else {
		res = await db.collection('subjects').get()
	}
	
	return {
		code: 0,
		msg: 'success',
		data: res.data
	}
};
