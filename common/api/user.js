import $http from '../js/http.js'

export const register = (data) => {
	return $http({
		url: 'register',
		data
	})
}

export const login = (data) => {
	return $http({
		url: 'login',
		data
	})
}

export const get_user = (data) => {
	return $http({
		url: 'get_user',
		data
	})
}