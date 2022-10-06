import AuthService from '@/auth/service/auth-service'
import { useUserStore } from './user-store'
import tokenService from '@/auth/service/token-service'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { ERole } from '@/shared/enums'

export const useAuthUserStore = defineStore('auth', () => {
  const user = JSON.parse(localStorage.getItem('user'))

  const status = user ? ref({ loggedIn: true }) : ref({ loggedIn: false })
  const userCurrent = user ? ref(user) : ref(null)

  const roles = computed(() => {
    if (userCurrent.value !== null) {
      let result = []
      userCurrent.value.roles.forEach(element => {
        switch (element) {
          case ERole.admin:
            result.push('Administrador')
            break
          case ERole.moderator:
            result.push('Moderador')
            break
          default:
            result.push('Usuario')
        }
      })
      return result
    } else return null
  })

  const login = user => {
    return AuthService.login(user)
      .then(response => {
        userCurrent.value = response
        status.value.loggedIn = true
        return Promise.resolve(response)
      })
      .catch(error => {
        status.value.loggedIn = false
        return Promise.reject(error.message)
      })
  }

  const logout = () => {
    return AuthService.logout()
      .then(response => {
        return Promise.resolve(response.data)
      })
      .catch(err => {
        console.log(err)
        return Promise.reject(err.message)
      })
      .finally(() => {
        status.value.loggedIn = false
        userCurrent.value = null
        tokenService.removeUser()
      })
  }

  const register = user => {
    const userStore = useUserStore()
    return AuthService.register(user)
      .then(response => {
        // status.value.loggedIn = false
        userStore.all.push(response.data)
        return Promise.resolve(response.data)
      })
      .catch(err => {
        // status.value.loggedIn = false
        return Promise.reject(err)
      })
  }

  const refreshToken = accessToken => {
    status.value.loggedIn = true
    userCurrent.value = { ...userCurrent.value, accessToken: accessToken }
  }

  return {
    status,
    userCurrent,
    roles,

    login,
    logout,
    register,
    refreshToken,
  }
})
