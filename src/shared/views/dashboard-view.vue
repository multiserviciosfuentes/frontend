<template>
  <a-layout id="inventory">
    <a-layout-sider v-model:collapsed="collapsed" collapsible>
      <div class="logo-test">
        <a-image :width="150" :src="MFuentes" :preview="false" />
      </div>

      <a-menu v-model:openKeys="openKeys" v-model:selectedKeys="selectedKeys" theme="dark" mode="inline">
        <template v-if="checkedRole === ERole.admin">
          <a-sub-menu key="sub4">
            <template #title>
              <span>
                <shop-outlined />
                <span>Configuración</span>
              </span>
            </template>
            <a-menu-item key="User" v-if="user.roles.some(item => item === ERole.admin)" @click="onClick('User')">
              <span>Usuarios</span>
            </a-menu-item>
          </a-sub-menu>
        </template>

        <template v-else>
          <a-sub-menu key="sub1">
            <template #title>
              <span>
                <shop-outlined />
                <span>Ventas</span>
              </span>
            </template>
            <a-menu-item key="Sale" @click="onClick('Sale')">
              <span class="nav-text">Comprobantes</span>
            </a-menu-item>
            <a-menu-item key="Quotation" @click="onClick('Quotation')">
              <span class="nav-text">Cotizaciones</span>
            </a-menu-item>
          </a-sub-menu>

          <a-sub-menu key="sub2">
            <template #title>
              <span>
                <home-outlined />
                <span>Inventario</span>
              </span>
            </template>
            <a-menu-item key="Catalog" @click="onClick('Catalog')">
              <span class="nav-text">Productos</span>
            </a-menu-item>
          </a-sub-menu>

          <a-sub-menu key="sub3">
            <template #title>
              <span>
                <barcode-outlined />
                <span>Entidades</span>
              </span>
            </template>
            <a-menu-item key="BusinessEntity" @click="onClick('BusinessEntity')">
              <span class="nav-text">Razón social</span>
            </a-menu-item>
            <a-menu-item key="Contact" @click="onClick('Contact')">
              <span class="nav-text">Contactos</span>
            </a-menu-item>
          </a-sub-menu>
        </template>
      </a-menu>
    </a-layout-sider>

    <!-- <dashboard-view :role="ERole.admin"></dashboard-view> -->

    <a-layout>
      <a-layout-header :style="{ background: `${colorHeadr}`, height: '64px' }">
        <a-space :style="{ float: 'right' }">
          <a-avatar style="color: #f56a00; background-color: #fde3cf">
            {{ user.fullName.charAt(0).toUpperCase() }}</a-avatar
          >
          <span v-if="true" :style="{ color: 'white' }">
            {{ user.fullName.toLowerCase() }}
            <!-- <a-tag v-if="role" :color="ERole.admin === role ? '#2db7f5' : '#87d068'">{{ role }}</a-tag> -->
          </span>

          <a-radio-group v-model:value="checkedRole" button-style="solid">
            <a-radio-button v-if="user.roles.some(item => item === ERole.admin)" :value="ERole.admin"
              >Administrador</a-radio-button
            >
            <a-radio-button v-if="user.roles.some(item => item === ERole.moderator)" :value="ERole.moderator"
              >Moderador</a-radio-button
            >
            <a-radio-button v-if="user.roles.some(item => item === ERole.user)" :value="ERole.user"
              >Usuario</a-radio-button
            >
          </a-radio-group>

          <a-button @click="handleLogout" type="link" :style="{ height: '100%', color: 'white' }">
            <template #icon><logout-outlined></logout-outlined></template>
            Cerrar sesión
          </a-button>
        </a-space>
      </a-layout-header>

      <a-layout-content :style="{ margin: '0 16px', overflow: 'initial' }">
        <div
          :style="{
            padding: '14px',
            background: '#fff',
            height: 'calc( 100vh - 64px )',
          }"
        >
          <router-view />
        </div>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup>
import { computed, createVNode, onMounted, provide, ref, watch, watchPostEffect } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import { useAuthUserStore } from '@/stores/auth-user-store'
import { message, Modal } from 'ant-design-vue'
import MFuentes from '@/assets/images/local/fuentes-sider.png'

import {
  ShopOutlined,
  HomeOutlined,
  BarcodeOutlined,
  LogoutOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons-vue'
import _ from 'lodash'
import useLogin from '@/shared/composables/use-login'
import { useInvoiceStore } from '@/stores/invoice-store'
import { useUserStore } from '@/stores/user-store'
import { ERole, EType } from '@/shared/enums'

// states
const router = useRouter()
const route = useRoute()
const collapsed = ref(false)
const selectedKeys = ref([])
const openKeys = ref(['sub1', 'sub2', 'sub3', 'sub4'])
const checkedRole = ref(ERole.user)
const colorHeadr = ref('#323639')
provide(/* key */ 'role', /* value */ checkedRole.value)

// composables
const authUserStore = useAuthUserStore()
const { laodData } = useLogin()

// computeds
const loggedIn = computed(() => authUserStore.status.loggedIn)
const user = computed(() => authUserStore.userCurrent)

const roles = computed(() => authUserStore.roles)
const invoiceStore = useInvoiceStore()
const userStore = useUserStore()
watch(checkedRole, newRole => {
  if (newRole === ERole.user) {
    invoiceStore.getInvoicesByUserId(user.value.id)
  } else {
    invoiceStore.getAll()
  }

  if (newRole === ERole.user) {
    colorHeadr.value = '#323639'
  } else if (newRole === ERole.moderator) {
    colorHeadr.value = '#384754'
  } else {
    colorHeadr.value = '#00162A'
  }

  if (newRole === ERole.admin) userStore.getAll()
  redirectForRole(newRole)

})

const redirectForRole = role => {
  if (role === ERole.moderator || role === ERole.user) {
    router.push({ name: 'Sale' })
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
</script>

<style>
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
[data-theme='dark'] .site-layout .site-layout-background {
  background: #141414;
}
</style>
