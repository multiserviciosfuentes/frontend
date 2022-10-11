import DirectService from '@/inventory/services/direct-service'
import { useMovementStore } from '@/stores/movement-store'
import { defineStore } from 'pinia'

export const useDirectStore = defineStore('direct', () => {
  const add = direct => {
    return DirectService.create(direct)
      .then(response => {
        let movementStore = useMovementStore()
        movementStore.getAll()
        return Promise.resolve(response.data)
      })
      .catch(e => {
        return Promise.reject(e.message)
      })
  }

  const remove = id => {
    return DirectService.delete(id)
      .then(response => {
        let movementStore = useMovementStore()
        movementStore.getAll()
        return Promise.resolve(response)
      })
      .catch(e => {
        return Promise.reject(e.message)
      })
  }

  return {
    add,
    remove,
  }
})
