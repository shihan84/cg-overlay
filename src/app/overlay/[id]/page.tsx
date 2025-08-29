"use client"

import { useEffect, useState } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { io, Socket } from "socket.io-client"

interface OverlayData {
  title?: string
  subtitle?: string
  text?: string
  imageUrl?: string
  color?: string
  backgroundColor?: string
  isVisible?: boolean
  animation?: string
}

interface TemplateConfig {
  type: string
  style: {
    fontSize?: string
    fontFamily?: string
    fontWeight?: string
    padding?: string
    borderRadius?: string
    backgroundColor?: string
    color?: string
    border?: string
    boxShadow?: string
  }
  animation?: {
    enter?: string
    exit?: string
    duration?: string
  }
}

export default function OverlayPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const overlayId = params.id as string
  const templateType = searchParams.get('type') || 'LOWER_THIRD'
  
  const [overlayData, setOverlayData] = useState<OverlayData>({})
  const [isVisible, setIsVisible] = useState(false)
  const [socket, setSocket] = useState<Socket | null>(null)
  const [templateConfig, setTemplateConfig] = useState<TemplateConfig>({
    type: templateType,
    style: {
      fontSize: '16px',
      fontFamily: 'Arial, sans-serif',
      fontWeight: 'bold',
      padding: '12px 24px',
      borderRadius: '8px',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      color: 'white',
      border: 'none',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)'
    },
    animation: {
      enter: 'slideInUp',
      exit: 'slideOutDown',
      duration: '0.5s'
    }
  })

  useEffect(() => {
    // Initialize socket connection for real-time updates
    const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001')
    setSocket(newSocket)

    // Join overlay room
    newSocket.emit('join-overlay', overlayId)

    // Listen for overlay updates
    newSocket.on('overlay-update', (data: OverlayData) => {
      setOverlayData(data)
    })

    // Listen for visibility changes
    newSocket.on('overlay-visibility', (visible: boolean) => {
      setIsVisible(visible)
    })

    // Listen for template config changes
    newSocket.on('template-config', (config: TemplateConfig) => {
      setTemplateConfig(config)
    })

    return () => {
      newSocket.disconnect()
    }
  }, [overlayId])

  const renderOverlay = () => {
    const style = {
      ...templateConfig.style,
      backgroundColor: overlayData.backgroundColor || templateConfig.style.backgroundColor,
      color: overlayData.color || templateConfig.style.color,
      display: isVisible ? 'block' : 'none',
      animation: isVisible ? 
        `${templateConfig.animation?.enter} ${templateConfig.animation?.duration}` : 
        `${templateConfig.animation?.exit} ${templateConfig.animation?.duration}`
    }

    switch (templateConfig.type) {
      case 'LOWER_THIRD':
        return (
          <div 
            className="fixed bottom-8 left-8 right-8 z-50"
            style={style}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                {overlayData.title && (
                  <h1 className="text-2xl font-bold mb-1">{overlayData.title}</h1>
                )}
                {overlayData.subtitle && (
                  <p className="text-lg opacity-90">{overlayData.subtitle}</p>
                )}
                {overlayData.text && (
                  <p className="text-base opacity-75 mt-1">{overlayData.text}</p>
                )}
              </div>
              {overlayData.imageUrl && (
                <div className="ml-4">
                  <img 
                    src={overlayData.imageUrl} 
                    alt="Overlay" 
                    className="h-16 w-16 rounded-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        )

      case 'BREAKING_NEWS':
        return (
          <div 
            className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50"
            style={style}
          >
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse mr-2"></div>
                <span className="text-sm font-bold">BREAKING NEWS</span>
                <div className="w-3 h-3 bg-white rounded-full animate-pulse ml-2"></div>
              </div>
              {overlayData.title && (
                <h1 className="text-2xl font-bold mb-1">{overlayData.title}</h1>
              )}
              {overlayData.text && (
                <p className="text-lg opacity-90">{overlayData.text}</p>
              )}
            </div>
          </div>
        )

      case 'TICKER':
        return (
          <div 
            className="fixed bottom-0 left-0 right-0 z-50"
            style={style}
          >
            <div className="flex items-center">
              <span className="bg-red-600 text-white px-3 py-2 text-sm font-bold mr-3">
                NEWS
              </span>
              <div className="flex-1 overflow-hidden">
                <div className="animate-marquee whitespace-nowrap">
                  {overlayData.text || '• Latest headlines from around the world • Breaking news updates • '}
                </div>
              </div>
            </div>
          </div>
        )

      case 'SCOREBUG':
        return (
          <div 
            className="fixed top-8 right-8 z-50"
            style={style}
          >
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-500 rounded mb-2"></div>
                <p className="text-sm font-bold">TEAM A</p>
                <p className="text-2xl font-bold">{overlayData.title || '0'}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-300">VS</p>
                <p className="text-sm text-gray-300">{overlayData.subtitle || '45:00'}</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-red-500 rounded mb-2"></div>
                <p className="text-sm font-bold">TEAM B</p>
                <p className="text-2xl font-bold">{overlayData.text || '0'}</p>
              </div>
            </div>
          </div>
        )

      case 'WEATHER':
        return (
          <div 
            className="fixed top-8 left-8 z-50"
            style={style}
          >
            <div className="flex items-center space-x-3">
              <div className="text-4xl">☀️</div>
              <div>
                <p className="text-xs opacity-75">CURRENT WEATHER</p>
                <p className="text-3xl font-bold">{overlayData.title || '72°F'}</p>
                <p className="text-sm">{overlayData.text || 'Partly Cloudy'}</p>
              </div>
            </div>
          </div>
        )

      case 'FULLSCREEN':
        return (
          <div 
            className="fixed inset-0 z-50"
            style={style}
          >
            <div className="flex items-center justify-center h-full text-center p-8">
              <div>
                {overlayData.title && (
                  <h1 className="text-4xl font-bold mb-4">{overlayData.title}</h1>
                )}
                {overlayData.subtitle && (
                  <p className="text-2xl opacity-90 mb-2">{overlayData.subtitle}</p>
                )}
                {overlayData.text && (
                  <p className="text-lg opacity-75">{overlayData.text}</p>
                )}
              </div>
            </div>
          </div>
        )

      case 'SOCIAL_MEDIA':
        return (
          <div 
            className="fixed bottom-8 right-8 z-50"
            style={style}
          >
            <div className="flex items-center space-x-3">
              <div className="text-2xl">📱</div>
              <div>
                <p className="text-sm opacity-75">SOCIAL MEDIA</p>
                {overlayData.title && (
                  <p className="font-bold">@{overlayData.title}</p>
                )}
                {overlayData.text && (
                  <p className="text-sm">{overlayData.text}</p>
                )}
              </div>
            </div>
          </div>
        )

      case 'LOGO_BUG':
        return (
          <div 
            className="fixed bottom-8 right-8 z-50"
            style={style}
          >
            <div className="flex items-center space-x-2">
              {overlayData.imageUrl ? (
                <img 
                  src={overlayData.imageUrl} 
                  alt="Logo" 
                  className="h-12 w-12 object-contain"
                />
              ) : (
                <div className="h-12 w-12 bg-white rounded flex items-center justify-center">
                  <span className="text-black font-bold text-xs">LOGO</span>
                </div>
              )}
              {overlayData.title && (
                <span className="text-sm font-bold">{overlayData.title}</span>
              )}
            </div>
          </div>
        )

      default:
        return (
          <div 
            className="fixed bottom-8 left-8 z-50"
            style={style}
          >
            <p>Overlay Content</p>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-transparent">
      {/* Global styles for animations */}
      <style jsx global>{`
        @keyframes slideInUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes slideOutDown {
          from {
            transform: translateY(0);
            opacity: 1;
          }
          to {
            transform: translateY(100%);
            opacity: 0;
          }
        }

        @keyframes marquee {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }

        .animate-marquee {
          animation: marquee 20s linear infinite;
        }

        .animate-slideInUp {
          animation: slideInUp 0.5s ease-out;
        }

        .animate-slideOutDown {
          animation: slideOutDown 0.5s ease-in;
        }
      `}</style>

      {/* Render the overlay */}
      {renderOverlay()}

      {/* Debug info (only visible in development) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-4 left-4 bg-black bg-opacity-75 text-white p-2 rounded text-xs z-50">
          <div>Overlay ID: {overlayId}</div>
          <div>Template: {templateConfig.type}</div>
          <div>Visible: {isVisible ? 'Yes' : 'No'}</div>
          <div>Connected: {socket ? 'Yes' : 'No'}</div>
        </div>
      )}
    </div>
  )
}