import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import per_btn from './modules/per_btn'
Vue.use(Vuex)

const store = new Vuex.Store({
    modules: {
        per_btn
    },
    getters
})
export default store