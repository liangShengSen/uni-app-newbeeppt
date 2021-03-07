<template>
	<view class="register">
		<view class="forget-bg">
			<navbar type="auth" title="注册"></navbar>
			<view class="forget-card">
				<view class="forget-input forget-margin-b">
					<input v-model.trim="username" placeholder="请输入手机号/邮箱" />
				</view>
				<view class="forget-input forget-margin-b">
					<view class="verify-left">
						<input v-model.trim="verify" maxlength="4" placeholder="请输入验证码" />
					</view>
					<view class="verify-right" @click="getVerify">
						<canvas v-if="initCode" :style="{width:width+'px',height:height+'px'}" canvas-id="imgcanvas" class="canvas"></canvas>
						<button type="primary" :loading="loading" v-else class="get-verify">获取验证码</button>
					</view>
				</view>
				<view class="forget-input">
					<input type="password" v-model.trim="password" @confirm="register" placeholder="请输入密码(6-20位)" />
				</view>
			</view>
		</view>
		<view class="forget-btn">
			<button class="landing" type="primary" @click="register">注册</button>
			<!-- #ifdef MP-WEIXIN -->
			<view class="login-by-wx">
				<view class="inner" @click="getLoginCode">
					<view class="iconfont icon-weixindenglu"></view>
					<text class="text">微信注册</text>					
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
				width: 120,
				height: 40,
				initCode: false,
				tempCode: '',
				username: '',
				verify: '',
				password: '',
				loading: false,
			}
		},
		methods: {
			registerSuccess() {
				this.$utils.toast('注册成功', () => {
					uni.showModal({
						title: '提示',
						content: '新用户首次完善资料可送20P豆哦~~',
						confirmColor: '#f07373',
						success: function(res) {
							uni.switchTab({
								url: '../../tabBar/my/my'
							})
						}
					});
				})
			},
			getVerify() {
				if (!this.username) {
					this.$utils.toast('请输入账号')
					return false;
				}
				if (!(PHONE.test(this.username) || EMAIL.test(this.username))) {
					this.$utils.toast('请输入手机号码或者邮箱')
					return false;
				}
				let data = {}
				if (PHONE.test(this.username)) {
					data['mobile'] = this.username
				} else {
					data['email'] = this.username
				}
				this.loading = true
				this.$api.getVerifyCode(data).then(res => {
					this.loading = false
					if (res.code === 0) {
						this.tempCode = res.data.code
						this.initCode = true
						setTimeout(() => {
							this.createVerifyCode(this.tempCode)
						}, 0)
					}
				}).catch(() => {
					this.loading = false
				})
			},
			register() {
				if (!this.username) {
					this.$utils.toast('请输入账号')
					return false;
				}
				if (!(PHONE.test(this.username) || EMAIL.test(this.username))) {
					this.$utils.toast('账号格式错误')
					return false;
				}
				if(!this.verify) {
					this.$utils.toast('请输入验证码')
					return false;
				}
				if(this.verify !== this.tempCode) {
					this.$utils.toast('验证码错误')
					return false;
				}
				if (this.password.length < 6 || this.password.length > 20) {
					this.$utils.toast('请输入6-20位密码')
					return false;
				}
				this.$utils.showLoading('注册中')
				this.$api.register({
					username: this.username,
					code: this.verify,
					password: this.password
				}).then(res => {
					uni.hideLoading()
					if (res.code === 0) {
						uni.setStorageSync('uni_id_token', res.token)
						this.registerSuccess()
					} else {
						this.$utils.toast(res.msg)
					}
				}).catch((err) => {
					uni.hideLoading()
					this.$utils.toast(err.msg)
				})
			},
			getLoginCode() {
				this.$utils.showLoading('微信注册中')
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
									if (res.type === 'register') { // 第一次为注册，其他则是登录
										this.registerSuccess()
									} else {
										this.$utils.toast('该账号已注册', () => {
											uni.switchTab({
												url: '../../tabBar/my/my'
											})
										})
									}
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
			},
			createVerifyCode(str) {
				var context = uni.createCanvasContext('imgcanvas', this),
					w = this.width,
					h = this.height;
				context.setFillStyle("#F2F5F6");
				context.setLineWidth(5);
				context.fillRect(0, 0, w, h);
				var pool = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "I", "M", "N", "O", "P", "Q", "R", "S",
						"T", "U", "V", "W", "S", "Y", "Z", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0"
					],
					code = ''
				let strArr = str.split('')
				for (var i = 0; i < strArr.length; i++) {
					var c = strArr[i];
					var deg = this.rn(-30, 30);
					context.setFontSize(18);
					context.setTextBaseline("top");
					context.setFillStyle(this.rc(80, 150));
					context.save();
					context.translate(30 * i + 15, parseInt(h / 1.5));
					context.rotate(deg * Math.PI / 180);
					context.fillText(c, -15 + 5, -15);
					context.restore();
					code += c;
				}
				for (var i = 0; i < 40; i++) {
					context.beginPath();
					context.arc(this.rn(0, w), this.rn(0, h), 1, 0, 2 * Math.PI);
					context.closePath();
					context.setFillStyle(this.rc(150, 200));
					context.fill();
				}
				context.draw();
			},
			rc(min, max) {
				var r = this.rn(min, max);
				var g = this.rn(min, max);
				var b = this.rn(min, max);
				return "rgb(" + r + "," + g + "," + b + ")";
			},
			rn(max, min) {
				return parseInt(Math.random() * (max - min)) + min;
			}
		}
	}
</script>

<style lang="scss">
	.register {
		width: 100%;
	}

	.verify-left {
		width: calc(100% - 130px);
	}

	.verify-right {
		padding-left: 10px;

		.get-verify {
			display: block;
			width: 120px;
			height: 40px;
			line-height: 40px;
			text-align: center;
			border-radius: 4px;
			font-size: 15px;
			color: #fff;
			@include base-bg;
		}

		.canvas {
			border-radius: 4px;
			overflow: hidden;
		}
	}

	.verify-left,
	.verify-right {
		float: left;
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

	.forget-btn {
		padding: 5px 10px;
		margin-top: 215px;
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

	.forget-input input {
		background: #F2F5F6;
		font-size: 14px;
		padding: 5px 12px;
		height: 30px;
		line-height: 30px;
		border-radius: 4px;
	}

	.forget-margin-b {
		margin-bottom: 12px;
	}

	.forget-input {
		padding: 5px 10px;
		overflow: auto;
	}

	.forget-card {
		background: #fff;
		border-radius: 6px;
		padding: 30px 12px;
		box-shadow: 0 3px 9px rgba(0, 0, 0, 0.12);
		position: relative;
		margin-top: 30px;
	}

	.forget-bg {
		position: relative;
		height: 150px;
		padding: 12px;
		border-radius: 0 0 10px 10px;
		@include base-bg;
	}
</style>
