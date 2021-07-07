<template>
	<view class="personal">
		<view class="section">
			<view class="personal-item">
				<text class="text">头像</text>
				<view class="right">
					<view class="content" @click="setUserAvatar">
						<image class="image" v-if="userInfo.avatar" :src="userInfo.avatar" mode="aspectFill"></image>
						<text v-else>未设置</text>
					</view>
					<uni-icons type="arrowright" size="14" color="#999"></uni-icons>
				</view>
			</view>
			<view class="personal-item" @click="showModal('nickname')">
				<text class="text">昵称</text>
				<view class="right">
					<view class="content">{{userInfo.nickname || '未设置'}}</view>
					<uni-icons type="arrowright" size="14" color="#999"></uni-icons>
				</view>
			</view>
			<view class="personal-item">
				<text class="text">性别</text>
				<view class="right">
					<view class="content">
						<picker class="gender-picker" @change="bindPickerChange" :value="userInfo.gender" :range="genderArr" range-key="name">
							<view class="uni-input">{{genderArr[userInfo.gender].name}}</view>
						</picker>
					</view>
					<uni-icons type="arrowright" size="14" color="#999"></uni-icons>
				</view>
			</view>
		</view>
		<view class="section">
			<view class="personal-item">
				<text class="text">手机绑定</text>
				<view class="right" @click="showModal('mobile')">
					<view class="content">{{userInfo.mobile || '未设置'}}</view>
					<uni-icons type="arrowright" size="14" color="#999"></uni-icons>
				</view>
			</view>
			<view class="personal-item">
				<text class="text">邮箱绑定</text>
				<view class="right" @click="showModal('email')">
					<view class="content">{{userInfo.email || '未设置'}}</view>
					<uni-icons type="arrowright" size="14" color="#999"></uni-icons>
				</view>
			</view>
		</view>
		<uni-popup ref="popup" type="center">
			<view class="modal-content">
				<view class="form-item" v-if="formType === 'nickname'">
					<view class="label">昵称：</view>
					<input class="input" focus type="text" v-model="userInfo.nickname" placeholder="请输入昵称" />
				</view>
				<view class="form-item" v-if="formType === 'email'">
					<view class="label">邮箱：</view>
					<input class="input" focus type="text" v-model="userInfo.email" placeholder="请输入邮箱" />
				</view>
				<view class="form-item" v-if="formType === 'mobile'">
					<view class="label">手机：</view>
					<input class="input" focus type="text" v-model="userInfo.mobile" placeholder="请输入手机" />
				</view>
				<view class="btn" @click="updateUser">确定</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import {
		PHONE,
		EMAIL
	} from '@/common/js/regx.js'
	export default {
		data() {
			return {
				formType: '',
				userInfo: {
					username: '',
					nickname: '',
					gender: 0,
					mobile: '',
					email: '',
				},
				genderArr: [{
						name: "未设置",
						value: 0
					},
					{
						name: "男",
						value: 1
					},
					{
						name: "女",
						value: 2
					}
				]
			}
		},
		created() {
			this.getUserInfo()
		},
		methods: {
			showModal(type) {
				this.formType = type
				this.$refs.popup.open()
			},
			bindPickerChange(e) {
				this.userInfo.gender = e.detail.value
				this.$utils.showLoading('加载中')
				this.$api.updateUserInfo({
					gender: this.userInfo.gender
				}).then(res => {
					if (res.code === 0) {
						uni.hideLoading()
						this.$utils.toast(res.msg)
					}
				})
			},
			getUserInfo() {
				let uniIdToken = uni.getStorageSync('uni_id_token') || ''
				if (uniIdToken && !this.userInfo._id) {
					this.$utils.showLoading('加载中')
					this.$api.getUserInfo().then(res => {
						uni.hideLoading()
						if (res.code === 0) {
							this.userInfo = Object.assign(this.userInfo, res.userInfo)
						} else {
							this.$utils.toast(res.msg)
						}
					}).catch(err => {
						uni.hideLoading()
					})
				}
			},
			updateUser() {
				if (this.userInfo.mobile && !PHONE.test(this.userInfo.mobile)) {
					return this.$utils.toast('请输入正确的手机号')
				}
				if (this.userInfo.email && !EMAIL.test(this.userInfo.email)) {
					return this.$utils.toast('请输入正确的邮箱')
				}
				let data = {
					nickname: this.userInfo.nickname,
					gender: this.userInfo.gender,
					mobile: this.userInfo.mobile,
					email: this.userInfo.email
				}
				this.$refs.popup.close()
				this.$utils.showLoading('加载中')
				this.$api.updateUserInfo(data).then(res => {
					if (res.code === 0) {
						uni.hideLoading()
						this.$utils.toast(res.msg)
					}
				}).catch(err => {
					uni.hideLoading()
				})
			},
			setUserAvatar() {
				uni.chooseImage({
					count: 1,
					success: async (res) => {
						let fileExtension = res.tempFilePaths[0].substring(res.tempFilePaths[0].lastIndexOf('.') + 1);
						const filePath = res.tempFilePaths[0],
							fileName = res.tempFiles[0].name || (new Date().getTime() + '.' + fileExtension)
						this.$utils.showLoading('上传中')
						const result = await uniCloud.uploadFile({
							filePath: filePath,
							cloudPath: fileName
						});
						if (result.success) {
							this.$api.setUserAvatar({
								avatar: result.fileID
							}).then(res => {
								uni.hideLoading()
								this.userInfo.avatar = result.fileID
								this.$forceUpdate()
								if (res.code === 0) {
									this.$utils.toast(res.msg)
								}
							})
						}
					}
				});
			}
		}
	}
</script>

<style lang="scss">
	page {
		height: 100%;
	}

	.modal-content {
		background-color: #fff;
		border-radius: 4px;
		width: 90%;
		margin: 0 auto;
		padding: 20px;
		box-sizing: border-box;

		.form-item {
			display: flex;
			align-items: center;
			margin-bottom: 20px;

			.label {
				color: #999;
				font-size: 14px;
			}

			.input {
				width: 85%;
				font-size: 14px;
				color: #333;
				padding: 5px 0;
				border-bottom: 1px solid #f5f5f5;
			}
		}

		.btn {
			height: 36px;
			line-height: 36px;
			font-size: 16px;
			text-align: center;
			color: #fff;
			border-radius: 36px;
			@include base-bg;
		}
	}

	.personal {
		height: 100%;
		background-color: #eee;
		overflow: hidden;

		.section {
			margin-top: 10px;
			background-color: #fff;

			.personal-item {
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin: 0 15px;

				&+.personal-item {
					border-top: 1px solid #f5f5f5;
				}

				.text {
					color: #666;
					font-size: 16px;
				}

				.right {
					width: 80%;
					display: flex;
					align-items: center;

					.content {
						display: flex;
						align-items: center;
						justify-content: flex-end;
						width: 100%;
						height: 50px;
						padding-right: 10px;
						font-size: 16px;
						color: #999;

						.gender-picker {
							width: 100%;
							text-align: right;
						}

						.image {
							width: 40px;
							height: 40px;
							border-radius: 40px;
							border: 1px solid #f5f5f5;
						}
					}
				}
			}
		}
	}
</style>
