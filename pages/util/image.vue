<template>
	<view class="content">
		<view class="text-area">
			<text class="title">{{title}}</text>
		</view>
		<button type="default" @click="uploadImgs">click me</button>
	</view>
</template>

<script>
	let jsonData = require('@/puppeteer/json/chapters.json');
	export default {
		data() {
			return {
				title: 'Hello',
			}
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
				let data = jsonData
				for (let i = 0; i < data.length; i++) {
					let fileSize = data[i]['file_size'].split(' ')[0],
						size = data[i]['file_size'].split(' ')[0]
					if (!(size === 'MB' && parseInt(fileSize) >= 100)) {
						let priviewImg = data[i]['cover_img'],
							downLink = data[i]['priview_imgs'][0],
							downloadUrl = data[i]['download_url'];
						let [error1, res1] = await uni.downloadFile({
							url: priviewImg,
						});
						await this.timeout(500)
						let [error2, res2] = await uni.downloadFile({
							url: downLink,
						});
						await this.timeout(500)
						let [error3, res3] = await uni.downloadFile({
							url: downloadUrl,
						});
						await this.timeout(1000)
						console.log(`res1:${JSON.stringify(error1)}`);
						console.log(`res2:${JSON.stringify(error2)}`);
						console.log(`res3:${JSON.stringify(error3)}`);
						if (res1.statusCode === 200) {
							let fileExtension = priviewImg.substring(priviewImg.lastIndexOf('.') + 1);
							let result = await uniCloud.uploadFile({
								filePath: res1.tempFilePath,
								cloudPath: `${data[i]['title']}.${fileExtension}`,
							});
							data[i]['cover_img'] = result.fileID
						}
						if (res2.statusCode === 200) {
							let fileExtension = downLink.substring(downLink.lastIndexOf('.') + 1);
							let result = await uniCloud.uploadFile({
								filePath: res2.tempFilePath,
								cloudPath: `${data[i]['title']}.${fileExtension}`,
							});
							data[i]['priview_imgs'] = [result.fileID]
						}
						if (res3.statusCode === 200) {
							let fileExtension = downloadUrl.substring(downloadUrl.lastIndexOf('.') + 1);
							let result = await uniCloud.uploadFile({
								filePath: res3.tempFilePath,
								cloudPath: `${data[i]['title']}.${fileExtension}`,
							});
							data[i]['download_url'] = result.fileID
						}
						await this.timeout(1000)
						let res = await uniCloud.callFunction({
							name: 'add',
							data: data[i],
						});
						if (res.success) {
							console.log(`第${i}条数据: ${data[i]['title']}: 插入成功`);
						} else {
							console.log("%c " + `${data[i]['title']}: 插入失败`, "color:" + 'red');
						}
					}
				}
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
