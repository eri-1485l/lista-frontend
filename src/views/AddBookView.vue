<template>
  <div class="add-page">
    <div class="add-card">
      <div class="ornament-top">❖</div>
      <h1>Agregar Libro</h1>
      <p class="subtitle">Añade un nuevo título a tu colección</p>

      <form @submit.prevent="submitBook" class="add-form">
        <div class="field">
          <label>Nombre del libro</label>
          <input v-model="name" class="input-field" placeholder="Ej: Mo Dao Zu Shi" required />
        </div>

        <div class="field">
          <label>Descripción / Género</label>
          <input v-model="description" class="input-field" placeholder="Ej: Cultivo y misterio" required />
        </div>

        <div class="buttons">
          <button type="submit" class="btn btn-primary">
            <Icon name="plus" :size="18" />
            Guardar
          </button>
          <button type="button" class="btn btn-secondary" @click="$router.push('/dashboard')">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useBooksStore } from '../stores/books'
import { useRouter } from 'vue-router'
import Icon from '../components/Icon.vue'

const name = ref('')
const description = ref('')
const booksStore = useBooksStore()
const router = useRouter()

async function submitBook() {
  await booksStore.addBook({ name: name.value, description: description.value })
  router.push('/dashboard')
}
</script>

<style scoped>
.add-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
  z-index: 1;
}

.add-card {
  width: 100%;
  max-width: 520px;
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

h1 {
  font-size: 28px;
  color: var(--color-cinnabar);
  margin-bottom: 6px;
}

.subtitle {
  color: var(--color-text-muted);
  font-size: 14px;
  font-style: italic;
  margin-bottom: 32px;
  letter-spacing: 0.03em;
}

.add-form {
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

.buttons {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}

.buttons .btn {
  flex: 1;
}
</style>