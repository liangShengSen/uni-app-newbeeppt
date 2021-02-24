const puppeteer = require('puppeteer');
const xlsx = require('node-xlsx');
const fs = require('fs');

//读取文件内容
const excelObj = xlsx.parse('./xlsx/platform_albums.xlsx');
const excelData = excelObj[0].data
const dataLinks = []
let [column_0_name, column_1_name, column_2_name] = excelData[0];
column_3_name = 'jx_num'
column_4_name = 'platform_num'
column_5_name = 'is_need_update'
excelData.shift()
for(let i = 0; i < excelData.length; i++) {
	let obj = {}
	obj[column_0_name] = excelData[i][0]
	obj[column_1_name] = excelData[i][1]
	obj[column_2_name] = excelData[i][2]
	dataLinks.push(obj)
}
;
(async () => {
	const browser = await puppeteer.launch({
		headless: true,
	});
	const page = await browser.newPage();
	await page.setDefaultNavigationTimeout(0);
	for (let i = 0, len = dataLinks.length; i < len; i++) {
		const { jx_url,platform,platform_url } = dataLinks[i]
		let dom_class = '';
		if(platform === 'zxxk') {
			dom_class = '.catalog-list .document-node .name'
		}else if(platform === 'cnjy') {
			dom_class = '.book-detail--chapter-list .book-detail--chapter-preview'
		}
		try {
			await page.goto(jx_url);
			let jx_page_links = await page.$$eval('.list-bd .row-content .file-wrap .title a', (a) =>
				a.map((v) => {
					return v.href;
				})
			);
			await page.goto(platform_url);
			let platform_page_links = await page.$$eval(dom_class, (a) =>
				a.map((v) => {
					return v.href;
				})
			);
			dataLinks[i][column_3_name] = jx_page_links.length
			dataLinks[i][column_4_name] = platform_page_links.length
			dataLinks[i][column_5_name] = platform_page_links.length > jx_page_links.length ? '是' : '否'
		} catch (error) {
			console.log(error);
		}
	}
	let mian_arr = [
		[column_0_name, column_1_name, column_2_name,column_3_name,column_4_name,column_5_name]
	]
	for(let i = 0; i < dataLinks.length; i++) {
		let sub_arr = []
		sub_arr.push(dataLinks[i][column_0_name])
		sub_arr.push(dataLinks[i][column_1_name])
		sub_arr.push(dataLinks[i][column_2_name])
		sub_arr.push(dataLinks[i][column_3_name])
		sub_arr.push(dataLinks[i][column_4_name])
		sub_arr.push(dataLinks[i][column_5_name])
		mian_arr.push(sub_arr)
	}
	let xlsxObj = [
	    {
			name: 'sheet',
			data: mian_arr,
		}
	]
	 fs.writeFileSync('./xlsx/platform_albums_updated.xlsx',xlsx.build(xlsxObj),"binary");
	browser.close();
})();
