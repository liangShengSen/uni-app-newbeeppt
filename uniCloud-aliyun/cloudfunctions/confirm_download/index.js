'use strict';
const uniID = require('uni-id')
const nodemailer = require('nodemailer');
const db = uniCloud.database()
const dbCmd = db.command
exports.main = async (event, context) => {
	let {
		uniIdToken,
		_id,
		coins,
		is_free,
		date
	} = event
	const payload = await uniID.checkToken(uniIdToken)
	if (payload.code) {
		return payload
	}
	let data = {}
	// 扣费，添加下载记录
	await db.collection('uni-id-users').doc(payload.uid).update({
		balance: dbCmd.inc(is_free ? 0 : -(parseInt(coins))),
		download_docs: dbCmd.unshift({
			_id,
			down_at: date
		}),
		download_total: dbCmd.inc(1)
	})
	// 更新文档的下载次数
	await db.collection('documents').where({
		_id
	}).update({
		download_num: dbCmd.inc(1)
	})
	// 获取下载地址
	data.download_url =
		'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-7d64ea77-4eba-4652-9fb5-6cbebc534629/e011f060-0c38-442e-ab1c-ec449e86b9e5.pptx'
		
	// 判断用户是否完善邮箱信息，有则发送文件的下载地址到用户邮箱
	if(payload.userInfo.email) {
		
	}

	return {
		code: 0,
		msg: 'success',
		data
	}
};
