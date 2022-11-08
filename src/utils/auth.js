import config from '@/utils/config'

const TOKEN_KEY = config.tokenKey
const PERMISSION_KEY = config.permissionKey
const USER_KEY = config.userKey

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  return localStorage.setItem(TOKEN_KEY, token)
}

export function removeToken() {
  return localStorage.removeItem(TOKEN_KEY)
}

export function setPermission(data) {
  return localStorage.setItem(PERMISSION_KEY, data)
}

export function getPermission() {
  return localStorage.getItem(PERMISSION_KEY)
}

export function removePermission() {
  return localStorage.removeItem(PERMISSION_KEY)
}

export function setUserInfo(data) {
  return localStorage.setItem(USER_KEY, JSON.stringify({
    userId: data._id,
    username: data.username,
    name: data.name,
    avatar: data.avatar,
    projectId: data.projectId,
    roleProject: data.roleProject,
    changePasswordAt: data.changePasswordAt,
    token: data.token
  }))
}

export function getUserInfo() {
  return localStorage.getItem(USER_KEY) ? JSON.parse(localStorage.getItem(USER_KEY)) : {}
}
