<template>
  <div>
    <a-page-header style="border: 1px solid rgb(235, 237, 240)" :title="title">
      <template #extra v-if="type === EType.quotation">
        <a-row type="flex">
          <a-statistic
            title="Vendido"
            :value-style="{ color: '#3f8600' }"
            :value="invoices.filter(inv => inv.status === EStatus.sold).length"
          >
            <template #prefix>
              <arrow-up-outlined />
            </template>
          </a-statistic>
          <a-statistic
            title="Rechazado"
            :value-style="{ color: '#cf1322' }"
            :style="{
              margin: '0 32px',
            }"
            :value="invoices.filter(inv => inv.status === EStatus.rejected).length"
          >
            <template #prefix>
              <arrow-down-outlined />
            </template>
          </a-statistic>
          <a-statistic
            title="Proceso"
            :value-style="{ color: '#3f8600' }"
            :value="invoices.filter(inv => inv.status === EStatus.process).length"
          />
        </a-row>
      </template>
    </a-page-header>

    <a-table
      class="ant-table-striped"
      :row-class-name="(_record, index) => (index % 2 === 1 ? 'table-striped' : null)"
      :row-key="_record => _record.id"
      :columns="type === EType.quotation ? columnsQuotationUser : type === EType.sale ? columnsSale : columnsBuy"
      :data-source="repositoriesSearchQuery"
      :loading="loadingInvoices"
      :pagination="false"
      :scroll="{ x: 1000, y: 'calc( 100vh - 64px - 40px - 49px - 39px - 40px)' }"
      size="small"
      bordered
      @change="handleChangeInvoice"
    >
      <template #title>
        <a-row type="flex">
          <a-col flex="auto">
            <a-space :size="20">
              <a-button v-if="type === EType.quotation" type="primary" @click="handleAddVoucher">
                <template #icon>
                  <plus-outlined></plus-outlined>
                </template>
                Nueva cotización
              </a-button>
              <a-button v-else-if="type === EType.sale" type="primary" @click="handleAddVoucher">
                <template #icon>
                  <plus-outlined></plus-outlined>
                </template>
                Nueva orden de venta
              </a-button>
              <a-button v-else-if="type === EType.buy" type="primary" @click="handleAddVoucher">
                <template #icon>
                  <plus-outlined></plus-outlined>
                </template>
                Nueva orden de compra
              </a-button>

              <a-input-group compact>
                <a-select :style="{ width: '150px' }" v-model:value="searchType">
                  <a-select-option :value="ESearch.businessEntity">
                    {{ type === EType.buy ? 'PROVEEDOR' : 'CLIENTE' }}
                  </a-select-option>
                  <a-select-option :value="ESearch.code" v-if="type !== (EType.quotation || EType.purchaseOrder)"
                    >COMPROBANTE</a-select-option
                  >
                </a-select>
                <a-input-search
                  v-model:value="searchQuery"
                  :placeholder="
                    searchType === ESearch.businessEntity
                      ? `Buscar ${type === EType.buy ? 'proveedor' : 'cliente'}`
                      : 'Buscar número de comprobante'
                  "
                  :style="{ width: '400px', textTransform: 'uppercase' }"
                />
              </a-input-group>
            </a-space>
          </a-col>
        </a-row>
      </template>

      <template #bodyCell="{ record, column, index }">
        <template v-if="column.key === 'index'">
          <span>
            {{ (index = index + 1) }}
          </span>
        </template>

        <template v-else-if="column.dataIndex === 'dateVoucher'">
          <span>
            {{ dateParse(record.dateVoucher) }}
          </span>
        </template>

        <template v-else-if="column.dataIndex === 'subtotal'">
          <span v-if="record.status === EStatus.sold || record.status === EStatus.bought">
            {{ currency(record.total / (1 + IGV / 100), record.typeCurrency === ETypeCurrency.soles ? 'S/' : '$', 2) }}
          </span>
          <span v-else>
            {{ currency(record.total, record.typeCurrency === ETypeCurrency.soles ? 'S/' : '$', 2) }}
          </span>
        </template>

        <template v-else-if="column.dataIndex === 'total'">
          <span>
            {{
              record.status === EStatus.sold || record.status === EStatus.bought
                ? currency(record.total, record.typeCurrency === ETypeCurrency.soles ? 'S/' : '$', 2)
                : '-'
            }}
          </span>
        </template>

        <template v-else-if="column.dataIndex === 'businessEntity'">
          <span v-if="record.businessEntity != null">
            {{ record.businessEntity.name }}
          </span>
        </template>

        <template v-else-if="column.dataIndex === 'typeVoucher'">
          <a-tag v-if="record.typeVoucher === ETypeVoucher.invoice" color="orange">FACTURA</a-tag>
          <a-tag v-else-if="record.typeVoucher === ETypeVoucher.bill" color="green">BOLENTA DE VENTA</a-tag>
          <a-tag v-else-if="record.typeVoucher === ETypeVoucher.proforma" color="cyan">PROFORMA</a-tag>
        </template>

        <template v-else-if="column.dataIndex === 'status' && type === EType.quotation">
          <span>
            <a-badge v-if="record.status === EStatus.process" status="processing" />
            <a-badge v-else-if="record.status === EStatus.sold" status="success" />
            <a-badge v-else-if="record.status === EStatus.rejected" status="error" />

            <span v-if="record.status === EStatus.process">PROCESO</span>
            <span v-else-if="record.status === EStatus.sold">VENDIDO</span>
            <span v-else>RECHAZADO</span>
          </span>
        </template>

        <template v-else-if="column.key === 'operation'">
          <a v-if="record.status !== EStatus.sold" @click="handleEditVoucher(record.id)">Editar</a>
          <a v-else disabled>Editar</a>
          <a-divider type="vertical" />
          <a-dropdown>
            <template #overlay>
              <a-menu>
                <a-menu-item @click="formPrintModel(record)" :disabled="record.status === EStatus.sold"
                  >Descargar PDF</a-menu-item
                >

                <a-menu-item @click="handleSoldQuotation(record.id)" :disabled="record.status === EStatus.sold"
                  >Vendido</a-menu-item
                >
                <a-menu-item
                  @click="handleRejectedQuotation(record)"
                  :disabled="record.status === EStatus.rejected || record.status === EStatus.sold"
                  >Rechazado</a-menu-item
                >
                <a-menu-item @click="handleDeleteVoucher(record.id)" :disabled="record.status === EStatus.sold"
                  >Eliminar</a-menu-item
                >
              </a-menu>
            </template>
            <a>
              Más
              <down-outlined></down-outlined>
            </a>
          </a-dropdown>
        </template>

        <template v-else-if="column.key === 'operationBuy'">
          <a-dropdown>
            <template #overlay>
              <a-menu>
                <!-- <a-menu-item @click="onPrintOrder(record)" :disabled="!user.roles.some(role => role === ERole.admin)"
                  >Descargar PDF</a-menu-item
                > -->
                <a-menu-item
                  @click="handleEditVoucher(record.id)"
                  :disabled="!user.roles.some(role => role === ERole.admin)"
                  >Editar</a-menu-item
                >
                <a-menu-item
                  @click="handleDeleteVoucher(record.id)"
                  :disabled="!user.roles.some(role => role === ERole.admin)"
                  >Eliminar</a-menu-item
                >
              </a-menu>
            </template>
            <a>
              Más
              <down-outlined></down-outlined>
            </a>
          </a-dropdown>
        </template>
      </template>

      <template #expandedRowRender="{ record, index }">
        <a-table
          :row-key="_record => _record.id"
          :columns="innerColumns"
          :data-source="record.invoiceDetails"
          :pagination="false"
        >
          <template #bodyCell="{ record, column, text }">
            <template v-if="column.key === 'rode'">
              <span>
                {{ currency(calcRode(record.quantity, record.price, record.discount), 'S/ ', 3) }}
              </span>
            </template>

            <template v-else-if="column.dataIndex === 'price'">
              <span>
                {{ currency(text, 'S/ ', 3) }}
              </span>
            </template>

            <template v-else-if="column.dataIndex === 'discount'">
              <span>
                {{ record.discount != null ? `${record.discount}%` : null }}
              </span>
            </template>
          </template>
        </a-table>
      </template>
    </a-table>

    <!--    modal sold-->
    <a-modal
      v-model:visible="showModalSold"
      title="Venta de cotización"
      :confirm-loading="confirmLoadingModalSold"
      @ok="handleSoldQuotation"
    >
      <a-form layout="vertical">
        <a-form-item label="Comprobante" name="resource">
          <a-radio-group v-model:value="formStateModelSold.typeVoucher">
            <a-radio :value="ETypeVoucher.invoice">FACTURA</a-radio>
            <a-radio :value="ETypeVoucher.bill">BOLETA DE VENTA</a-radio>
            <a-radio :value="ETypeVoucher.proforma">PROFORMA</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="Número" name="number" v-bind="validateInfos.number">
          <a-input v-model:value="formStateModelSold.number" style="width: 50%" />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- for print -->
    <template v-if="showPrintModal">
      <a-modal
        v-model:visible="showPrintModal"
        title="Generando pdf..."
        ok-text="Descargar"
        cancel-text="Cancel"
        @ok="okPrint"
        @cancel="cancelPrint"
      >
        <a-form ref="formRefPrint" :model="formPrint" layout="vertical" name="form_in_modal">
          <a-form-item name="wayToPay" label="Forma de pago">
            <a-input v-model:value="formPrint.wayToPay" />
          </a-form-item>
          <a-form-item name="place" label="Lugar de entrega">
            <a-input v-model:value="formPrint.place" />
          </a-form-item>
          <a-form-item name="availability" label="Disponibilidad">
            <a-input v-model:value="formPrint.availability" />
          </a-form-item>
          <a-form-item name="validity" label="Validez de la cotización">
            <a-input v-model:value="formPrint.validity" />
          </a-form-item>
        </a-form>
      </a-modal>
    </template>

    <!-- show quotation -->
    <template v-if="showInvoiceModal">
      <form-invoice-component
        :show="showInvoiceModal"
        :type="type"
        :is-add="isAdd"
        :invoice="formInvoice"
        @on-close="showInvoiceModal = false"
      ></form-invoice-component>
    </template>
  </div>
</template>

<script setup>
import useInvoices from '@/sale/composables/use-invoices'
import useInvoicesVariables from '@/sale/composables/use-invoices-variables'
import { useInvoiceStore } from '@/stores/invoice-store'
import { computed, createVNode, reactive, ref } from 'vue'
import { calcRode, dateParse, currency } from '@/shared/methods'
import FormInvoiceComponent from './form-invoice-component.vue'
import {
  DownOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from '@ant-design/icons-vue'
import Invoice from '../models/invoice'
import dayjs from 'dayjs'
import _ from 'lodash'
import { Form, message, Modal } from 'ant-design-vue'
import useQuotationPrintAutotable from './composables/use-quotation-print-autotable'
import Movement from '@/inventory/models/movement'
import { EType, EStatus, ESearch, ETypeVoucher, ETypeMovement, ERole, ETypeCurrency } from '@/shared/enums'
import { useAuthUserStore } from '@/stores/auth-user-store'
import useInvoicesSearch from '../composables/use-invoices-search'
import { IGV } from '@/shared/utils/constantes'
import useSaleOrderPrint from '@/inventory/composables/prints/use-sale-order-print';


const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
})

// stores
const invoiceStore = useInvoiceStore()
const authUserStore = useAuthUserStore()

// states
const showInvoiceModal = ref(false)
const formInvoice = ref(new Invoice())
const isAdd = ref(false)

// composables
const { repositories: invoices } = useInvoices(props.type)
const { repositoriesSearchQuery, searchQuery, searchType } = useInvoicesSearch(invoices, props.type)
const { columnsSale, columnsBuy, innerColumns, columnsQuotation, columnsQuotationUser, handleChangeInvoice } =
  useInvoicesVariables()

const { onPrint: onPrintOrder} = useSaleOrderPrint()

// computeds
const loadingInvoices = computed(() => invoiceStore.loading)
const user = computed(() => authUserStore.userCurrent)

// functions quotation
const handleAddVoucher = () => {
  showInvoiceModal.value = true
  isAdd.value = true

  formInvoice.value = new Invoice()
  formInvoice.value.dateVoucher = dayjs()
  formInvoice.value.status =
    props.type === EType.quotation ? EStatus.process : props.type === EType.sale ? EStatus.sold : EStatus.bought
  formInvoice.value.type = props.type === EType.quotation || props.type === EType.sale ? EType.sale : EType.buy
  formInvoice.value.user = { id: authUserStore.userCurrent.id }

  if (props.type !== EType.quotation) {
    formInvoice.value.typeVoucher = ETypeVoucher.invoice
    formInvoice.value.igv = IGV
  }

  if (props.type === EType.sale) {
    formInvoice.value.movement = new Movement(ETypeMovement.output, 'SALIDA POR ORDEN DE VENTA')
  } else if (props.type == EType.buy) {
    formInvoice.value.movement = new Movement(ETypeMovement.input, 'INGRESO POR ORDEN DE COMPRA')
  }
}

const handleEditVoucher = id => {
  showInvoiceModal.value = true
  isAdd.value = false

  formInvoice.value = _.cloneDeep(invoices.value.filter(item => item.id === id)[0])
  formInvoice.value.dateVoucher = dayjs(formInvoice.value.dateVoucher)
  formInvoice.value.businessEntity = formInvoice.value.businessEntity.name
  formInvoice.value.contact = formInvoice.value.contact && formInvoice.value.contact.id
}

const handleDeleteVoucher = id => {
  Modal.confirm({
    title: '¿Eliminar cotización?',
    icon: createVNode(ExclamationCircleOutlined),
    okText: 'Si',
    okType: 'danger',
    cancelText: 'No',

    async onOk() {
      try {
        await invoiceStore.remove(id)
        message.success('Cotización eliminada')
      } catch (error) {
        message.success(error)
      }
    },

    onCancel() {
      console.log('Cancel')
    },
  })
}

const handleRejectedQuotation = quotation => {
  Modal.confirm({
    title: '¿Cotización rechazada?',
    icon: createVNode(ExclamationCircleOutlined),
    okText: 'Si',
    okType: 'danger',
    cancelText: 'No',

    async onOk() {
      let objQuotation = _.cloneDeep(quotation)
      objQuotation.status = EStatus.rejected
      objQuotation.numberSaleOrder = null
      objQuotation.numberPurchaseOrder = null
      objQuotation.movement = null
      objQuotation.igv = null

      try {
        await invoiceStore.patch(objQuotation)
        message.success('Cotización rechazada')
      } catch (error) {
        message.success(error)
      }
    },

    onCancel() {
      console.log('Cancel')
    },
  })
}

const showModalSold = ref(false)
const confirmLoadingModalSold = ref(false)
const formStateModelSold = reactive({
  typeVoucher: ETypeVoucher.invoice,
  number: null,
})
const rulesInvoiceSold = reactive({
  typeVoucher: [],
  number: [
    {
      required: true,
      message: 'Inserta num de comprobante',
    },
  ],
})
const useForm = Form.useForm
const { resetFields, validate, validateInfos } = useForm(formStateModelSold, rulesInvoiceSold)

const handleShowSoldQuotation = id => {
  showModalSold.value = true
  formInvoice.value = _.cloneDeep(invoices.value.filter(item => item.id === id)[0])
  formInvoice.value.dateVoucher = dayjs(formInvoice.value.dateVoucher)
  formInvoice.value.businessEntity = formInvoice.value.businessEntity.id
  formInvoice.value.contact = formInvoice.value.contact && formInvoice.value.contact.id
}

const handleSoldQuotation = quotationId => {
  Modal.confirm({
    title: 'Vender cotización?',
    icon: createVNode(ExclamationCircleOutlined),

    onOk() {
      formInvoice.value = _.cloneDeep(invoices.value.filter(item => item.id === quotationId)[0])
      formInvoice.value.dateVoucher = dayjs(formInvoice.value.dateVoucher)
      formInvoice.value.businessEntity = formInvoice.value.businessEntity.id
      formInvoice.value.contact = formInvoice.value.contact && formInvoice.value.contact.id
      formInvoice.value.status = EStatus.sold
      formInvoice.value.movement = new Movement(ETypeMovement.output, 'VENTA DE COTIZACIÓN')
      formInvoice.value.igv = IGV
      confirmLoadingModalSold.value = true
      return invoiceStore
        .patch(formInvoice.value)
        .then(response => {
          message.success('Cotización vendida')
          resetFields()
          showModalSold.value = false
        })
        .catch(err => {
          message.error(err)
        })
        .finally(() => {
          confirmLoadingModalSold.value = false
        })
    },

    onCancel() {},
  })

  // validate()
  //   .then(() => {
  //     let objQuotation = _.cloneDeep(formInvoice.value)
  //     objQuotation.status = EStatus.sold
  //     objQuotation.typeVoucher = formStateModelSold.typeVoucher
  //     objQuotation.numberInvoice = null
  //     objQuotation.numberBill = null
  //     objQuotation.numberProforma = null
  //     objQuotation.igv = IGV

  //     switch (formStateModelSold.typeVoucher) {
  //       case ETypeVoucher.invoice:
  //         objQuotation.numberInvoice = formStateModelSold.number
  //         break
  //       case ETypeVoucher.bill:
  //         objQuotation.numberBill = formStateModelSold.number
  //         break
  //       case ETypeVoucher.proforma:
  //         objQuotation.numberProforma = formStateModelSold.number
  //         break
  //       default:
  //         break
  //     }

  //     objQuotation.numberPurchaseOrder = null
  //     objQuotation.movement = new Movement(ETypeMovement.output, 'VENTA DE COTIZACIÓN')

  //     confirmLoadingModalSold.value = true
  //     invoiceStore
  //       .patch(objQuotation)
  //       .then(response => {
  //         message.success('Cotización vendida')
  //         resetFields()
  //         showModalSold.value = false
  //       })
  //       .catch(err => {
  //         message.error(err)
  //       })
  //       .finally(() => {
  //         confirmLoadingModalSold.value = false
  //       })
  //   })
  //   .catch(err => {
  //     console.log(err)
  //   })
}

// operation quotation
const { onPrint: hanldeQuotationPrintAutotable } = useQuotationPrintAutotable()

const showPrintModal = ref(false)
const formRefPrint = ref()

const formPrint = reactive({
  igv: 'con',
  wayToPay: '15 días',
  place: 'Lima metropolitana',
  availability: 'Inmediata',
  validity: '05 días útiles',
  quotation: Object,
  user: user.value,
})

const formPrintModel = quotation => {
  showPrintModal.value = true
  formPrint.quotation = quotation
}

const okPrint = () => {
  showPrintModal.value = false
  hanldeQuotationPrintAutotable(formPrint)
  formRefPrint.value.resetFields()
}

const cancelPrint = () => {
  formRefPrint.value.resetFields()
}
</script>

<style lang="less" scoped>
.ant-table-striped :deep(.table-striped) td {
  background-color: #f0f0f0;
}
</style>
