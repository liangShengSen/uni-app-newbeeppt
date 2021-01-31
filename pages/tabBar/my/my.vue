<template>
	<view class="my">
		<view class="my-header">
			<view class="my-header_logo">
				<view class="my-header_logo-box">
					<image src="../../../static/images/no_login.png" mode="aspectFill"></image>
				</view>
				<text class="my-header_name" @click="toLogin">登录/注册</text>
			</view>
			<view class="my-header_info">
				<view class="my-header_info-box">
					<view class="my-header_info-item">
						<text class="count">10</text>
						<text class="text">我的下载</text>
					</view>	
					<view class="my-header_info-item">
						<text class="count">5</text>
						<text class="text">我的收藏</text>
					</view>
					<view class="my-header_info-item">
						<!-- <uni-icons type="help" size="22" color="#f07373"></uni-icons> -->
						<text class="count">100</text>
						<text class="text">我的P豆</text>
					</view>
				</view>
			</view>
		</view>
		<view class="my-content">
			<view class="my-content_list">
				<view class="my-content_list-title">
					<uni-icons class="icon" type="download" size="18" color="#f07373"></uni-icons>
					<text>我的下载</text>
				</view>
				<uni-icons type="arrowright" size="14" color="#999"></uni-icons>
			</view>
			<view class="my-content_list">
				<view class="my-content_list-title">
					<uni-icons class="icon" type="heart" size="18" color="#f07373"></uni-icons>
					<text>我的收藏</text>
				</view>
				<uni-icons type="arrowright" size="14" color="#999"></uni-icons>
			</view>
			<view class="my-content_list">
				<view class="my-content_list-title">
					<uni-icons class="icon" type="help" size="18" color="#f07373"></uni-icons>
					<text>帮助中心</text>
				</view>
				<uni-icons type="arrowright" size="14" color="#999"></uni-icons>
			</view>
		</view>
		<view class="login-bar">
			<view class="login-box">退出登录</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		methods: {
			toLogin() {
				uni.navigateTo({
					url:'/pages/login/login'
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		height: 100%;
	}
	.my {
		height: 100%;
		background-color: #f5f5f5;
		.my-header {
			width: 100%;
			height: 150px;
			background: linear-gradient(135deg, $base-color 0%, #e28383 100%);
			border-radius: 0px 0px 10px 10px;
			color: #fff;
			padding-top: 20px;
			.my-header_logo {
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				.my-header_logo-box {
					width: 60px;
					height: 60px;
					margin: 0 10px 0 15px;
					border-radius: 50%;
					overflow: hidden;
					image {
						width: 100%;
						height: 100%;
					}
				}	
				.my-header_name {
					margin-top: 5px;
				}
			}
			.my-header_info {
				margin-top: 20px;
				padding: 0 10px;
				height: 60px;
				.my-header_info-box {
					position: relative;
					z-index: 1;
					display: flex;
					align-items: center;
					justify-content: space-evenly;
					height: 100%;
					background-color: #fff;
					border-radius: 5px;
					box-shadow: 0 3px 4px 0 #ece9e9;
					.my-header_info-item {
						display: flex;
						flex-direction: column;
						align-items: center;
						.count {
							font-size: 18px;
							color: #333;
						}
						.text {
							font-size: 12px;
							color: #999;
						}
					}
				}
			}
		}
		.my-content {
			background-color: #fff;
			padding: 20px 10px 0;
			.my-content_list {
				display: flex;
				align-items: center;
				justify-content: space-between;
				border-bottom: 1px solid #f5f5f5;
				&:last-child {
					border-bottom: none;
				}
				padding: 15px 0;
				.my-content_list-title {
					color: #666;
					font-size: 14px;
					.icon {
						margin-right: 10px;
					}
				}
			}
		}
		.login-bar {
			margin-top: 20px;
			padding: 0 10px;
			.login-box {
				border-radius: 5px;
				height: 40px;
				line-height: 40px;
				text-align: center;
				font-size: 15px;
				color: #666;
				background-color: #fff;
			}
		}
	}
</style>
