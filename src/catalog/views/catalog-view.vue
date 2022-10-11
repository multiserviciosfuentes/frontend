<template>
  <div>
    <!-- <a-typography-title :level="3">PRODUCTOS</a-typography-title> -->
    <!--    table product-->

    <a-page-header style="border: 1px solid rgb(235, 237, 240)" title="PRODUCTOS">
      <template #extra v-if="user.roles.some(role => role === (ERole.admin || ERole.moderator))">
        <a-row type="flex">
          <a-statistic title="Monto" value="Total" />
          <a-statistic
            title="PEN"
            prefix="S/"
            :value-style="{ color: '#3f8600' }"
            :value="currency(rodeSolesMovements, '', 3)"
            :style="{
              margin: '0 32px',
            }"
          />
          <a-statistic title="USD" prefix="$" :value="currency(rodeDollarMovements, '', 3)" />
        </a-row>
      </template>
    </a-page-header>

    <a-table
      class="ant-table-striped"
      :row-class-name="(_record, index) => (index % 2 === 1 ? 'table-striped' : null)"
      :row-key="_record => _record.id"
      :columns="columnsProduct"
      :data-source="repositoriesSearchQuery"
      :pagination="false"
      :scroll="{ x: 1000, y: 'calc( 100vh - 220px)' }"
      :loading="loadingProducts"
      size="small"
      bordered
      @change="handleChangeProduct"
    >
      <template #title>
        <a-row type="flex">
          <a-col flex="auto">
            <a-space :size="20">
              <a-button type="primary" @click="handleAddProduct">
                <template #icon>
                  <plus-outlined></plus-outlined>
                </template>
                Nuevo producto
              </a-button>
              <a-input-group compact>
                <a-select style="width: 120px" v-model:value="searchType">
                  <a-select-option value="name">NOMBRE</a-select-option>
                  <a-select-option value="code">CÓDIGO</a-select-option>
                </a-select>
                <a-input-search
                  v-model:value="searchQuery"
                  :placeholder="searchType === 'name' ? 'Buscar nombre o alias' : 'Buscar código'"
                  :style="{ width: '400px', textTransform: 'uppercase' }"
                />
              </a-input-group>
            </a-space>

            <!-- <a-space :size="20" :style="{ float: 'right' }">
              <a-button type="primary" ghost @click="onClick('PurchaseOrder')">
                <template #icon>
                  <plus-outlined></plus-outlined>
                </template>
                Entrada
              </a-button>

              <a-button type="primary" ghost danger @click="onClick('SaleOrder')">
                <template #icon>
                  <minus-outlined></minus-outlined>
                </template>
                Salida
              </a-button>
            </a-space> -->
          </a-col>
        </a-row>
      </template>

      <template #bodyCell="{ column, text, record, index }">
        <template v-if="column.key === 'index'">
          <span>
            {{ (index += 1) }}
          </span>
        </template>

        <template v-else-if="column.dataIndex === 'unitOfMeasurement'">
          <span>
            {{ record.unitOfMeasurement.name }}
          </span>
        </template>

        <template v-else-if="column.dataIndex === 'name'">
          <span>
            {{ text }}
          </span>
          <span v-if="!_.isEmpty(record.nicknames)">
            {{ ` - ` }}
          </span>
          <a-tag v-for="item in record.nicknames" :key="item.id" color="cyan"> {{ item.name }}</a-tag>
        </template>

        <template v-else-if="column.key === 'action'">
          <div class="editable-row-operations">
            <span>
              <a-dropdown>
                <template #overlay>
                  <a-menu>
                    <a-menu-item @click="handleFormDirect(record)">Agregar o quitar</a-menu-item>
                    <a-menu-item @click="handleEditProduct(record.id)">Editar</a-menu-item>
                    <a-menu-item @click="handleRemoveProduct(record.id)">Eliminar</a-menu-item>
                  </a-menu>
                </template>
                <a>
                  Más
                  <down-outlined></down-outlined>
                </a>
              </a-dropdown>
            </span>
          </div>
        </template>

        <template v-else-if="column.dataIndex === 'price'">
          <span>
            {{ currency(text, record.typeCurrency === ETypeCurrency.soles ? 'S/' : '$', 3) }}
          </span>
        </template>

        <template v-else-if="column.dataIndex === 'stock'">
          <a @click="handleMovements(record.id)">
            <a-tag :color="stockByProductId(record.id) <= 100 ? 'red' : 'green'">
              {{ stockByProductId(record.id) }}</a-tag
            >
          </a>
        </template>

        <template v-else-if="column.dataIndex === 'rodeSoles'">
          <span>
            {{
              record.typeCurrency === ETypeCurrency.soles
                ? currency(record.price * stockByProductId(record.id), '', 3)
                : '-'
            }}
          </span>
        </template>

        <template v-else-if="column.dataIndex === 'rodeDollar'">
          <span>
            {{
              record.typeCurrency === ETypeCurrency.dollar
                ? currency(record.price * stockByProductId(record.id), '', 3)
                : '-'
            }}
          </span>
        </template>
      </template>

      <!-- <template #summary>
        <a-table-summary fixed>
          <a-table-summary-row :style="{ background: '#CAE6FF' }">
            <a-table-summary-cell :col-span="5"></a-table-summary-cell>

            <a-table-summary-cell :style="{ textAlign: 'right', fontWeight: 'bold' }">Total</a-table-summary-cell>
            <a-table-summary-cell :style="{ textAlign: 'right', fontWeight: 'bold' }">{{
              currency(rodeSolesMovements, 'S/', 3)
            }}</a-table-summary-cell>
            <a-table-summary-cell :style="{ textAlign: 'right', fontWeight: 'bold' }">{{
              currency(rodeDollarMovements, '$', 3)
            }}</a-table-summary-cell>
            <a-table-summary-cell></a-table-summary-cell>
          </a-table-summary-row>
        </a-table-summary>
      </template> -->
    </a-table>

    <template v-if="showMovements">
      <movements-modal :show="showMovements" :product="productForm" @on-close="showMovements = false"></movements-modal>
    </template>

    <template v-if="showDrawerProduct">
      <form-product-drawer
        :show="showDrawerProduct"
        :is-add="isAddProduct"
        :product="productForm"
        @on-close="showDrawerProduct = false"
      ></form-product-drawer>
    </template>

    <template v-if="showFormDirect">
      <form-direct :show="showFormDirect" :product="currentProduct" @on-close="showFormDirect = false"></form-direct>
    </template>
  </div>
</template>

<script setup>
import FormProductDrawer from '@/catalog/components/form-product-drawer.vue'
import { computed, createVNode, ref } from 'vue'
import useActionsProduct from '../composables/actions/use-actions-product'
import useProducts from '../composables/use-products'
import useProductsNameSearch from '../composables/use-products-name-search'
import Product from '../models/product'
import { currency } from '@/shared/methods'
import _ from 'lodash'
import { useProductStore } from '@/stores/product-store'
import { PlusOutlined, MinusOutlined, DownOutlined, ExclamationCircleOutlined } from '@ant-design/icons-vue'
import { message, Modal } from 'ant-design-vue'
import FormDirect from '@/inventory/components/form-direct.vue'

import { useMovementStore } from '@/stores/movement-store'

import MovementsModal from '@/inventory/components/movements-modal.vue'
import useMovements from '@/inventory/composables/use-movements'
import useMovementsByProduct from '@/inventory/composables/use-movements-by-product'
import { ERole, ETypeCurrency } from '@/shared/enums'
import { useAuthUserStore } from '@/stores/auth-user-store'
import { useRoute, useRouter } from 'vue-router'

// stores
const authUserStore = useAuthUserStore()
const productStore = useProductStore()
const movementStore = useMovementStore()
const router = useRouter()
const route = useRoute()

// states
const showDrawerProduct = ref(false)
const isAddProduct = ref(true)
const productForm = ref(new Product())

//composable
const { products } = useProducts()
const { searchQuery, repositoriesSearchQuery, searchType } = useProductsNameSearch(products)
const { columnsProduct, handleChangeProduct } = useActionsProduct(products)

// computeds
const loadingProducts = computed(() => productStore.loading)
const loading = ref(false)
const user = computed(() => authUserStore.userCurrent)

// functions
const handleAddProduct = () => {
  productForm.value = new Product()
  showDrawerProduct.value = true
  isAddProduct.value = true
}

const handleEditProduct = id => {
  showDrawerProduct.value = true
  isAddProduct.value = false
  let objProduct = _.cloneDeep(products.value.filter(item => item.id === id)[0])
  productForm.value = objProduct
  productForm.value.unitOfMeasurement = objProduct.unitOfMeasurement.name
}

const handleRemoveProduct = productId => {
  Modal.confirm({
    title: 'Eliminar product?',
    icon: createVNode(ExclamationCircleOutlined),
    content: createVNode(
      'div',
      {
        style: 'color:red;',
      },
      ''
    ),

    async onOk() {
      try {
        await productStore.remove(productId)
        message.success('Producto eliminado')
      } catch (error) {
        message.error(error)
      }
    },
    onCancel() {
      console.log('Cancel')
    },

    class: 'test',
  })
}

const onClick = name => {
  router.push({ name: name })
}

const { repositories: movements } = useMovements()
const { stockByProductId, rodeSolesMovements, rodeDollarMovements } = useMovementsByProduct(movements)
const showMovements = ref(false)
const handleMovements = productId => {
  showMovements.value = true
  productForm.value = _.cloneDeep(products.value.filter(item => item.id === productId)[0])
}

const showFormDirect = ref(false)
const currentProduct = ref(new Product())
const handleFormDirect = product => {
  showFormDirect.value = true
  currentProduct.value = product
}
</script>

<style lang="less" scoped>
.ant-table-striped :deep(.table-striped) td {
  background-color: #f0f0f0;
}
</style>

<style lang="less">
.full-modal {
  .ant-modal {
    max-width: 100%;
    top: 0;
    padding-bottom: 0;
    margin: 0;
  }
  .ant-modal-content {
    display: flex;
    flex-direction: column;
    height: calc(100vh);
  }
  .ant-modal-body {
    flex: 1;
  }
}

.editable-row-operations a {
  margin-right: 8px;
}

th.column-right,
td.column-right {
  text-align: right !important;
}

th.column-center,
td.column-center {
  text-align: center !important;
}

.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>
