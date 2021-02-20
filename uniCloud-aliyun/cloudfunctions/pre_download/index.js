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
	for(let i = 0;i < docs.length;i++) {
		if (docs[i].id === id && getDays(date,docs[i].down_at) <= 15) {
			data.is_free = true
			break
		}
	}
	return {
		code: 0,
		msg: 'success',
		data
	}
};
