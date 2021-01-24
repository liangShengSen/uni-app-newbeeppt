<template>
	<list-scroll class="list-scroll" @loadmore="loadmore">
		<list-card :item="item" v-for="item in documents" :key="item._id"></list-card>
		<uni-load-more v-if="documents.length == 0 || documents.length > 9" :status="load.loading" iconType="snow"></uni-load-more>
	</list-scroll>
</template>

<script>
	export default {
		props:{
			documents:{
				type: Array,
				default() {
					return []
				}
			},
			load:{
				type:Object,
				default(){
					return {
						loading: 'loading'
					}
				}
			}
		},
		methods:{
			loadmore() {
				this.$emit('loadmore')
			}
		}
	}
</script>

<style>
	.list-scroll {
		width: 100%;
	}
</style>
