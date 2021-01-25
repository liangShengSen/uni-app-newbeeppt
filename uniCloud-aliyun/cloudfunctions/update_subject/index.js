'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	const { user_id, subject_ids = [] } = event
	await db.collection('users').doc(user_id).update({
		subject_ids
	})
	return {
		code: 200,
		msg: 'success'
	}
};
