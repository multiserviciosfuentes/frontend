import { reactive, ref, watch } from 'vue'
import useContacts from '@/sale/composables/use-contacts'

export default function useActionsContactAutocomplete() {
  const contactSelected = ref(null)

  const { contacts } = useContacts()

  const stateContacts = reactive({
    valueContact: undefined,
  })

  const onSearchContact = (input, option) => {
    return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
  }

  const onSelectContact = () => {
    if (stateContacts.valueContact !== undefined)
      contactSelected.value = contacts.value.filter(x => x.id === parseInt(stateContacts.valueContact))[0]
  }

  watch(() => stateContacts.valueContact, onSelectContact)

  return {
    stateContacts,
    contactSelected,
    onSearchContact,
    onSelectContact,
  }
}
