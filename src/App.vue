<template>
  <a-config-provider :locale="locale">
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

const locale = ref(esEs)

// composables
const authUserStore = useAuthUserStore()
const loggedIn = computed(() => authUserStore.status.loggedIn)
</script>
