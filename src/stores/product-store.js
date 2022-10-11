import ProductService from '@/catalog/services/product-service'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useMovementStore } from './movement-store'

export const useProductStore = defineStore('product', () => {
  const all = ref([])
  const loading = ref(false)
  const movements = ref([])

  const getAll = () => {
    loading.value = true
    return ProductService.getAll()
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

  const getMovements = productId => {
    loading.value = true
    return ProductService.getMovementsByProductId(productId)
      .then(response => {
        movements.value = response.data
        return Promise.resolve(response.data)
      })
      .catch(e => {
        return Promise.reject(e.message)
      })
      .finally(() => {
        loading.value = false
      })
  }

  const add = product => {
    return ProductService.create(product)
      .then(response => {
        all.value.push(response.data)
        let movementStore = useMovementStore()
        movementStore.getAll()
        return Promise.resolve(response.data)
      })
      .catch(e => {
        return Promise.reject(e.message)
      })
  }

  const update = payload => {
    return ProductService.update(payload.id, payload)
      .then(response => {
        Object.assign(all.value.filter(item => payload.id === item.id)[0], response.data)
        let movementStore = useMovementStore()
        movementStore.getAll()
        return Promise.resolve(response.data)
      })
      .catch(e => {
        return Promise.reject(e.message)
      })
  }

  const remove = id => {
    return ProductService.delete(id)
      .then(response => {
        let index = all.value.findIndex(x => x.id === id)
        if (index !== -1) {
          all.value.splice(index, 1)
        }
        let movementStore = useMovementStore()
        movementStore.getAll()
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
    getMovements,
    add,
    update,
    remove,
  }
})
