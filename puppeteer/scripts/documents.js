const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
	const browser = await puppeteer.launch({
		headless: true,
	});
	try {
		const page = await browser.newPage();
		await page.goto('http://www.pptok.com/kejian/mulu/202.html');
		let arr = await page.$$eval('#mulu .mldy h2 a', (a) =>
			a.map((v) => {
				return { url: v.href };
			})
		);
		console.log(arr.length)
		let links = [],list = []
		for (let i = 0; i <= arr.length; i++) {
			await page.goto(arr[i].url);
			const pageEle = await page.$(".bigPage > a");
			if(pageEle) {
				let pagesLinks = await page.$$eval('.bigPage a', (a) =>
					a.map((v) => {
						return { url: v.href };
					})
				);
				console.log(pagesLinks)
				for (let j = 0; j <= pagesLinks.length; j++) {
					await page.goto(pagesLinks[j].url);
					let arr = await page.$$eval('#tg_box_con > li > a', (a) =>
						a.map((v) => {
							return { url: v.href };
						})
					);
					list = [...list,...arr]
				}
			}else{
				list = await page.$$eval('#tg_box_con > li > a', (a) =>
					a.map((v) => {
						return { url: v.href };
					})
				);				
			}
			links = [...links,...list]
		}
		console.log(links)
	} catch (e) {
		console.log('err', e);
	} finally {
		await browser.close();
	}
})();
