"use client"

import { useState, useEffect } from "react"
import { io, Socket } from "socket.io-client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, Eye, EyeOff, Settings, Save, RefreshCw } from "lucide-react"

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

interface OverlayControlProps {
  overlayId: string
  templateType: string
  overlayName: string
}

export function OverlayControl({ overlayId, templateType, overlayName }: OverlayControlProps) {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [overlayData, setOverlayData] = useState<OverlayData>({})
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
  const [isConnected, setIsConnected] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001')
    setSocket(newSocket)

    newSocket.on('connect', () => {
      setIsConnected(true)
      newSocket.emit('join-overlay', overlayId)
    })

    newSocket.on('disconnect', () => {
      setIsConnected(false)
    })

    // Listen for overlay updates
    newSocket.on('overlay-update', (data: OverlayData) => {
      setOverlayData(data)
      setIsVisible(data.isVisible || false)
    })

    // Listen for visibility changes
    newSocket.on('overlay-visibility', (visible: boolean) => {
      setIsVisible(visible)
    })

    // Get current overlay data
    newSocket.emit('get-overlay-data', overlayId, (data: OverlayData) => {
      setOverlayData(data)
      setIsVisible(data.isVisible || false)
    })

    // Get current template config
    newSocket.emit('get-template-config', overlayId, (config: TemplateConfig) => {
      setTemplateConfig(config)
    })

    return () => {
      newSocket.disconnect()
    }
  }, [overlayId])

  const handleDataChange = (field: keyof OverlayData, value: any) => {
    const newData = { ...overlayData, [field]: value }
    setOverlayData(newData)
    
    if (socket) {
      socket.emit('update-overlay', {
        overlayId,
        data: newData
      })
    }
  }

  const handleVisibilityToggle = (visible: boolean) => {
    setIsVisible(visible)
    
    if (socket) {
      socket.emit('toggle-visibility', {
        overlayId,
        visible
      })
    }
  }

  const handleConfigChange = (field: string, value: any) => {
    const newConfig = { ...templateConfig }
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      ;(newConfig as any)[parent][child] = value
    } else {
      ;(newConfig as any)[field] = value
    }
    
    setTemplateConfig(newConfig)
    
    if (socket) {
      socket.emit('update-template-config', {
        overlayId,
        config: newConfig
      })
    }
  }

  const getOverlayUrl = () => {
    return `${window.location.origin}/overlay/${overlayId}?type=${templateType}`
  }

  const renderFieldControls = () => {
    switch (templateType) {
      case 'LOWER_THIRD':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={overlayData.title || ''}
                onChange={(e) => handleDataChange('title', e.target.value)}
                placeholder="Enter title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subtitle">Subtitle</Label>
              <Input
                id="subtitle"
                value={overlayData.subtitle || ''}
                onChange={(e) => handleDataChange('subtitle', e.target.value)}
                placeholder="Enter subtitle"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="text">Additional Text</Label>
              <Input
                id="text"
                value={overlayData.text || ''}
                onChange={(e) => handleDataChange('text', e.target.value)}
                placeholder="Enter additional text"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="imageUrl">Profile Image URL</Label>
              <Input
                id="imageUrl"
                value={overlayData.imageUrl || ''}
                onChange={(e) => handleDataChange('imageUrl', e.target.value)}
                placeholder="Enter image URL"
              />
            </div>
          </div>
        )

      case 'BREAKING_NEWS':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Headline</Label>
              <Input
                id="title"
                value={overlayData.title || ''}
                onChange={(e) => handleDataChange('title', e.target.value)}
                placeholder="Enter headline"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="text">Description</Label>
              <Textarea
                id="text"
                value={overlayData.text || ''}
                onChange={(e) => handleDataChange('text', e.target.value)}
                placeholder="Enter description"
                rows={3}
              />
            </div>
          </div>
        )

      case 'TICKER':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="text">Ticker Text</Label>
              <Textarea
                id="text"
                value={overlayData.text || ''}
                onChange={(e) => handleDataChange('text', e.target.value)}
                placeholder="Enter ticker text"
                rows={3}
              />
            </div>
          </div>
        )

      case 'SCOREBUG':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Team A Score</Label>
                <Input
                  id="title"
                  value={overlayData.title || ''}
                  onChange={(e) => handleDataChange('title', e.target.value)}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="text">Team B Score</Label>
                <Input
                  id="text"
                  value={overlayData.text || ''}
                  onChange={(e) => handleDataChange('text', e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="subtitle">Time</Label>
              <Input
                id="subtitle"
                value={overlayData.subtitle || ''}
                onChange={(e) => handleDataChange('subtitle', e.target.value)}
                placeholder="45:00"
              />
            </div>
          </div>
        )

      case 'WEATHER':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Temperature</Label>
              <Input
                id="title"
                value={overlayData.title || ''}
                onChange={(e) => handleDataChange('title', e.target.value)}
                placeholder="72°F"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="text">Conditions</Label>
              <Input
                id="text"
                value={overlayData.text || ''}
                onChange={(e) => handleDataChange('text', e.target.value)}
                placeholder="Partly Cloudy"
              />
            </div>
          </div>
        )

      default:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={overlayData.title || ''}
                onChange={(e) => handleDataChange('title', e.target.value)}
                placeholder="Enter title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="text">Text</Label>
              <Textarea
                id="text"
                value={overlayData.text || ''}
                onChange={(e) => handleDataChange('text', e.target.value)}
                placeholder="Enter text"
                rows={3}
              />
            </div>
          </div>
        )
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <span>{overlayName}</span>
              <Badge variant={isConnected ? "default" : "secondary"}>
                {isConnected ? "Connected" : "Disconnected"}
              </Badge>
            </CardTitle>
            <CardDescription>
              Real-time overlay control for OBS Studio
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant={isVisible ? "destructive" : "default"}
              size="sm"
              onClick={() => handleVisibilityToggle(!isVisible)}
            >
              {isVisible ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
              {isVisible ? "Hide" : "Show"}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* OBS URL */}
        <div className="space-y-2">
          <Label>OBS Studio URL</Label>
          <div className="flex space-x-2">
            <Input
              value={getOverlayUrl()}
              readOnly
              className="flex-1 font-mono text-xs"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigator.clipboard.writeText(getOverlayUrl())}
            >
              Copy
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Use this URL in OBS Studio Browser Source
          </p>
        </div>

        {/* Content Controls */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Content</h3>
          {renderFieldControls()}
        </div>

        {/* Style Controls */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Style</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="backgroundColor">Background Color</Label>
              <div className="flex space-x-2">
                <Input
                  id="backgroundColor"
                  type="color"
                  value={overlayData.backgroundColor || templateConfig.style.backgroundColor || '#000000'}
                  onChange={(e) => handleDataChange('backgroundColor', e.target.value)}
                  className="w-12 h-10 p-1"
                />
                <Input
                  value={overlayData.backgroundColor || templateConfig.style.backgroundColor || '#000000'}
                  onChange={(e) => handleDataChange('backgroundColor', e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="color">Text Color</Label>
              <div className="flex space-x-2">
                <Input
                  id="color"
                  type="color"
                  value={overlayData.color || templateConfig.style.color || '#ffffff'}
                  onChange={(e) => handleDataChange('color', e.target.value)}
                  className="w-12 h-10 p-1"
                />
                <Input
                  value={overlayData.color || templateConfig.style.color || '#ffffff'}
                  onChange={(e) => handleDataChange('color', e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm text-muted-foreground">
              {isConnected ? 'Connected to server' : 'Disconnected from server'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={isVisible ? "default" : "secondary"}>
              {isVisible ? 'Visible' : 'Hidden'}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}