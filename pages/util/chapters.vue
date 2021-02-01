<template>
	<view class="content">
		<view class="text-area">
			<text class="title">{{ title }}</text>
		</view>
		<!-- <button type="default" @click="solveName">处理格式</button> -->
		<button type="default" @click="uploadImgs">click me</button>
	</view>
</template>

<script>
	let jsonData = require("@/puppeteer/json/temp.json");
	export default {
		data() {
			return {
				title: "Hello",
			};
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
						let arr = []
						let chapters = res.result[0].chapters;
						for (let i = 0; i < jsonData.length; i++) {
							let item = self.getById(chapters, jsonData[i].name);
							if (item) {
								jsonData[i].data.chapter.id = item.id;
								jsonData[i].data.chapter.name = item.name;
								let priviewImg = jsonData[i].data.cover_img,
									downLink = jsonData[i].data.priview_imgs[0];
								let [error1, res1] = await uni.downloadFile({
									url: priviewImg,
								});
								await this.timeout(500)
								let [error2, res2] = await uni.downloadFile({
									url: downLink,
								});
								await this.timeout(500)
								console.log(`res1:${JSON.stringify(error1)}`);
								console.log(`res2:${JSON.stringify(error2)}`);
								if (res1.statusCode === 200) {
									let fileExtension = priviewImg.substring(priviewImg.lastIndexOf('.') + 1);
									let result = await uniCloud.uploadFile({
										filePath: res1.tempFilePath,
										cloudPath: `${jsonData[i]['data']['title']}.${fileExtension}`,
									});
									jsonData[i]['data']['cover_img'] = result.fileID
								}
								if (res2.statusCode === 200) {
									let fileExtension = downLink.substring(downLink.lastIndexOf('.') + 1);
									let result = await uniCloud.uploadFile({
										filePath: res2.tempFilePath,
										cloudPath: `${jsonData[i]['data']['title']}.${fileExtension}`,
									});
									jsonData[i]['data']['priview_imgs'] = [result.fileID]
								}
								await this.timeout(500)
								let res = await uniCloud.callFunction({
									name: 'add',
									data: jsonData[i]['data'],
								});
								if (res.success) {
									console.log(`第${i}条数据: ${jsonData[i]['data']['title']}: 插入成功`);
								} else {
									arr.push(jsonData[i].name)
									console.log("%c " + `${jsonData[i]['data']['title']}: 插入失败`, "color:" + 'red');
								}
							}else{
								arr.push(jsonData[i].name)
							}
							if(i === (jsonData.length - 1)) {
								console.log(`插入数据失败的记录：${arr.length ? arr : '0'}`);
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
