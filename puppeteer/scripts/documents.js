const puppeteer = require('puppeteer');
const fs = require('fs');
const dayjs = require('dayjs');

(async () => {
	const browser = await puppeteer.launch({
		headless: true,
	});
	try {
		const page = await browser.newPage();
		await page.setDefaultNavigationTimeout(0);
		await page.goto('http://www.pptok.com/kejian/mulu/207.html');
		let arr = await page.$$eval('#mulu .mldy h2 a', (a) =>
			a.map((v) => {
				return {
					name: v.innerHTML,
					url: v.href,
				};
			})
		);
		console.log(arr.length)
		let docsArr = [];
		for (let i = 0; i < arr.length; i++) {
			console.log(i)
			if(arr[i].url) {
				await page.goto(arr[i].url);
				const pageEle = await page.$('.bigPage > a');
				let list = [];
				if (pageEle) {
					let pagesLinks = await page.$$eval('.bigPage a', (a) =>
						a.map((v) => {
							return v.href;
						})
					);
					for (let j = 0; j < pagesLinks.length; j++) {
						await page.goto(pagesLinks[j]);
						let arr = await page.$$eval('#tg_box_con > li > a', (a) =>
							a.map((v) => {
								let img = $(v).find('.topic > img').attr('src')
								return {
									href: v.href,
									cover: `http://www.pptok.com${img}`,
								}
							})
						);
						list = [...list, ...arr];
					}
				} else {
					list = await page.$$eval('#tg_box_con > li > a', (a) =>
						a.map((v) => {
							let img = $(v).find('.topic > img').attr('src')
							return {
								href: v.href,
								cover: `http://www.pptok.com${img}`,
							}
						})
					);
				}
				arr[i]['list'] = list;
				for (let n = 0; n < arr[i]['list'].length; n++) {
					console.log(arr[i]['name'])
					try {
						await page.goto(arr[i]['list'][n]['href']);
						let info = {
							name: arr[i].name,
							data: {
								title: await page.$eval('#main h1', (h) => h.innerHTML),
								intro: await page.$eval('#soft-intro p:nth-child(4)', (p) => p.innerHTML),
								file_size: await page.$eval('.ver-chose', (span) => span.innerHTML),
								priview_imgs: [await page.$eval('#soft-intro img', (img) => img.src)],
								cover_img: arr[i]['list'][n]['cover'],
								author: {
								    "id": "001",
								    "name": "Sam"
								},
								stage: {
									"id": "1",
									"name": "小学"
								},
								subject: {
									"id": "2",
									"name": "语文"
								},
								version:{
									"id":"1000",
									"name":"人教部编版"
								},
								book:{
									"id":"10005",
									"name":"三年级下册"
								},
								grade: {
									"id": "3",
									"name": "三年级"
								},
								chapter:{
									"id":"",
									"name": ""
								},
								term: "2",
								year: '2021',
								rank: '0',
								price: 5,
								status: '1',
								download_num: 0,
								created_at: dayjs().format('YYYY-MM-DD'),
								type: "ppt",
								type_label: "课件"
							},
						};
						docsArr.push(info);
					}catch(err) {
						console.log(`错误链接：${arr[i]['list'][n]['href']}`)
						console.log(err)
					}
				}
			}
		}
		fs.writeFileSync('./json/temp.json', JSON.stringify(docsArr));
	} catch (e) {
		console.log('err', e);
	} finally {
		await browser.close();
	}
})();
