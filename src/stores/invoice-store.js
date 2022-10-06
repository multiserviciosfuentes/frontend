import InvoiceService from '@/sale/services/invoice-service'
import UserService from '@/profile/services/user-service'
import { useMovementStore } from '@/stores/movement-store'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useInvoiceStore = defineStore('invoice', () => {
  const all = ref([])
  const loading = ref(false)

  const getAll = () => {
    loading.value = true
    return InvoiceService.getAll()
      .then(response => {
        all.value = response.data
        let movementStore = useMovementStore()
        movementStore.getAll()
        return Promise.resolve(response.data)
      })
      .catch(e => {
        return Promise.reject(e.message)
      })
      .finally(() => {
        loading.value = false
      })
  }

  const getInvoicesByUserId = id => {
    loading.value = true
    return UserService.getInvoicesByUserId(id)
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

  const add = invoice => {
    return InvoiceService.create(invoice)
      .then(response => {
        all.value.push(response.data)
        return Promise.resolve(response.data)
      })
      .catch(e => {
        return Promise.reject(e.message)
      })
  }

  const update = payload => {
    return InvoiceService.update(payload.id, payload)
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

  const patch = payload => {
    return InvoiceService.patch(payload.id, payload)
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
    return InvoiceService.delete(id)
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
    getInvoicesByUserId,
    add,
    update,
    remove,
    patch,
  }
})
