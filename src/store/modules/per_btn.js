import { findResByAdmin } from '@/api/admin'
const getDefaultState = () => {
    return {
        per_btn: [],
        resList: []
    }
}

const state = getDefaultState()

const mutations = {
    SET_PER_BTN: (state, per_btn) => {
        state.per_btn = per_btn
    },
    SET_RES_LIST: (state, resList) => {
        state.resList = resList
    }
}

const actions = {
    /**
     * 获取人员权限
     * @param {*} param0 
     * @param {*} token 
     */
    findResByAdmin({ commit }, token) {
        new Promise((resolve, reject) => {
            findResByAdmin(token).then(res => {
                commit("SET_PER_BTN", res.data.perBtn);
                commit("SET_RES_LIST", res.data.resList);
            })
            resolve()
        }).catch(error => {
            reject(error)
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}