'use strict';
const uniID = require('uni-id')
exports.main = async function(event, context) {
	const {
		mobile
	} = event
	// 生成6位数字为例
	const randomStr = '00000' + Math.floor(Math.random() * 1000000)
	const code = randomStr.substring(randomStr.length - 6)
	const res = await uniID.setVerifyCode({
		mobile,
		code,
		expiresIn: 180,
		type: 'login'
	})
	return res
}
