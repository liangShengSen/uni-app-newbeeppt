<template>
	<view class="login">
		<view class="login-header">
			<uni-icons class="back" type="back" size="26" color="#fff" @click="back"></uni-icons>
			<view class="logo">
				<!-- <image src="" mode=""></image> -->
			</view>
		</view>
		<view class="login-form">
			<view class="form-title">{{isLogin ? '登陆':'注册'}}</view>
			<view class="form-item">
				<view class="form-item-label">账号</view>
				<input class="form-input" type="text" adjust-position v-model="account" placeholder="请输入账号" />
			</view>
			<view class="form-item">
				<view class="form-item-label">密码</view>
				<input class="form-input" type="password" adjust-position v-model="password" placeholder="请输入密码" />
			</view>
			<view class="login-btn">
				<view class="login-text">{{isLogin ? '登陆':'注册'}}</view>
			</view>
		</view>
		<view class="forget-password" v-if="isLogin">忘记密码？</view>
		<view class="toggle-login-register" v-if="isLogin">没有账号？现在<text class="text" @click="isLogin = false">注册</text></view>
		<view class="toggle-login-register" v-else>已有账号？马上<text class="text" @click="isLogin = true">登陆</text></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isLogin: true,
				account: "",
				password: "",
			}
		},
		methods: {
			back() {
				uni.navigateBack({
					delta: 1
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		height: 100%;
	}
	.login {
		min-height: 100%;
		.login-header {
			position: relative;
			width: 100%;
			height: 300px;
			display: flex;
			justify-content: center;
			background-color: $base-color;
			border-radius: 0px 0px 10px 10px;
			.back {
				position: absolute;
				top: 15px;
				left: 15px;
			}
			.logo {
				width: 80px;
				height: 80px;
				background-color: #fff;
				overflow: hidden;
				border-radius: 50%;
				margin-top: 60px;
				image {
					width: 100%;
					height: 100%;
				}
			}
		}
		.login-form {
			position: relative;
			z-index: 1;
			margin: -115px 15px 0;
			height: 240px;
			background-color: #fff;
			border-radius: 10px;
			box-shadow: 0 3px 2px 0 #ece9e9;
			.form-title {
				text-align: center;
				font-size: 18px;
				color: #333;
				padding: 15px 0 5px;
			}
			.form-item {
				margin: 0 15px;
				color: #333;
				& + .form-item {
					margin-top: 20px;
				}
				.form-item-label {
					font-size: 15px;
					color: #666;
					line-height: 16px;
				}
				.form-input {
					padding: 10px 0;
					border-bottom: 1px solid #eee;
					color: #333;
					font-size: 14px;
				}
				.uni-input-placeholder {
					font-size: 14px;
					color: #ddd;
				}
			}
			.login-btn {
				width: 100%;
				position: absolute;
				bottom: -22px;
				display: flex;
				justify-content: center;
				.login-text {
					width: 170px;
					height: 44px;
					line-height: 44px;
					text-align: center;
					color: #fff;
					font-size: 16px;
					background-color: $base-color;
					border-radius: 24px;
				}
			}
		}
		.forget-password {
			margin-top: 35px;
			font-size: 12px;
			color: #666;
			text-align: center;
		}
		.toggle-login-register {
			width: 100%;
			position: absolute;
			bottom: 15px;
			font-size: 12px;
			color: #666;
			text-align: center;
			.text {
				color: $base-color;
			}
		}
	}
</style>
