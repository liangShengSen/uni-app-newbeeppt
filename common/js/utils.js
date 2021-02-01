class Utils {
  constructor() {}
  
  toast(title,cb) {
  	uni.showToast({
  		icon: 'none',
		duration: 1500,
  		title,
		success() {
			setTimeout(() => {
				cb && cb()
			},1000)
		}
  	});
  }
  
}

export default new Utils()