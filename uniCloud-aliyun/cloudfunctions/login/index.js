'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	const { account, password } = event
	let user = await db.collection('users').aggregate().match({
		account,
		password
	}).project({
		subject_ids: 0,
		collected_ids: 0,
		download_ids: 0
	}).end();
	if(user.data.length === 0) {
		return {
			code: 400,
			msg: "账号或密码错误"
		}		
	}
	return {
		code: 200,
		msg: "success",
		data: user.data[0]
	}
};
