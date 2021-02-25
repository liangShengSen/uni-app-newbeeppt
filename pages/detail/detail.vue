<template>
	<view class="detail" v-if="detailData">
		<view class="detail-title">{{ detailData.title }}</view>
		<view class="detail-header">
			<view class="detail-header_content">
				<text>{{ detailData.created_at }}</text>
				<text>{{ detailData.download_num }}次下载</text>
				<text class="price" v-if="detailData.price > 0">{{ detailData.price }} P豆</text>
				<text class="free" v-else>免费</text>
			</view>
		</view>
		<view class="detail-content">
			<image :src="detailData.priview_imgs[0]" mode="widthFix"></image>
		</view>
		<view class="detail-attrs">
			<view class="attr-tit">资料属性</view>
			<view class="attr-list">
				<block v-if="detailData.stage">
					<view class="attr-list_item">学段： {{ detailData.stage.name }}</view>
					<view class="attr-list_item">学科： {{ detailData.subject.name }}</view>
					<view class="attr-list_item">版本： {{ detailData.version.name }}</view>
					<view class="attr-list_item">册别： {{ detailData.book.name }}</view>
					<view class="attr-list_item">所属章节： {{ detailData.chapter.name }}</view>					
				</block>
				<view class="attr-list_item">资料作者： {{ detailData.author.name }}</view>
				<view class="attr-list_item">适用地区： 全国</view>
				<view class="attr-list_item">文件大小：{{ detailData.file_size }}</view>
				<view class="attr-list_item">资 料 I D： {{ detailData._id }}</view>
			</view>
		</view>
		<div class="detail-attrs intro">
			<view class="attr-tit">资料简介</view>
			<view class="detail-intro">{{ detailData.intro }}</view>
		</div>
		<view class="detail-bottom_bar">
			<view class="content">
				<view class="content-left">
					<!-- #ifdef MP-WEIXIN -->
						<button class="share" open-type="share">
							<uni-icons size="20" type="redo"></uni-icons>
							<view class="text">分享</view>
						</button>					
					<!-- #endif -->
					<!-- #ifndef MP-WEIXIN -->
						<view class="share" @click="shareDetail">
							<uni-icons size="20" type="redo"></uni-icons>
							<view class="text">分享</view>
						</view>					
					<!-- #endif -->
					<view class="collect">
						<collect :item="detailData" :isDetail="true"></collect>
						<view class="text">收藏</view>
					</view>
				</view>
				<view class="content-right" @click="preDownload">立即下载</view>
			</view>
		</view>
		<uni-popup ref="popup" type="center">
			<view class="modal-content">
				<view class="down-info" v-if="preDownData.is_free || detailData.price === 0">本次下载：<text class="is-free">免费</text></view>
				<view class="down-info" v-else>下载需要：<text class="need-pay">{{detailData.price}} P豆</text></view>
				<view class="down-info">账户余额：{{preDownData.balance}} P豆</view>
				<view class="down-info free">首次下载后15天内可免费重复下载</view>
				<view class="btn" @click="confirmDownload">确定下载</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import {
		mapState
	} from "vuex";
	export default {
		data() {
			return {
				_id: "",
				type: '',
				detailData: null,
				preDownData: {}
			};
		},
		computed: {
			...mapState(["doc_detail"]),
		},
		onLoad(query) {
			this._id = query._id;
			this.type = query.type
			this.detailData = this.doc_detail;
			this.getDetail();
		},
		onShareAppMessage() {
			return {
				title: `${this.detailData.title}__newbeeppt`,
				desc: '这是我在newbeeppt小程序中分享的ppt课件，欢迎下载使用哦~',
				path: `/pages/detail/detail?_id=${this._id}`,
				imageUrl: `${this.detailData.priview_imgs[0]}?x-oss-process=image/resize,m_fill,w_245,h_60`,
			}
		},
		onShareTimeline() {
			return {
				title: `${this.detailData.title}__newbeeppt`,
				imageUrl: `${this.detailData.priview_imgs[0]}?x-oss-process=image/resize,m_fixed,h_40,w_40`,
			}
		},
		methods: {
			getDetail() {
				let data = {
					_id: this._id
				}
				if(this.type) {
					data.type = this.type
				}
				this.$api
					.get_subject_detail(data)
					.then((res) => {
						const {
							data
						} = res;
						this.detailData = data;
					});
			},
			shareDetail() {
				this.$utils.toast('请在微信小程序中进行分享操作')
			},
			preDownload() {
				let uniIdToken = uni.getStorageSync('uni_id_token') || null
				if(!uniIdToken) {
					return this.$utils.toast('请先登录',() => {
						uni.navigateTo({
							url: `../auth/login/login?id=${this._id}`
						})
					})
				}
				uni.showLoading()
				this.$api.pre_download({
					id: this._id,
					date: this.$utils.getNowDate()
				}).then(res => {
					uni.hideLoading()
					if(res.code === 0) {
						if(res.data.balance < this.detailData.price) { // 不够钱，跳到充值页面
							return this.$utils.toast('账户余额不足，请先充值',() => {
								return uni.navigateTo({
									url: `../recharge/recharge?id=${this._id}`
								})								
							})
						}
						this.preDownData = res.data
						this.$refs.popup.open()
					}
				}).catch(() => {
					uni.hideLoading()
				})
			},
			downloadFunc(url) {
				// #ifdef  H5
					window.open(url,'_self')
				// #endif
				// #ifdef  MP-WEIXIN
				uni.showLoading({
					title: '文件下载中'
				})
				uni.downloadFile({
				    url: url,
				    success: (res) => {
						uni.hideLoading()
				        if (res.statusCode === 200) {
							uni.saveFile({
							  tempFilePath: res.tempFilePath,
							  success: (result) => {
								this.$utils.toast(`文件保存在${result.savedFilePath},请注意查看！`, null , 3000)
							  }
							});
				        }
				    }
				});
				// #endif
				uni.$emit('update_doc_status') // 更新列表下载次数
			},
			confirmDownload() {
				this.$refs.popup.close()
				uni.showLoading()
				let data = {
					id: this._id,
					coins: this.detailData.price,
					is_free: this.preDownData.is_free,
					date: this.$utils.getNowDate()
				}
				if(this.type) {
					data.type = this.type
				}
				this.$api.confirm_download(data).then(res => {
					if(res.code === 0) {
						uni.hideLoading()
						this.downloadFunc(res.data.download_url)
					}
				}).catch(() => {
					uni.hideLoading()
				})
			}
		},
	};
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
		.down-info {
			margin-bottom: 10px;
			text-align: center;
			color: #333;
			font-size: 14px;
			&.free {
				color: #999;
				margin-bottom: 25px;
			}
			.is-free {
				color: #30b33a;
			}
			.need-pay {
				color: $base-color;
			}
		}
		.btn {
			height: 36px;
			line-height: 36px;
			font-size: 16px;
			text-align: center;
			color: #fff;
			border-radius: 36px;
			@include base-bg;
		}
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
					&.free {
						color: #30b33a;
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
					.share {
						background-color: transparent;
						padding: 0;
						line-height: inherit;
						&::after {
							border: none;
						}
					}

					.share,
					.collect {
						position: relative;
						display: flex;
						flex-direction: column;
						margin-right: 25px;

						.icons {
							position: inherit;
						}

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
					@include base-bg;
				}
			}
		}
	}
</style>
