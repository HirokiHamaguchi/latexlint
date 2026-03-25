import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ROUTES } from './constants/routes'
import { Content } from './content'
import { OtherPage } from './pages/OtherPage'
import { ReadmePage } from './pages/ReadmePage'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ChakraProvider value={defaultSystem}>
      <HashRouter>
        <Routes>
          <Route path={ROUTES.HOME} element={<Content />} />
          <Route path={ROUTES.OTHER} element={<OtherPage />} />
          <Route path={ROUTES.README} element={<ReadmePage />} />
          <Route path={`${ROUTES.README}/:anchor`} element={<ReadmePage />} />
          <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
        </Routes>
      </HashRouter>
    </ChakraProvider>
  </StrictMode>,
)
