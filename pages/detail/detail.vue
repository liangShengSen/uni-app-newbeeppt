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
			<image :src="detailData.priview_imgs" mode="widthFix"></image>
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
						<uni-icons size="22" type="redo"></uni-icons>
						<view class="text">分享</view>
					</button>
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
				<uni-icons type="closeempty" color="#999" size="20" class="close-icon" @click="closeModal"></uni-icons>
				<view class="down-info" v-if="preDownData.is_free || detailData.price === 0">本次下载：<text
						class="is-free">免费</text></view>
				<view class="down-info" v-else>下载需要：<text class="need-pay">{{detailData.price}} P豆</text></view>
				<view class="down-info">账户余额：{{preDownData.balance}} P豆</view>
				<view class="down-info free">首次下载后15天内可免费重复下载</view>
				<view class="down-info email"><span class="red" @click="jump">完善邮箱信息👈</span>稍后会收到资料下载地址</view>
				<view class="btn" @click="confirmDownload">确定下载</view>
			</view>
		</uni-popup>
		<uni-popup ref="successPopup" type="center">
			<view class="modal-content">
				<uni-icons type="closeempty" color="#999" size="20" class="close-icon" @click="closeModal"></uni-icons>
				<view class="success-wrap">
					<view class="iconfont icon-yunongtongcaozuochenggong success-icon"></view>
					<text class="success-text">下载成功</text>
					<text class="success-tips">复制下方链接地址到手机浏览器下载即可</text>
					<view class="link-wrap">{{downloadUrl}}</view>
					<view class="copy-btn" id="copy-btn" @click="copyLink">复制</view>
				</view>
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
				preDownData: {},
				downloadUrl: ''
			};
		},
		computed: {
			...mapState(["doc_detail"]),
		},
		onLoad(query) {
			this._id = query._id;
			this.detailData = this.doc_detail;
			this.getDetail();
		},
		onShareAppMessage() {
			return {
				title: `${this.detailData.title}__newbeeppt`,
				desc: '这是我在newbeeppt小程序中分享的ppt课件，欢迎下载使用哦~',
				path: `/pages/detail/detail?_id=${this._id}`,
				imageUrl: `${this.detailData.cover_img}?x-oss-process=image/resize,m_fill,w_245,h_60`,
			}
		},
		onShareTimeline() {
			return {
				title: `${this.detailData.title}__newbeeppt`,
				imageUrl: `${this.detailData.cover_img}?x-oss-process=image/resize,m_fixed,h_40,w_40`,
			}
		},
		methods: {
			jump(){
				uni.navigateTo({
					url: '../personal/personal'
				})
			},
			showSuccessDialog(url) {
				this.downloadUrl = url;
				this.$refs.successPopup.open()
			},
			copyLink() {
				uni.setClipboardData({
					data: this.downloadUrl,
					success: () => {
						uni.hideToast(); // 隐藏默认提示信息
						this.closeModal();
						uni.showToast({
							title: '链接已复制',
						});
					}
				});
			},
			closeModal() {
				this.$refs.popup.close()
				this.$refs.successPopup.close()
			},
			getDetail() {
				this.$api
					.get_detail({
						_id: this._id
					})
					.then((res) => {
						const {
							data
						} = res;
						this.detailData = data;
					});
			},
			preDownload() {
				let uniIdToken = uni.getStorageSync('uni_id_token') || null
				if (!uniIdToken) {
					return this.$utils.toast('请先登录', () => {
						uni.navigateTo({
							url: `../auth/login/login`
						})
					})
				}
				this.$utils.showLoading('加载中')
				this.$api.pre_download({
					_id: this._id,
					date: this.$utils.getNowDate()
				}).then(res => {
					uni.hideLoading()
					if (res.code === 0) {
						if (!res.data.is_free && res.data.balance < this.detailData.price) { // 不够钱，跳到充值页面
							return this.$utils.toast('账户余额不足，请先充值', () => {
								return uni.navigateTo({
									url: `../recharge/recharge`
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
			confirmDownload() {
				this.$refs.popup.close()
				this.$utils.showLoading('下载中')
				let data = {
					_id: this._id,
					source_id: this.detailData.source_id,
					coins: this.detailData.price,
					is_free: this.preDownData.is_free,
					date: this.$utils.getNowDate()
				}
				this.$api.confirm_download(data).then(res => {
					if (res.code === 0) {
						uni.hideLoading()
						uni.$emit('update_doc_status') // 更新列表下载次数
						this.showSuccessDialog(res.data.download_url)
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
		position: relative;
		background-color: #fff;
		border-radius: 4px;
		width: 90%;
		margin: 0 auto;
		padding: 20px;
		box-sizing: border-box;

		.success-wrap {
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;

			.success-icon {
				color: #07c160;
				font-size: 60px;
				margin-bottom: 10px;
			}

			.success-text {
				font-size: 16px;
				color: #333;
				margin-bottom: 20px;
			}

			.success-tips {
				font-size: 14px;
				color: #999;
				margin-bottom: 10px;
			}

			.link-wrap {
				width: 232px;
				height: 32px;
				line-height: 32px;
				text-align: center;
				padding: 0 10px;
				color: #999;
				font-size: 12px;
				background-color: #f2f2f2;
				border-radius: 4px;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}

			.copy-btn {
				width: 150px;
				height: 36px;
				line-height: 36px;
				border-radius: 36px;
				text-align: center;
				margin-top: 30px;
				color: #fff;
				@include base-bg;
			}
		}

		.close-icon {
			position: absolute;
			right: 10px;
			top: 5px;
		}

		.down-info {
			margin-bottom: 10px;
			text-align: center;
			color: #333;
			font-size: 16px;

			&.free {
				color: #999;
				font-size: 14px;
				margin-bottom: 5px;
			}

			.red {
				color: red;
			}

			&.email {
				color: #999;
				font-size: 14px;
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
			font-size: 18px;
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
			font-size: 20px;
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
				font-size: 14px;
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
				font-size: 18px;
				font-weight: 800;
				color: #333;
			}

			.attr-list {
				margin-top: 5px;

				.attr-list_item {
					margin-top: 10px;
					font-size: 16px;
					color: #666;
				}
			}

			.detail-intro {
				font-size: 16px;
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
			height: 60px;
			padding: 7px 0 6px;
			box-sizing: border-box;
			border-top: 1px solid #f1f1f1;
			background-color: #fff;
			z-index: 50;
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
						margin-right: 35px;

						.icons {
							position: inherit;
						}

						.text {
							font-size: 14px;
							color: #666;
						}
					}
				}

				.content-right {
					width: 120px;
					height: 38px;
					line-height: 38px;
					text-align: center;
					font-size: 16px;
					color: #fff;
					border-radius: 20px;
					@include base-bg;
				}
			}
		}
	}
</style>
