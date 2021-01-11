const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
	const browser = await puppeteer.launch({
		headless: true,
	});
	const writeJson = (detail) => {
		let res = fs.readFileSync('./json/detail.json');
		let { data } = JSON.parse(res);
		let list = [...data, ...detail];
		let jsonData = {
			data: list,
		};
		fs.writeFileSync('./json/detail.json', JSON.stringify(jsonData));
	};
	const page = await browser.newPage();
	let res = fs.readFileSync('./json/list.json');
	let { data } = JSON.parse(res);
	let detailArr = [];
	for (let i = 0, len = data.length; i < len; i++) {
		try {
			await page.goto(data[i].url);
			try {
				let info = {
					title: await page.$eval('#main h1', (h) => h.innerHTML),
					intro: await page.$eval('#soft-intro p:nth-child(4)', (p) => p.innerHTML),
					downLink: await page.$eval('.scdown .blue', (a) => a.href),
					fileSize: await page.$eval('.ver-chose', (span) => span.innerHTML),
					priviewImg: await page.$eval('#soft-intro img', (img) => img.src),
				};
				detailArr.push(info);
			} catch (e) {
				console.log(e);
			}
		} catch (error) {
			console.log(error);
		}
	}
	console.log(detailArr);
	writeJson(detailArr);
	browser.close();
})();
