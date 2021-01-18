<template>
	<view class="content">
		<image class="logo" src="/static/logo.png"></image>
		<view class="text-area">
			<text class="title">{{title}}</text>
		</view>
		<button type="default" @click="uploadImgs">上传图片</button>
	</view>
</template>

<script>
	let jsonData = require('@/puppeteer/json/detail_bak.json');
	export default {
		data() {
			return {
				title: 'Hello',
			}
		},
		onLoad() {
	
		},
		methods: {
			timeout(delay) {
				return new Promise((resolve, reject) => {
				  setTimeout(() => {
				    try {
				      resolve(1)
				    } catch (e) {
				      reject(0)
				    }
				  }, delay);
				})
			},
			async uploadImgs() {
				let { data } = jsonData
				let arr = [];
				for (let i = 0; i < data.length; i++) {
					if(i > 400 && i <= 520) {
						let fileSizeArr = data[i].fileSize.split(' ');
						if(parseInt(fileSizeArr[0]) > 100 && fileSizeArr[1] == 'MB') {
							console.log(`大于100MB:${data[i]['title']}:${data[i]['fileSize']}`);
						}else{
							let priviewImg = data[i]['priviewImg'],
								downLink = data[i]['downLink'];
							let [error1, res1] = await uni.downloadFile({
								url: priviewImg,
							});
							let [error2, res2] = await uni.downloadFile({
								url: downLink,
							});
							console.log('=========');
							console.log(`res1:${JSON.stringify(error1)}`);
							console.log(`res2:${JSON.stringify(error2)}`);
							console.log('=========');
							if (res1.statusCode === 200) {
								let fileExtension = priviewImg.substring(priviewImg.lastIndexOf('.') + 1);
								let result = await uniCloud.uploadFile({
									filePath: res1.tempFilePath,
									cloudPath: `${data[i]['title']}.${fileExtension}`,
								});
								data[i]['priviewImg'] = result.fileID
							}
							if (res2.statusCode === 200) {
								let fileExtension = downLink.substring(downLink.lastIndexOf('.') + 1);
								let result = await uniCloud.uploadFile({
									filePath:res2.tempFilePath,
									cloudPath: `${data[i]['title']}.${fileExtension}`,
								});
								data[i]['downLink'] = result.fileID								
							}
							arr.push(data[i])
						}						
					}
				}
				console.log(JSON.stringify(arr));	
			}
		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
</style>
