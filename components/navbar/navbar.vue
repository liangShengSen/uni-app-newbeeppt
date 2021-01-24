<template>
	<view class="navbar">
		<view class="navbar-fixed">
			<view :style="{height: `${statusBarHeight}px`}"></view>
			<view class="navbar-content" :style="{height: `${navbarHeight}px`,width: `${windowWidth}px`}">
				<view class="navbar-search">
					<view class="navbar-search_icon">
						<uni-icons type="search" size="16" color="#999"></uni-icons>
					</view>
					<view class="navbar-search_text">vue</view>
				</view>							
			</view>
		</view>
		<view :style="{height: `${navbarHeight + statusBarHeight}px`}"></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				statusBarHeight: 20,
				navbarHeight:44,
				windowWidth: 375,
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
			background-color: $base-color;
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
						font-size: 12px;
						color: #999;
					}
				}				
			}
		}
	}
</style>
