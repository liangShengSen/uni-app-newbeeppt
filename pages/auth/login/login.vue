<template>
	<view class="login">
		<view class="login-bg">
			<navbar type="auth"></navbar>
			<view class="login-card">
				<view class="login-head">请输入你的账户</view>
				<view class="login-input login-margin-b">
					<input v-model="account" placeholder="手机号或者邮箱" />
				</view>
				<view class="login-input">
					<input v-model="password" @confirm="login" placeholder="请输入密码(8-16位)" />
				</view>
				<view class="login-function">
					<view class="login-register" @click="go_register">快速注册</view>
				</view>
			</view>
		</view>
		<view class="login-btn">
			<button class="landing" type="primary" @click="login">登陆</button>
		</view>
	</view>
</template>

<script>
	import { PHONE, EMAIL } from '@/common/js/regx.js'
	export default {
		data() {
			return {
				account: '',
				password: ''
			}
		},
		onLoad() {

		},
		methods: {
			go_register(){
				uni.navigateTo({
					url: '/pages/auth/register/register'
				})
			},
			login() {
				if(!this.account) {
					this.$utils.toast('请输入账号')
					return false;
				}
				if(!(PHONE.test(this.account) || EMAIL.test(this.account))) {
					this.$utils.toast('账号格式错误')
					return false;
				}
				if (this.password.length < 8 || this.password.length > 16) {
					this.$utils.toast('请输入8-16位密码')
					return false;
				}
				uni.showLoading()
				this.$api.login({
					account: this.account,
					password: this.password
				}).then(res => {
					uni.hideLoading()
					if(res.code === 200) {
						uni.setStorageSync('user_id',res.data._id)
						this.$utils.toast('登录成功',() => {
							uni.switchTab({
								url: '../../tabBar/my/my'
							})							
						})
					}
				}).catch((err) => {
					uni.hideLoading()
					this.$utils.toast(err.msg)
				})
			}
		}
	}
</script>

<style lang="scss">
	.login {
		width: 100%;
	}
	.landing{
		height: 40px;
		line-height: 40px;
		border-radius: 40px;
		font-size: 16px;
		@include base-bg;
	}
	.login-btn{
		padding: 5px 10px;
		margin-top: 175px;
	}
	.login-function{
		overflow: auto;
		padding: 10px 10px 15px 10px;
	}
	.login-forget{
		float: left;
		font-size: 12px;
		color: #999;
	}
	.login-register{
		color: #666;
		float: right;
		font-size: 12px;
	}
	.login-input input{
		background: #f2f5f6;
		font-size: 14px;
		padding: 5px 12px;
		height: 30px;
		line-height: 30px;
		border-radius: 4px;
	}
	.login-margin-b{
		margin-bottom: 12px;
	}
	.login-input{
		padding: 5px 10px;
	}
	.login-head{
		font-size: 16px;
		text-align: center;
		padding: 12px 5px 22px 5px;
	}
	.login-card{
		background: #fff;
		border-radius: 6px;
		padding: 5px 12px;
		box-shadow: 0 3px 9px rgba(0,0,0,0.12);
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
