'use strict';
const db = uniCloud.database()
let arr = [];
exports.main = async (event, context) => {
	let res = await db.collection('documents').skip(2500).limit(500).get();
	res.data.map(item => {
		if(item.source_id.length > 8) {
			arr.push(item.source_id);
		}
	})
	return arr;
};
