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
		num = 0,
		collected_ids = payload.userInfo.collected_ids || []
	if (collected_ids.includes(document_id)) {
		dbCmdFuns = dbCmd.pull(document_id)
		num = -1
	} else {
		dbCmdFuns = dbCmd.addToSet(document_id)
		num = 1
	}
	await db.collection('uni-id-users').doc(payload.uid).update({
		collected_ids: dbCmdFuns,
		collected_total: dbCmd.inc(num)
	})

	return {
		code: 0,
		msg: 'success'
	}
};
