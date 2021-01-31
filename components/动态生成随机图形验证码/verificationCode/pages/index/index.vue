<template>
	<view class="register">
		<view class="content">

			<!-- 头部logo -->
			<view class="header">
				<image :src="logoImage"></image>
			</view>

			<!-- 注册input主体 -->
			<view class="main">
				<wInput v-model="phoneData" type="number" maxlength="11" placeholder="请输入手机号"></wInput>
				<wInput v-model="passData" type="password" maxlength="11" placeholder="请输入密码" isShowPass></wInput>
				<wInput v-model="passDataAgain" type="password" maxlength="11" placeholder="确认登录密码" isShowPass></wInput>
				<view class="codeView">
					<wInput v-model="verCode" type="text" maxlength="4" placeholder="请输入右边验证码">

					</wInput>
					<view class="canvas-img-code" @click="refresh()">
						<canvas :style="{width:width+'px',height:height+'px'}" canvas-id="imgcanvas" @error="canvasIdErrorCallback"></canvas>
					</view>
				</view>
			</view>

			<!-- 注册按钮 -->
			<wButton text="注 册" :rotate="isRotate" @click.native="startReg()"></wButton>
		</view>
	</view>
</template>

<script>
	var _this;
	import wInput from '../../components/register/watch-input.vue'
	import wButton from '../../components/register/watch-button.vue'

	export default {
		data() {
			return {
				logoImage: '../../static/images/logo.png',//logo图
				phoneData: '', // 手机号
				passData: '', //密码
				verCode: "", //验证码
				passDataAgain: "", //确认密码
				isRotate: false, //注册按钮是否加载旋转特效
				width: 120,
				height: 45
			}
		},
		components: {
			wInput,
			wButton,
		},
		onShow() {
			_this = this;
			setTimeout(function() {
				_this.init();
			}, 1000)
		},
		methods: {
			startReg() {
				//点击注册按钮
				if (this.isRotate) {
					return false;
				}
				if (this.phoneData.length != 11) {
					uni.showToast({
						icon: 'none',
						position: 'bottom',
						title: '手机号不正确'
					});
					return false;
				}
				if (this.passData.length < 6) {
					uni.showToast({
						icon: 'none',
						position: 'bottom',
						title: '密码长度不能小于6位'
					});
					return false;
				}
				if (this.passDataAgain.length < 6) {
					uni.showToast({
						icon: 'none',
						position: 'bottom',
						title: '密码长度不能小于6位'
					});
					return false;
				}
				if (this.passDataAgain != this.passData) {
					uni.showToast({
						icon: 'none',
						position: 'bottom',
						title: '两次输入的密码不一致'
					});
					return false;
				}
				if (this.verCode.length != 4) {
					uni.showToast({
						icon: 'none',
						position: 'bottom',
						title: '验证码不正确'
					});
					return false;
				}
				if (this.verCode.toLowerCase() != uni.getStorageSync('imgcode').toLowerCase()) {
					uni.showToast({
						icon: 'none',
						position: 'bottom',
						title: '验证码不正确'
					});
					return false;
				}

				_this.isRotate = true;

				// 注册成功
				setTimeout(function() {
					uni.showToast({
						icon: 'none',
						position: 'bottom',
						title: '注册成功'
					});
					
					_this.isRotate = false
				}, 2000)
			},

			// 初始化验证码
			init: function() {
				console.log('start');
				var context = uni.createCanvasContext('imgcanvas', this),
					w = this.width,
					h = this.height;
				context.setFillStyle("white");
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
				console.log('end');
			},
			rc: function(min, max) {
				var r = this.rn(min, max);
				var g = this.rn(min, max);
				var b = this.rn(min, max);
				return "rgb(" + r + "," + g + "," + b + ")";
			},
			rn: function(max, min) {
				return parseInt(Math.random() * (max - min)) + min;
			},
			refresh: function() {
				this.init();
			},
			canvasIdErrorCallback: function(e) {
				console.error(e.detail.errMsg)
			}
		}
	}
</script>

<style>
	@import url("../../components/register/css/icon.css");
	@import url("../../static/css/main.css");

	.codeView {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}

	.canvas-img-code {
		display: inline-block;
	}
</style>
