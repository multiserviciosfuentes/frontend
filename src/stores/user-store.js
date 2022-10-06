import UserService from '@/profile/services/user-service'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user-app', () => {
  const all = ref([])
  const loading = ref(false)

  const getAll = () => {
    loading.value = true
    return UserService.getAll()
      .then(response => {
        all.value = response.data
        return Promise.resolve(response.data)
      })
      .catch(e => {
        return Promise.reject(e.message)
      })
      .finally(() => {
        loading.value = false
      })
  }

  const update = payload => {
    return UserService.update(payload.id, payload)
      .then(response => {
        Object.assign(all.value.filter(item => payload.id === item.id)[0], response.data)
        return Promise.resolve(response.data)
      })
      .catch(e => {
        return Promise.reject(e.message)
      })
  }

  const remove = id => {
    return UserService.delete(id)
      .then(response => {
        let index = all.value.findIndex(x => x.id === id)
        if (index !== -1) {
          all.value.splice(index, 1)
        }
        return Promise.resolve(response)
      })
      .catch(e => {
        return Promise.reject(e.message)
      })
  }

  return {
    all,
    loading,

    getAll,
    update,
    remove,
  }
})
