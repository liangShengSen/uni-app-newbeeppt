'use strict';
const uniID = require('uni-id')
const db = uniCloud.database()
exports.main = async (event, context) => {
	try {
		let {
			_id,
			uid,
			expired
		} = event.queryStringParameters
		

		let userRecord = await db.collection('uni-id-users').doc(uid).get();

		// 当前用户id不存在或者当前时间戳大于token过期时间戳(2小时)，返回过期提示
		if (!userRecord.affectedDocs || Date.now() > expired) {
			return '链接已失效，请重新下载。'
		}

		let docRecord = await db.collection('documents').doc(_id).get(),
			document = docRecord.data[0]
		return {
			mpserverlessComposedResponse: true, // 使用阿里云返回集成响应是需要此字段为true
			isBase64Encoded: false,
			statusCode: 301,
			headers: {
				'location': document.download_url
			}

		}
	} catch (e) {
		return '链接已失效，请重新下载。'
	}
};
