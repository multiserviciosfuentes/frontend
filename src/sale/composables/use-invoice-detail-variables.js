import { reactive } from 'vue'

const labelCol = {
  span: 6,
}
const wrapperCol = {
  span: 16,
}

const columnsInvoiceDetails = [
  {
    title: 'ITEM',
    key: 'index',
    width: '50px',
    className: 'column-center',
  },
  {
    title: 'COD',
    dataIndex: 'code',
    width: '120px',
  },
  {
    title: 'DESCRIPCIÓN',
    dataIndex: 'description',
  },
  {
    title: 'CANT',
    dataIndex: 'quantity',
    width: '80px',
    className: 'column-center',
  },
  {
    title: 'VALOR V.',
    dataIndex: 'price',
    width: '120px',
    className: 'column-right',
  },
  // {
  //   title: 'DTO',
  //   dataIndex: 'discount',
  //   width: '90px',
  //   className: 'column-center',
  // },
  {
    title: 'MONTO',
    dataIndex: 'rode',
    width: '150px',
    className: 'column-right',
  },
  // {
  //   title: 'C.OFER',
  //   dataIndex: 'quantityOffer',
  //   width: '100px',
  //   className: 'column-center',
  // },
  {
    title: '',
    dataIndex: 'operation',
    width: '140px',
    className: 'column-center',
  },
]

export default function useInvoiceDetailVariables() {
  const rulesInvoice = reactive({
    dateVoucher: [
      {
        required: true,
        message: 'Inserta una fecha',
      },
    ],
    businessEntity: [
      {
        required: true,
        message: 'Inserta una entidad',
      },
    ],
    contact: [],
  })

  const rulesInvoiceDetail = reactive({
    product: [
      {
        required: true,
        message: 'Inserta una fecha',
      },
    ],
    // description: [
    //   {
    //     required: true,
    //     message: 'Inserta una descipción',
    //   },
    // ],
    quantity: [
      {
        required: true,
        message: 'Inserta una cantidad',
      },
    ],
    price: [
      {
        required: true,
        message: 'Inserta un precio',
      },
    ],
    discount: [],
    quantityOffer: [],
  })

  return {
    columnsInvoiceDetails,
    rulesInvoiceDetail,
    rulesInvoice,

    wrapperCol,
    labelCol,
  }
}
