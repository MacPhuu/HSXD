const getDefaultState = () => {
  return {
    levelList: []
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_BREADCRUMB: (state, levelList) => {
    state.levelList = levelList
  },
}

const actions = {
  setBreadcrumb({ commit }, levelList) {
    commit('SET_BREADCRUMB', levelList)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
