<template>
	<view class="search">
		<navbar :isSearch="true" v-model="value" @input="change"></navbar>
		<view class="search-list">
			<view v-if="is_history" class="label-box">
				<view class="label-header">
					<text class="label-title">搜索历史</text>
					<text class="label-clear" @click="clear">清空</text>
				</view>
				<view class="label-content" v-if="historyList.length > 0">
					<view class="label-content_item" v-for="(item,index) in historyList" :key="index" @click="openHistory(item)">
						{{item.name}}
					</view>
				</view>
				<view class="no-data" v-else>
					没有搜索历史
				</view>
			</view>
			<list-scroll v-else class="list-scroll">
				<uni-load-more v-if="loading" status="loading" iconType="snow"></uni-load-more>
				<view v-if="searchList.length > 0">
					<list-card :item="item" v-for="item in searchList" :key="item._id" @click="setHistory"></list-card>
				</view>
				<view v-if="searchList.length === 0 && !loading" class="no-data">
					没搜索到相关数据
				</view>
			</list-scroll>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	export default {
		data() {
			return {
				value: '',
				is_history: true,
				searchList: [],
				loading: false,
			}
		},
		computed:{
			...mapState(['historyList'])
		},
		methods: {
			setHistory() {
				this.$store.dispatch('set_history',{
					name: this.value
				})
			},
			openHistory(item) {
				this.value = item.name
				this.getSearch(this.value)
			},
			clear() {
				this.$store.dispatch('clear_history')
				uni.showToast({
					title: '清空完成'
				})
			},
			change(value) {
				if(!value) {
					clearTimeout(this.timer)
					this.mark = false
					this.getSearch(value)
					return
				}
				if(!this.mark) {
					this.mark = true
					this.timer = setTimeout(() => {
						this.mark = false
						this.getSearch(value)
					},1000)
				}
			},
			getSearch(value) {
				if(!value) {
					this.searchList = []
					this.is_history = true
					return
				}
				this.is_history = false
				this.loading = true
				this.$api.get_search({
					value
				}).then(res => {
					let { data } = res
					this.loading = false
					this.searchList = data
				}).catch(() => {
					this.loading = false
				})
			},
		}
	}
</script>

<style lang="scss">
	page {
		display: flex;
		height: 100%;
		background-color: #f5f5f5;
	}

	.search {
		display: flex;
		flex-direction: column;
		flex: 1;

		.label-box {
			background-color: #fff;
			margin-bottom: 10px;

			.label-header {
				display: flex;
				justify-content: space-between;
				font-size: 14px;
				color: #666;
				padding: 10px 15px;
				border-bottom: 1px solid #f5f5f5;

				.label-title {
					color: $base-color;
				}

				.label-clear {
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
					padding: 2px 10px;
					margin-top: 12px;
					margin-right: 10px;
					border-radius: 5px;
					border: 1px solid #666;
					font-size: 14px;
					color: #666;
				}
			}
		}
		.no-data {
			width: 100%;
			height: 100px;
			line-height: 100px;
			text-align: center;
			font-size: 12px;
			color: #999;
		}
	}
</style>
