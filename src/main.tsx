import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from '@/context/ThemeContext'
import './index.css'
import App from './App.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()
console.log('Current environment:', import.meta.env.MODE);
console.log('Is DEV:', import.meta.env.DEV);
console.log('Is PROD:', import.meta.env.PROD);
console.log('Vite env:', import.meta.env);
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
