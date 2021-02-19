<template>
	<view class="navbar">
		<view :class="['navbar-fixed',type === 'auth' ? 'bg-none':'']">
			<view :style="{height: `${statusBarHeight}px`}"></view>
			<view class="navbar-content" :class="type === 'search' ? 'is-search':`${(type === 'auth' || type === 'recharge') ? 'is-auth' : ''}`" :style="{height: `${navbarHeight}px`,width: `${windowWidth}px`}" @click.stop="open">
				<view class="navbar-content_search-icons" v-if="type === 'search' || type === 'auth' || type === 'recharge'" @click="back">
					<uni-icons type="back" size="24" color="#fff"></uni-icons>
				</view>
				<view v-if="type === 'home'" class="navbar-search">
					<view class="navbar-search_icon">
						<uni-icons type="search" size="16" color="#999"></uni-icons>
					</view>
					<view class="navbar-search_text">PPT课件</view>
				</view>	
				<view v-if="type === 'search'" class="navbar-search">
					<input class="navbar-search_text" type="text" v-model="val" placeholder="请输入您要搜索的内容" @input="inputChange"/>
				</view>
				<view v-if="type === 'auth' || type === 'recharge'" class="auth-box">
					<text class="auth-title">{{title}}</text>
				</view>
			</view>
		</view>
		<view :style="{height: `${navbarHeight + statusBarHeight}px`}"></view>
	</view>
</template>

<script>
	export default {
		props:{
			value:{
				type: [String,Number],
				default: ''
			},
			type:{
				type: String,
				default: 'home'
			},
			title: {
				type: String,
				default: '登录'
			}
		},
		watch:{
			value(val) {
				this.val = val
			}
		},
		data() {
			return {
				statusBarHeight: 20,
				navbarHeight:44,
				windowWidth: 375,
				val: ''
			};
		},
		created() {
			// 状态栏高度
			const info = uni.getSystemInfoSync()
			this.statusBarHeight = info.statusBarHeight
			this.windowWidth = info.windowWidth
			// #ifndef H5 || APP-PLUS || MP-ALIPAY
			// 胶囊位置
			const menuButtonInfo = uni.getMenuButtonBoundingClientRect()
			// #ifndef MP-WEIXIN
				this.navbarHeight = (menuButtonInfo.bottom - info.statusBarHeight) + (menuButtonInfo.top - info.statusBarHeight)
			// #endif
			this.windowWidth = menuButtonInfo.left
			// #endif
		},
		methods:{
			open() {
				if(this.type === 'search') return
				uni.navigateTo({
					url: '/pages/search/search'
				})
			},
			inputChange(e) {
				const {  value } = e.detail
				this.$emit('input',value)
			},
			back() {
				if(this.type === 'search') {
					uni.switchTab({
						url: '../../pages/tabBar/home/home'
					})	
				}else {
					uni.navigateBack({
						delta:1
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	.navbar {
		.navbar-fixed {
			position: fixed;
			top: 0;
			left: 0;
			z-index: 99;
			width: 100%;
			@include base-bg;
			&.bg-none {
				background-color: transparent;
			}
			.navbar-content {
				display: flex;
				align-items: center;
				justify-content: center;
				padding: 0 15px;
				box-sizing: border-box;
				.navbar-search {
					display: flex;
					align-items: center;
					width: 100%;
					height: 32px;
					border-radius: 32px;
					padding: 0 10px;
					background-color: #fff;
					.navbar-search_icon {
						margin-right: 10px;
					}
					.navbar-search_text {
						font-size: 14px;
						color: #999;
						width: 100%;
					}
				}	
				&.is-search {
					padding-left: 0;
					.navbar-content_search-icons {
						margin: 0 8px;
					}
					.navbar-search {
						border-radius: 5px;
					}
				}
				&.is-auth {
					justify-content: flex-start;
					.auth-box {
						width: calc(100% - 50px);
						text-align: center;
						.auth-title {
							color: #fff;
							font-size: 15px;
							/*  #ifdef  MP-WEIXIN  */
							padding-left: 90px; // 胶囊的宽度
							/*  #endif  */
						}
					}
				}
			}
		}
	}
</style>
