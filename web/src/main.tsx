import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Content } from './content'
import { OverviewPage } from './pages/OverviewPage'
import { ReadmePage } from './pages/ReadmePage'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ChakraProvider value={defaultSystem}>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Content />} />
          <Route path="/overview" element={<OverviewPage />} />
          <Route path="/readme" element={<ReadmePage />} />
          <Route path="/readme/:anchor" element={<ReadmePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </ChakraProvider>
  </StrictMode>,
)
