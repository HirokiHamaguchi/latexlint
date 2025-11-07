import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { Content } from './content'

// Load kuromoji.js and set it as a global variable
import * as kuromojiModule from './kuromoji/kuromoji.js';
(window as Window & { kuromoji?: unknown }).kuromoji = kuromojiModule;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ChakraProvider value={defaultSystem}>
      <Content />
    </ChakraProvider>
  </StrictMode>,
)

