import _ from 'lodash'
import { message, Modal } from 'ant-design-vue'
import { computed, createVNode, reactive, ref } from 'vue'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'

export default function useActionsProduct(products) {
  const filteredInfo = ref()
  const sortedInfo = ref()

  const columnsProduct = computed(() => {
    const filtered = filteredInfo.value || {}
    const sorted = sortedInfo.value || {}

    return [
      {
        title: 'ITEM',
        dataIndex: 'index',
        key: 'index',
        className: 'column-center',
        width: '50px',
      },
      {
        title: 'COD',
        dataIndex: 'code',
        key: 'code',
        width: '110px',
      },
      {
        title: 'NOMBRE',
        dataIndex: 'name',
        key: 'name',
        filteredValue: filtered.name || null,
        onFilter: (value, record) => record.name.includes(value),
        sorter: (a, b) => a.name.charCodeAt(0) - b.name.charCodeAt(0),
        sortOrder: sorted.columnKey === 'name' ? sorted.order : 'ascend',
      },
      {
        title: 'UM',
        dataIndex: 'unitOfMeasurement',
        key: 'unitOfMeasurement',
        width: '120px',
      },
      {
        title: 'VALOR V.',
        dataIndex: 'price',
        key: 'price',
        width: '120px',
        className: 'column-right',
      },
      {
        title: 'STOCK',
        dataIndex: 'stock',
        width: '110px',
        className: 'column-center',
      },
      {
        title: 'MONTO S/',
        dataIndex: 'rodeSoles',
        width: '140px',
        className: 'column-right',
      },
      {
        title: 'MONTO $',
        dataIndex: 'rodeDollar',
        width: '140px',
        className: 'column-right',
      },
      {
        title: '',
        dataIndex: 'action',
        key: 'action',
        width: '70px',
        className: 'column-center',
      },
    ]
  })

  const setAgeSort = () => {
    sortedInfo.value = {
      order: 'descend',
      columnKey: 'stock',
    }
  }

  const handleChangeProduct = (pagination, filters, sorter) => {
    filteredInfo.value = filters
    sortedInfo.value = sorter
  }

  const editableProduct = reactive({})

  const onDeleteProduct = id => {
    Modal.confirm({
      title: '¿Eliminar este producto?',
      icon: createVNode(ExclamationCircleOutlined),
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',

      onOk() {},

      onCancel() {
        console.log('Cancel')
      },
    })
  }

  const cancelProduct = id => {
    delete editableProduct[id]
  }

  return {
    columnsProduct,
    editableProduct,
    cancelProduct,
    onDeleteProduct,

    handleChangeProduct,
    setAgeSort,
  }
}
