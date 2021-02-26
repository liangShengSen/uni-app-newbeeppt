'use strict';
const db = uniCloud.database()
const uniID = require('uni-id')
exports.main = async (event, context) => {
	const {
		username,
		password
	} = event
	const res = await uniID.login({
		username,
		password,
		queryField: ['username']
	})
	return res
};
