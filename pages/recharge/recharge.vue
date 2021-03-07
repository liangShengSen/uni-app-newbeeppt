<template>
	<view class="recharge">
		<view class="login-bg">
			<navbar type="recharge" title="充值中心"></navbar>
			<view class="user-balance">
				<view class="count">{{balance}}.00</view>
				<view class="label">当前账户余额（P豆）</view>
			</view>
		</view>
		<view class="recharge-list">
			<view class="recharge-item" :class="index === active ? 'active' : ''" v-for="(item,index) in rechargeList"
				:key="item.price" @click="toggleRecharge(index)">{{item.price}}元</view>
		</view>
		<view class="tips">
			<view class="title">充值提示</view>
			<view class="tips-item">1、如果出现无法充值、充值失败等情况，请添加客服QQ(1213509006)进行咨询相关问题，谢谢配合。</view>
			<view class="tips-item">2、凡是充值成功之后，为了减少双方不必要的麻烦，概不退款，请注意！！！</view>
		</view>
		<view class="recharge-btn">
			<button class="landing" type="primary" @click="showPayQrcode">立即支付</button>
		</view>
		<uni-popup ref="popup" type="center">
			<view class="modal-content">
				<uni-icons type="closeempty" color="#999" size="20" class="close-icon" @click="cancelPay(1)">
				</uni-icons>
				<view class="pay-info">充值金额：{{payInfo.price}} 元</view>
				<view class="pay-info">可得 P 豆：{{payInfo.coins}} 豆</view>
				<view class="qrcode-wrap">
					<image :src="payInfo.qrcode" mode="aspectFill" @click="scanImage(payInfo.qrcode)"></image>
				</view>
				<view class="recharge-tips">点击-长按-发送给好友-长按-付款<view>即可完成充值操作</view>
				</view>
				<view class="btn" @click="cancelPay">确认支付</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				balance: 0,
				active: 1,
				rechargeList: [],
				payInfo: {}
			}
		},
		onLoad(query) {
			this.getRechargeList()
		},
		methods: {
			getRechargeList() {
				this.$utils.showLoading('加载中')
				this.$api.get_recharge().then(res => {
					uni.hideLoading()
					if (res.code === 0) {
						this.rechargeList = res.data.recharges
						this.balance = res.data.balance
					}
				}).catch(() => {
					uni.hideLoading()
				})
			},
			toggleRecharge(i) {
				this.active = i
			},
			showPayQrcode() {
				this.payInfo = this.rechargeList[this.active]
				this.$refs.popup.open()
			},
			cancelPay(flag) {
				this.$refs.popup.close()
				if (flag === 1) return
				this.$utils.showLoading('加载中')
				this.$api.recharge_pay_cb({
					_id: this.$utils.guid(),
					price: this.payInfo.price,
					coins: this.payInfo.coins,
					date: this.$utils.getNowDate()
				}).then(res => {
					uni.hideLoading()
					if (res.code === 0) {
						this.$utils.toast('充值成功', () => {
							uni.navigateBack({
								delta: 1
							})
						})
					}
				}).catch(() => {
					uni.hideLoading()
				})
			},
			scanImage(url) {
				uni.previewImage({
					current: 0,
					urls: [url],
					longPressActions: {
						itemList: ['发送给朋友']
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

	.modal-content {
		position: relative;
		background-color: #fff;
		border-radius: 4px;
		width: 90%;
		margin: 0 auto;
		padding: 30px 20px 20px 20px;
		box-sizing: border-box;

		.close-icon {
			position: absolute;
			right: 10px;
			top: 5px;
		}

		.pay-info {
			margin-bottom: 10px;
			text-align: center;
			color: #333;
			font-size: 14px;
		}

		.btn {
			width: 150px;
			height: 36px;
			line-height: 36px;
			font-size: 16px;
			text-align: center;
			color: #fff;
			border-radius: 36px;
			margin: 30px auto 0;
			@include base-bg;
		}

		.recharge-tips {
			color: #999;
			font-size: 14px;
			margin-top: 10px;
			text-align: center;
		}

		.qrcode-wrap {
			width: 180px;
			height: 180px;
			border: 1px solid #ddd;
			padding: 10px 0;
			border-radius: 2px;
			margin: 25px auto 0;
			overflow: hidden;

			image {
				width: 100%;
				height: 100%;
			}
		}
	}

	.recharge {
		position: relative;
		width: 100%;
		height: 100%;
	}

	.landing {
		height: 40px;
		line-height: 40px;
		border-radius: 40px;
		font-size: 16px;
		@include base-bg;
	}

	.recharge-btn {
		position: absolute;
		bottom: 20px;
		width: 100%;
		box-sizing: border-box;
		padding: 5px 10px;
	}

	.recharge-list {
		width: 100%;
		box-sizing: border-box;
		margin: 30px 0 20px;
		padding: 0 15px;
		display: flex;
		flex-wrap: wrap;

		.recharge-item {
			flex-grow: 1;
			flex-shrink: 0;
			width: calc((100% - 50px) / 3);
			height: 40px;
			line-height: 40px;
			border-radius: 3px;
			border: 1px solid #ddd;
			text-align: center;
			color: #333;
			margin-right: 10px;
			margin-bottom: 10px;
			font-size: 16px;

			&:nth-child(3n) {
				margin-right: 0;
			}

			&.active {
				color: #fff;
				border-color: #ffbb69;
				@include base-bg;
			}
		}
	}

	.tips {
		width: 100%;
		box-sizing: border-box;
		padding: 0 15px;

		.title {
			font-size: 16px;
			color: #333;
			margin-bottom: 10px;
		}

		.tips-item {
			font-size: 14px;
			color: #999;
			margin-bottom: 5px;
		}
	}

	.login-bg {
		position: relative;
		height: 180px;
		padding: 12px;
		border-radius: 0 0 10px 10px;
		@include base-bg;

		.user-balance {
			display: flex;
			align-items: center;
			flex-direction: column;
			margin-top: 10px;

			.count {
				color: #fff;
				font-size: 45px;
			}

			.label {
				font-size: 14px;
				color: #fff;
			}
		}
	}
</style>
