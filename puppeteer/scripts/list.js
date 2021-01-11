const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
	const browser = await puppeteer.launch({
		headless: true,
	});
	const writeJson = (links) => {
		let res = fs.readFileSync('./json/list.json');
		let { data } = JSON.parse(res);
		let list = [...data, ...links];
		let jsonData = {
			data: list,
		};
		fs.writeFileSync('./json/list.json', JSON.stringify(jsonData));
	};
	try {
		const page = await browser.newPage();
		await page.goto('http://www.pptok.com/pptmb/');
		let arr = await page.$$eval('#tg_box_con > li > a', (a) =>
			a.map((v) => {
				return { url: v.href };
			})
		);
		writeJson(arr);
		for (let i = 2; i <= 26; i++) {
			await page.goto(`http://www.pptok.com/pptmb/index_${i}.html`);
			let links = await page.$$eval('#tg_box_con > li > a', (a) =>
				a.map((v) => {
					return { url: v.href };
				})
			);
			writeJson(links);
		}
	} catch (e) {
		console.log('err', e);
	} finally {
		await browser.close();
	}
})();
