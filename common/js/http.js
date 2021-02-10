export default function $http(options) {
	const { url, data } = options
	return new Promise((resolve,reject) => {
		uniCloud.callFunction({
			name: url,
			data
		}).then(res => {
			if(res.result.code === 0) {
				resolve(res.result)
			}else{
				if([30201,30202,30203,30204].includes(res.result.code)) { // token过期
					uni.showToast({
						icon:'none',
						title: res.result.msg,
						success: () => {
							uni.removeStorageSync('uni_id_token')
						}
					})
					setTimeout(() => {
						uni.navigateTo({
							url: '/pages/auth/login/login'
						})
					},1500)
				}
				reject(res.result)
			}
		}).catch(err => {
			reject(err)
		})
	})
}