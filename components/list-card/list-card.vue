<template>
	<view @click="open">
		<!-- 基础卡片 -->
		<view class="listcard">
			<view class="listcard-image">
				<image :src="`${item.cover_img}`" mode="aspectFill"></image>
			</view>
			<view class="listcard-content">
				<view class="listcard-content_title">
					<text>{{item.title}}</text>
					<collect :item="item" :collect="collect" v-if="!download"></collect>
				</view>
				<view class="listcard-content_des">
					<view class="listcard-content_des-label" v-if="!download">
						<view class="listcard-content_des-label-item">{{item.label}}</view>
					</view>
					<view class="listcard-content_des-info" v-if="!download">
						<view class="listcard-content_des-info-item">
							{{item.created_at}}
						</view>
						<view class="listcard-content_des-info-item">
							{{item.download_num}}次下载
						</view>
						<view class="listcard-content_des-info-item" v-if="item.price > 0">
							{{item.price}}P豆
						</view>
						<view class="listcard-content_des-info-item free" v-else>免费</view>
					</view>
					<!-- 下载列表 -->
					<view class="down-info-box" v-else>
						<view class="listcard-content_des-info-item">
							支付：{{ item.price }} P豆
						</view>
						<view class="listcard-content_des-info-item">
							下载时间：{{item.down_at}}
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			item: {
				type: Object,
				default () {
					return {}
				}
			},
			collect: {
				type: Boolean,
				default: false
			},
			download: {
				type: Boolean,
				default: false
			},
			type: {
				type: String,
				default: ''
			}
		},
		data() {
			return {

			};
		},
		methods: {
			open() {
				this.$emit('click', this.item) // 触发搜索页的保存搜索记录
				this.$store.dispatch('set_detail', this.item) // 首页的列表数据保存传到详情页
				uni.navigateTo({
					url: `/pages/detail/detail?_id=${this.item._id}`
				})
			}
		}
	}
</script>

<style lang="scss">
	.listcard {
		display: flex;
		padding: 10px;
		margin: 10px;
		border-radius: 5px;
		box-shadow: 0 0 5px 1px rgba(0, 0, 0, .1);
		box-sizing: border-box;

		.listcard-image {
			flex-shrink: 0;
			width: 60px;
			height: 60px;
			border-radius: 5px;
			overflow: hidden;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.listcard-content {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			padding-left: 10px;
			width: 100%;

			.listcard-content_title {
				position: relative;
				padding-right: 30px;
				font-size: 14px;
				color: #333;
				font-weight: 400;
				line-height: 1.2;

				text {
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
				}

			}

			.listcard-content_des {
				display: flex;
				justify-content: space-between;
				font-size: 12px;

				.listcard-content_des-label {
					display: flex;

					.listcard-content_des-label-item {
						padding: 0 5px;
						margin-right: 5px;
						border-radius: 15px;
						border: 1px solid $base-color;
						color: $base-color;
					}
				}

				.down-info-box {
					width: 100%;
					display: flex;
					align-items: center;
					justify-content: space-between;
				}

				.listcard-content_des-info {
					display: flex;
					align-items: center;
				}

				.listcard-content_des-info-item {
					color: #999;
					line-height: 1.5;
					margin-left: 10px;

					&:first-child {
						margin-left: 0;
					}

					&.free {
						color: #30b33a;
					}
				}

			}
		}

		&.mode-column {
			.listcard-content {
				width: 100%;
				padding-left: 0;
			}

			.listcard-image {
				display: flex;
				margin-top: 10px;
				width: 100%;
				height: 70px;

				.listcard-image_item {
					margin-left: 10px;
					width: 33.3%;
					border-radius: 5px;
					overflow: hidden;

					&:first-child {
						margin-left: 0;
					}

					image {
						width: 100%;
						height: 100%;
					}
				}
			}

			.listcard-content_des {
				margin-top: 10px;
			}
		}

		&.mode-image {
			flex-direction: column;

			.listcard-image {
				width: 100%;
				height: 100px;
			}

			.listcard-content {
				padding-left: 0;
				margin-top: 10px;

				.listcard-content_des {
					display: flex;
					align-items: center;
					margin-top: 10px;
				}
			}
		}
	}
</style>
