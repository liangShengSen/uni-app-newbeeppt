'use strict';
const db = uniCloud.database()
const $ = db.command.aggregate
const dbCmd = db.command
const uniID = require('uni-id')
exports.main = async (event, context) => {
	let { uniIdToken,type } = event
	const payload = await uniID.checkToken(uniIdToken)
	if (payload.code) {
		return payload
	}
	let arr = []
	if(type === 'download') {
		arr = payload.userInfo.download_ids || []
	}else if(type === 'collected') {
		arr = payload.userInfo.collected_ids || []
	}
	const res = await db.collection('subject_documents').aggregate().addFields({
		is_collect: $.in(['$_id', payload.userInfo.collected_ids])
	}).match({
		_id: dbCmd.in(arr)
	}).end()
	
	return {
		code: 0,
		msg: 'success',
		data: res.data
	}
};
