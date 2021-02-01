'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	const { account, password } = event
	let user = {
		account,
		password,
		nickname: null,
		gender: null,
		avatar: null,
		status: "1",
		collected_ids: [],
		subject_ids: [],
		download_ids: [],
		coins: 0
	}
	let userExist = await db.collection('users').where({
		account
	}).limit(1).get()
	if(userExist.data.length > 0) {
		return {
			code: 400,
			msg: "账号已注册"
		}		
	}
	let res = await db.collection('users').add(user)
	return {
		code: 200,
		msg: "success",
		data: res
	}
};
