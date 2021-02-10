'use strict';
const db = uniCloud.database()
const uniID = require('uni-id')
exports.main = async function(event, context) {
	const {
		mobile,
		email,
	} = event
	// 生成6位数字为例
	const randomStr = '00000' + Math.floor(Math.random() * 1000000)
	const code = randomStr.substring(randomStr.length - 4)
	let data = {
		code,
		type: 'register',
		expiresIn: 300, // 有效时长5mins
	}
	let params = {}
	if(mobile) {
		data['mobile'] = mobile
		params['mobile'] = mobile
	}else{
		data['email'] = email
		params['email'] = email
	}
	const res = await uniID.setVerifyCode(data)
	if(res.code === 0) {
		const res = await db.collection('opendb-verify-codes').where(params).orderBy("created_at","desc").get()
		return {
			code: 0,
			msg: "success",
			data: res.data[0] // 最新一条
		}
		
	}
}
