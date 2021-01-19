const puppeteer = require('puppeteer');
const fs = require('fs');
const dayjs = require('dayjs');

(async () => {
	const browser = await puppeteer.launch({
		headless: true,
	});
	try {
		const page = await browser.newPage();
		await page.goto('http://www.pptok.com/kejian/mulu/204.html');
		let arr = await page.$$eval('#mulu .mldy h2 a', (a) =>
			a.map((v) => {
				return {
					name: v.title,
					url: v.href,
				};
			})
		);
		console.log(arr.length)
		let docsArr = [];
		for (let i = 0; i < arr.length; i++) {
			if (i > 20) {
				console.log(i)
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
								return v.href;
							})
						);
						list = [...list, ...arr];
					}
				} else {
					list = await page.$$eval('#tg_box_con > li > a', (a) =>
						a.map((v) => {
							return v.href;
						})
					);
				}
				arr[i]['list'] = list;
				for (let n = 0; n < arr[i]['list'].length; n++) {
					if(arr[i]['list'][n] != 'http://www.pptok.com/zt/woyaodeshihuluppt/index_2.html') {
						await page.goto(arr[i]['list'][n]);
						let info = {
							name: arr[i].name,
							data: {
								title: await page.$eval('#main h1', (h) => h.innerHTML),
								intro: await page.$eval('#soft-intro p:nth-child(4)', (p) => p.innerHTML),
								fileSize: await page.$eval('.ver-chose', (span) => span.innerHTML),
								priviewImg: await page.$eval('#soft-intro img', (img) => img.src),
								stage_id: '1',
								subject_id: '2',
								version_id: '1000',
								book_id: '10002',
								chapter_id: '',
								grade_id: '2',
								term: "1",
								user_id: '001',
								user_name: 'Sam',
								year: '2021',
								rank: '0',
								price: 5,
								status: '1',
								download_num: 0,
								create_at: dayjs().format('YYYY-MM-DD'),
								update_at: null,
							},
						};
						docsArr.push(info);
					}
				}
			}
		}
		fs.writeFileSync('./json/chapters.json', JSON.stringify(docsArr));
	} catch (e) {
		console.log('err', e);
	} finally {
		await browser.close();
	}
})();
