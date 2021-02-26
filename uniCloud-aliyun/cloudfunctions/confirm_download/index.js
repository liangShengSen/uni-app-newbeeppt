'use strict';
const uniID = require('uni-id')
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
	await db.collection('test_documents').where({
		_id
	}).update({
		download_num: dbCmd.inc(1)
	})
	// 获取下载地址
	data.download_url =
		'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-aliyun-k9gnc4vsx5e167449b/c971bd61-99dc-42f0-9b23-a58919d3596b.pptx'

	return {
		code: 0,
		msg: 'success',
		data
	}
};
