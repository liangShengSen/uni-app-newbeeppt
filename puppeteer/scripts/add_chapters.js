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
		var items = $('.box-software').eq(3).find('a')
		var links = []
		items.each((index, item) => {
			links.push({
				name: $(item).text(),
				// href: `http://www.pptok.com${$(item).attr('href')}`
				href: $(item).attr('href')
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
					name: v.innerText,
					value: S4() + S4() + S4() + S4() + S4() + S4()
				}
			})
		)
		let obj = {
			name: bookLins[i].name,
			order: (i + 1)
		}
		if(i <= 11) {
			obj.stage = {
				name: "小学",
				value: "6038483da112ea00011a4ef7"
			}
			obj.version = {
				name: "北师大版",
				value: "6040bcac714a8c00015d7b4e"
			}
		}else if(i > 11 & i <= 17) {
			obj.stage = {
				name: "初中",
				value: "60384847de602f0001317e18"
			}
			obj.version = {
				name: "北师大版",
				value: "6040bce4d465ff0001ae60ca"
			}
		}else {
			obj.stage = {
				name: "高中",
				value: "6038484fe857bd000153f0f5"
			}
			obj.version = {
				name: "北师大版",
				value: "6040bd0fb510d00001e59d0d"
			}
		}
		obj.subject = {
			name: "语文",
			value: "5ffef5038cc87f0001b0d7a6"
		}
		obj.data = chapter
		chapters.push(obj)
	}
	console.log(chapters)
	fs.writeFileSync('../json/chapters.json', JSON.stringify(chapters));
	browser.close()
})()
