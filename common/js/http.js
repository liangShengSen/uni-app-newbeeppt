export default function $http(options) {
	const { url, data } = options
	const dataParams = {
		user_id: '600d7452b2f9d8000148f779',
		...data
	}
	return new Promise((resolve,reject) => {
		uniCloud.callFunction({
			name: url,
			data: dataParams
		}).then(res => {
			if(res.result.code === 200) {
				resolve(res.result)
			}else{
				reject(res.result)
			}
		}).catch(err => {
			reject(err)
		})
	})
}