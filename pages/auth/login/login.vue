<template>
	<view class="login">
		<view class="login-bg">
			<navbar type="auth"></navbar>
			<view class="login-card">
				<view class="login-head">请输入你的账户</view>
				<view class="login-input login-margin-b">
					<input v-model="username" placeholder="手机号或者邮箱" />
				</view>
				<view class="login-input">
					<input type="password" v-model="password" @confirm="login" placeholder="请输入密码(8-16位)" />
				</view>
				<view class="login-function">
					<view class="login-register" @click="go_register">快速注册</view>
				</view>
			</view>
		</view>
		<view class="login-btn">
			<button class="landing" type="primary" @click="login">账号登陆</button>
			<!-- #ifdef MP-WEIXIN -->
			<button class="wx-btn" type="primary" @click="getLoginCode">微信登陆</button>
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
				from: '',
				id: ''
			}
		},
		onLoad(query) {
			this.from = query.from || ''
			this.id = query.id || ''
		},
		methods: {
			go_register() {
				uni.navigateTo({
					url: '/pages/auth/register/register'
				})
			},
			fallBack() {
				switch (this.from) {
					case 'tabs':
						uni.$emit('subjectChange') // 更新tab学科信息
						this.$utils.toast('登录成功', () => {
							uni.switchTab({
								url: '../../tabBar/home/home'
							})
						})
						break
					case 'detail':
						this.$utils.toast('登录成功', () => {
							uni.navigateTo({
								url: `../../detail/detail?_id=${this.id}`
							})
						})
						break
					case 'my':
						this.$utils.toast('登录成功', () => {
							uni.switchTab({
								url: '../../tabBar/my/my'
							})
						})
						break
					default:
						uni.switchTab({
							url: '../../tabBar/home/home'
						})
						break
				}
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
				uni.showLoading()
				this.$api.login({
					username: this.username,
					password: this.password
				}).then(res => {
					uni.hideLoading()
					if (res.code === 0) {
						uni.setStorageSync('uni_id_token', res.token)
						this.fallBack()
					} else {
						this.$utils.toast(res.msg)
					}
				}).catch((err) => {
					uni.hideLoading()
					this.$utils.toast(err.msg)
				})
			},
			getLoginCode() {
				uni.showLoading({
					title: "微信登录中"
				})
				uni.login({
					provider: 'weixin',
					success: (result) => {
						let {
							code
						} = result
						if (code) {
							this.$api.loginByWeixin({
								code
							}).then(res => {
								uni.hideLoading()
								if (res.code === 0) {
									uni.setStorageSync('uni_id_token', res.token)
									this.fallBack()
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
		margin-top: 175px;
	}

	.login-function {
		overflow: auto;
		padding: 10px 10px 15px 10px;
	}

	.login-forget {
		float: left;
		font-size: 12px;
		color: #999;
	}

	.login-register {
		color: #666;
		float: right;
		font-size: 12px;
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
