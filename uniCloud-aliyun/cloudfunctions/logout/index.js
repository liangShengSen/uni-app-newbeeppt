'use strict';
const uniID = require('uni-id')
exports.main = async (event, context) => {
	const res = await uniID.logout(event.uniIdToken)
	return res
};
