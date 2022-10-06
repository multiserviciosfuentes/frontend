import { computed, reactive, ref } from 'vue'

export default function useContactVariables() {
  const filteredInfo = ref()
  const sortedInfo = ref()

  const columnsContact = computed(() => {
    const filtered = filteredInfo.value || {}
    const sorted = sortedInfo.value || {}

    return [
      {
        title: 'ITEM',
        dataIndex: 'index',
        key: 'index',
        width: '50px',
        className: 'column-center',
        fixed: true,
      },
      {
        title: 'NOMBRE',
        dataIndex: 'fullName',
        key: 'fullName',
        filteredValue: filtered.fullName || null,
        onFilter: (value, record) => record.fullName.includes(value),
        sorter: (a, b) => a.fullName.charCodeAt(0) - b.fullName.charCodeAt(0),
        sortOrder: sorted.columnKey === 'fullName' ? sorted.order : 'ascend',
        sortDirections: ['ascend'],
      },
      {
        title: 'TELF',
        dataIndex: 'phone',
        width: '120px',
      },
      {
        title: 'CORREO',
        dataIndex: 'email',
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
    fullName: [
      {
        required: true,
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
    columnsContact,
    handleChange,
  }
}
