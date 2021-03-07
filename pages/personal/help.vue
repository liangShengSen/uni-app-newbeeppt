<template>
	<view class="help">
		<view class="list">
			<view class="list-item" v-for="item in list" :key="item.title" @click="showModal(item.content)">
				{{item.title}}
			</view>
		</view>
		<uni-popup ref="popup" type="center">
			<view class="modal-content">
				<view class="content">{{content}}</view>
				<view class="btn" @click="hideModal">我知道了</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				content: '',
				list: [
					{
						title: '下载同一份资料会重复扣P豆吗？',
						content: '同一份资源或试卷在首次下载后的15个自然日内重复下载不再扣费。'
					},
					{
						title: '下载资料后在手机上找不到怎么办？',
						content: '资料下载后，一般保存在您手机的文件管理器，因不同类型手机存储位置不同，请自行百度即可。'
					},
					{
						title: '为什么没有下载资料，P豆却少了？',
						content: '我们不存在主动乱扣P豆的情况，每一笔消费均可在我的下载里看到，如果出现P豆减少情况，请先确认是否把账号借给同事或朋友，如未借出却有P豆减少的情况，请第一时间联系我们！'
					}
				]
			}
		},
		methods: {
			showModal(content) {
				this.content = content
				this.$refs.popup.open()
			},
			hideModal() {
				this.$refs.popup.close()
			}
		}
	}
</script>

<style lang="scss">
	.modal-content {
		background-color: #fff;
		border-radius: 4px;
		width: 90%;
		margin: 0 auto;
		padding: 20px;
		box-sizing: border-box;
		.content {
			font-size: 16px;
			color: #666;
			margin-bottom: 20px;
		}
		.btn {
			height: 36px;
			line-height: 36px;
			font-size: 16px;
			text-align: center;
			color: #fff;
			border-radius: 36px;
			@include base-bg;
		}
	}
	.help {
		height: 100%;
		.list {
			padding: 10px 15px;
			.list-item {
				padding: 14px 0;
				color: #333;
				font-size: 16px;
				border-bottom: 1px solid #f5f5f5;
				&::before {
					content: '•';
					color: #ccc;
					padding-right: 10px;
				}
			}
		}
	}
</style>
