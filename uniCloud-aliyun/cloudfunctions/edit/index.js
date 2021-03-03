'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	console.log(event[0]);
	for(let i = 0; i < event.length; i++) {
		let item = event[i]
		// if(i === 0) {
			let options = item.data
			delete item.data
			const res = await db.collection('books').add(item)
			// console.log(res);
			let { id } = res
			let obj = {
				stage: item.stage,
				subject: item.subject,
				version: item.version,
				book: {
					name: item.name,
					value: id
				},
				options
			}
			const res1 = await db.collection('chapters').add(obj)
		// }	
	}
	return 'success'
};