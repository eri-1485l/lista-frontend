import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import { useAuthStore } from './auth'
import { useRouter } from 'vue-router'

export const useBooksStore = defineStore('books', () => {
  const books = ref([])
  const authStore = useAuthStore()
  const router = useRouter()

  const api = axios.create({
    baseURL: 'http://localhost:8001'
  })

  api.interceptors.request.use(config => {
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`
      console.log('🔐 Enviando petición con JWT:', config.headers.Authorization)
    }
    return config
  })

  api.interceptors.response.use(
    response => response,
    error => {
      if (error.response?.status === 401) {
        authStore.logout()
        window.dispatchEvent(new CustomEvent('session-expired'))
        router.push('/login')
      }
      return Promise.reject(error)
    }
  )

  async function fetchBooks() {
    const response = await api.get('/api/books')
    books.value = response.data
  }

  async function addBook(book) {
    const response = await api.post('/api/books', book)
    books.value.push(response.data)
    return response.data
  }

  return { books, fetchBooks, addBook }
})