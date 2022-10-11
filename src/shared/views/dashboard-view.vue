<template>
  <a-layout id="inventory">
    <!-- <a-layout-sider v-model:collapsed="collapsed" collapsible> -->
    <a-layout-sider
      :style="{ background: '#001529', overflow: 'auto', height: '100vh', position: 'fixed', left: 0, top: 0, bottom: 0 }"
    >
      <div class="logo-test">
        <a-image :width="150" :src="MFuentes" :preview="false" />
      </div>

      <a-select v-model:value="checkedRole" :style="{ width: '180px', paddingLeft: '20px' }" :options="optionsRoles">
      </a-select>

      <a-menu v-model:selectedKeys="selectedKeys" mode="inline" theme="dark">
        <template v-if="checkedRole === ERole.admin">
          <a-divider orientation="left" :style="{ color: colorSubMenus, fontSize: '14px', fontWeight: 'normal' }"
            >Configuración</a-divider
          >
          <a-menu-item key="User" v-if="user.roles.some(item => item === ERole.admin)" @click="onClick('User')">
            <span>Usuarios</span>
          </a-menu-item>
        </template>

        <template v-else>
          <a-divider orientation="left" :style="{ color: colorSubMenus, fontSize: '14px', fontWeight: 'normal' }"
            >Ventas</a-divider
          >
          <a-menu-item key="Quotation" @click="onClick('Quotation')">
            <span class="nav-text">Cotizaciones</span>
          </a-menu-item>

          <a-menu-item key="SaleOrder" @click="onClick('SaleOrder')">
            <span class="nav-text">Ordenes de venta</span>
          </a-menu-item>

          <a-divider orientation="left" :style="{ color: colorSubMenus, fontSize: '14px', fontWeight: 'normal' }"
            >Compras</a-divider
          >
          <a-menu-item key="PurchaseOrder" @click="onClick('PurchaseOrder')">
            <span class="nav-text">Ordenes de compra</span>
          </a-menu-item>

          <a-divider orientation="left" :style="{ color: colorSubMenus, fontSize: '14px', fontWeight: 'normal' }"
            >Inventario</a-divider
          >
          <a-menu-item key="Catalog" @click="onClick('Catalog')">
            <span class="nav-text">Productos</span>
          </a-menu-item>

          <a-divider orientation="left" :style="{ color: colorSubMenus, fontSize: '14px', fontWeight: 'normal' }"
            >Entidades</a-divider
          >
          <a-menu-item key="BusinessEntity" @click="onClick('BusinessEntity')">
            <span class="nav-text">Razón social</span>
          </a-menu-item>
          <a-menu-item key="Contact" @click="onClick('Contact')">
            <span class="nav-text">Contactos</span>
          </a-menu-item>
        </template>
      </a-menu>

      <div
        :style="{
          position: 'fixed',
          bottom: '0',
          left: '0',
          width: '183px',
          textAlign: 'center',
          paddingTop: '10px',
          paddingBottom: '10px',
        }"
      >
        <span :style="{ display: 'block', background:'#001529', color:'white' }">
          {{ user.username.toLowerCase() }}
        </span>
        <a-button @click="handleLogout" type="link" :style="{ color:'white' }">
          <template #icon><logout-outlined></logout-outlined></template>
          Cerrar sesión
        </a-button>
      </div>
    </a-layout-sider>

    <a-layout :style="{ marginLeft: '200px' }">
      <a-layout-content :style="{ margin: '0 16px', overflow: 'initial' }">
        <!-- <a-layout-header :style="{ background: `${colorHeader}`, height: '64px' }">
          <a-space :style="{ float: 'right' }">
            <a-avatar style="color: #f56a00; background-color: #fde3cf">
              {{ user.fullName.charAt(0).toUpperCase() }}</a-avatar
            >
            <span v-if="true" :style="{ color: 'white' }">
              {{ user.fullName.toLowerCase() }}
            </span>
            <a-button @click="handleLogout" type="link" :style="{ height: '100%', color: 'white' }">
              <template #icon><logout-outlined></logout-outlined></template>
              Cerrar sesión
            </a-button>
          </a-space>
        </a-layout-header> -->
        <div
          :style="{
            padding: '14px',
            background: '#fff',
            height: '100vh',
          }"
        >
          <router-view />
        </div>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup>
import { computed, createVNode, onMounted, ref, watch, watchPostEffect } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import { useAuthUserStore } from '@/stores/auth-user-store'
import { message, Modal } from 'ant-design-vue'
import MFuentes from '@/assets/images/local/fuentes-sider.png'

import { LogoutOutlined, ExclamationCircleOutlined, SmileOutlined } from '@ant-design/icons-vue'
import _ from 'lodash'
import useLogin from '@/shared/composables/use-login'
import { useInvoiceStore } from '@/stores/invoice-store'
import { useUserStore } from '@/stores/user-store'
import { ERole } from '@/shared/enums'

// states
const router = useRouter()
const route = useRoute()
const selectedKeys = ref([])
const checkedRole = ref(ERole.user)
const colorHeader = ref('#323639')
const colorSubMenus = ref('#F3B77F')

// composables
const authUserStore = useAuthUserStore()
const { laodData } = useLogin()

// computeds
const loggedIn = computed(() => authUserStore.status.loggedIn)
const user = computed(() => authUserStore.userCurrent)

const invoiceStore = useInvoiceStore()
const userStore = useUserStore()
watch(checkedRole, newRole => {
  if (newRole === ERole.user) {
    invoiceStore.getInvoicesByUserId(user.value.id)
  } else {
    invoiceStore.getAll()
  }

  if (newRole === ERole.user) {
    colorHeader.value = '#323639'
  } else if (newRole === ERole.moderator) {
    colorHeader.value = '#384754'
  } else {
    colorHeader.value = '#00162A'
  }

  if (newRole === ERole.admin) userStore.getAll()
  redirectForRole(newRole)
})

const redirectForRole = role => {
  if (role === ERole.moderator || role === ERole.user) {
    router.push({ name: 'Quotation' })
  } else {
    router.push({ name: 'User' })
  }
}

// functions
const onClick = name => {
  router.push({ name: name })
}

const handleLogout = () => {
  Modal.confirm({
    title: 'Cerrar sesión?',
    icon: createVNode(ExclamationCircleOutlined),

    async onOk() {
      try {
        await authUserStore.logout()
        message.info('Se ha cerrado sesión')
      } catch (err) {
        message.error(err)
      }
    },

    onCancel() {},
  })
}

watchPostEffect(() => {
  selectedKeys.value = [`${route.name}`]

  if (loggedIn.value && route.name === 'Login') {
    router.push({ name: 'Home' })
  }
})

onMounted(() => {
  laodData()
  redirectForRole(ERole.user)
})

// variables
const optionsRoles = ref([
  {
    value: ERole.user,
    label: 'Usuario',
  },
  {
    value: ERole.moderator,
    label: 'Moderador',
    disabled: !user.value.roles.some(item => item === ERole.moderator),
  },
  {
    value: ERole.admin,
    label: 'Administrador',
    disabled: !user.value.roles.some(item => item === ERole.admin),
  },
])
</script>

<style lang="less">
#inventory .logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px;
}
.logo-test {
  display: flex;
}
.logo-test .ant-image {
  margin: 16px auto;
}
.site-layout .site-layout-background {
  background: #fff;
}
/* [data-theme='dark'] .site-layout .site-layout-background {
  background: #141414;
} */
</style>
