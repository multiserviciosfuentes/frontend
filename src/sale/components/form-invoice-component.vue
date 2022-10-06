<template>
  <a-modal
    :visible="show"
    width="100%"
    wrap-class-name="full-modal"
    @ok="handleOkInvoice"
    @cancel="$emit('onClose')"
    :confirm-loading="isDisable"
  >
    <template #title>
      <span>
        <a-tag :color="isAdd ? 'green' : 'volcano'">
          <template #icon>
            <sync-outlined :spin="true" />
          </template>
          {{ title }}
        </a-tag>
      </span>
    </template>
    <a-space :size="20" direction="horizontal">
      <a-form :style="{ width: '400px' }" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-item label="Num">
          <a-tag style="width: 250px"> {{ num }}</a-tag>
        </a-form-item>

        <a-form-item ref="name" label="Fecha" name="dateVoucher">
          <a-date-picker v-model:value="invoice.dateVoucher" format="DD/MM/YYYY" size="small" :style="styleInput" />
        </a-form-item>

        <a-form-item label="Cliente" v-bind="validateInfosInvoice.businessEntity">
          <a-space :size="8">
            <a-select
              v-model:value="invoice.businessEntity"
              show-search
              placeholder="Buscar cliente"
              :style="styleInput"
              :default-active-first-option="false"
              :filter-option="false"
              :not-found-content="null"
              :options="businessEntitiesSearchQuery"
              :field-names="{
                label: 'name',
                value: 'name',
              }"
              @search="handleBusinessEntitySearch"
              @change="handleBusinessEntityChange"
              size="small"
            ></a-select>
            <a-button type="primary" @click="handleAddBusinessEntity" size="small"> + </a-button>
          </a-space>
        </a-form-item>
        <a-form-item label="Contacto" v-bind="validateInfosInvoice.contact">
          <a-space :size="8">
            <a-select
              v-model:value="invoice.contact"
              show-search
              placeholder="Buscar contacto"
              style="width: 250px"
              :default-active-first-option="false"
              :filter-option="false"
              :not-found-content="null"
              :options="contactsSearchQuery"
              :field-names="{
                label: 'fullName',
                value: 'id',
              }"
              @search="handleContactSearch"
              @change="handleContactChange"
              size="small"
            ></a-select>
            <a-button type="primary" @click="handleAddContact" size="small"> + </a-button>
          </a-space>
        </a-form-item>
        <a-form-item label=" ">
          <a-popconfirm title="Resetear?" @confirm="handleResetInvoice">
            <a-button style="width: 250px" size="small" type="dashed">
              <template #icon>
                <arrow-up-outlined></arrow-up-outlined>
              </template>
              Resetear
            </a-button>
          </a-popconfirm>
        </a-form-item>
        <a-form-item label=" ">
          <a-popconfirm title="Resetear todo?" @confirm="handleResetAll">
            <a-button style="width: 250px" size="small" type="dashed" danger>
              <template #icon>
                <clear-outlined></clear-outlined>
              </template>
              Resetear todo
            </a-button>
          </a-popconfirm>
        </a-form-item>
      </a-form>

      <a-form :style="{ width: '400px' }" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-item label="Producto" v-bind="validateInfos.product">
          <a-space :size="8">
            <a-select
              v-model:value="invoiceDetail.product"
              show-search
              placeholder="Buscar producto"
              style="width: 250px"
              :default-active-first-option="false"
              :filter-option="false"
              :not-found-content="null"
              :options="productsSearchQuery"
              :field-names="{
                label: 'name',
                value: 'name',
              }"
              @search="handleProductSearch"
              @change="handleProductChange"
              size="small"
            ></a-select>
            <a-button type="primary" @click="handleAddProduct" size="small"> + </a-button>
          </a-space>
        </a-form-item>

        <a-form-item label="Cant" v-bind="validateInfos.quantity">
          <a-input type="number" v-model:value="invoiceDetail.quantity" style="width: 250px" size="small" :min="1" />
        </a-form-item>

        <a-form-item label="Precio" v-bind="validateInfos.price">
          <a-input type="number" v-model:value="invoiceDetail.price" style="width: 250px" size="small" />
        </a-form-item>

        <a-form-item label="Discount" v-bind="validateInfos.discount">
          <a-input type="number" v-model:value="invoiceDetail.discount" style="width: 250px" size="small" />
        </a-form-item>

        <a-form-item label="Cant oferta" v-bind="validateInfos.quantityOffer">
          <a-input type="number" v-model:value="invoiceDetail.quantityOffer" style="width: 250px" size="small" />
        </a-form-item>

        <a-form-item label=" ">
          <a-button type="primary" @click.prevent="handleAddInvoiceDetail" style="width: 250px" size="small">
            <template #icon>
              <shopping-cart-outlined></shopping-cart-outlined>
            </template>
            Agregar
          </a-button>
        </a-form-item>
      </a-form>
    </a-space>

    <a-table
      class="ant-table-striped"
      :row-class-name="(_record, index) => (index % 2 === 1 ? 'table-striped' : null)"
      :row-key="_record => _record.id"
      :columns="columnsInvoiceDetails"
      :data-source="invoiceDetails"
      :pagination="false"
      :scroll="{ x: 1000, y: 'calc( 100vh - 490px)' }"
      size="small"
      bordered
    >
      <template #bodyCell="{ column, text, record, index }">
        <template v-if="column.key === 'index'">
          <span>
            {{ (index = index + 1) }}
          </span>
        </template>

        <template v-if="column.dataIndex === 'code'">
          <span>
            {{ record.product.code }}
          </span>
        </template>

        <template
          v-else-if="['description', 'quantity', 'price', 'discount', 'quantityOffer'].includes(column.dataIndex)"
        >
          <div>
            <a-input
              v-if="editableData[record.product.id]"
              v-model:value="editableData[record.product.id][column.dataIndex]"
              style="margin: -5px 0"
            />
            <template v-else>
              {{
                _.isNull(text) || text === ''
                  ? '-'
                  : column.dataIndex === 'price'
                  ? currency(text, 'S/', 3)
                  : column.dataIndex === 'discount'
                  ? `${text}%`
                  : text
              }}
            </template>
          </div>
        </template>

        <template v-else-if="column.dataIndex === 'rode'">
          <span v-if="record.quantity !== '' && record.price !== ''">
            {{ currency(calcRode(record.quantity, record.price, record.discount), 'S/', 3) }}
          </span>
        </template>

        <template v-else-if="column.dataIndex === 'operation'">
          <div class="editable-row-operations">
            <span v-if="editableData[record.product.id]">
              <a-popconfirm title="Guardar?" @confirm="handleSaveRow(record.product.id)">
                <a>Guardar</a>
              </a-popconfirm>
              <a-typography-link @click="handleCancelRow(record.product.id)">Cancelar</a-typography-link>
            </span>
            <span v-else>
              <a @click="handleEditRow(record.product.id)">Editar</a>
              <a-divider type="vertical" />
              <a-popconfirm title="Eliminar?" @confirm="handleRemoveRow(record.product.id)">
                <a>Eliminar</a>
              </a-popconfirm>
            </span>
          </div>
        </template>
      </template>
    </a-table>
  </a-modal>

  <template v-if="showDrawerBusinessEntity">
    <form-business-entity-drawer
      :show="showDrawerBusinessEntity"
      :business-entity="selectedBEntity"
      @on-submit="handleBusinessEntityChange"
      @on-close="showDrawerBusinessEntity = false"
    ></form-business-entity-drawer>
  </template>

  <template v-if="showDrawerContact">
    <form-contact-drawer
      :show="showDrawerContact"
      :contact="selectedContact"
      @on-submit="handleContactChange"
      @on-close="showDrawerContact = false"
    ></form-contact-drawer>
  </template>

  <template v-if="showDrawerProduct">
    <form-product-drawer
      :show="showDrawerProduct"
      :product="selectedProduct"
      @on-submit="handleProductChange"
      @on-close="showDrawerProduct = false"
    ></form-product-drawer>
  </template>
</template>

<script setup>
import useProducts from '@/catalog/composables/use-products'
import useProductsNameSearch from '@/catalog/composables/use-products-name-search'
import useinvoiceDetailVariables from '@/sale/composables/use-invoice-detail-variables'
import { computed, reactive, ref, watch } from 'vue'
import _ from 'lodash'
import { Form, message } from 'ant-design-vue'
import InvoiceDetail from '../models/invoice-detail'
import { calcRode, currency, dateParse } from '@/shared/methods'
import {
  ShoppingCartOutlined,
  SmileOutlined,
  SyncOutlined,
  ClearOutlined,
  ArrowUpOutlined,
} from '@ant-design/icons-vue'
import useBusinessEntities from '../composables/use-business-entities'
import useBusinessEntitiesNameSearch from '../composables/use-business-entites-name-search'
import useContacts from '../composables/use-contacts'
import useContactsNameSearch from '../composables/use-contacts-name-search'
import FormBusinessEntityDrawer from './form-business-entity-drawer.vue'
import BusinessEntity from '../models/business-entity'
import Contact from '../models/contact'
import FormContactDrawer from '../components/form-contact-drawer.vue'
import Product from '@/catalog/models/product'
import FormProductDrawer from '@/catalog/components/form-product-drawer.vue'
import { useInvoiceStore } from '@/stores/invoice-store'
import { EType, EStatus } from '@/shared/enums'

const props = defineProps({
  show: Boolean,
  type: {
    type: String,
    required: true,
  },
  isAdd: {
    type: Boolean,
    default: true,
  },
  invoice: Object,
})

const emit = defineEmits(['onClose'])

// states
const invoice = ref(props.invoice)
const invoiceDetails = ref(props.invoice.invoiceDetails)
const invoiceDetail = ref(new InvoiceDetail())
const editableData = reactive({})
const isDisable = ref(false)
const styleInput = ref({
  width: '250px',
})

const showDrawerBusinessEntity = ref(false)
const selectedBEntity = ref(new BusinessEntity())

const showDrawerContact = ref(false)
const selectedContact = ref(new Contact())

const showDrawerProduct = ref(false)
const selectedProduct = ref(new Product())

const useForm = Form.useForm
const useInvoiceForm = Form.useForm

// computeds
const title = computed(() => {
  switch (props.type) {
    case EType.quotation:
      if (props.isAdd) {
        return 'Agregando cotización...'
      } else {
        return 'Editando cotización...'
      }
    case EType.sale:
      if (props.isAdd) {
        return 'Agregando venta...'
      } else {
        return 'Editando venta...'
      }
    case EType.buy:
      if (props.isAdd) {
        return 'Agregando compra...'
      } else {
        return 'Editando compra...'
      }

    default:
      return '-'
  }
})

const num = computed(() => {
  switch (props.type) {
    case EType.quotation:
      if (!props.isAdd) {
        return _.cloneDeep(invoice.value.numberQuotation)
      } else {
        return '-'
      }
    case EType.sale:
      if (!props.isAdd) {
        return _.cloneDeep(invoice.value.numberInvoice)
      } else {
        return '-'
      }
    default:
      return '-'
  }
})

// composables
const invoiceStore = useInvoiceStore()
const { columnsInvoiceDetails, rulesInvoice, rulesInvoiceDetail, labelCol, wrapperCol } = useinvoiceDetailVariables()
const { resetFields: resetFieldsInvoiceDetails, validate, validateInfos } = useForm(invoiceDetail, rulesInvoiceDetail)
const {
  resetFields: resetFieldsInvoice,
  validate: validateInvoice,
  validateInfos: validateInfosInvoice,
} = useInvoiceForm(invoice, rulesInvoice)

// products select--------------------------------------------
const { products } = useProducts()
const { searchQuery: productsSearch, repositoriesSearchQuery: productsSearchQuery } = useProductsNameSearch(products)

const handleProductSearch = val => {
  productsSearch.value = val
}

const handleProductChange = (name, close = true) => {
  productsSearch.value = name
  invoiceDetail.value.product = name
  invoiceDetail.value.price = _.cloneDeep(products.value.filter(item => item.name === name)[0]).price
  if (!close) showDrawerProduct.value = close
}

const handleAddProduct = () => {
  showDrawerProduct.value = true
  selectedProduct.value = new Product()
}
// -----------------------------------------------------

// business entity select--------------------------------------------
const { businessEntities } = useBusinessEntities()
const { searchQuery: businessEntitiesSearch, repositoriesSearchQuery: businessEntitiesSearchQuery } =
  useBusinessEntitiesNameSearch(businessEntities)

const handleBusinessEntitySearch = val => {
  businessEntitiesSearch.value = val
}

const handleBusinessEntityChange = (name, close = true) => {
  businessEntitiesSearch.value = name
  invoice.value.businessEntity = name
  if (!close) showDrawerBusinessEntity.value = close
}

const handleAddBusinessEntity = () => {
  showDrawerBusinessEntity.value = true
  selectedBEntity.value = new BusinessEntity()
}
// -----------------------------------------------------

// contact select--------------------------------------------
const { contacts } = useContacts()
const { searchQuery: contactsSearch, repositoriesSearchQuery: contactsSearchQuery } = useContactsNameSearch(contacts)

const handleContactSearch = val => {
  contactsSearch.value = val
}

const handleContactChange = (id, close = true) => {
  contactsSearch.value = _.cloneDeep(contacts.value.filter(item => item.id === id)[0]).fullName
  invoice.value.contact = id
  if (!close) showDrawerContact.value = close
}

const handleAddContact = () => {
  showDrawerContact.value = true
  selectedContact.value = new Contact()
}
// -----------------------------------------------------

// functions
const handleEditRow = key => {
  editableData[key] = _.cloneDeep(invoiceDetails.value.filter(item => item.product.id === key)[0])
}

const handleSaveRow = key => {
  Object.assign(invoiceDetails.value.filter(item => item.product.id === key)[0], editableData[key])
  delete editableData[key]
}

const handleRemoveRow = key => {
  let index = invoiceDetails.value.findIndex(x => x.product.id === key)
  if (index !== -1) {
    invoiceDetails.value.splice(index, 1)
  }
}

const handleCancelRow = key => {
  delete editableData[key]
}

const handleAddInvoiceDetail = () => {
  if (!invoiceDetails.value.some(item => item.product.name === invoiceDetail.value.product)) {
    validate()
      .then(() => {
        let objInvoiceDetail = new InvoiceDetail()
        objInvoiceDetail.product = _.cloneDeep(
          productsSearchQuery.value.filter(item => item.name === invoiceDetail.value.product)[0]
        )
        objInvoiceDetail.description = invoiceDetail.value.product
        objInvoiceDetail.quantity = invoiceDetail.value.quantity
        objInvoiceDetail.price = invoiceDetail.value.price
        objInvoiceDetail.discount = invoiceDetail.value.discount
        objInvoiceDetail.quantityOffer = invoiceDetail.value.quantityOffer

        invoiceDetails.value.push(objInvoiceDetail)
        handleResetInvoiceDetail()
      })
      .catch(err => {
        console.log(err)
      })
  } else {
    message.error('El producto ya fue ingresado')
  }
}

const loading = ref(false)
const handleOkInvoice = () => {
  if (invoiceDetails.value.length > 0) {
    validateInvoice()
      .then(() => {
        let objInvoice = _.cloneDeep(invoice.value)
        objInvoice.businessEntity = businessEntities.value.filter(item => item.name === invoice.value.businessEntity)[0]
        objInvoice.contact = contacts.value.filter(item => item.id === invoice.value.contact)[0]
        objInvoice.invoiceDetails = invoiceDetails.value

        isDisable.value = true
        if (props.isAdd) {
          message.loading({
            content: 'Agregando...',
            key: 'addInvoice',
          })
          invoiceStore
            .add(objInvoice)
            .then(response => {
              message.success({
                content: 'Comprobante agregado',
                key: 'addInvoice',
                duration: 3,
              })
              handleResetAll()
              close()
            })
            .catch(err => {
              message.error({
                content: err,
                key: 'addInvoice',
                duration: 3,
              })
            })
            .finally(() => {
              isDisable.value = false
            })
        } else {
          message.loading({
            content: 'editando...',
            key: 'addInvoice',
          })
          invoiceStore
            .update(objInvoice)
            .then(response => {
              message.success({
                content: 'Comprobante editado',
                key: 'addInvoice',
                duration: 3,
              })
              handleResetAll()
              close()
            })
            .catch(err => {
              message.error({
                content: err,
                key: 'addInvoice',
                duration: 3,
              })
            })
            .finally(() => {
              isDisable.value = false
            })
        }
      })
      .catch(err => {
        console.log(err)
      })
  } else {
    message.error('Falta al menos un item')
  }
}

const handleResetInvoice = () => {
  invoice.value.businessEntity = null
  invoice.value.contact = null
  businessEntitiesSearch.value = ''
  contactsSearch.value = ''
}

const handleResetInvoiceDetail = () => {
  resetFieldsInvoiceDetails()
  productsSearch.value = ''
}

const handleResetAll = () => {
  handleResetInvoice()
  handleResetInvoiceDetail()
  invoiceDetails.value = []
}

const close = () => {
  emit('onClose')
}

// business entities------------------------------------------------------
</script>

<style lang="less" scoped>
.ant-table-striped :deep(.table-striped) td {
  background-color: #f0f0f0;
}
.ant-form-item {
  margin-bottom: 5px;
}
</style>
