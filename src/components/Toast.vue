<template>
  <Transition name="toast">
    <div v-if="visible" class="toast" :class="`toast-${type}`">
      <Icon :name="type === 'warning' ? 'warning' : 'feather'" :size="18" />
      <span>{{ message }}</span>
    </div>
  </Transition>
</template>

<script setup>
import { ref } from 'vue'
import Icon from './Icon.vue'

const visible = ref(false)
const message = ref('')
const type = ref('info')
let timeoutId = null

function show(msg, toastType = 'info', duration = 4000) {
  message.value = msg
  type.value = toastType
  visible.value = true
  if (timeoutId) clearTimeout(timeoutId)
  timeoutId = setTimeout(() => { visible.value = false }, duration)
}

defineExpose({ show })
</script>

<style scoped>
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from, .toast-leave-to { transform: translateX(120%); opacity: 0; }
</style>