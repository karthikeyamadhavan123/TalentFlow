import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from '@/context/ThemeContext'
import './index.css'
import App from './App.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()
async function setupMirage() {
  if (import.meta.env.DEV) {
    try {
      const { makeServer } = await import('./mirage/server')
      makeServer({ environment: 'development' })
      console.log('✅ Mirage started')
    } catch (err) {
      console.error('❌ Mirage failed:', err)
    }
  }
}
setupMirage().finally(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </QueryClientProvider>

    </StrictMode>
  )
})
