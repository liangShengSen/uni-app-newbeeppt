<template>
	<view class="category">
		<navbar type="category" title="分类"></navbar>
		<view class="stages">
			<view v-for="(item,i) in stages" :key="item._id" :class="['stage-item', stage_id === item._id ? 'active' : '']"
			 @click="toggle('stage_id',item._id)">{{item.name}}</view>
		</view>
		<view class="category-content">
			<scroll-view scroll-y class="category-content_left">
				<view class="subjects" v-if="subjects.length">
					<view v-for="item in subjects" :key="item._id" :class="['subject-item',item._id === subject_id ? 'active' : '']"
					 @click="toggle('subject_id',item._id)">{{item.name}}</view>
				</view>
			</scroll-view>
			<scroll-view scroll-y="true" class="category-content_right" :scroll-top="scrollTop">
				<view class="banner-box">
					<swiper class="swiper" :indicator-dots="true" :autoplay="true" :duration="1000" indicator-color="rgba(255, 255, 255, .8)"
					 indicator-active-color="#ffbb69">
						<swiper-item v-for="banner in banners" :key="banner._id">
							<image :src="banner.img" mode="aspectFill" class="image"></image>
						</swiper-item>
					</swiper>
				</view>
				<view class="version-box">
					<block v-if="versions.length">
						<view class="version-item" v-for="item in versions" :key="item._id">
							<view class="name">{{item.name}}</view>
							<view class="item-box">
								<block v-if="item.books.length">
									<view v-for="(book,i) in item.books" :key="book._id" :class="['item', item.index === i ? 'active' : '']"
									 @click="toggleBooks(item,i)">
										<view class="text">{{book.name}}</view>
									</view>
								</block>
								<view v-else class="empty">暂无版本</view>
							</view>
							<view class="name label">章节</view>
							<view class="chapter-box">
								<block v-if="item.chapters.length && item.chapters[item.index]">
									<scroll-view scroll-y="true" class="scroll-box">
										<view class="chapter-item" v-for="chapter in item.chapters[item.index].options" :key="chapter._id">
											<navigator class="sub-chapter" :url="`/pages/list/list?stage=${JSON.stringify(item.stage)}&subject=${JSON.stringify(item.subject)}&chapter=${JSON.stringify(chapter)}`">{{chapter.name}}</navigator>
										</view>											
									</scroll-view>
								</block>
								<view v-else class="empty">暂无章节</view>
							</view>
						</view>
					</block>
					<view v-if="stages.length && !versions.length" class="empty-box">
						<view class="iconfont icon-kong"></view>
						<view class="empty-tips">暂无数据</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				scrollTop: 0,
				stage_id: "",
				subject_id: "",
				stages: [],
				subjects: [],
				versions: [],
				banners: []
			}
		},
		onLoad() {
			this.getFilters()
			this.getBanners()
		},
		methods: {
			toggle(type, id) {
				this[type] = id
				if (type === 'stage_id') {
					this.subject_id = this.subjects[0]._id
					this.scrollTop = Math.random()
				}
				this.getFilters()
			},
			toggleBooks(item,i) {
				item.index = i
			},
			getFilters() {
				let data = {
					_keys: 'stage,subject,version',
					stage: this.stage_id,
					subject: this.subject_id
				}
				this.$utils.showLoading('加载中')
				this.$api.documentFilters(data).then(res => {
					uni.hideLoading()
					if (res.code === 0) {
						res.data.forEach(item => {
							if (item.key === 'version') {
								item.options.forEach(version => {
									version.index = 0
								})
							}
							this[`${item.key}s`] = item.options
							this[`${item.key}_id`] = item.value
						})
					}
				}).catch(err => {
					uni.hideLoading()
				})
			},
			getBanners() {
				this.$api.getBanners({
					position: 'category'
				}).then(res => {
					if (res.code === 0) {
						this.banners = res.data
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		height: 100%;
	}

	.category {
		height: 100%;

		.stages {
			display: flex;
			align-items: center;
			padding: 0 15px;
			height: 40px;

			.stage-item {
				position: relative;
				margin-right: 35px;
				color: #666;
				font-size: 14px;
				height: 40px;
				line-height: 40px;

				&::after {
					position: absolute;
					bottom: 0px;
					left: 50%;
					margin-left: -9px;
					content: '';
					width: 18px;
					height: 2px;
					border-radius: 2px;
					background-color: transparent;
				}

				&.active {
					color: #333;
					font-size: 16px;

					&::after {
						background-color: $base-color;
					}
				}
			}
		}

		.category-content {
			display: flex;
			margin-top: 5px;
			height: calc(100% - 89px);
			/*  #ifdef  MP-WEIXIN  */
			height: calc(100% - 109px);

			/*  #endif  */
			.category-content_left {
				height: 100%;
				width: 100px;

				.subjects {
					width: 100%;
					min-height: 100%;
					text-align: center;
					background-color: #f7f7f7;

					.subject-item {
						height: 42px;
						line-height: 42px;
						font-size: 14px;
						color: #333;
						transition: all ease-in-out .2s;

						&.active {
							color: $base-color;
							background-color: #fff;
						}
					}
				}
			}

			.category-content_right {
				.banner-box {
					border-radius: 6px;
					margin: 0 15px 17px;
					overflow: hidden;
					height: calc((2000vw - 1980px)/64);

					.swiper {
						height: 100%;
					}

					.image {
						height: calc((2000vw - 1980px)/64);
						width: 100%;
						border-radius: 6px;
					}
				}

				.empty-box {
					padding: 80px 0;
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					.icon-kong {
						font-size: 50px;
						color: #ddd;
					}
					.empty-tips {
						margin-top: 20px;
						color: #ddd;
						font-size: 14px;
					}
				}

				.version-box {
					padding: 0 15px;

					.empty {
						color: #ddd;
						font-size: 12px;
						text-align: center;
						line-height: 24px;
					}

					.version-item {
						box-shadow: -5px 0 5px rgba(0, 0, 0, .01), 0 -5px 5px rgba(0, 0, 0, .01), 5px 0 5px rgba(0, 0, 0, .01), 0 5px 5px rgba(0, 0, 0, .01);
						padding: 5px 10px;
						margin: 10px auto;
						border-radius: 4px;

						.name {
							padding: 5px 0;
							font-size: 16px;
							color: #000;
							font-weight: 500;

							&.label {
								font-weight: normal;
								margin-bottom: 5px;
							}
						}

						.item-box {
							font-size: 0;
							letter-spacing: 0;

							.item {
								display: inline-block;
								font-size: 14px;
								width: (100% / 3);
								height: 28px;
								line-height: 28px;
								overflow: hidden;
								text-overflow: ellipsis;
								white-space: nowrap;
								text-align: center;

								&.active .text {
									color: $base-color;
								}

								.text {
									width: 100%;
									white-space: nowrap;
									overflow: hidden;
									text-overflow: ellipsis;
									color: #666;
									font-size: 15px;
								}
							}
						}

						.chapter-box {
							height: 250px;
							.scroll-box {
								height: 100%;
							}
							.chapter-item {
								display: inline-block;
								font-size: 14px;
								height: 28px;
								line-height: 28px;
								margin-right: 15px;
								color: #666;
								padding: 0 5px;
							}
						}
					}
				}
			}
		}
	}
</style>
