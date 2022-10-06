import { computed, ref } from 'vue'

const columnsSale = [
  {
    title: 'ITEM',
    key: 'index',
    className: 'column-center',
    width: '50px',
  },
  {
    title: 'FECHA',
    dataIndex: 'dateVoucher',
    width: '90px',
  },
  {
    title: 'TIPO',
    dataIndex: 'typeVoucher',
    width: '140px',
  },
  {
    title: 'NUM',
    dataIndex: 'number',
    className: 'column-center',
    width: '70px',
  },
  {
    title: 'CLIENTE',
    dataIndex: 'businessEntity',
  },
  {
    title: 'TOTAL',
    dataIndex: 'total',
    className: 'column-right',
    width: '180px',
  },
  {
    title: 'ACCIÓN',
    key: 'operationSale',
    className: 'column-center',
    width: '120px',
  },
]

const innerColumns = [
  {
    title: 'DESCRIPCIÓN',
    dataIndex: 'description',
  },
  {
    title: 'CANT.',
    dataIndex: 'quantity',
    width: '80px',
    className: 'column-center',
  },
  {
    title: 'PRECIO',
    dataIndex: 'price',
    width: '150px',
    className: 'column-right',
  },
  {
    title: 'DTO',
    dataIndex: 'discount',
    width: '80px',
    className: 'column-center',
  },
  {
    title: 'CANT. OFERTA',
    dataIndex: 'quantityOffer',
    width: '120px',
    className: 'column-center',
  },
  {
    title: 'MONTO',
    key: 'rode',
    width: '150px',
    className: 'column-right',
  },
  {
    title: 'ACCIONES',
    key: 'action',
    width: '150px',
    className: 'column-center',
  },
]

const columnsQuotation = [
  {
    title: 'ITEM',
    key: 'index',
    className: 'column-center',
    width: '50px',
  },
  {
    title: 'FECHA',
    dataIndex: 'dateVoucher',
    width: '90px',
  },
  {
    title: 'NUM',
    dataIndex: 'numberQuotation',
    className: 'column-center',
    width: '70px',
    defaultSortOrder: 'ascend',
    sorter: (a, b) => a.numberQuotation - b.numberQuotation,
  },
  {
    title: 'VENDEDOR',
    dataIndex: 'seller',
    onFilter: (value, record) => record.indexOf(value) === 0,
    sorter: (a, b) => a.length - b.length,
  },
  {
    title: 'CLIENTE',
    dataIndex: 'businessEntity',
    onFilter: (value, record) => record.businessEntity.name.indexOf(value) === 0,
    sorter: (a, b) => a.businessEntity.name.length - b.businessEntity.name.length,
  },
  {
    title: 'ESTADO',
    dataIndex: 'status',
    width: '120px',
  },
  {
    title: 'TOTAL',
    dataIndex: 'total',
    className: 'column-right',
    width: '160px',
  },
  {
    title: 'ACCIÓN',
    key: 'operation',
    className: 'column-center',
    width: '120px',
  },
]

const columnsQuotationUser = [
  {
    title: 'ITEM',
    key: 'index',
    className: 'column-center',
    width: '50px',
  },
  {
    title: 'FECHA',
    dataIndex: 'dateVoucher',
    width: '90px',
  },
  {
    title: 'NUM',
    dataIndex: 'numberQuotation',
    className: 'column-center',
    width: '70px',
    defaultSortOrder: 'ascend',
    sorter: (a, b) => a.numberQuotation - b.numberQuotation,
  },
  {
    title: 'CLIENTE',
    dataIndex: 'businessEntity',
    onFilter: (value, record) => record.businessEntity.name.indexOf(value) === 0,
    sorter: (a, b) => a.businessEntity.name.length - b.businessEntity.name.length,
  },
  {
    title: 'ESTADO',
    dataIndex: 'status',
    width: '120px',
  },
  {
    title: 'TOTAL',
    dataIndex: 'total',
    className: 'column-right',
    width: '160px',
  },
  {
    title: 'ACCIÓN',
    key: 'operation',
    className: 'column-center',
    width: '120px',
  },
]

export default function useInvoicesVariables() {
  const filteredInfo = ref()
  const sortedInfo = ref()

  // const columnsQuotation = computed(() => {
  //   const filtered = filteredInfo.value || {};
  //   const sorted = sortedInfo.value || {};
  //   return [
  //     {
  //       title: "ITEM",
  //       key: "index",
  //       className: "column-center",
  //       width: "50px",
  //     },
  //     {
  //       title: "FECHA",
  //       dataIndex: "dateVoucher",
  //       width: "90px",
  //     },
  //     {
  //       title: "NUM",
  //       dataIndex: "numberQuotation",
  //       className: "column-center",
  //       width: "70px",
  //       defaultSortOrder: "ascend",
  //       sorter: (a, b) => a.numberQuotation - b.numberQuotation,
  //     },
  //     {
  //       title: "CLIENTE",
  //       dataIndex: "businessEntity",
  //       key: "businessEntity",
  //       filteredValue: filtered.name || null,
  //       onFilter: (value, record) => record.businessEntity.name.includes(value),
  //       sorter: (a, b) =>
  //         a.businessEntity.name.charCodeAt(0) -
  //         b.businessEntity.name.charCodeAt(0),
  //       sortOrder: sorted.columnKey === "businessEntity" && sorted.order,
  //     },
  //     // {
  //     //   title: 'CONTACTO',
  //     //   dataIndex: 'contact',
  //     // },
  //     {
  //       title: "ESTADO",
  //       dataIndex: "status",
  //       width: "120px",
  //     },
  //     {
  //       title: "TOTAL",
  //       dataIndex: "total",
  //       className: "column-right",
  //       width: "160px",
  //     },
  //     {
  //       title: "ACCIÓN",
  //       key: "operation",
  //       className: "column-center",
  //       width: "120px",
  //     },
  //   ]
  // })

  const handleChangeInvoice = (pagination, filters, sorter) => {
    filteredInfo.value = filters
    sortedInfo.value = sorter
  }

  return {
    columnsSale,
    innerColumns,
    columnsQuotation,
    columnsQuotationUser,
    handleChangeInvoice,
  }
}
