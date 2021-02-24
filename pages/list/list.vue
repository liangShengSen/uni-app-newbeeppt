<template>
	<view class="list">
		<view class="list-hd">
			<view class="filter-icon">
				<text class="text">筛选</text>
				<uni-icons type="gear" size="18" color="#f7931e"></uni-icons>
			</view>
			<view class="current-filter-text">- {{stage.name}}{{grade.name ? `·${grade.name}`: ''}}{{subject.name && `·${subject.name}`}}{{rank_id ? rank_id === '0' ? '·普通' : '·精品' : ''}}{{chapter.name ? `·${chapter.name}` : ''}}
				-</view>
		</view>
		<view class="list-content">
			<list-scroll class="list-scroll" @loadmore="loadmore">
				<list-card v-for="item in documents" :key="item._id" :item="item" type="filter"></list-card>
				<uni-load-more v-if="documents.length == 0 || documents.length > 9" :status="load" iconType="snow"></uni-load-more>
			</list-scroll>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				page: 1,
				stage: {},
				subject: {},
				chapter: {},
				grade: {},
				rank_id: '',
				documents: [],
				load: 'loading'
			}
		},
		onLoad(query) {
			this.stage = JSON.parse(query.stage)
			this.subject = JSON.parse(query.subject)
			this.chapter = JSON.parse(query.chapter)
			this.getFilterDocuments()
		},
		methods: {
			getFilterDocuments() {
				let data = {
					page: this.page
				}
				if (this.chapter && this.chapter.id) {
					data.chapter_id = this.chapter.id
				} else {

				}
				this.load = 'loading'
				this.$api.getFilterDocuments(data).then(res => {
					const {
						code,
						data
					} = res
					if (code === 0) {
						if (data.length === 0) {
							this.load = 'noMore'
							this.$forceUpdate()
							this.page--
							return
						}
						this.documents = [...this.documents, ...res.data]
					}
				})
			},
			loadmore() {
				if (this.load === 'noMore') return
				this.page++
				this.getFilterDocuments()
			}
		}
	}
</script>

<style lang="scss">
	page {
		height: 100%;
		display: flex;
	}

	.list {
		display: flex;
		flex-direction: column;
		flex: 1;
		overflow: hidden;

		.list-hd {
			padding: 10px 0;

			.current-filter-text {
				font-size: 13px;
				color: #f60;
				text-align: center;
			}

			.filter-icon {
				display: flex;
				align-items: center;
				justify-content: flex-end;
				padding: 0 15px;

				.text {
					font-size: 14px;
					color: #f7931e;
					padding-right: 5px;
				}
			}
		}


		.list-content {
			flex: 1;
			box-sizing: border-box;
			height: calc(100% - 60px);

			.list-scroll {
				height: 100%;
			}
		}
	}
</style>
