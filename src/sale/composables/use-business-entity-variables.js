import { computed, reactive, ref } from 'vue'

export default function useBusinessEntityVariables() {
  const filteredInfo = ref()
  const sortedInfo = ref()

  const columnsBusinessEntity = computed(() => {
    const filtered = filteredInfo.value || {}
    const sorted = sortedInfo.value || {}

    return [
      {
        title: 'ITEM',
        dataIndex: 'index',
        key: 'index',
        width: '50px',
        className: 'column-center',
      },
      {
        title: 'RUC/DNI',
        dataIndex: 'identityNumber',
        width: '140px',
      },
      {
        title: 'NOMBRE',
        dataIndex: 'name',
        key: 'name',
        filteredValue: filtered.name || null,
        onFilter: (value, record) => record.name.includes(value),
        sorter: (a, b) => a.name.charCodeAt(0) - b.name.charCodeAt(0),
        sortOrder: sorted.columnKey === 'name' ? sorted.order : 'ascend',
        sortDirections: ['ascend'],
      },
      {
        title: 'DIRECCIÓN',
        dataIndex: 'address',
      },
      {
        title: 'ACCIONES',
        dataIndex: 'action',
        key: 'action',
        width: '140px',
        className: 'column-center',
      },
    ]
  })

  const rules = reactive({
    identityNumber: [
      {
        required: true,
        message: 'Debe ingresar RUC/DNI',
      },
    ],
    name: [
      {
        required: true,
        message: 'Debe ingresar nombre',
      },
    ],
    address: [
      {
        message: 'Debe ingresar nombre',
      },
    ],
  })

  const handleChange = (pagination, filters, sorter) => {
    filteredInfo.value = filters
    sortedInfo.value = sorter
  }

  return {
    rules,
    columnsBusinessEntity,
    handleChange,
  }
}
