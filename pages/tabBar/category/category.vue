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
			<scroll-view scroll-y="true" class="category-content_right">
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
									 @click="item.index = i">
										<view class="text">{{book.name}}</view>
									</view>
								</block>
								<view v-else class="empty">暂无版本</view>
							</view>
							<view class="name label">章节</view>
							<view class="chapter-box">
								<block v-if="item.chapters.length && item.chapters[item.index]">
									<view class="chapter-item" v-for="chapter in item.chapters[item.index].options" :key="chapter._id">
										<navigator class="sub-chapter" :url="`/pages/list/list?stage=${JSON.stringify(item.stage)}&subject=${JSON.stringify(item.subject)}&chapter=${JSON.stringify(chapter)}`">{{chapter.name}}</navigator>
									</view>
								</block>
								<view v-else class="empty">暂无章节</view>
							</view>
						</view>
					</block>
					<view v-if="stages.length && !versions.length" class="empty-box">
						<svg t="1614781358764" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5406"
						 width="64" height="64">
							<path d="M855.6 427.2H168.5c-12.7 0-24.4 6.9-30.6 18L4.4 684.7C1.5 689.9 0 695.8 0 701.8v287.1c0 19.4 15.7 35.1 35.1 35.1H989c19.4 0 35.1-15.7 35.1-35.1V701.8c0-6-1.5-11.8-4.4-17.1L886.2 445.2c-6.2-11.1-17.9-18-30.6-18zM673.4 695.6c-16.5 0-30.8 11.5-34.3 27.7-12.7 58.5-64.8 102.3-127.2 102.3s-114.5-43.8-127.2-102.3c-3.5-16.1-17.8-27.7-34.3-27.7H119c-26.4 0-43.3-28-31.1-51.4l81.7-155.8c6.1-11.6 18-18.8 31.1-18.8h622.4c13 0 25 7.2 31.1 18.8l81.7 155.8c12.2 23.4-4.7 51.4-31.1 51.4H673.4zM819.9 209.5c-1-1.8-2.1-3.7-3.2-5.5-9.8-16.6-31.1-22.2-47.8-12.6L648.5 261c-17 9.8-22.7 31.6-12.6 48.4 0.9 1.4 1.7 2.9 2.5 4.4 9.5 17 31.2 22.8 48 13L807 257.3c16.7-9.7 22.4-31 12.9-47.8zM375.4 261.1L255 191.6c-16.7-9.6-38-4-47.8 12.6-1.1 1.8-2.1 3.6-3.2 5.5-9.5 16.8-3.8 38.1 12.9 47.8L337.3 327c16.9 9.7 38.6 4 48-13.1 0.8-1.5 1.7-2.9 2.5-4.4 10.2-16.8 4.5-38.6-12.4-48.4zM512 239.3h2.5c19.5 0.3 35.5-15.5 35.5-35.1v-139c0-19.3-15.6-34.9-34.8-35.1h-6.4C489.6 30.3 474 46 474 65.2v139c0 19.5 15.9 35.4 35.5 35.1h2.5z"
							 p-id="5407" fill="#dbdbdb"></path>
						</svg>
						<view class="empty-tips">
							暂无数据
						</view>
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
				}
				this.getFilters()
			},
			getFilters() {
				let data = {
					_keys: 'stage,subject,version',
					stage: this.stage_id,
					subject: this.subject_id
				}
				uni.showLoading()
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
			height: 30px;

			.stage-item {
				position: relative;
				margin-right: 35px;
				color: #666;
				font-size: 13px;
				line-height: 30px;

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
					font-size: 15px;

					&::after {
						background-color: $base-color;
					}
				}
			}
		}

		.category-content {
			display: flex;
			margin-top: 5px;
			height: calc(100% - 79px);
			/*  #ifdef  MP-WEIXIN  */
			height: calc(100% - 99px);

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
						height: 36px;
						line-height: 36px;
						font-size: 12px;
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
							font-size: 13px;
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
								font-size: 12px;
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
								}
							}
						}

						.chapter-box {
							.chapter-item {
								display: inline-block;
								font-size: 12px;
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
