import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { Content } from './content'

import './kuromoji/kuromoji.js';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ChakraProvider value={defaultSystem}>
      <Content />
    </ChakraProvider>
  </StrictMode>,
)

