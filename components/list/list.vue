<template>
	<swiper class="home-swiper" :current="activeIndex" @change="change">
		<swiper-item v-for="(item,index) in tabs" :key="index" class="swiper-item">
			<list-item :documents="docsCatchData[index]" :load="load[index]" @loadmore="loadmore"></list-item>
		</swiper-item>
	</swiper>
</template>

<script>
	import listItem from './list-item.vue'
	export default {
		props:{
			tabs:{
				type: Array,
				default(){
					return []
				}
			},
			activeIndex:{
				type:Number,
				default: 0
			}
		},
		components:{
			listItem
		},
		data() {
			return {
				documents: [],
				docsCatchData:{},
				load:{},
				pageSize: 10
			};
		},
		watch: {
			tabs(val) {
				if(val.length === 0) return
				this.getDocuments(this.activeIndex)
			}
		},
		methods:{
			change(e) {
				const { current } = e.detail
				this.$emit('change',current)
				// TODO 当数据不存在或者长度是0的情况才去请求数据
				if(!this.docsCatchData[current] || this.docsCatchData[current].length === 0) {
					this.getDocuments(current)
				}
			},
			getDocuments(current) {
				if(!this.load[current]) {
					this.load[current] = {
						page:1,
						loading: "loading"
					}
				}
				this.$api.get_documents({
					id: this.tabs[current].id,
					page: this.load[current].page,
					pageSize: this.pageSize
				}).then(res => {
					let { data } = res
					if(data.length === 0) {
						let oldLoad = {}
						oldLoad.loading = 'noMore'
						oldLoad.page = this.load[current].page
						this.$set(this.load,current,oldLoad)
						this.$forceUpdate()
						return
					}
					let oldData = this.docsCatchData[current] || []
					oldData.push(...data)
					this.$set(this.docsCatchData,current,oldData)
				})
			},
			loadmore() {
				if(this.load[this.activeIndex].loading === 'noMore') return
				this.load[this.activeIndex].page++
				this.getDocuments(this.activeIndex)
			}
		}
	}
</script>

<style lang="scss">
	.home-swiper {
		height: 100%;
		.swiper-item {
			height: 100%;
			overflow: hidden;
			.list-scroll {
				height: 100%;
			}
		}
	}
</style>
