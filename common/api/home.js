import $http from '../js/http.js'

export const get_subjects = (data) => {
	return $http({
		url: 'get_subjects',
		data
	})
}

export const get_documents = (data) => {
	return $http({
		url: 'get_documents',
		data
	})
}

export const collect_documents = (data) => {
	return $http({
		url: 'collecting',
		data
	})
}