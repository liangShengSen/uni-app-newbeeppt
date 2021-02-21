<template>
	<view class="category">
		<navbar type="category" title="分类"></navbar>
		<view class="stages">
			<view v-for="(item,i) in stages.slice(0,3)" :key="item.id" :class="['stage-item', stage_id === item.id ? 'active' : '']" @click="toggle('stage_id',item.id)">{{item.name}}</view>
		</view>
		<view class="category-content">
			<scroll-view scroll-y class="category-content_left">
				<view class="subjects">
					<view v-for="item in subjects" :key="item.id" :class="['subject-item',item.id === subject_id ? 'active' : '']" @click="toggle('subject_id',item.id)">{{item.name}}</view>
				</view>
			</scroll-view>
			<scroll-view scroll-y="true" class="category-content_right">
				<view></view>
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
			toggle(type,id) {
				this[type] = id
			},
			getFilters() {
				uni.showLoading()
				this.$api.documentFilters({
					_keys: 'stage,subject,version,book,chapter',
					stage: '1',
					subject: '2',
					version: '1000',
					book: '10001'
				}).then(res => {
					uni.hideLoading()
					if(res.code === 0) {
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
			margin-top: 5px;
			height: calc(100% - 79px);
			/*  #ifdef  MP-WEIXIN  */
			height: calc(100% - 99px);
			/*  #endif  */
			.category-content_left {
				height: 100%;
				.subjects {
					width: 80px;
					height: 100%;
					text-align: center;
					background-color: #f7f7f7;
					.subject-item {
						height: 32px;
						line-height: 32px;
						font-size: 12px;
						color: #333;
						&.active {
							color: $base-color;
							background-color: #fff;
						}
					}
				}
			}
		}
	}
</style>
