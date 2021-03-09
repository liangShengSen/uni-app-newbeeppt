<template>
	<view class="home">
		<navbar type="home"></navbar>
		<tabs :list="subjectsList" :tabIndex="tabIndex" @tabs="tabs"></tabs>
		<view class="home-list">
			<list :tabs="subjectsList" :activeIndex="activeIndex" @change="change"></list>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tabIndex: 0,
				activeIndex: 0,
				subjectsList: [],
			}
		},
		onLoad() {
			uni.$on('subjectChange',(res) => {
				this.subjectsList = []
				this.tabIndex = 0
				this.activeIndex = 0
				this.getSubjects()
			})
			this.getSubjects()
		},
		methods: {
			getSubjects() {
				this.$utils.showLoading('加载中')
				this.$api.get_subjects().then(res => {
					const { data } = res
					data.unshift({
						id:"0",
						name:"全部"
					})
					uni.hideLoading()
					this.subjectsList = data
				}).catch(() => {
					uni.hideLoading()
				})
			},
			tabs({data,index}) {
				this.activeIndex = index
			},
			change(current) {
				this.tabIndex = current
				this.activeIndex = current
			}
		}
	}
</script>

<style lang="scss">
	page {
		height: 100%;
		display: flex;
	}
	.home {
		display: flex;
		flex-direction: column;
		flex: 1;
		overflow: hidden;
		.home-list {
			flex: 1;
			box-sizing: border-box;
		}
	}
</style>
