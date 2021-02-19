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
	    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, function (c) {
	      return (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16);
	    });
	}

}

export default new Utils()
