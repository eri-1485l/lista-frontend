<template>
  <div class="dashboard-page">
    <header class="topbar">
      <div class="brand">
        <Icon name="book" :size="24" />
        <h1>Mi Lista de Libros</h1>
      </div>
      <div class="user-area">
        <span class="user-badge">
          <Icon name="user" :size="16" />
          {{ authStore.username }}
        </span>
        <button class="btn btn-danger" @click="logout">
          <Icon name="logout" :size="16" />
          Cerrar Sesión
        </button>
      </div>
    </header>

    <main class="content">
      <div class="actions">
        <button class="btn btn-primary" @click="$router.push('/add')">
          <Icon name="plus" :size="18" />
          Agregar Libro
        </button>
        <span class="count">{{ booksStore.books.length }} {{ booksStore.books.length === 1 ? 'libro' : 'libros' }}</span>
      </div>

      <div v-if="booksStore.books.length === 0" class="empty">
        <Icon name="book" :size="48" />
        <p>Tu lista está vacía</p>
        <p class="empty-hint">Agrega tu primer libro para comenzar</p>
      </div>

      <ul v-else class="book-list">
        <li v-for="book in booksStore.books" :key="book.id" class="book-card">
          <div class="book-number">{{ String(book.id).padStart(2, '0') }}</div>
          <div class="book-info">
            <h3>{{ book.name }}</h3>
            <p>{{ book.description }}</p>
          </div>
        </li>
      </ul>
    </main>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useBooksStore } from '../stores/books'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'
import Icon from '../components/Icon.vue'

const booksStore = useBooksStore()
const authStore = useAuthStore()
const router = useRouter()

onMounted(() => {
  booksStore.fetchBooks()
})

function logout() {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.dashboard-page {
  min-height: 100vh;
  position: relative;
  z-index: 1;
}

.topbar {
  background: rgba(26, 20, 16, 0.95);
  color: var(--color-gold-light);
  padding: 16px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 12px rgba(0,0,0,0.15);
  position: sticky;
  top: 0;
  z-index: 10;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--color-gold);
}

.brand h1 {
  font-family: var(--font-serif);
  font-size: 22px;
  font-weight: 600;
  letter-spacing: 0.03em;
  color: var(--color-gold-light);
}

.user-area {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  background: rgba(201, 169, 97, 0.15);
  border: 1px solid rgba(201, 169, 97, 0.3);
  font-size: 13px;
  color: var(--color-gold-light);
}

.content {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 24px;
}

.actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.count {
  color: var(--color-text-muted);
  font-size: 14px;
  font-style: italic;
  font-family: var(--font-serif);
  letter-spacing: 0.05em;
}

.book-list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.book-card {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(201, 169, 97, 0.25);
  border-left: 4px solid var(--color-cinnabar);
  border-radius: var(--radius);
  padding: 20px 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  transition: all 0.25s ease;
  box-shadow: var(--shadow-soft);
}

.book-card:hover {
  transform: translateX(4px);
  box-shadow: var(--shadow-strong);
  border-left-color: var(--color-gold);
}

.book-number {
  font-family: var(--font-serif);
  font-size: 28px;
  font-weight: 600;
  color: var(--color-gold);
  min-width: 50px;
  text-align: center;
  opacity: 0.7;
}

.book-info h3 {
  font-family: var(--font-serif);
  font-size: 20px;
  color: var(--color-ink);
  margin-bottom: 4px;
}

.book-info p {
  color: var(--color-text-muted);
  font-size: 14px;
  font-style: italic;
}

.empty {
  text-align: center;
  padding: 80px 20px;
  color: var(--color-text-muted);
}

.empty svg {
  color: var(--color-gold);
  opacity: 0.5;
  margin-bottom: 16px;
}

.empty p {
  font-size: 18px;
  font-family: var(--font-serif);
}

.empty-hint {
  font-size: 14px;
  margin-top: 8px;
  opacity: 0.7;
}
</style>