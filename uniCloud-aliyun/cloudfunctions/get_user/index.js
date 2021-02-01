'use strict';
const db = uniCloud.database()
const $ = db.command.aggregate
exports.main = async (event, context) => {
	const { user_id } = event
	if(!user_id) {
		return {
			code: 400,
			msg: '缺少用户id'
		}
	}
	const userInfo = await db.collection('users').aggregate().match({
		_id: user_id
	}).addFields({
		collectCount: {
			$size: '$collected_ids'
		},
		downloadCount: {
			$size: '$download_ids'
		}
	}).project({
		subject_ids: 0,
		collected_ids: 0,
		download_ids: 0
	}).end()
	return {
		code: 200,
		msg: 'success',
		data: userInfo.data[0]
	}
};
