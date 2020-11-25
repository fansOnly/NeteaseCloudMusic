const state = {
  name: ''
}


const mutations = {
  UPDATE(state: any, val: string) {
    state.name = val
  }
}

const actions = {
  UPDATE({ commit }, data: string) {
    commit('UPDATE', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
