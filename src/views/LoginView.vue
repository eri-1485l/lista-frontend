<template>
  <div class="login-page">
    <div class="login-card">
      <div class="ornament-top">❖</div>

      <h1 class="title">Lista de Libros</h1>
      <p class="subtitle">Colección personal</p>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="field">
          <label>Usuario</label>
          <input v-model="username" class="input-field" placeholder="Ingresa tu usuario" required />
        </div>

        <div class="field">
          <label>Contraseña</label>
          <input v-model="password" type="password" class="input-field" placeholder="••••••••" required />
        </div>

        <button type="submit" class="btn btn-primary" :disabled="loading">
          <Icon name="lock" :size="18" />
          {{ loading ? 'Entrando...' : 'Iniciar Sesión' }}
        </button>
      </form>

      <p v-if="error" class="error">
        <Icon name="warning" :size="16" />
        {{ error }}
      </p>

      <div class="ornament-bottom">❖ ❖ ❖</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import Icon from '../components/Icon.vue'
import axios from 'axios'

const username = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const router = useRouter()
const authStore = useAuthStore()

async function handleLogin() {
  error.value = ''
  loading.value = true
  try {
    const params = new URLSearchParams()
    params.append('grant_type', 'password')
    params.append('client_id', 'fastapi-api')
    params.append('username', username.value)
    params.append('password', password.value)
    params.append('scope', 'openid')

    const response = await axios.post(
      'http://localhost:8081/realms/cybersecurity/protocol/openid-connect/token',
      params,
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    )

    
    authStore.setToken(response.data.access_token, username.value)
    router.push('/dashboard')
  } catch (err) {
    console.error(err)
    error.value = 'Credenciales incorrectas o Keycloak no responde.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
  z-index: 1;
}

.login-card {
  width: 100%;
  max-width: 420px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(201, 169, 97, 0.4);
  border-radius: 20px;
  padding: 48px 40px;
  box-shadow: var(--shadow-strong);
  text-align: center;
}

.ornament-top {
  color: var(--color-gold);
  font-size: 22px;
  letter-spacing: 6px;
  margin-bottom: 12px;
}

.title {
  font-size: 32px;
  font-family: var(--font-serif);
  color: var(--color-cinnabar);
  margin-bottom: 4px;
  letter-spacing: 0.03em;
}

.subtitle {
  color: var(--color-text-muted);
  font-size: 14px;
  margin-bottom: 32px;
  font-style: italic;
  letter-spacing: 0.05em;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
  text-align: left;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field label {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-muted);
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.login-form .btn {
  margin-top: 8px;
  width: 100%;
}

.error {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  color: var(--color-cinnabar);
  font-size: 14px;
  margin-top: 20px;
}

.ornament-bottom {
  color: var(--color-gold);
  font-size: 12px;
  letter-spacing: 8px;
  margin-top: 32px;
  opacity: 0.6;
}
</style>