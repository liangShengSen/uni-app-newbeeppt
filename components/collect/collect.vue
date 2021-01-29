<template>
	<view class="icons" @click.stop="collecting">
		<uni-icons size="20" color="#f07373" :type="isCollect ? 'heart-filled' : 'heart'"></uni-icons>
	</view>
</template>

<script>
	export default {
		props:{
			item:{
				type:Object,
				default() {
					return {}
				}
			},
			isDetail: {
				type: Boolean,
				default: null
			}
		},
		data() {
			return {
				isCollect: false
			};
		},
		watch:{
			item(val) {
				this.isCollect = this.item.is_collect
			}
		},
		created() {
			this.isCollect = this.item.is_collect
		},
		methods:{
			collecting() {
				uni.showLoading()
				this.isCollect = !this.isCollect
				this.$api.collect_documents({
					user_id: '600d7452b2f9d8000148f779',
					document_id: this.item._id
				}).then(res => {
					uni.hideLoading()
					uni.showToast({
						title: this.isCollect ? '收藏成功' : '取消收藏',
						icon: 'none'
					})
					// 更新列表收藏状态
					if(this.isDetail) {
						uni.$emit('update_doc_status')
					}
				}).catch(() => {
					uni.hideLoading()
				})
			},
			
		}
	}
</script>

<style lang="scss">
	.icons {
		position: absolute;
		right: 0;
		top: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 20px;
		height: 20px;
	}
</style>
