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

	UUIDGenerator() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = Math.random() * 16 | 0,
				v = c == 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		});
	}

}

export default new Utils()
