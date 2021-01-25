<template>
	<view @click="open">
		<!-- 基础卡片 -->
		<view class="listcard" v-if="item.type === 'ppt'">
			<view class="listcard-image">
				<image :src="`${item.priviewImg}`" mode="aspectFill"></image>
			</view>
			<view class="listcard-content">
				<view class="listcard-content_title">
					<text>{{item.title}}</text>
					<collect :item="item"></collect>
				</view>
				<view class="listcard-content_des">
					<view class="listcard-content_des-label">
						<view class="listcard-content_des-label-item">{{item.type_label}}</view>
					</view>
					<view class="listcard-content_des-info">
						<view class="listcard-content_des-info-item">
							{{item.create_at}}
						</view>
						<view class="listcard-content_des-info-item">
							{{item.download_num}}次下载
						</view>
						<view class="listcard-content_des-info-item">
							{{item.price}}币
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 多图卡片 -->
		<view class="listcard mode-column" v-if="item.type !== 'ppt'">
			<view class="listcard-content">
				<view class="listcard-content_title">
					<text>{{item.title}} </text>
					<collect :item="item"></collect>
				</view>
				<view class="listcard-image">
					<view v-for="(imgindex) in item.priview_imgs" :key="index" class="listcard-image_item">
						<image :src="img" mode="aspectFill"></image>
					</view>
				</view>
				<view class="listcard-content_des">
					<view class="listcard-content_des-label">
						<view class="listcard-content_des-label-item">课件</view>
					</view>
					<view class="listcard-content_des-info">
						<view class="listcard-content_des-info-item">
							{{item.create_at}}
						</view>
						<view class="listcard-content_des-info-item">
							{{item.download_num}}次下载
						</view>
						<view class="listcard-content_des-info-item">
							{{item.price}}币
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 大图模式 -->
		<view class="listcard mode-image" v-if="item.type !== 'ppt'">
			<view class="listcard-image">
				<image :src="`${item.priviewImg}`" mode="aspectFill"></image>
			</view>
			<view class="listcard-content">
				<view class="listcard-content_title">
					<text>{{item.title}} </text>
					<collect :item="item"></collect>
				</view>
				<view class="listcard-content_des">
					<view class="listcard-content_des-label">
						<view class="listcard-content_des-label-item">课件</view>
					</view>
					<view class="listcard-content_des-info">
						<view class="listcard-content_des-info-item">
							{{item.create_at}}
						</view>
						<view class="listcard-content_des-info-item">
							{{item.download_num}}次下载
						</view>
						<view class="listcard-content_des-info-item">
							{{item.price}}币
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
			}
		},
		data() {
			return {

			};
		},
		methods:{
			open(){
				this.$emit('click', this.item)
				let params = {
					_id: this.item._id,
					title: this.item.title,
					price: this.item.price,
					is_collect: this.item.is_collect,
					fileSize: this.item.fileSize,
					user_name: this.item.user_name,
					priviewImg: this.item.priviewImg,
					download_num: this.item.download_num,
					create_at: this.item.create_at
				}
				uni.navigateTo({
					url: `/pages/detail/detail?params=${JSON.stringify(params)}`
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

				.listcard-content_des-info {
					display: flex;
					align-items: center;

					.listcard-content_des-info-item {
						color: #999;
						line-height: 1.5;
						margin-left: 10px;

						&:first-child {
							margin-left: 0;
						}
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
					width: 100%;
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
