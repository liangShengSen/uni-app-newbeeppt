<template>
	<view class="my">
		<view class="my-header">
			<view class="my-header_logo">
				<view class="my-header_logo-box">
					<image :src="`${userInfo.avatar ? userInfo.avatar : '../../../static/images/no_login.png'}`" mode="aspectFill"></image>
				</view>
				<text class="my-header_name" v-if="userInfo._id">{{userInfo.nickname ? userInfo.nickname : userInfo.username}}</text>
				<text class="my-header_name" v-else @click="toLogin">登录/注册</text>
			</view>
			<view class="my-header_info">
				<view class="my-header_info-box">
					<view class="my-header_info-item">
						<text class="count">{{userInfo.download_ids && userInfo.download_ids.length || 0}}</text>
						<text class="text">我的下载</text>
					</view>
					<view class="my-header_info-item">
						<text class="count">{{userInfo.collected_ids && userInfo.collected_ids.length || 0}}</text>
						<text class="text">我的收藏</text>
					</view>
					<view class="my-header_info-item">
						<text class="count">{{userInfo.coins || 0}}</text>
						<text class="text">我的P豆</text>
					</view>
				</view>
			</view>
		</view>
		<view class="my-content">
			<view class="my-content_list" @click="toCollectedAndDownload('download')">
				<view class="my-content_list-title">
					<uni-icons class="icon" type="download" size="18"></uni-icons>
					<text>我的下载</text>
				</view>
				<uni-icons type="arrowright" size="14" color="#999"></uni-icons>
			</view>
			<view class="my-content_list" @click="toCollectedAndDownload('collected')">
				<view class="my-content_list-title">
					<uni-icons class="icon" type="heart" size="18"></uni-icons>
					<text>我的收藏</text>
				</view>
				<uni-icons type="arrowright" size="14" color="#999"></uni-icons>
			</view>
			<view class="my-content_list" @click="setUserInfo">
				<view class="my-content_list-title">
					<uni-icons class="icon" type="chatbubble" size="18"></uni-icons>
					<text>我的信息</text>
				</view>
				<uni-icons type="arrowright" size="14" color="#999"></uni-icons>
			</view>
			<view class="my-content_list" @click="toHelp">
				<view class="my-content_list-title">
					<uni-icons class="icon" type="help" size="18"></uni-icons>
					<text>帮助中心</text>
				</view>
				<uni-icons type="arrowright" size="14" color="#999"></uni-icons>
			</view>
		</view>
		<view class="login-bar" v-if="userInfo._id" @click="logout">
			<view class="login-box">退出登录</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userInfo: {}
			}
		},
		onShow() {
			this.getUserInfo()
		},
		methods: {
			toLogin() {
				uni.navigateTo({
					url: '../../auth/login/login'
				})
			},
			toHelp() {
				uni.navigateTo({
					url: '../../personal/help'
				})
			},
			toCollectedAndDownload(type) {
				let url = ''
				if (!this.userInfo._id) {
					url = '../../auth/login/login'
				} else {
					if (type === 'collected') {
						url = '../../personal/my_collected'
					} else {
						url = '../../personal/my_download'
					}
				}
				uni.navigateTo({
					url
				})
			},
			setUserInfo() {
				uni.navigateTo({
					url: '../../personal/personal'
				})
			},
			getUserInfo() {
				let uniIdToken = uni.getStorageSync('uni_id_token') || ''
				if (uniIdToken) {
					uni.showLoading()
					this.$api.getUserInfo().then(res => {
						uni.hideLoading()
						if (res.code === 0) {
							this.userInfo = res.userInfo
						} else {
							this.$utils.toast(res.msg)
						}
					}).catch(err => {
						uni.hideLoading()
					})
				}
			},
			logout() {
				uni.showModal({
					title: '提示',
					content: '确定退出登录吗？',
					confirmColor: '#f07373',
					success: (res) => {
						if (res.confirm) {
							uni.showLoading()
							this.$api.logout().then(res => {
								uni.hideLoading()
								if (res.code === 0) {
									this.userInfo = {}
									uni.removeStorageSync('uni_id_token')
									uni.$emit('subjectChange') // 更新tab学科信息
									this.$utils.toast('退出成功',() => {
										console.log(2323);
										uni.switchTab({
											url: '../home/home'
										})
									})
								}
							})
						}
					}
				});
			}
		}
	}
</script>

<style lang="scss">
	page {
		height: 100%;
	}

	.my {
		width: 100%;
		height: 100%;
		background-color: #f5f5f5;

		.my-header {
			width: 100%;
			height: 150px;
			@include base-bg;
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
				color: #fff;
				background-color: #fff;
				@include base-bg
			}
		}
	}
</style>
