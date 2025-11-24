'use client'
// ...existing code...
import React from 'react'
import { SidebarProvider } from '@/context/SidebarContext'
import { ThemeProvider } from '@/context/ThemeContext'
import { ToastContainer } from 'react-toastify'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <SidebarProvider>{children}</SidebarProvider>
      <ToastContainer />
    </ThemeProvider>
  )
}
// ...existing code...