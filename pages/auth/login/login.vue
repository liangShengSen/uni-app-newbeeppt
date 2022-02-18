<template>
	<view class="login">
		<view class="login-bg">
			<navbar type="auth"></navbar>
			<view class="login-card">
				<view class="login-head">请输入你的账户</view>
				<view class="login-input login-margin-b">
					<input v-model.trim="username" placeholder="手机号或者邮箱" />
				</view>
				<view class="login-input">
					<input type="password" v-model.trim="password" @confirm="login" placeholder="请输入密码(8-16位)" />
				</view>
				<view class="login-function">
					<view class="login-register" @click="go_register">快速注册</view>
				</view>
			</view>
		</view>
		<view class="login-btn">
			<button class="landing" type="primary" @click="login">登陆</button>
			<!-- #ifdef MP-WEIXIN -->
			<view class="login-by-wx">
				<view class="inner" @click="loginByWechat">
					<view class="iconfont icon-weixindenglu"></view>
					<text class="text">微信登陆</text>
				</view>
			</view>
			<!-- #endif -->
		</view>
	</view>
</template>

<script>
	import {
		PHONE,
		EMAIL
	} from '@/common/js/regx.js'
	export default {
		data() {
			return {
				username: '',
				password: '',
				id: ''
			}
		},
		onLoad(query) {
			this.id = query.id || ''
		},
		methods: {
			go_register() {
				uni.navigateTo({
					url: '/pages/auth/register/register'
				})
			},
			login() {
				if (!this.username) {
					this.$utils.toast('请输入账号')
					return false;
				}
				if (!(PHONE.test(this.username) || EMAIL.test(this.username))) {
					this.$utils.toast('账号格式错误')
					return false;
				}
				if (this.password.length < 6 || this.password.length > 20) {
					this.$utils.toast('请输入6-20位密码')
					return false;
				}
				this.$utils.showLoading('登录中')
				this.$api.login({
					username: this.username,
					password: this.password
				}).then(res => {
					uni.hideLoading()
					if (res.code === 0) {
						uni.setStorageSync('uni_id_token', res.token)
						this.$utils.toast('登录成功', () => {
							uni.navigateBack({
								delta: 1
							})
						})
					} else {
						this.$utils.toast(res.msg)
					}
				}).catch((err) => {
					uni.hideLoading()
					this.$utils.toast(err.msg)
				})
			},
			loginByWechat() {
				const isAuthorize = uni.getStorageSync('authorize');
				if (isAuthorize) {
					this.getLoginCode()
				} else {
					uni.getUserProfile({
						desc: '授权登录', //不写不弹提示框
						success: res => {
							let {
								nickName,
								avatarUrl
							} = res.userInfo
							this.getLoginCode(nickName, avatarUrl)
						},
						fail: err => {
							uni.showToast({
								title: '请点击授权进行登录',
								icon: 'none'
							});
						}
					})
				}
			},
			getLoginCode(nickName, avatarUrl) {
				this.$utils.showLoading('微信登录中')
				uni.login({
					provider: 'weixin',
					success: (result) => {
						let {
							code
						} = result
						if (code) {
							let data = {
								code
							}
							if(nickName || avatarUrl) {
								data.nickname = nickName
								data.avatar = avatarUrl
							}
							this.$api.loginByWeixin(data).then(res => {
								uni.hideLoading()
								if (res.code === 0) {
									if(nickName || avatarUrl) {
										uni.setStorageSync('authorize', 1)
									}
									uni.setStorageSync('uni_id_token', res.token)
									uni.$emit('subjectChange') // 更新tab学科信息
									this.$utils.toast('登录成功', () => {
										uni.navigateBack({
											delta: 1
										})
									})
								}
							}).catch(() => {
								uni.hideLoading()
							})
						}
					},
					fail: () => {
						uni.hideLoading()
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.login {
		width: 100%;
	}

	.landing {
		height: 40px;
		line-height: 40px;
		border-radius: 40px;
		font-size: 16px;
		@include base-bg;
	}

	.wx-btn {
		height: 40px;
		line-height: 40px;
		border-radius: 40px;
		font-size: 16px;
		margin-top: 15px;
	}

	.login-btn {
		padding: 5px 10px;
		margin-top: 200px;

		.login-by-wx {
			margin-top: 35px;

			.inner {
				display: flex;
				align-items: center;
				flex-direction: column;
				justify-content: center;
				width: 75px;
				margin: 0 auto;

				.icon-weixindenglu {
					font-size: 40px;
					color: #00c800;
				}

				.text {
					font-size: 14px;
					padding: 5px 0;
					color: #666;
				}
			}
		}
	}

	.login-function {
		overflow: auto;
		padding: 10px 10px 15px 10px;
	}

	.login-register {
		color: #666;
		float: right;
		font-size: 14px;
	}

	.login-input input {
		background: #f2f5f6;
		font-size: 14px;
		padding: 5px 12px;
		height: 30px;
		line-height: 30px;
		border-radius: 4px;
	}

	.login-margin-b {
		margin-bottom: 12px;
	}

	.login-input {
		padding: 5px 10px;
	}

	.login-head {
		font-size: 16px;
		text-align: center;
		padding: 12px 5px 22px 5px;
	}

	.login-card {
		background: #fff;
		border-radius: 6px;
		padding: 5px 12px;
		box-shadow: 0 3px 9px rgba(0, 0, 0, 0.12);
		position: relative;
		margin-top: 30px;
	}

	.login-bg {
		position: relative;
		height: 150px;
		padding: 12px;
		border-radius: 0 0 10px 10px;
		@include base-bg;
	}
</style>
