'use strict';
const db = uniCloud.database()
var urllib = require('urllib');
var _ = require('lodash');

async function getFiles(i) {
	let {
		data,
		status
	} = await urllib.request(
		`https://unicloud-api.dcloud.net.cn/unicloud/api/file/list?appid=&provider=aliyun&spaceId=7d64ea77-4eba-4652-9fb5-6cbebc534629&page=${i}&pageSize=100&folder=`, {
			dataType: 'application/json',
			headers: {
				Accept: 'application/json',
				token: '288826d1c90d996ceb6d3984c6aaea6c'
			}
		});
	if (status == 200) {
		data = data.toString()
		data = JSON.parse(data)
		let fileList = data.data.files.map(item => {
			return item.url
		})
		return fileList
	}
}

exports.main = async (event, context) => {
	try{
		let filesArr = []
		let i = 1
		while(i <= 100) {
			let data = await getFiles(i)
			filesArr = [...filesArr,...data]
			i++
		}
		
		filesArr = _.chunk(filesArr,30)
		
		console.log(filesArr)    
		
		for(let y = 0; y <= filesArr.length; y++) {
			try{
				console.log(y,filesArr[y])
				await uniCloud.deleteFile({
				    fileList: filesArr[y]
				});
			}catch(e){
				console.log(e)
			}
		}
	
	}catch(e){
		console.log(e)
	}

};
