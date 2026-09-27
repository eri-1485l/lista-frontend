import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('jwt_token') || null)
  const username = ref(localStorage.getItem('jwt_username') || null)

  function getTokenExpiration(t) {
    try {
      const payload = JSON.parse(atob(t.split('.')[1]))
      return payload.exp * 1000
    } catch {
      return null
    }
  }

  const isExpired = computed(() => {
    if (!token.value) return true
    const exp = getTokenExpiration(token.value)
    if (!exp) return true
    return Date.now() >= exp
  })

  function setToken(newToken, newUsername) {
    token.value = newToken
    username.value = newUsername
    localStorage.setItem('jwt_token', newToken)
    localStorage.setItem('jwt_username', newUsername)
  }

  function logout() {
    token.value = null
    username.value = null
    localStorage.removeItem('jwt_token')
    localStorage.removeItem('jwt_username')
  }

  return { token, username, isExpired, setToken, logout }
})