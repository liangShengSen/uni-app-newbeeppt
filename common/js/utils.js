class Utils {
	constructor() {}

	toast(title, cb, duration) {
		uni.showToast({
			icon: 'none',
			duration: duration || 1500,
			title,
			success() {
				setTimeout(() => {
					cb && cb()
				}, 1000)
			}
		});
	}

	getNowDate() {
		let now = new Date()
		let yy = now.getFullYear(),
			mm = (now.getMonth() + 1),
			dd = now.getDate()
		return `${yy}-${mm < 10 ? `0${mm}` : mm}-${dd < 10 ? `0${dd}` : dd}`
	}

	guid() {
		const S4 = () => {
			return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
		}
		return S4() + S4() + S4() + S4() + S4() + S4()
	}

}

export default new Utils()
