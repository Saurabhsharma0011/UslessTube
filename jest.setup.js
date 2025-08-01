import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname() {
    return '/'
  },
}))

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
global.localStorage = localStorageMock

// Mock window.phantom
Object.defineProperty(window, 'phantom', {
  value: {
    solana: {
      isPhantom: true,
      connect: jest.fn(),
      disconnect: jest.fn(),
      on: jest.fn(),
      off: jest.fn(),
    },
  },
  writable: true,
})

// Mock fetch
global.fetch = jest.fn()

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks()
}) 