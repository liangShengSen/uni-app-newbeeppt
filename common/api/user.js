import $http from '../js/http.js'

export const login = (data) => {
	return $http({
		url: 'login',
		data
	})
}

export const logout = () => {
	return $http({
		url: 'logout'
	})
}

export const register = (data) => {
	return $http({
		url: 'register',
		data
	})
}

export const getVerifyCode = (data) => {
	return $http({
		url: 'get_verify',
		data
	})
}

export const getUserInfo = () => {
	return $http({
		url: 'get_userInfo'
	})
}

export const updateUserInfo = (data) => {
	return $http({
		url: 'update_user',
		data
	})
}

export const setUserAvatar = (data) => {
	return $http({
		url: 'set_avatar',
		data
	})
}

export const getDownloadAndCollected = (data) => {
	return $http({
		url: 'get_download_collected',
		data
	})
}

export const createRechargeRecord = (data) => {
	return $http({
		url: 'create_recharge_order',
		data
	})
}

export const getRechargeOrders = () => {
	return $http({
		url: 'get_recharge_records'
	})
}

export const loginByWeixin = (data) => {
	return $http({
		url: 'login_by_weixin',
		data
	})
}