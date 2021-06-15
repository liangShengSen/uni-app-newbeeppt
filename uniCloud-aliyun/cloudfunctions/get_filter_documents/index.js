'use strict';
const db = uniCloud.database()
const $ = db.command.aggregate
const uniID = require('uni-id')
exports.main = async (event, context) => {
	const {
		uniIdToken,
		stage_id,
		subject_id,
		chapter_id,
		grade_id,
		rank_id,
		page = 1,
		pageSize = 10
	} = event
	let match = {
		'chapter.value': chapter_id
	}
	if(!chapter_id) {
		match = {
			'stage.value': stage_id,
			'subject.value': subject_id,
			'grade.value': grade_id,
			rank: rank_id			
		}
	}
	const payload = await uniID.checkToken(uniIdToken)
	let collected_ids = []
	if (payload.code === 0) { // 登录态
		collected_ids = payload.userInfo.collected_ids || []
	}
	const res = await db.collection('documents').aggregate().addFields({
		is_collect: $.in(['$_id', collected_ids])
	}).match(match).skip((page - 1) * pageSize).limit(pageSize).end()

	return {
		code: 0,
		msg: 'success',
		data: res.data
	}
};
