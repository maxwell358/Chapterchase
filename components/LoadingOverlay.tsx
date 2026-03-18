"use client"

import React from "react"
import { Loader2 } from "lucide-react"

type LoadingOverlayProps = {
  isOpen?: boolean
  title?: string
  message?: string
}

const LoadingOverlay = ({
  isOpen = false,
  title = "Preparing your book",
  message = "We are setting up the interview experience.",
}: LoadingOverlayProps) => {
  if (!isOpen) {
    return null
  }

  return (
    <div className="loading-wrapper" role="status" aria-live="polite">
      <div className="loading-shadow-wrapper bg-white shadow-soft-lg">
        <div className="loading-shadow">
          <Loader2 className="loading-animation w-12 h-12 text-[var(--accent-warm)]" />
          <div className="text-center space-y-2">
            <h2 className="loading-title">{title}</h2>
            <p className="text-sm text-[var(--text-secondary)]">{message}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoadingOverlay
