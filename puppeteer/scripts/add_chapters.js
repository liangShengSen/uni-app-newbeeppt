const puppeteer = require('puppeteer')
const fs = require('fs')

void(async () => {
	const browser = await puppeteer.launch({
		headless: true
	})
	const page = await browser.newPage()
	await page.goto('http://www.pptok.com/')
	// 获取某个版本下所有册别链接
	const bookLins = await page.evaluate(() => {
		var items = $('.box-software').eq(0).find('a')
		var links = []
		items.each((index, item) => {
			links.push({
				name: $(item).text(),
				href: `http://www.pptok.com${$(item).attr('href')}`
			})
		})
		return links
	})
	console.log(bookLins)
	// 循环访问链接并获取章节信息
	let chapters = []
	for (let i = 0; i < bookLins.length; i++) {
		await page.goto(bookLins[i].href)
		let chapter = await page.$$eval('#mulu .mldy .ml_t h2 a', (a) =>
			a.map((v) => {
				function S4() {
					return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
				}
				return {
					_id: S4() + S4() + S4() + S4() + S4() + S4(),
					name: v.innerText
				}
			})
		)
		chapters.push({
			book_name: bookLins[i].name,
			data: chapter
		})
	}
	console.log(chapters)
	fs.writeFileSync('../json/chapters.json', JSON.stringify(chapters));
	browser.close()
})()
