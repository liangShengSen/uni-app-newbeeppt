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
		await page.goto('http://www.pptok.com/kejian/mulu/178.html');
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
			if (arr[i].url) {
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
						let temp_url = list[n]['href'].split('.html')[0],
							source_id = temp_url.substring(temp_url.lastIndexOf('/') + 1)
							console.log(source_id)
						let info = {
							name: arr[i].name,
							data: {
								title: await page.$eval('#main h1', (h) => h.innerHTML),
								intro: await page.$eval('#soft-intro p:nth-child(4)', (p) => p.innerHTML),
								file_size: await page.$eval('.ver-chose', (span) => span.innerHTML),
								priview_imgs: await page.$eval('#soft-intro img', (img) => img.src),
								cover_img: arr[i]['list'][n]['cover'],
								source_id,
								author: {
									"id": "001",
									"name": "admin"
								},
								"stage": {
									"name": "小学",
									"value": "6038483da112ea00011a4ef7"
								},
								"subject": {
									"name": "语文",
									"value": "5ffef5038cc87f0001b0d7a6"
								},
								"version": {
									"name": "北师大版",
									"value": "6040bcac714a8c00015d7b4e"
								},
								"book": {
									"name": "四年级上册",
									"value": "6040bddd38aac700017032ba"
								},
								grade: {
									"name": "四年级",
									"value": "603b8a1eb68dad7fd627f702"
								},
								chapter: {
									"name": "",
									"value": "",
								},
								rank: '0',
								price: 10,
								download_num: 0,
								created_at: dayjs().format('YYYY-MM-DD'),
								label: "课件"
							},
						};
						docsArr.push(info);
					} catch (err) {
						console.log(`错误链接：${arr[i]['list'][n]['href']}`)
						console.log(err)
					}
				}
			}
		}
		fs.writeFileSync('../json/temp.json', JSON.stringify(docsArr));
		console.log(docsArr.length)
	} catch (e) {
		console.log('err', e);
	} finally {
		await browser.close();
	}
})();
