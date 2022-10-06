<template>
  <div class="bg--login">
    <div>
      <a-card title="Iniciar sesión" :style="{ width: '500px', textAlign: 'center' }">
        <a-form :model="formUser" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-form-item label="Usuario">
            <a-input v-model:value="formUser.username" placeholder="usuario">
              <template #prefix><UserOutlined style="color: rgba(0, 0, 0, 0.25)" /></template>
            </a-input>
          </a-form-item>
          <a-form-item label="Contraseña">
            <a-input v-model:value="formUser.password" type="password" placeholder="contraseña">
              <template #prefix><LockOutlined style="color: rgba(0, 0, 0, 0.25)" /></template>
            </a-input>
          </a-form-item>
          <a-form-item :style="{ justifyContent: 'center', textAlign: 'center' }">
            <a-button
              type="primary"
              @click="login"
              :loading="loading"
              :disabled="formUser.user === '' || formUser.password === ''"
            >
              <template #icon><login-outlined></login-outlined></template>
              Ingresar
            </a-button>
          </a-form-item>
        </a-form>
      </a-card>
    </div>
  </div>
</template>

<script setup>
import User from '@/auth/models/user'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { reactive, ref } from 'vue'
import { UserOutlined, LockOutlined, LoginOutlined } from '@ant-design/icons-vue'
import { useAuthUserStore } from '@/stores/auth-user-store'
import useLogin from '@/shared/composables/use-login'

// states
const router = useRouter()
const loading = ref(false)

const formUser = reactive({
  username: '',
  password: '',
})

// composables
const authUserStore = useAuthUserStore()
const { laodData } = useLogin()

// funcstions
const login = () => {
  loading.value = true
  authUserStore
    .login(formUser)
    .then(response => {
      laodData()
      router.push({ name: 'Home' })
      message.success(`Hola ${response.fullName}`)
    })
    .catch(error => {
      message.error(error)
    })
    .finally(() => {
      loading.value = false
    })
}

const labelCol = {
  span: 7,
}

const wrapperCol = {
  span: 16,
}
</script>

<style scoped>
.bg--login {
  background-color: #f4f5f5;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%23bfbfbf' fill-opacity='0.34' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E");
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
</style>
