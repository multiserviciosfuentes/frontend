<template>
  <a-config-provider :locale="locale">
    <!-- <a-layout v-if="loggedIn" id="inventory">
      <a-layout-sider v-model:collapsed="collapsed" collapsible>
        <div class="logo-test">
          <a-image :width="150" :src="MFuentes" :preview="false" />
        </div>

        <a-menu v-model:openKeys="openKeys" v-model:selectedKeys="selectedKeys" theme="dark" mode="inline">
          <template v-if="checkedRole === 'adm'">
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


      <a-layout>
        <a-layout-header :style="{ background: '#002140', height: '64px' }">
          <a-space :style="{ float: 'right' }">
            <a-avatar style="color: #f56a00; background-color: #fde3cf">
              {{ user.fullName.charAt(0).toUpperCase() }}</a-avatar
            >
            <span v-if="true" :style="{ color: 'white' }">
              {{ user.fullName.toLowerCase() }}
            </span>

            <a-radio-group v-model:value="checkedRole" button-style="solid">
              <a-radio-button v-for="item in roles" :key="item" :value="item">{{ item }}</a-radio-button>
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
    </a-layout> -->

    <dashboard-view v-if="loggedIn"></dashboard-view>
    <login-view v-else />
  </a-config-provider>
</template>

<script setup>
import { computed, ref } from 'vue'
import esEs from 'ant-design-vue/es/locale/es_ES'
import { useAuthUserStore } from '@/stores/auth-user-store'

import LoginView from './shared/views/login-view.vue'
import DashboardView from './shared/views/dashboard-view.vue'

import { ERole } from './shared/enums'

const locale = ref(esEs)

// composables
const authUserStore = useAuthUserStore()
const loggedIn = computed(() => authUserStore.status.loggedIn)
</script>
