'use strict';
const uniID = require('uni-id')
exports.main = async function(event, context) {
	const payload = await uniID.checkToken(event.uniIdToken)
	if (payload.code) {
		return payload
	}
	const userRes = await uniID.getUserInfo({
		uid: payload.uid,
		field: ['is_completed','coins']
	})
	const { nickname, gender, mobile, email } = event
	let data = {
		uid: payload.uid,
		gender
	}
	if(nickname) {
		data['nickname'] = nickname
	}
	if(mobile) {
		data['mobile'] =  mobile
	}
	if(email) {
		data['email'] = email
	}
	if(userRes.code === 0 && !userRes.userInfo.is_completed) { // 首次完善信息赠送20P币
		data['is_completed'] = 1
		data['coins'] = (userRes.userInfo.coins || 0) + 20
	}
	const res = await uniID.updateUser(data)
	return res
}
