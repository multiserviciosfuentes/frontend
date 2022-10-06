import UnitOfMeasurementService from '@/catalog/services/unit-of-measurement-service'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUnitOfMeasurementStore = defineStore('unit_of_measurement', () => {
  const all = ref([])
  const loading = ref(false)

  const getAll = () => {
    loading.value = true
    return UnitOfMeasurementService.getAll()
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

  const add = unitOfMeasurement => {
    return UnitOfMeasurementService.create(unitOfMeasurement)
      .then(response => {
        all.value.push(response.data)
        return Promise.resolve(response.data)
      })
      .catch(e => {
        return Promise.reject(e.message)
      })
  }

  const update = payload => {
    return UnitOfMeasurementService.update(payload.id, payload)
      .then(response => {
        Object.assign(all.value.filter(item => payload.id === item.id)[0], response.data)
        return Promise.resolve(response.data)
      })
      .catch(e => {
        return Promise.reject(e.message)
      })
  }

  const remove = id => {
    return UnitOfMeasurementService.delete(id)
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
