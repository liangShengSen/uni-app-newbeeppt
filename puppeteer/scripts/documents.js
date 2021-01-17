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
				return {
					name: v.title,
					url: v.href ,
				};
			})
		);
		for (let i = 0; i < arr.length; i++) {
			if(i <= 100) {
				await page.goto(arr[i].url);
				const pageEle = await page.$(".bigPage > a");
				let list = [];
				if(pageEle) {
					let pagesLinks = await page.$$eval('.bigPage a', (a) =>
						a.map((v) => {
							return v.href;
						})
					);
					for(let j = 0;j < pagesLinks.length;j++) {
						await page.goto(pagesLinks[j]);
						let arr = await page.$$eval('#tg_box_con > li > a', (a) =>
							a.map((v) => {
								return  v.href
							})
						);
						list = [...list,...arr]
					}
				}else{
					list = await page.$$eval('#tg_box_con > li > a', (a) =>
						a.map((v) => {
							return v.href
						})
					)
				}
				arr[i]['docs'] = list		
			}
		}
		console.log(arr)
	} catch (e) {
		console.log('err', e);
	} finally {
		await browser.close();
	}
})();
