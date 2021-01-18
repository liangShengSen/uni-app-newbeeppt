<template>
	<view class="content">
		<image class="logo" src="/static/logo.png"></image>
		<view class="text-area">
			<text class="title">{{ title }}</text>
		</view>
		<button type="default" @click="uploadImgs">上传图片</button>
	</view>
</template>

<script>
	let jsonData = require("@/puppeteer/json/chapters.json");
	export default {
		data() {
			return {
				title: "Hello",
			};
		},
		methods: {
			getById(Data, name) {
				var Deep, T, F
				for (F = Data.length; F; ) {
				  T = Data[--F]
				  if (name == T['name']) return T
				  if (T.children.length) {
					Deep = this.getById(T['children'], name)
					if (Deep) return Deep
				  }
				}
			},
			async uploadImgs() {
				let self = this
				uniCloud.callFunction({
					name: 'chapters',
					success: async (res) => {
						let chapters = res.result.data[0].chapters;
						for (let i = 0; i < jsonData.length; i++) {
							if(i < 10) {
								let item = self.getById(chapters,jsonData[i].name);
								if(item) {
									let priviewImg = jsonData[i].data.priviewImg;
									jsonData[i].data.chapter_id = item.id;
									let [error1, res1] = await uni.downloadFile({
										url: priviewImg,
									});
									if (res1.statusCode === 200) {
										let fileExtension = priviewImg.substring(priviewImg.lastIndexOf('.') + 1);
										let result = await uniCloud.uploadFile({
											filePath: res1.tempFilePath,
											cloudPath: `${jsonData[i].data.title}.${fileExtension}`,
										});
										jsonData[i].data['priviewImg'] = result.fileID
									}
								}						
							}
						}
						console.log(jsonData);			
					}
				})
			},
		},
	};
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
