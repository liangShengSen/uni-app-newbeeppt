'use strict';
const db = uniCloud.database()
const dbCmd = db.command
exports.main = async (event, context) => {
	const {
		user_id,
		document_id
	} = event
	const userInfo = await db.collection('users').doc(user_id).get()
	const collected_ids = userInfo.data[0].collected_ids
	let dbCmdFuns = null
	if(collected_ids.includes(document_id)) {
		dbCmdFuns = dbCmd.pull(document_id)
	}else{
		dbCmdFuns = dbCmd.addToSet(document_id)
	}
	await db.collection('users').doc(user_id).update({
		collected_ids: dbCmdFuns
	})

	return {
		code: 200,
		msg: 'success',
		data: userInfo.data[0]
	}
};
