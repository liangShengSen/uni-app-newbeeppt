<template>
	<view class="category">
		<navbar type="category" title="分类"></navbar>
		<view class="stages">
			<view v-for="(item,i) in stages" :key="item.id" :class="['stage-item', stage_id === item.id ? 'active' : '']" @click="toggle('stage_id',item.id)">{{item.name}}</view>
		</view>
		<view class="category-content">
			<scroll-view scroll-y class="category-content_left">
				<view class="subjects" v-if="subjects.length">
					<view v-for="item in subjects" :key="item.id" :class="['subject-item',item.id === subject_id ? 'active' : '']"
					 @click="toggle('subject_id',item.id)">{{item.name}}</view>
				</view>
			</scroll-view>
			<scroll-view scroll-y="true" class="category-content_right">
				<view class="banner-box">
					<swiper class="swiper" :indicator-dots="true" :autoplay="true" :duration="1000" indicator-color="rgba(255, 255, 255, .8)" indicator-active-color="#ffbb69">
						<swiper-item v-for="banner in banners" :key="banner._id">
							<image :src="banner.img" mode="aspectFill" class="image"></image>
						</swiper-item>
					</swiper>
				</view>
				<view class="version-box">
					<view class="version-item" v-for="item in versions" :key="item.id">
						<view class="name">{{item.name}}</view>
						<view class="item-box">
							<block v-if="item.books.length">
								<view v-for="(book,i) in item.books" :key="book.id" :class="['item', item.book_id === book.id ? 'active' : '']"
								 @click="toggleBook(item,book,i)">
									<view class="text">{{book.name}}</view>
								</view>
							</block>
							<view v-else class="empty">暂无版本</view>
						</view>
						<view class="name label">章节</view>
						<view class="chapter-box">
							<block v-if="item.chapters[item.index] && item.chapters[item.index].data.length">
								<view class="chapter" v-for="chapter in item.chapters[item.index].data" :key="chapter.id">
									<view class="main-chapter">{{chapter.name}}</view>
									<view class="sub-chapters-box">
										<navigator class="sub-chapter" v-for="sub_chapter in chapter.allChildren" :key="sub_chapter.id" :url="`/pages/list/list?stage=${JSON.stringify(item.stage)}&subject=${JSON.stringify(item.subject)}&chapter=${JSON.stringify(sub_chapter)}`">{{sub_chapter.name}}</navigator>
									</view>
								</view>
							</block>
							<view v-else class="empty">暂无章节</view>
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
					this.subject_id = '2'
				}
				this.getFilters()
			},
			toggleBook(item, book, i) {
				item.book_id = book.id
				item.index = i
			},
			sortTreeData(Data, level = 0) {
				let T, F
				for (F = Data.length; F;) {
					T = Data[--F]
					T['level'] = level + 1
					if (T['level'] == 1) {
						let childrens = this.getTreeChilds(T['children'], [])
						T['allChildren'] = [...T['children'], ...childrens]
					}
					if (T['children'].length) {
						this.sortTreeData(T['children'], T['level'])
					}
				}
				return Data
			},
			getTreeChilds(treeData, arr = []) {
				for (let i = 0; i < treeData.length; i++) {
					if (treeData[i].children && treeData[i].children.length) {
						arr.push(...treeData[i].children)
						this.getTreeChilds(treeData[i].children, arr)
					}
				}
				return arr
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
									version.chapters.forEach(chapter => {
										chapter.data = this.sortTreeData(chapter.data)
									})
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
							.chapter {
								background-color: #fff;
								.main-chapter {
									background-color: #f9f9f9;
									font-size: 12px;
									color: #666;
									padding: 6px 8px;
									border-radius: 3px;
								}
								.sub-chapters-box {
									padding: 8px 5px;
									.sub-chapter {
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
		}
	}
</style>