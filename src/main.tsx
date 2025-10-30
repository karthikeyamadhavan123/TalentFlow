import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from '@/context/ThemeContext'
import './index.css'
import App from './App.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { seedDatabase } from './seedDatabase' // Import the seed function

const queryClient = new QueryClient()

async function setupMirage() {
    try {
      const { makeServer } = await import('./mirage/server')
      makeServer({ environment: 'development' })    
      console.log('✅ Mirage started')
    } catch (err) {
      console.error('❌ Mirage failed:', err)
    }
}

async function initializeApp() {
  try {
    await setupMirage();
    await seedDatabase(); // Seed the database
  } catch (error) {
    console.error('❌ Initialization failed:', error);
  }
}

// Start initialization and render when done
initializeApp().finally(() => {
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