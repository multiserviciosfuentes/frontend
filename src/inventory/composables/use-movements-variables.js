import { ref } from 'vue'

const columnsMovements = [
  {
    title: 'ITEM',
    key: 'index',
    className: 'column-center',
    width: '50px',
  },
  {
    title: 'FECHA',
    dataIndex: 'createdAt',
    key: 'createdAt',
    width: '110px',
    defaultSortOrder: 'descend',
    sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
  },
  {
    title: 'USUARIO',
    dataIndex: 'username',
    width: '180px',
  },
  {
    title: 'TIPO',
    dataIndex: 'type',
    width: '100px',
  },
  {
    title: 'FORMA',
    dataIndex: 'form',
    width: '180px',
  },
  {
    title: 'DESCRIPCIÓN',
    dataIndex: 'description',
  },
  {
    title: 'ENTRADA',
    dataIndex: 'input',
    className: 'column-center',
    width: '150px',
  },
  {
    title: 'SALIDA',
    dataIndex: 'output',
    className: 'column-center',
    width: '150px',
  },
]

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
}

export default function useUsersVariables() {
  const filteredInfo = ref()
  const sortedInfo = ref()

  const handleChange = (pagination, filters, sorter) => {
    filteredInfo.value = filters
    sortedInfo.value = sorter
  }
  return {
    columnsMovements,
    formItemLayout,

    handleChange,
  }
}
