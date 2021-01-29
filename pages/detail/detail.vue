<template>
	<view class="detail">
		<skeleton v-if="loading" :loading="loading" :showTitle="true" :row="20" :showAvatar="false"></skeleton>
		<block v-else>	
			<view class="detail-title">{{detailData.title}}</view>
			<view class="detail-header">
				<view class="detail-header_content">
					<text>{{detailData.created_at}}</text>
					<text>{{detailData.download_num}}次下载</text>
					<text class="price">{{detailData.price}}豆</text>
				</view>
			</view>
			<view class="detail-content">
				<image :src="detailData && detailData.priview_imgs[0]" mode="widthFix"></image>
			</view>
			<view class="detail-attrs">
				<view class="attr-tit">资料属性</view>
				<view class="attr-list">
					<view class="attr-list_item">资料作者： {{detailData.author.name}}</view>
					<view class="attr-list_item">适用地区： 全国</view>
					<view class="attr-list_item">文件大小：{{detailData.file_size}}</view>
					<view class="attr-list_item">资 料 I D： {{detailData._id}}</view>
				</view>
			</view>
			<div class="detail-attrs intro">
				<view class="attr-tit">资料简介</view>
				<view class="detail-intro">{{detailData.intro}}</view>
			</div>
			<view class="detail-bottom_bar">
				<view class="content">
					<view class="content-left">
						<view class="share">
							<uni-icons size="20" color="#f07373" type="redo"></uni-icons>
							<view class="text">分享</view>
						</view>
						<view class="collect">
							<uni-icons size="20" color="#f07373" :type="detailData.is_collect ? 'heart-filled' :'heart'"></uni-icons>
							<view class="text">收藏</view>
						</view>
					</view>
					<view class="content-right">立即下载</view>
				</view>
			</view>
		</block>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				_id:'',
				loading: true,
				detailData: {}
			}
		},
		onLoad(query) {
			this._id = query._id
			this.getDetail()
		},
		methods: {
			getDetail() {
				this.$api.get_subject_detail({
					_id:this._id
				}).then(res => {
					const {  data } = res
					this.detailData = data
					this.loading = false
				}).catch(() => {
					this.loading = false
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		height: 100%;
	}
	.detail {
		min-height: 100%;
		padding-bottom: 60px;
		background-color: #f8f8f8;

		.detail-title {
			padding: 10px 15px 0;
			font-size: 16px;
			background-color: #fff;
			font-weight: bold;
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-line-clamp: 2;
			-webkit-box-orient: vertical;
		}

		.detail-header {
			padding: 5px 14px 10px;
			background-color: #fff;

			.detail-header_content {
				width: 100%;
				font-size: 12px;
				color: #999;

				text {
					margin-right: 15px;

					&.price {
						color: $base-color;
					}
				}
			}
		}

		.detail-content {
			width: 100%;

			image {
				width: 100%;
			}
		}

		.detail-attrs {
			margin-top: 5px;
			background-color: #fff;
			padding: 15px;
			&.intro {
				margin-top: 10px;
			}
			.attr-tit {
				font-size: 16px;
				font-weight: 800;
				color: #333;
			}

			.attr-list {
				margin-top: 5px;

				.attr-list_item {
					margin-top: 10px;
					font-size: 14px;
					color: #666;
				}
			}
			.detail-intro {
				font-size: 12px;
				line-height: 1.5;
				color: #666;
				padding-top: 10px;
			}
		}

		.detail-bottom_bar {
			position: fixed;
			bottom: 0;
			left: 0;
			right: 0;
			width: 100%;
			height: 50px;
			padding: 7px 0 6px;
			box-sizing: border-box;
			border-top: 1px solid #f1f1f1;
			background-color: #fff;
			z-index: 700;
			font-size: 0;

			.content {
				display: flex;
				align-items: center;
				justify-content: space-between;
				height: 100%;
				padding: 0 15px;

				.content-left {
					display: flex;
					align-items: center;

					.share,
					.collect {
						display: flex;
						flex-direction: column;
						margin-right: 25px;

						.text {
							font-size: 12px;
							color: #666;
						}
					}
				}

				.content-right {
					width: 120px;
					height: 36px;
					line-height: 36px;
					text-align: center;
					font-size: 14px;
					color: #fff;
					border-radius: 20px;
					background-color: $base-color;
				}
			}
		}
	}
</style>
