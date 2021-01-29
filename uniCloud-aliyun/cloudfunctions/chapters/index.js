'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	const collection = db.collection('documents');
	const res = await collection.where({
		book_id:'10000'
	}).limit(1).get()
	res.data.forEach(async item =>{
		await collection.doc(item._id).update({
			file_size: item.fileSize,
			priview_imgs: [item.priviewImg],
		})
	})
	return res.data
};
