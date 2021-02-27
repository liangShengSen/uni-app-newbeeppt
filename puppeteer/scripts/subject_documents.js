const puppeteer = require('puppeteer');
const fs = require('fs');
const dayjs = require('dayjs');

(async () => {
	let pageUrl = 'http://www.pptok.com/pptku/jiachanghuippt/'
	const browser = await puppeteer.launch({
		headless: true,
	});
	try {
		const page = await browser.newPage();
		await page.setDefaultNavigationTimeout(0);
		await page.goto(pageUrl);
		let list = [],
			docsArr = [];
		let pagesArr = [`${pageUrl}index.html`]
		for (let i = 2; i <= 100; i++) {
			pagesArr.push(`${pageUrl}index_${i}.html`)
		}
		for (let i = 0; i < pagesArr.length; i++) {
			await page.goto(pagesArr[i]);
			let arr = await page.$$eval('#tg_box_con > li > a', (a) =>
				a.map((v) => {
					let img = $(v).find('.topic > img').attr('src')
					return {
						href: v.href,
						cover_img: `http://www.pptok.com${img}`,
					};
				})
			);
			list = [...list, ...arr];
		}
		console.log(list.length)
		for (let n = 0; n < list.length; n++) {
			try {
				await page.goto(list[n]['href']);
				console.log(list[n]['href'])
				let temp_url = list[n]['href'].split('.html')[0],
					source_id = temp_url.substring(temp_url.lastIndexOf('/') + 1)
				let info = {
					title: await page.$eval('#main h1', (h) => h.innerHTML),
					intro: await page.$eval('#soft-intro p:nth-child(4)', (p) => p.innerHTML),
					file_size: await page.$eval('.ver-chose', (span) => span.innerHTML),
					priview_imgs: await page.$eval('#soft-intro img', (img) => img.src),
					cover_img: list[n].cover_img,
					source_id,
					author: {
						id: "001",
						name: "admin"
					},
					subject: "家长会",
					rank: '0',
					price: 10,
					download_num: 0,
					created_at: dayjs().format('YYYY-MM-DD'),
					label: "课件"
				}
				docsArr.push(info);
				console.log(info)
				console.log(docsArr.length)
			}catch(err) {
				console.log(list[n]['href'])
				console.log(err)
			}
		}
		fs.writeFileSync('../json/temp.json', JSON.stringify(docsArr));
	} catch (e) {
		console.log('err', e);
	} finally {
		await browser.close();
	}
})();
