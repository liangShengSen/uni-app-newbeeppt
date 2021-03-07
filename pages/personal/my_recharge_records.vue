<template>
	<view class="my-recharge-record">
		<list-scroll class="list-scroll">
			<uni-load-more v-if="loading" status="loading" iconType="snow"></uni-load-more>
			<view v-if="rechargeRecords.length > 0" class="list">
				<view class="list-item" v-for="item in rechargeRecords" :key="item._id">
					<view class="order-id"><text class="label">ID：</text>{{item._id}}</view>
					<view class="order-info">
						<view class="price"><text class="label">金额：</text>{{item.price}}元</view>
						<view class="date"><text class="label">日期：</text>{{item.date}}</view>
					</view>
				</view>
			</view>
			<view v-if="rechargeRecords.length === 0 && !loading" class="no-data">
				暂无数据
			</view>
		</list-scroll>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				loading: false,
				rechargeRecords: []
			}
		},
		onLoad() {
			this.getRechargeList()
		},
		methods: {
			getRechargeList() {
				this.loading = true
				this.$api.getRechargeOrders().then(res => {
					this.loading = false
					if (res.code === 0) {
						this.rechargeRecords = res.userInfo.recharge_orders || []
					}
				}).catch(() => {
					this.loading = false
				})
			}
		}
	}
</script>

<style lang="scss">
	.my-recharge-record {
		.list {
			padding: 10px 15px;

			.list-item {
				padding: 10px 0;
				color: #333;
				font-size: 16px;
				border-radius: 5px;
				border-bottom: 1px solid #f5f5f5;

				.label {
					color: #999;
				}

				.order-id {
					margin-bottom: 10px;
				}

				.order-info {
					display: flex;
					align-items: center;
					justify-content: space-between;
					font-size: 14px;
				}
			}
		}

		.no-data {
			width: 100%;
			height: 100px;
			line-height: 100px;
			text-align: center;
			font-size: 14px;
			color: #999;
		}
	}
</style>
