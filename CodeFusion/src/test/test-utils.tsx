import { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { ThemeContext } from '../context/ThemeContext'
import { vi } from 'vitest'

interface AllTheProvidersProps {
  children: React.ReactNode
  darkMode?: boolean
}

// Add all your providers here
const AllTheProviders = ({ children, darkMode = false }: AllTheProvidersProps) => {
  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode: vi.fn() }}>
      {children}
    </ThemeContext.Provider>
  )
}

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  darkMode?: boolean
}

const customRender = (
  ui: ReactElement,
  { darkMode = false, ...renderOptions }: CustomRenderOptions = {}
) => render(ui, { 
  wrapper: ({ children }) => <AllTheProviders darkMode={darkMode}>{children}</AllTheProviders>,
  ...renderOptions 
})

export * from '@testing-library/react'
export { customRender as render }