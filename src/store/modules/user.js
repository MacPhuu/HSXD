import {getToken, setToken, removeToken, setUserInfo} from '@/utils/auth'
import {resetRouter} from '@/router'
import UserAPI from '@/api/auth/user'
import config from '@/utils/config'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    userInfo: {},
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_USER_INFO: (state, data) => {
    state.userInfo = data
    setUserInfo(data)
  },
  SET_CHECK_CONTRACTOR(state, data) {
    localStorage.setItem(config.checkContractorKey, data)
  }
}

const actions = {
  // user login
  // login({commit}, userInfo) {
  //   const {username, password} = userInfo
  //   return new Promise((resolve, reject) => {
  //     UserAPI.login({username: username.trim(), password: password}).then(response => {
  //       commit('SET_TOKEN', response.token)
  //       commit('SET_USER_INFO', response)
  //       setToken(response.token)
  //       resolve()
  //     }).catch(error => {
  //       reject(error)
  //     })
  //   })
  // },

  login({commit}, data) {
    return new Promise((resolve, reject) => {
      UserAPI.loginStep2(data).then(response => {
        commit('SET_TOKEN', response.token)
        commit('SET_USER_INFO', response)
        setToken(response.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  loginContractor({commit}, data) {
    return new Promise((resolve, reject) => {
      UserAPI.loginStep2Bidding(data).then(response => {
        commit('SET_TOKEN', response.token)
        commit('SET_USER_INFO', response)
        commit('SET_CHECK_CONTRACTOR', response.checkContractor)
        setToken(response.token)
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({commit, state}) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const {data} = response

        if (!data) {
          return reject('Verification failed, please Login again.')
        }

        const {name, avatar} = data

        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({commit, state}) {
    return new Promise((resolve, reject) => {
      removeToken() // must remove  token  first
      resetRouter()
      commit('RESET_STATE')
      localStorage.removeItem(config.userKey)
      resolve()
    })
  },

  // remove token
  resetToken({commit}) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

