<template>
	<view class="my-collected">
		<list-scroll class="list-scroll">
			<uni-load-more v-if="loading" status="loading" iconType="snow"></uni-load-more>
			<view v-if="collectedList.length > 0">
				<list-card :item="item" :collect="true" v-for="item in collectedList" :key="item._id"></list-card>
			</view>
			<view v-if="collectedList.length === 0 && !loading" class="no-data">
				暂无数据
			</view>
		</list-scroll>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				loading: false,
				collectedList: []
			}
		},
		created() {
			uni.$on('update_collected', (data) => {
				this.collectedList.forEach((item,i) => {
					if(item._id === data.id) {
						this.collectedList.splice(i,1)
					}
				})
			})
		},
		onLoad() {
			this.getDocuments()
		},
		methods: {
			getDocuments() {
				this.loading = true
				this.$api.getDownloadAndCollected({
					type: 'collected'
				}).then(res => {
					this.loading = false
					if(res.code === 0) {
						this.collectedList = res.data
					}
				}).catch(() => {
					this.loading = false
				})
			}
		}
	}
</script>

<style lang="scss">
	.my-collected {
		.no-data {
			width: 100%;
			height: 100px;
			line-height: 100px;
			text-align: center;
			font-size: 14px;
			color: #999;
		}
	}
</style>
