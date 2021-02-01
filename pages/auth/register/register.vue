<template>
	<view class="register">
		<view class="forget-bg">
			<navbar type="auth" authTitle="注册"></navbar>
			<view class="forget-card">
				<view class="forget-input forget-margin-b">
					<input v-model="account" placeholder="请输入手机号/邮箱" />
				</view>
				<view class="forget-input forget-margin-b">
					<view class="verify-left">
						<input v-model="verify" maxlength="4" placeholder="请输入验证码" />
					</view>
					<view class="verify-right" @click="refresh">
						<canvas :style="{width:width+'px',height:height+'px'}" canvas-id="imgcanvas" class="canvas" @error="canvasIdErrorCallback"></canvas>
					</view>
				</view>
				<view class="forget-input">
					<input v-model="password" @confirm="register" placeholder="请输入密码(8-16位)" />
				</view>
			</view>
		</view>
		<view class="forget-btn">
			<button class="landing" type="primary" @click="register">注册</button>
		</view>
	</view>
</template>

<script>
	import { PHONE, EMAIL } from '@/common/js/regx.js'
	export default {
		data() {
			return {
				width: 120,
				height: 40,
				account: '',
				verify: '',
				password: ''
			}
		},
		onLoad() {
			
		},
		onReady() {
			this.init();
		},
		methods: {
			register() {
				if(!this.account) {
					this.$utils.toast('请输入账号')
					return false;
				}
				if(!(PHONE.test(this.account) || EMAIL.test(this.account))) {
					this.$utils.toast('账号格式错误')
					return false;
				}
				if (this.verify.length != 4 || this.verify.toLowerCase() != uni.getStorageSync('imgcode').toLowerCase()) {
					this.$utils.toast('验证码不正确')
					return false;
				}
				if (this.password.length < 8 || this.password.length > 16) {
					this.$utils.toast('请输入8-16位密码')
					return false;
				}
				uni.showLoading()
				this.$api.register({
					account: this.account,
					password: this.password
				}).then(res => {
					uni.hideLoading()
					if(res.code === 200) {
						uni.setStorageSync('user_id',res.data.id)
						this.$utils.toast('注册成功',() =>{
							uni.showModal({
							    title: '提示',
							    content: '新用户完善资料可送20P币哦~~',
								confirmColor: '#f07373',
							    success: function (res) {
							        uni.switchTab({
							        	url: '../../tabBar/my/my'
							        })	
							    }
							});
													
						})
					}
				}).catch((err) => {
					uni.hideLoading()
					this.$utils.toast(err.msg)
				})
			},
			init() {
				var context = uni.createCanvasContext('imgcanvas', this),
					w = this.width,
					h = this.height;
				context.setFillStyle("#F2F5F6");
				context.setLineWidth(5);
				context.fillRect(0, 0, w, h);
				var pool = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "I", "M", "N", "O", "P", "Q", "R", "S",
						"T", "U", "V", "W", "S", "Y", "Z", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0"
					],
					str = '';
				for (var i = 0; i < 4; i++) {
					var c = pool[this.rn(0, pool.length - 1)];
					var deg = this.rn(-30, 30);
					context.setFontSize(18);
					context.setTextBaseline("top");
					context.setFillStyle(this.rc(80, 150));
					context.save();
					context.translate(30 * i + 15, parseInt(h / 1.5));
					context.rotate(deg * Math.PI / 180);
					context.fillText(c, -15 + 5, -15);
					context.restore();
					str += c;
				}
				uni.setStorage({
					key: 'imgcode',
					data: str,
				});
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
			},
			refresh() {
				this.init();
			},
			canvasIdErrorCallback(e) {
				console.error(e.detail.errMsg)
			}
		}
	}
</script>

<style lang="scss">
	.register {
		width: 100%;
	}
	.verify-left{
		width: calc(100% - 130px);
	}
	.verify-right{
		padding-left: 10px;
		.canvas {
			border-radius: 4px;
			overflow: hidden;
		}
	}
	.verify-left,.verify-right{
		float: left;
	}
	.landing{
		height: 40px;
		line-height: 40px;
		border-radius: 40px;
		font-size: 16px;
		@include base-bg;
	}
	.forget-btn{
		padding: 5px 10px;
		margin-top: 190px;
	}

	.forget-input input{
		background: #F2F5F6;
		font-size: 14px;
		padding: 5px 12px;
		height: 30px;
		line-height: 30px;
		border-radius: 4px;
	}
	.forget-margin-b{
		margin-bottom: 12px;
	}
	.forget-input{
		padding: 5px 10px;
		overflow: auto;
	}
	.forget-card{
		background: #fff;
		border-radius: 6px;
		padding: 30px 12px;
		box-shadow: 0 3px 9px rgba(0,0,0,0.12);
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
