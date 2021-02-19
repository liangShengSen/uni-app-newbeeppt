'use strict';
const uniID = require('uni-id')
const db = uniCloud.database()
const dbCmd = db.command
const getDays = (d1, d2) => {
	let _d1 = Date.parse(d1),
		_d2 = Date.parse(d2)
	let dateDiffer = Math.abs(_d1 - _d2)
	let differDay = Math.floor(dateDiffer / (24 * 3600 * 1000))
	return differDay

}
exports.main = async (event, context) => {
	const {
		uniIdToken,
		id,
		date
	} = event
	const payload = await uniID.checkToken(uniIdToken)
	if (payload.code) {
		return payload
	}

	const data = {
		balance: payload.userInfo.balance || 0,
		is_free: false
	}
	const docs = payload.userInfo.download_docs || []
	docs.reverse() // 比较最新下载的一条
	for(let i = 0;i < docs.length;i++) {
		if (docs[i].id === id && getDays(date,docs[i].down_at) <= 15) {
			data.is_free = true
			break
		}
	}
	// 该次下载免费
	if(data.is_free) {
		// 则查询出下载地址
		const document = await db.collection('subject_documents').where({
			_id: id,
		}).get()
		data.download_url = document.data[0].download_url || 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-aliyun-k9gnc4vsx5e167449b/c971bd61-99dc-42f0-9b23-a58919d3596b.pptx'
		// 并且添加下载记录
		let download_docs = payload.userInfo.download_docs || []
		download_docs.push({
			id,
			down_at: date
		})
		await db.collection('uni-id-users').doc(payload.uid).update({
			download_docs
		})
		// 更新文档的下载次数
		await db.collection('subject_documents').where({
			_id: id
		}).update({
			download_num: dbCmd.inc(1)
		})
	}
	return {
		code: 0,
		msg: 'success',
		data
	}
};
