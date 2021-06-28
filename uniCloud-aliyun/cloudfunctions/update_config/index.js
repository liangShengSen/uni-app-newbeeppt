'use strict';
const db = uniCloud.database()
const config_id = '60d9dad44cb0900001cc7815'
exports.main = async (event, context) => {
	let {
		rnd
	} = event.queryStringParameters
	let data = await db.collection('download_config').doc(config_id).update({
		rnd
	})
	return JSON.stringify({
		code: 0,
		msg: '更新成功',
		data
	})
};
