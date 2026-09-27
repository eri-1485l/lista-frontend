<template>
  <Toast ref="toastRef" />
  <RouterView />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { RouterView } from 'vue-router'
import Toast from './components/Toast.vue'

const toastRef = ref(null)

onMounted(() => {
  window.addEventListener('session-expired', () => {
    toastRef.value?.show('Tu sesión ha expirado. Por favor, inicia sesión de nuevo.', 'warning')
  })
})
</script>