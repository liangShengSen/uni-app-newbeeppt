import $http from '../js/http.js'

export const get_subject_detail = (data) => {
	return $http({
		url: 'get_subject_detail',
		data
	})
}