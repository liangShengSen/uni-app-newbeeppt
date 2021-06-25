'use strict';
const uniID = require('uni-id')
const db = uniCloud.database()
const dbCmd = db.command
const nodemailer = require('nodemailer');
const iconv = require('iconv-lite');
const request = require('sync-request');
const cheerio = require('cheerio')
const schedule = require('node-schedule');
const headers = {
	'Content-Type': 'text/html',
	'user-agent': 'Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.106 Mobile Safari/537.36',
	'Cookie': 'vzwvlmlusername=Sam6011966; vzwvlmluserid=4407542; vzwvlmlgroupid=2; vzwvlmlrnd=LfXHhQDCqihc6sLCDSCk;'
}

// 定时访问首页刷新登录session信息
const refreshSession = () => {
	let timer = null;
	try {
		let rule = new schedule.RecurrenceRule();
		rule.hour = [1, 5, 9, 13, 17, 21]; // 每4小时
		timer = schedule.scheduleJob(rule, () => {
			request('GET', 'http://www.pptok.com/', {
				headers
			});
		});
	} catch (e) {
		timer.cancel();
	}
}
refreshSession();

// 根据id获取下载地址
const getDownloadUrl = (id) => {
	let url = `http://vip.pptok.com/down.php?id=${id}`;
	let res = request('GET', url, {
		headers
	});
	let responsebody = iconv.decode(res.getBody(), 'gbk');
	const $ = cheerio.load(responsebody)
	let down_url = $('.tqdown > .box > a').attr('href')
	return down_url;
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
		html: `<b>下载地址：${download_url}</b>`, // 发送内容
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
		data.download_url = getDownloadUrl(source_id); // 获取下载地址
		updateInfo.download_url = data.download_url
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

	// 判断用户是否完善邮箱信息，有则发送文件的下载地址到用户邮箱
	if (payload.userInfo.email) {
		sendDownloadUrlToEmail(payload.userInfo.email, data.download_url)
	}

	return {
		code: 0,
		msg: 'success',
		data
	}
};
