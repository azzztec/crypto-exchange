import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { MainPage } from '@/page/main'
import { RootStoreProvider } from './providers/rootStoreProvider'
import { ThemeProvider } from './providers/themeProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <RootStoreProvider>
        <MainPage />
      </RootStoreProvider>
    </ThemeProvider>
  </StrictMode>
)
