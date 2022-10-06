import { reactive, ref, watch } from 'vue'
import useClients from '@/sale/composables/use-business-entities'

export default function useActionsClientAutocomplete() {
  const clientSelected = ref(null)

  const { businessEntities } = useClients()

  const stateClients = reactive({
    valueClient: undefined,
  })

  const onSearchClient = (input, option) => {
    return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
  }

  const onSelectClient = () => {
    if (stateClients.valueClient !== undefined)
      clientSelected.value = businessEntities.value.filter(x => x.id === parseInt(stateClients.valueClient))[0]
  }

  watch(() => stateClients.valueClient, onSelectClient)

  return {
    stateClients,
    clientSelected,
    onSearchClient,
    onSelectClient,
  }
}
