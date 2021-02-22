<template>
	<view class="category">
		<navbar type="category" title="分类"></navbar>
		<view class="stages">
			<view v-for="(item,i) in stages" :key="item.id" :class="['stage-item', stage_id === item.id ? 'active' : '']" @click="toggle('stage_id',item.id)">{{item.name}}</view>
		</view>
		<view class="category-content">
			<scroll-view scroll-y class="category-content_left">
				<view class="subjects">
					<view v-for="item in subjects" :key="item.id" :class="['subject-item',item.id === subject_id ? 'active' : '']"
					 @click="toggle('subject_id',item.id)">{{item.name}}</view>
				</view>
			</scroll-view>
			<scroll-view scroll-y="true" class="category-content_right">
				<view class="version-box">
					<view class="version-item">
						<view class="name">人教部编版</view>
						<view class="item-box">
							<view class="item active">
								<view class="text">一年级上册</view>
							</view>
							<view class="item">
								<view class="text">一年级上册</view>
							</view>
							<view class="item">
								<view class="text">一年级上册</view>
							</view>
							<view class="item">
								<view class="text">一年级上册</view>
							</view>
							<view class="item">
								<view class="text">一年级上册</view>
							</view>
							<view class="item">
								<view class="text">一年级上册</view>
							</view>
						</view>
						<view class="name">章节</view>
						<view class="item-box">
							<view class="item chapter">
								<view class="text">我上学了</view>
							</view>
							<view class="item chapter">
								<view class="text">金木水火土</view>
							</view>
							<view class="item chapter">
								<view class="text">识字一</view>
							</view>
							<view class="item chapter">
								<view class="text">天地人</view>
							</view>
							<view class="item chapter">
								<view class="text">我上学了我上学了</view>
							</view>
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
				stage_id: "1",
				stages: [],
				subject_id: "2",
				subjects: []
			}
		},
		onLoad() {
			this.getFilters()
		},
		methods: {
			toggle(type, id) {
				this[type] = id
			},
			getFilters() {
				uni.showLoading()
				this.$api.documentFilters({
					_keys: 'stage,subject,version,book,chapter',
					stage: '2',
					subject: '2',
					version: '1000',
					book: '10001'
				}).then(res => {
					uni.hideLoading()
					if (res.code === 0) {
						res.data.forEach(item => {
							this[`${item.key}s`] = item.options
						})
					}
				}).catch(err => {
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

				.version-box {
					padding: 0 15px;
					.version-item {
						box-shadow: -5px 0 5px rgba(0,0,0,.01),0 -5px 5px rgba(0,0,0,.01),5px 0 5px rgba(0,0,0,.01),0 5px 5px rgba(0,0,0,.01);
						padding: 5px 10px;
						margin: 10px auto;
						border-radius: 4px;
						.name {
							padding: 5px 0;
							font-size: 13px;
							color: #999;
							font-weight: 400;
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
								border-top: 0;
								border-left: 0;
								&.active .text {
									color: $base-color;
								}
								&.chapter {
									width: auto;
									margin-right: 15px;
								}
								.text {
									width: 100%;
									white-space: nowrap;
									overflow: hidden;
									text-overflow: ellipsis;
									color: #333;
								}
							}
						}
					}
				}
			}
		}
	}
</style>
