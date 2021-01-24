<template>
	<view class="content">
		<view class="text-area">
			<text class="title">{{ title }}</text>
		</view>
		<button type="default" @click="solveName">处理格式</button>
		<button type="default" @click="uploadImgs">click me</button>
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
			solveName() {
				jsonData.forEach(item => {
					let str = item.name,
						re = /《([^》]*)》/ig;
					if (re.exec(str))
						item.name = RegExp.$1
					return RegExp.$1
				})
				console.log(jsonData);
			},
			getById(Data, name) {
				var Deep, T, F
				for (F = Data.length; F;) {
					T = Data[--F]
					if (T['name'].includes(name)) return T
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
						let num = 0;
						for (let i = 0; i < jsonData.length; i++) {
							if (i < 1) {
								console.log(i);
								let item = self.getById(chapters, jsonData[i].name);
								if (item) {
									num++;
									console.log("%c " + `插入数量：${num}`, "color:" + 'red');
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
										uniCloud.callFunction({
											name: 'add',
											data: jsonData[i].data,
											success: (res) => {
												console.log('插入数据成功');
											},
											fail: (msg) => {
												console.log(msg);
											}
										});
									}
								}
							}
						}
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
