'use strict';
const db = uniCloud.database()
const uniID = require('uni-id')
const PHONE = /^1[3456789][0-9]\d{8}$/
exports.main = async function(event, context) {
	const {
		username,
		code,
		password
	} = event
	// 校验验证码
	let verifyData = {
		code,
		type: 'register'
	}
	if (PHONE.test(username)) {
		verifyData['mobile'] = username
	} else {
		verifyData['email'] = username
	}
	const checkRes = await uniID.verifyCode(verifyData)
	if (checkRes.code !== 0) {
		return {
			code: 1,
			msg: checkRes.msg
		}
	}
	// 注册
	const res = await uniID.register({
		username,
		password
	})
	return res
}
