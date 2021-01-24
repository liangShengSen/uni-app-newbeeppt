'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	const collection = db.collection('chapters');
	const res = await collection.where({
		version_id:"1001",
		book_id: "10013"
	}).get()
	//返回数据给客户端
	return {
		code: 200,
		data: res.data
	}
};