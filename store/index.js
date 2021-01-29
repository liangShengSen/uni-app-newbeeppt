import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state:{
		historyList: uni.getStorageSync("_history") || [],
		doc_detail: null
	},
	mutations:{
		SET_HISTORY_LIST(state,history) {
			state.historyList = history
		},
		CLEAR_HISTORY(state) {
			state.historyList = []
		},
		SET_DOC_DETAIL(state,detail) {
			state.doc_detail = detail
		}
	},
	actions:{
		set_history({commit,state},history){
			let list = state.historyList
			list.unshift(history)
			uni.setStorageSync('_history',list)
			commit('SET_HISTORY_LIST',list)
		},
		clear_history({commit}){
			uni.removeStorageSync('_history')
			commit('CLEAR_HISTORY')
		},
		set_detail({commit,state},detail){
			commit('SET_DOC_DETAIL',detail)
		},
	}
})

export default store