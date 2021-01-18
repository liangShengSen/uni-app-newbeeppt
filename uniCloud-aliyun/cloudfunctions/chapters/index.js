'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	const collection = db.collection('chapters');
	const res = await collection.where({
		version_id:"1000",
		book_id: "10000"
	}).get()
	console.log(JSON.stringify(res));
	//返回数据给客户端
	return {
		code: 200,
		data: res.data
	}
};
