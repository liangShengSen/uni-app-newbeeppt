<template>
	<view class="content">
		<view class="text-area">
			<text class="title">{{ title }}</text>
		</view>
		<!-- <button type="default" @click="uploadDocuments">upload</button> -->
		<!-- <button type="default" @click="addBookAndChapter">add_b_c</button> -->
		<button type="default" @click="uploadImgs">click me</button>
	</view>
</template>

<script>
	let jsonData = require("@/puppeteer/json/temp.json");
	let chaptersData = require("@/puppeteer/json/chapters.json");
	export default {
		data() {
			return {
				title: "Hello",
			};
		},
		methods: {
			async addBookAndChapter() {
				let result = await uniCloud.callFunction({
					name: 'edit',
					data: chaptersData
				});
				console.log(result);
			},
			async uploadDocuments() {
				let result = await uniCloud.callFunction({
					name: 'add',
					data: jsonData
				});
				console.log(result)
			},
			async uploadImgs() {
				let self = this
				uniCloud.callFunction({
					name: 'chapters',
					data: {
						chapter_id: '60430d6538aac7000173dea9',
					},
					success: async (res) => {
						// console.log(res);
						let arr = []
						res.result[0].options.forEach(item => {
							jsonData.forEach(item1 => {
								if(item.name === item1.name) {
									item1.data.chapter.name = item1.name
									item1.data.chapter.value = item.value
									arr.push(item1.data)
								}
							})
						})
						let arr1 = arr.slice(0,700)
						console.log(arr1);
						let result = await uniCloud.callFunction({
							name: 'add',
							data: arr1
						});
						console.log(result);
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
