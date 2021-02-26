<template>
	<view class="label">
		<view class="label-box">
			<view class="label-header">
				<view class="label-title">我的学科</view>
				<view class="label-edit" @click="editSubject">
					{{is_edit ? '完成':'编辑'}}
				</view>
			</view>
			<uni-load-more v-if="loading" status="loading" iconType="snow"></uni-load-more>
			<view v-if="!loading" class="label-content">
				<view class="label-content_item" v-for="(item,index) in subjectList" :key="item._id">
					{{item.name}}
					<uni-icons v-if="is_edit" type="clear" size="16" color="red" class="icons-close" @click="del(index)"></uni-icons>
				</view>
				<view v-if="subjectList.length === 0 && !loading" class="no-data">
					当前没有数据
				</view>
			</view>
		</view>
		<view class="label-box">
			<view class="label-header">
				<view class="label-title">学科推荐</view>
			</view>
			<uni-load-more v-if="loading" status="loading" iconType="snow"></uni-load-more>
			<view v-if="!loading" class="label-content">
				<view class="label-content_item" v-for="(item,index) in list" :key="item._id" @click="add(index)">
					{{item.name}}
				</view>
				<view v-if="list.length === 0 && !loading" class="no-data">
					当前没有数据
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				is_edit: false,
				subjectList: [],
				list: [],
				loading: true
			}
		},
		onLoad() {
			this.getSubjects()
		},
		methods: {
			editSubject() {
				if (this.is_edit) {
					this.is_edit = false
					this.setUpdateSubject(this.subjectList)
				} else {
					this.is_edit = true
				}
			},
			add(i) {
				if (!this.is_edit) return
				this.subjectList.push(this.list[i])
				this.list.splice(i, 1)
			},
			del(i) {
				this.list.push(this.subjectList[i])
				this.subjectList.splice(i, 1)
			},
			setUpdateSubject(subject_ids) {
				uni.showLoading()
				this.$api.update_subject({
					subject_ids: subject_ids.map(item => {
						return item._id
					})
				}).then(res => {
					uni.hideLoading()
					if (res.code === 0) {
						uni.$emit('subjectChange')
						this.$utils.toast(res.msg, () => {
							uni.switchTab({
								url: '/pages/tabBar/home/home'
							})
						})
					}
				}).catch(() => {
					uni.hideLoading()
				})
			},
			getSubjects() {
				this.loading = true
				this.$api.get_subjects({
					type: 'all'
				}).then(res => {
					this.loading = false
					const {
						data
					} = res
					this.subjectList = data.filter(item => {
						return item.current
					})
					this.list = data.filter(item => {
						return !item.current
					})
				})
			},

		}
	}
</script>

<style lang="scss">
	page {
		background-color: #f5f5f5;
	}

	.label {
		.no-data {
			width: 100%;
			text-align: center;
			padding: 50px 0;
			color: #999;
			font-size: 14px;
		}

		.label-box {
			background-color: #fff;
			margin-bottom: 10px;

			.label-header {
				display: flex;
				justify-content: space-between;
				padding: 10px 15px;
				font-size: 14px;
				color: #666;
				border-bottom: 1px solid #f5f5f5;

				.label-edit {
					color: #30b33a;
					font-weight: bold;
				}
			}

			.label-content {
				display: flex;
				flex-wrap: wrap;
				padding: 15px;
				padding-top: 0;

				.label-content_item {
					position: relative;
					padding: 2px 5px;
					margin: 12px 10px 0 0;
					border-radius: 5px;
					border: 1px solid #666;
					font-size: 14px;
					color: #666;

					.icons-close {
						position: absolute;
						right: -8px;
						top: -8px;
						background-color: #fff;
						border-radius: 50%;
					}
				}
			}
		}
	}
</style>
