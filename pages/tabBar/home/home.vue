<template>
	<view class="home">
		<navbar></navbar>
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
			this.getSubjects()
		},
		methods: {
			getSubjects() {
				this.$api.get_subjects({
					name: 'get_subjects'
				}).then(res => {
					const { data } = res
					data.unshift({
						id:"0",
						name:"全部"
					})
					this.subjectsList = data
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
