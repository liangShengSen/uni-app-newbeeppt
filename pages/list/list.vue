<template>
	<view class="list">
		<view class="list-hd">
			<view class="filter-icon" @click="showFilterModal">
				<text class="text">筛选</text>
				<view class="iconfont icon-shaixuan"></view>
			</view>
			<view class="current-filter-text">- {{stage.name}}{{grade.name ? `·${grade.name}`: ''}}{{subject.name && `·${subject.name}`}}{{rank.name ? `·${rank.name}`: ''}}{{chapter.name ? `·${chapter.name}` : ''}}
				-</view>
		</view>
		<view class="list-content">
			<list-scroll class="list-scroll" @loadmore="loadmore">
				<list-card v-for="item in documents" :key="item._id" :item="item" type="filter"></list-card>
				<uni-load-more v-if="documents.length == 0 || documents.length > 9" :status="load" iconType="snow"></uni-load-more>
			</list-scroll>
		</view>
		<uni-popup ref="popup" type="center">
			<view class="modal-content">
				<uni-icons type="closeempty" color="#999" size="20" class="close-icon" @click="closeModal"></uni-icons>
				<list-scroll class="list-scroll">
					<view class="title-text">学段</view>
					<view class="item-box">
						<view v-for="item in stages" :key="item._id" :class="['item', item._id === stage._id ? 'active' : '']" @click="toggleFilter('stage',item)">{{item.name}}</view>
					</view>
					<view class="title-text">年级</view>
					<view class="item-box">
						<view v-for="item in grades" :key="item._id" :class="['item', item._id === grade._id ? 'active' : '']" @click="toggleFilter('grade',item)">{{item.name}}</view>
					</view>
					<view class="title-text">学科</view>
					<view class="item-box">
						<view v-for="item in subjects" :key="item._id" :class="['item', item._id === subject._id ? 'active' : '']" @click="toggleFilter('subject',item)">{{item.name}}</view>
					</view>
					<view class="title-text">等级</view>
					<view class="item-box">
						<view v-for="item in ranks" :key="item.id" :class="['item', item.id === rank.id ? 'active' : '']" @click="toggleFilter('rank',item)">{{item.name}}</view>
					</view>					
				</list-scroll>
				<view class="btn-box">
					<view class="btn cancel" @click="closeModal">取消</view>
					<view class="btn submit" @click="confirm">确定</view>
				</view>
			</view>
		</uni-popup>
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
				stages: [],
				subjects: [],
				grades: [],
				ranks: [{
						id: "0",
						name: "普通"
					},
					{
						id: "1",
						name: "精品"
					}
				],
				rank: {},
				documents: [],
				load: 'loading'
			}
		},
		created() {
			uni.$on('update_doc_status', () => {
				this.documents = []
				this.getFilterDocuments()
			})	
		},
		onLoad(query) {
			this.stage = JSON.parse(query.stage)
			this.subject = JSON.parse(query.subject)
			this.chapter = JSON.parse(query.chapter)
			this.getFilterDocuments()
			this.getFilters('stage,subject,grade')
		},
		methods: {
			getFilters(_keys,flag) {
				let data = {
					stage: this.stage._id,
					subject: this.subject._id,
					_keys
				}
				this.$api.documentFilters(data).then(res => {
					if (res.code === 0) {
						res.data.forEach(item => {
							this[`${item.key}s`] = item.options
							this[`${item.key}`]['_id'] = item.value
							if(flag && item.key === 'grade') {
								this[`${item.key}`] = item.options[0]
							}
						})
					}
				})
			},
			toggleFilter(type,item) {
				this[type] = item
				if(type === 'stage') {
					this.getFilters('subject,grade', 1)
				}
			},
			getFilterDocuments() {
				let data = {
					page: this.page
				}
				if (this.chapter && this.chapter.value) {
					data.chapter_id = this.chapter.value
				} else {
					data.stage_id = this.stage._id
					data.subject_id = this.subject._id
					data.grade_id = this.grade._id
					data.rank_id = this.rank.id
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
			},
			showFilterModal() {
				this.$refs.popup.open()
			},
			closeModal() {
				this.$refs.popup.close()
			},
			confirm() {
				this.page = 1
				this.chapter = {}
				this.documents = []
				this.getFilterDocuments()
				this.closeModal()
			}
		}
	}
</script>

<style lang="scss">
	page {
		height: 100%;
		display: flex;
	}

	.modal-content {
		position: relative;
		background-color: #fff;
		border-radius: 4px;
		width: 90%;
		margin: 0 auto;
		box-sizing: border-box;
		overflow: hidden;
		padding-top: 30px;

		.close-icon {
			position: absolute;
			right: 10px;
			top: 5px;
		}

		.title-text {
			font-size: 13px;
			color: #999;
			padding: 13px 15px;
			&:first-child {
				padding-top: 0;
			}
		}

		.item-box {
			display: flex;
			flex-wrap: wrap;
			justify-content: stretch;
			padding: 0 15px;
			transition: all .3s;
			overflow: hidden;
			width: 100%;
			box-sizing: border-box;

			.item {
				height: 32px;
				background: #f4f4f4;
				border-radius: 3px;
				line-height: 32px;
				text-align: center;
				font-size: 14px;
				position: relative;
				white-space: nowrap;
				padding: 0 8px;
				box-sizing: border-box;
				overflow: hidden;
				text-overflow: ellipsis;
				margin-bottom: 8px;
				margin-right: 10px;

				&.active {
					color: #fff;
					background: #f7931e;
				}
			}
		}

		.btn-box {
			display: flex;
			align-items: center;
			justify-content: space-around;
			padding: 0 15px;
			margin: 10px 0;

			.btn {
				flex: 1;
				height: 40px;
				border-radius: 6px;
				color: #fff;
				font-size: 16px;
				text-align: center;
				line-height: 40px;

				&.cancel {
					background-color: #f7931e;
					margin-right: 10px;
				}

				&.submit {
					background-color: #ff6b00;
					margin-left: 10px;
				}
			}

		}
	}

	.list {
		display: flex;
		flex-direction: column;
		flex: 1;
		overflow: hidden;

		.list-hd {
			padding: 10px 0;

			.current-filter-text {
				font-size: 16px;
				color: #f60;
				text-align: center;
			}

			.filter-icon {
				display: flex;
				align-items: center;
				justify-content: flex-end;
				padding: 0 15px;
				.icon-shaixuan {
					font-size: 20px;
					color: #f7931e;
				}
				.text {
					font-size: 16px;
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
