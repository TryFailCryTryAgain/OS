import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createBrowserRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import Terminal_Test from './apps/Debugging_Files/Terminal_Test.tsx'

const router = createBrowserRouter([
  {
    path: "/",
    Component: App 
  },
  {
    path: "/debugging",
    Component: Terminal_Test
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
