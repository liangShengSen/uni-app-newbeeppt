import $http from '../js/http.js'

export const get_subject_detail = (data) => {
	return $http({
		url: 'get_subject_detail',
		data
	})
}

export const pre_download = (data) => {
	return $http({
		url: 'pre_download',
		data
	})
}

export const confirm_download = (data) => {
	return $http({
		url: 'confirm_download',
		data
	})
}

export const get_recharge = (data) => {
	return $http({
		url: 'get_recharge',
		data
	})
}

export const recharge_pay_cb = (data) => {
	return $http({
		url: 'recharge_pay_callback',
		data
	})
}