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
	if(PHONE.test(username)) {
		verifyData['mobile'] = username
	}else{
		verifyData['email'] = username
	}
	const checkRes = await uniID.verifyCode(verifyData)
	if(checkRes.code !== 0) {
		return {
			code: 1,
			msg: checkRes.msg
		}
	}
	// 查询是否注册
	let userExist = await db.collection('users').where({
		username
	}).limit(1).get()
	if (userExist.data.length > 0) {
		return {
			code: 1,
			msg: "账号已注册"
		}
	}
	// 注册
	const res = await uniID.register({
		username,
		password
	})
	return res
}
