import Vue from 'vue'
import Vuex from 'vuex'
import moment from 'moment'

Vue.use(Vuex)

const store = new Vuex.Store({
	// 定义状态
	state: {
		curNow: new Date(),
		initNow: new Date(),
		inittype: false,
	},
	mutations: {
		newCurNow(state, msg) {
			state.curNow = msg
		},
		newInitNow(state, msg) {
			state.initNow = msg
		},
		newInittype(state, msg) {
			state.inittype = msg
		},
	}
})

export default store