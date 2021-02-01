'use strict';
const db = uniCloud.database(); //引用数据库
exports.main = async (event, context) => {
	return new Promise((resolve, reject) => {
		db.collection('documents').add(event).then(res => {
			resolve(res);
		}).catch(e => {
			reject(e);
		})
	})
};
