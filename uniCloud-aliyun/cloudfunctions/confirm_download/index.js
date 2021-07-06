'use strict';
const uniID = require('uni-id')
const db = uniCloud.database()
const dbCmd = db.command
const nodemailer = require('nodemailer');
const iconv = require('iconv-lite');
const request = require('sync-request');
const cheerio = require('cheerio')
const EMAIL = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/

const config_id = '60d9dad44cb0900001cc7815'

const getHeaders = async () => {
	let res = await db.collection('download_config').doc(config_id).get();
	let {
		name,
		user_id,
		group_id,
		rnd
	} = res.data[0]
	const headers = {
		'Content-Type': 'text/html',
		'user-agent': 'Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.106 Mobile Safari/537.36',
		'Cookie': `vzwvlmlusername=${name}; vzwvlmluserid=${user_id}; vzwvlmlgroupid=${group_id}; vzwvlmlrnd=${rnd}`
	}
	return headers;
}

const updateConfig = async () => {
	const url =
		'https://oapi.dingtalk.com/robot/send?access_token=bd2aaca8466f6540d0dd5cc00f80bcc9150d77f837da21ebbe857f0979248090'
	const res = await uniCloud.httpclient.request(url, {
		method: 'POST',
		data: {
			msgtype: 'actionCard',
			actionCard: {
				title: "更新配置",
				text: `更新链接: https://7d64ea77-4eba-4652-9fb5-6cbebc534629.bspapp.com/http/update_config?rnd=`,
				btns: [{
					title: "确认更新",
					actionURL: `https://7d64ea77-4eba-4652-9fb5-6cbebc534629.bspapp.com/http/update_config?rnd=`
				}]
			}
		},
		contentType: 'json',
		dataType: 'json'
	})
	return res;
}

// 根据id获取下载地址
const getDownloadUrl = async (id) => {
	const req = async (id) => {
		let url = `http://vip.pptok.com/down.php?id=${id}`,
			headers = await getHeaders();
		let body = request('GET', url, {
			headers
		});
		body = iconv.decode(body.getBody(), 'gbk');
		return body
	}
	let res = await req(id);
	// source_id有的前面带8位格式日期，有的不带，因此需要截取后再请求一次
	if (res.indexOf('此信息不存在') > -1 || res.indexOf('window.close') > -1) {
		res = await req(id.slice(8));
	}
	// 下载配置信息失效，发出更新通知
	if (res.indexOf('QQ登录') > -1 || res.indexOf('微信登录') > -1) {
		await updateConfig();
		return '';
	}
	const $ = cheerio.load(res)
	let down_url = $('.tqdown > .box > a').attr('href')
	return down_url;
}
// 返回前端的文件下载地址
const createDownloadUrl = async (uid, _id) => {
	let {
		token,
		tokenExpired
	} = await uniID.createToken({
		uid
	});
	// 云函数URL化后，无法使用token校验
	let url =
		`https://7d64ea77-4eba-4652-9fb5-6cbebc534629.bspapp.com/http/create_download_url?_id=${_id}&uid=${uid}&expired=${tokenExpired}`
	return url;
}
// 发送下载地址到邮箱
const sendDownloadUrlToEmail = async (email, download_url) => {
	// 发件人
	let transporter = nodemailer.createTransport({
		service: 'qq',
		port: 465,
		secure: true,
		auth: {
			user: '1213509006@qq.com',
			pass: 'wnzgxvmwlojtheaj', // smtp授权密码
		},
	});
	// 邮件信息
	let mailOptions = await transporter.sendMail({
		from: '"Newbeeppt小程序" <1213509006@qq.com>', // 发送者
		to: email, // 接收者
		subject: "PPT文档下载地址", // 主题
		html: `<b>复制链接到浏览器打开即可下载：${download_url}</b>`, // 发送内容
	});
	// 捕获错误
	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			return console.log(error);
		}
	});
}

exports.main = async (event, context) => {
	let {
		uniIdToken,
		_id,
		source_id,
		coins,
		is_free,
		date
	} = event
	const payload = await uniID.checkToken(uniIdToken)
	if (payload.code) {
		return payload
	}
	let data = {},
		updateInfo = {
			download_num: dbCmd.inc(1),
		};
	// 判断是否有下载地址
	let docRecord = await db.collection('documents').doc(_id).get(),
		document = docRecord.data[0]
	if (document.download_url) {
		data.download_url = document.download_url
	} else {
		// 获取下载地址
		data.download_url = await getDownloadUrl(source_id);
		if (data.download_url) {
			updateInfo.download_url = data.download_url
		} else {
			return {
				code: 0,
				msg: '当前下载人数较多，请5分钟后重试。',
				data
			}
		}
	}

	await db.collection('documents').doc(_id).update(updateInfo) // 更新文档

	// 扣费，添加下载记录
	await db.collection('uni-id-users').doc(payload.uid).update({
		balance: dbCmd.inc(is_free ? 0 : -(parseInt(coins))),
		download_docs: dbCmd.unshift({
			_id,
			down_at: date
		}),
		download_total: dbCmd.inc(1)
	})

	// 给下载地址套上一层外壳，并且生成token鉴权
	data.download_url = await createDownloadUrl(payload.uid, _id)

	// 判断用户是否完善邮箱信息，有则发送文件的下载地址到用户邮箱
	if (payload.userInfo.email || EMAIL.test(payload.userInfo.username)) {
		await sendDownloadUrlToEmail(payload.userInfo.email, data.download_url)
	}

	return {
		code: 0,
		msg: 'success',
		data
	}
};
