import { reactive, ref } from 'vue'
import { useStore } from 'vuex'
import { message, Modal } from 'ant-design-vue'
import Direct from '@/inventory/models/direct'

import useStores from '@/inventory/composables/use-stores'
import useScaffolds from '@/inventory/composables/use-scaffolds'

const rulesDirect = {
  quantity: [
    {
      required: true,
      message: 'Insertar una cantidad',
    },
  ],
}

export default function useActionDirectModel(directs) {
  const store = useStore()
  const formRef = ref()
  const direct = ref(new Direct(null, null, null, null))

  const { stores } = useStores()
  const { scaffolds } = useScaffolds()

  const formStateDirect = reactive({
    quantity: null,
    store: null,
    scaffold: null,
  })

  const showDirectModel = productId => {
    direct.value = new Direct(null, null, { id: productId })
    store.commit('direct/setVisibleModal')
  }

  const onCancel = () => {
    store.commit('direct/setVisibleModal')
  }

  const onSave = type => {
    formRef.value
      .validate()
      .then(() => {
        direct.value.quantity = formStateDirect.quantity
        direct.value.movement = {
          type: type,
          description: type === 'INPUT' ? 'AGREGADO DIRECTO' : 'REMOVIDO DIRECTO',
          store: formStateDirect.store !== null ? stores.value.filter(x => x.id === formStateDirect.store)[0] : null,
          scaffold:
            formStateDirect.scaffold !== null
              ? scaffolds.value.filter(x => x.id === formStateDirect.scaffold)[0]
              : null,
        }

        store.dispatch('direct/add', direct.value).then(
          () => {
            message.success(type === 'INPUT' ? 'Se agregó al inventario' : 'Se removio del inventario')
            clean()
            store.commit('direct/setVisibleModal')
            store.dispatch('movement/getAll')
          },
          e => {
            Modal.error({
              title: 'Mensaje de error',
              content: e.message,
            })
          }
        )
      })
      .catch(error => {
        console.log('error', error)
      })
  }

  const clean = () => {
    direct.value = new Direct(null, null, null, null)
  }

  return {
    formRef,
    rulesDirect,
    formStateDirect,
    onCancel,
    showDirectModel,
    onSave,
  }
}
