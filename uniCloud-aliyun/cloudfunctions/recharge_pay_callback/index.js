'use strict';
const uniID = require('uni-id')
const getNowDate = () => {
	let now = new Date()
	let yy = now.getFullYear(),
		mm = (now.getMonth() + 1),
		dd = now.getDate()
	return `${yy}-${mm < 10 ? `0${mm}` : mm}-${dd < 10 ? `0${dd}` : dd}`
}
exports.main = async (event, context) => {
	const {
		uniIdToken,
		price,
		coins,
		_id,
		date
	} = event
	const payload = await uniID.checkToken(uniIdToken)
	if (payload.code) {
		return payload
	}
	const url =
		'https://oapi.dingtalk.com/robot/send?access_token=bd2aaca8466f6540d0dd5cc00f80bcc9150d77f837da21ebbe857f0979248090'
	const res = await uniCloud.httpclient.request(url, {
		method: 'POST',
		data: {
			msgtype: 'actionCard',
			actionCard: {
				title: "转账充值",
				text: `充值金额: ${price}&emsp;&emsp;&emsp;&emsp;&emsp;可得P豆: ${coins}&emsp;充值日期：${getNowDate()}`,
				btns: [{
					title: "确认支付",
					actionURL: `https://7d64ea77-4eba-4652-9fb5-6cbebc534629.bspapp.com/http/create_recharge_order?uid=${payload.uid}&_id=${_id}&price=${price}&coins=${coins}&date=${date}`
				}]
			}
		},
		contentType: 'json',
		dataType: 'json'
	})
	return {
		code: 0,
		msg: 'success',
		data: res
	}
};
