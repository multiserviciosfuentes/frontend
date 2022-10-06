import MovementService from '@/inventory/services/movement-service'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMovementStore = defineStore('movement', () => {
  const all = ref([])
  const loading = ref(false)

  const getAll = () => {
    loading.value = true
    return MovementService.getAll()
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

  return {
    all,
    loading,

    getAll,
  }
})
