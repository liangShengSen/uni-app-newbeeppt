'use strict';
const db = uniCloud.database()
const dbCmd = db.command
const uniID = require('uni-id')
exports.main = async (event, context) => {
	const {
		uniIdToken,
		document_id
	} = event
	const payload = await uniID.checkToken(uniIdToken)
	if (payload.code) {
		return payload
	}
	let dbCmdFuns = null,
		collected_ids = payload.userInfo.collected_ids || []
	if(collected_ids.includes(document_id)) {
		dbCmdFuns = dbCmd.pull(document_id)
	}else{
		dbCmdFuns = dbCmd.addToSet(document_id)
	}
	await db.collection('uni-id-users').doc(payload.uid).update({
		collected_ids: dbCmdFuns
	})

	return {
		code: 0,
		msg: 'success'
	}
};
