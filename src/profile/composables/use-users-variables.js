import { ref } from 'vue'

const columnsUsers = [
  {
    title: 'ITEM',
    key: 'index',
    className: 'column-center',
    width: '50px',
  },
  {
    title: 'ROLES',
    dataIndex: 'roles',
    width: '150px',
  },
  {
    title: 'USUARIO',
    dataIndex: 'username',
  },
  {
    title: 'NOMBRE',
    dataIndex: 'fullName',
    onFilter: (value, record) => record.fullName.indexOf(value) === 0,
    sorter: (a, b) => a.fullName.length - b.fullName.length,
  },
  {
    title: 'EMAIL',
    dataIndex: 'email',
  },
  {
    title: 'TELÉFONO',
    dataIndex: 'phone',
    width: '120px',
  },
  {
    title: 'ACCIÓN',
    key: 'operation',
    className: 'column-center',
    width: '140px',
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
    columnsUsers,
    formItemLayout,

    handleChange,
  }
}
