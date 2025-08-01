import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { PhantomWalletButton } from '@/components/phantom-wallet-button'

// Mock the hooks and utilities
jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}))

jest.mock('@/lib/phantom', () => ({
  connectPhantomWallet: jest.fn(),
  disconnectPhantomWallet: jest.fn(),
  isPhantomInstalled: jest.fn(),
  isPhantomConnected: jest.fn(),
  getConnectedWalletAddress: jest.fn(),
  autoConnectPhantom: jest.fn(),
}))

jest.mock('@/lib/auth', () => ({
  connectWallet: jest.fn(),
}))

describe('PhantomWalletButton', () => {
  const mockProps = {
    onWalletConnected: jest.fn(),
    onWalletDisconnected: jest.fn(),
    loading: false,
    setLoading: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders connect button when Phantom is not installed', () => {
    const { isPhantomInstalled } = require('@/lib/phantom')
    isPhantomInstalled.mockReturnValue(false)

    render(<PhantomWalletButton {...mockProps} />)

    expect(screen.getByText(/install phantom/i)).toBeInTheDocument()
    expect(screen.getByText(/phantom wallet/i)).toBeInTheDocument()
  })

  it('renders connect button when Phantom is installed but not connected', () => {
    const { isPhantomInstalled, isPhantomConnected } = require('@/lib/phantom')
    isPhantomInstalled.mockReturnValue(true)
    isPhantomConnected.mockReturnValue(false)

    render(<PhantomWalletButton {...mockProps} />)

    expect(screen.getByText(/connect wallet/i)).toBeInTheDocument()
  })

  it('shows loading state when connecting', () => {
    const { isPhantomInstalled } = require('@/lib/phantom')
    isPhantomInstalled.mockReturnValue(true)

    render(<PhantomWalletButton {...mockProps} loading={true} />)

    expect(screen.getByText(/connecting/i)).toBeInTheDocument()
  })

  it('handles connect button click', async () => {
    const { isPhantomInstalled, connectPhantomWallet } = require('@/lib/phantom')
    const { connectWallet } = require('@/lib/auth')
    
    isPhantomInstalled.mockReturnValue(true)
    connectPhantomWallet.mockResolvedValue('test-wallet-address')
    connectWallet.mockResolvedValue({ user: { id: 1 }, isNewUser: false })

    render(<PhantomWalletButton {...mockProps} />)

    const connectButton = screen.getByText(/connect wallet/i)
    fireEvent.click(connectButton)

    await waitFor(() => {
      expect(connectPhantomWallet).toHaveBeenCalled()
    })
  })
}) 