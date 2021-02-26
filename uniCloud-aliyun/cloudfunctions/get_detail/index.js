'use strict';
const db = uniCloud.database()
const $ = db.command.aggregate
const uniID = require('uni-id')
exports.main = async (event, context) => {
	const {
		_id,
		uniIdToken
	} = event
	const payload = await uniID.checkToken(uniIdToken)
	let collected_ids = []
	if (payload.code === 0) {
		collected_ids = payload.userInfo.collected_ids || []
	}
	let res = await db.collection('test_documents').aggregate()
		.addFields({
			is_collect: $.in(['$_id', collected_ids])
		})
		.match({
			_id
		}).end()

	return {
		code: 0,
		msg: 'success',
		data: res.data[0]
	}
};
