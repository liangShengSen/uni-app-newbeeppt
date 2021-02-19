const fs = require('fs');

(async () => {
	let res = fs.readFileSync('./json/docs.json');
	let data = JSON.parse(res)
	console.log(data);
	let arr = []
	data.forEach(item => {
		let obj = {
			title: item.title,
			intro: item.intro,
			file_size: item.fileSize,
			priview_imgs: [item.priviewImg],
			cover_img: '',
			author: {
				id: "001",
				name: "Sam"
			},
			subject: "其他",
			"year": "2021",
			"rank": "0",
			"price": 0,
			"status": "1",
			"download_num": 0,
			"created_at": "2021-01-26",
			"type": "ppt",
			"type_label": "其他"
		}
	})
})();
