import ContactService from '@/sale/services/contact-service'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useContactStore = defineStore('contact', () => {
  const all = ref([])
  const loading = ref(false)

  const getAll = () => {
    loading.value = true
    return ContactService.getAll()
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

  const add = contact => {
    return ContactService.create(contact)
      .then(response => {
        all.value.push(response.data)
        return Promise.resolve(response.data)
      })
      .catch(e => {
        return Promise.reject(e.message)
      })
  }

  const update = payload => {
    return ContactService.update(payload.id, payload)
      .then(response => {
        Object.assign(all.value.filter(item => payload.id === item.id)[0], response.data)
        return Promise.resolve(response.data)
      })
      .catch(e => {
        return Promise.reject(e.message)
      })
  }

  const remove = id => {
    return ContactService.delete(id)
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
    add,
    update,
    remove,
  }
})
