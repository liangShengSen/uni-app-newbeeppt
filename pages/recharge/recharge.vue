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
			<view class="recharge-item" :class="index === active ? 'active' : ''" v-for="(item,index) in rechargeList" :key="item.price"
			 @click="toggleRecharge(index)">{{item.price}}元</view>
		</view>
		<view class="tips">
			<view class="title">充值提示</view>
			<view class="tips-item">1、如果出现无法充值、充值失败等情况，请添加客服QQ(1213509006)进行咨询相关问题，谢谢配合。</view>
			<view class="tips-item">2、凡是充值成功之后，为了减少双方不必要的麻烦，概不退款，请注意！！！</view>
		</view>
		<view class="recharge-btn">
			<button class="landing" type="primary" @click="showPayQrcode">立即支付</button>
		</view>
		<uni-popup ref="popup" type="center" :maskClick="false">
			<view class="modal-content">
				<view class="pay-info">充值金额：{{payInfo.price}} 元</view>
				<view class="pay-info">可得 P 豆：{{payInfo.coins}} 豆</view>
				<view class="qrcode-wrap">
					<image :src="payInfo.qrcode" mode="aspectFill"></image>
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
				id: '',
				balance: 0,
				active: 1,
				rechargeList: [],
				payInfo: {}
			}
		},
		onLoad(query) {
			this.id = query.id
			this.getRechargeList()
		},
		methods: {
			getRechargeList() {
				uni.showLoading()
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
			cancelPay() {
				this.$refs.popup.close()
				uni.showLoading()
				this.$api.recharge_pay_cb({
					id: this.$utils.UUIDGenerator(),
					price: this.payInfo.price,
					coins: this.payInfo.coins,
					date: this.$utils.getNowDate()
				}).then(res => {
					uni.hideLoading()
					if(res.code === 0) {
						this.$utils.toast('充值成功', () => {
							uni.navigateTo({
								url: `../detail/detail?_id=${this.id}`
							})
						})						
					}
				}).catch(() => {
					uni.hideLoading()
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		height: 100%;
	}

	.modal-content {
		background-color: #fff;
		border-radius: 4px;
		width: 90%;
		margin: 0 auto;
		padding: 20px;
		box-sizing: border-box;

		.pay-info {
			margin-bottom: 10px;
			text-align: center;
			color: #333;
			font-size: 14px;
		}

		.btn {
			height: 36px;
			line-height: 36px;
			font-size: 16px;
			text-align: center;
			color: #fff;
			border-radius: 36px;
			margin-top: 30px;
			@include base-bg;
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
