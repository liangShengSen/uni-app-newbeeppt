<template>
	<view class="content">
		<view class="text-area">
			<text class="title">{{ title }}</text>
		</view>
		<button type="default" @click="uploadDocuments">上传文档</button>
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
			async uploadDocuments() {
				let result = await uniCloud.callFunction({
					name: 'add',
					data: jsonData.slice(1001,2000)
				});
				console.log(result)
			},
			async uploadImgs() {
				let self = this
				uniCloud.callFunction({
					name: 'chapters',
					data: {
						stage_id: '6038483da112ea00011a4ef7',
						subject_id: '60384e51b4be6b6576f90f8e',
						version_id: '60388ca88bb1992f1752bfe5',
					},
					success: async (res) => {
						let books = res.result
						let arr = []
						books.forEach(item => {
							jsonData.forEach(item1 => {
								if (item.name === item1.book_name) {
									let book = {
										_id: item._id,
										name: item.name
									}
									let obj = {
										stage: item.stage,
										subject: item.subject,
										version: item.version,
										book,
										chapters: item1.data
									}
									arr.push(obj)
								}
							})
						})
						console.log(arr);
						let result = await uniCloud.callFunction({
							name: 'add',
							data: arr
						});
						console.log(res);
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
