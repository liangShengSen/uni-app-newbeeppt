<template>
	<view class="tabs">
		<scroll-view scroll-x class="tabs-scroll">
			<view class="tabs-scroll_box">
				<view v-for="(item,index) in list" :key="index" @click="toggleTab(item,index)" :class="['tabs-scroll_item',active === index ? 'active' : '']">
					{{item.name}}
				</view>
			</view>
		</scroll-view>
		<view class="tabs-icon" @click="open">
			<uni-icons type="gear" size="26" color="#666"></uni-icons>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			list: {
				type: Array,
				default () {
					return []
				}
			},
			tabIndex:{
				type: Number,
				default: 0
			}
		},
		watch:{
			tabIndex(val) {
				this.active = val
			}
		},
		data() {
			return {
				active: 0
			}
		},
		methods: {
			toggleTab(item, index) {
				this.active = index
				this.$emit('tabs',{
					data: item,
					index
				})
			},
			open() {
				let url = ''
				if(!uni.getStorageSync('uni_id_token')) {
					url = '/pages/auth/login/login'
				}else{
					url = "/pages/home-label/home-label"
				}
				uni.navigateTo({
					url
				})
			}
		}
	}
</script>

<style lang="scss">
	.tabs {
		display: flex;
		width: 100%;
		background-color: #fff;
		border-bottom: 1px solid #f5f5f5;
		box-sizing: border-box;

		.tabs-scroll {
			flex: 1;
			overflow: hidden;

			.tabs-scroll_box {
				display: flex;
				align-items: center;
				flex-wrap: nowrap;
				height: 45px;
				box-sizing: border-box;

				.tabs-scroll_item {
					flex-shrink: 0;
					padding: 0 10px;
					color: #333;
					font-size: 16px;
					&.active {
						color: $base-color;
						font-weight: 500;
					}
				}
			}
		}

		.tabs-icon {
			position: relative;
			display: flex;
			justify-content: center;
			align-items: center;
			width: 45px;

			&::after {
				content: '';
				position: absolute;
				top: 12px;
				bottom: 12px;
				left: 0;
				width: 1px;
				background-color: #ddd;
			}
		}
	}
</style>
