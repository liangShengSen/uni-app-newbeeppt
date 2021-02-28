<template>
	<view class="my-download">
		<list-scroll class="list-scroll">
			<uni-load-more v-if="loading" status="loading" iconType="snow"></uni-load-more>
			<view v-if="downloadList.length > 0">
				<list-card :item="item" :download="true" v-for="(item,i) in downloadList" :key="i"></list-card>
			</view>
			<view v-if="downloadList.length === 0 && !loading" class="no-data">
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
				downloadList: []
			}
		},
		onLoad() {
			this.getDocuments()
		},
		methods: {
			getDocuments() {
				this.loading = true
				this.$api.getDownloadAndCollected({
					type: 'download'
				}).then(res => {
					this.loading = false
					if (res.code === 0) {
						this.downloadList = res.data
					}
				}).catch(() => {
					this.loading = false
				})
			}
		}
	}
</script>

<style lang="scss">
	.my-download {
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
