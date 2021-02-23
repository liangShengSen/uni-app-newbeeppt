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

export const get_search = (data) => {
	return $http({
		url: 'get_search',
		data
	})
}

export const update_subject = (data) => {
	return $http({
		url: 'update_subject',
		data
	})
}

export const documentFilters = (data) => {
	return $http({
		url: 'document_filters',
		data
	})
}

export const getBanners = (data) => {
	return $http({
		url: 'get_banners',
		data
	})
}