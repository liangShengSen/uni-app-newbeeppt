'use strict';
const uniID = require('uni-id')
exports.main = async function(event, context) {
	let {
		code,
		nickname,
		avatar
	} = event
	const res = await uniID.loginByWeixin({
		code
	})
	// 微信注册，设置微信头像和昵称
	if(res.type == 'register') {
		await uniID.updateUser({
			uid: res.uid,
			nickname,
			avatar
		})
	}
	return res
}
