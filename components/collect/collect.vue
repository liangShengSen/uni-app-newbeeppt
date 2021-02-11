<template>
	<view class="icons" @click.stop="collecting">
		<uni-icons size="20" :type="isCollect ? 'heart-filled' : 'heart'"></uni-icons>
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
			},
			collect: {
				type: Boolean,
				default: false
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
				this.$api.collect_documents({
					document_id: this.item._id
				}).then(res => {
					uni.hideLoading()
					if(res.code === 0) {
						this.isCollect = !this.isCollect
						uni.showToast({
							title: this.isCollect ? '收藏成功' : '取消收藏',
							icon: 'none'
						})
						// 更新列表收藏状态
						if(this.isDetail) {
							uni.$emit('update_doc_status')
						}
						// 更新收藏列表
						if(this.collect) {
							uni.$emit('update_collected', {
								id: this.item._id
							})							
						}
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
