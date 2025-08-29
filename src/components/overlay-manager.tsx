"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Eye, Edit, Trash2, Play, Pause, Copy, ExternalLink, Settings } from "lucide-react"
import { OverlayControl } from "@/components/overlay-control"

interface Client {
  id: string
  name: string
  description?: string
  color?: string
  isActive: boolean
  createdAt: string
}

interface Overlay {
  id: string
  clientId: string
  templateId: string
  name: string
  isActive: boolean
  isVisible: boolean
  createdAt: string
  client?: Client
  templateType?: string
}

interface OverlayManagerProps {
  clients: Client[]
}

export function OverlayManager({ clients }: OverlayManagerProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedClient, setSelectedClient] = useState("all")
  const [showActiveOnly, setShowActiveOnly] = useState(false)
  const [selectedOverlay, setSelectedOverlay] = useState<Overlay | null>(null)

  // Mock overlays data with template types
  const overlays: Overlay[] = [
    {
      id: "1",
      clientId: "1",
      templateId: "1",
      name: "Main News Lower Third",
      isActive: true,
      isVisible: false,
      createdAt: "2024-01-15",
      client: clients.find(c => c.id === "1"),
      templateType: "LOWER_THIRD"
    },
    {
      id: "2",
      clientId: "1",
      templateId: "2",
      name: "Breaking News Banner",
      isActive: true,
      isVisible: true,
      createdAt: "2024-01-16",
      client: clients.find(c => c.id === "1"),
      templateType: "BREAKING_NEWS"
    },
    {
      id: "3",
      clientId: "2",
      templateId: "4",
      name: "Sports Score Bug",
      isActive: true,
      isVisible: false,
      createdAt: "2024-01-18",
      client: clients.find(c => c.id === "2"),
      templateType: "SCOREBUG"
    },
    {
      id: "4",
      clientId: "3",
      templateId: "5",
      name: "Weather Widget",
      isActive: false,
      isVisible: false,
      createdAt: "2024-01-19",
      client: clients.find(c => c.id === "3"),
      templateType: "WEATHER"
    }
  ]

  const filteredOverlays = overlays.filter(overlay => {
    const matchesSearch = overlay.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesClient = selectedClient === "all" || overlay.clientId === selectedClient
    const matchesActive = !showActiveOnly || overlay.isActive
    
    return matchesSearch && matchesClient && matchesActive
  })

  const handleToggleVisibility = (overlayId: string) => {
    // In a real app, this would update the overlay visibility via API
    console.log(`Toggling visibility for overlay ${overlayId}`)
  }

  const handleToggleActive = (overlayId: string) => {
    // In a real app, this would update the overlay active status via API
    console.log(`Toggling active status for overlay ${overlayId}`)
  }

  const getOverlayUrl = (overlayId: string) => {
    const overlay = overlays.find(o => o.id === overlayId)
    const templateType = overlay?.templateType || 'LOWER_THIRD'
    return `${window.location.origin}/overlay/${overlayId}?type=${templateType}`
  }

  const getTemplateTypeLabel = (type?: string) => {
    const labels = {
      "LOWER_THIRD": "Lower Third",
      "BREAKING_NEWS": "Breaking News",
      "TICKER": "News Ticker",
      "SCOREBUG": "Score Bug",
      "WEATHER": "Weather Widget",
      "FULLSCREEN": "Fullscreen",
      "SOCIAL_MEDIA": "Social Media",
      "LOGO_BUG": "Logo Bug"
    }
    return labels[type as keyof typeof labels] || type || "Unknown"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Overlay Management</h2>
          <p className="text-muted-foreground">
            Manage your active overlays and their visibility in OBS Studio
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Overlay
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search overlays..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <div className="flex gap-2 items-center">
          <Select value={selectedClient} onValueChange={setSelectedClient}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Clients" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Clients</SelectItem>
              {clients.map(client => (
                <SelectItem key={client.id} value={client.id}>
                  {client.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="activeOnly"
              checked={showActiveOnly}
              onCheckedChange={setShowActiveOnly}
            />
            <label htmlFor="activeOnly" className="text-sm">Active only</label>
          </div>
        </div>
      </div>

      {/* Overlay Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredOverlays.map((overlay) => (
          <Card key={overlay.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    {overlay.client && (
                      <Avatar className="h-6 w-6">
                        <AvatarFallback style={{ backgroundColor: overlay.client.color }}>
                          {overlay.client.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <CardTitle className="text-lg">{overlay.name}</CardTitle>
                  </div>
                  <CardDescription>
                    {overlay.client?.name} • {getTemplateTypeLabel(overlay.templateType)}
                  </CardDescription>
                </div>
                <div className="flex space-x-1">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" onClick={() => setSelectedOverlay(overlay)}>
                        <Settings className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Overlay Control: {overlay.name}</DialogTitle>
                        <DialogDescription>
                          Real-time control for OBS Studio overlay
                        </DialogDescription>
                      </DialogHeader>
                      {selectedOverlay && (
                        <OverlayControl
                          overlayId={selectedOverlay.id}
                          templateType={selectedOverlay.templateType || 'LOWER_THIRD'}
                          overlayName={selectedOverlay.name}
                        />
                      )}
                    </DialogContent>
                  </Dialog>
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={overlay.isActive}
                      onCheckedChange={() => handleToggleActive(overlay.id)}
                    />
                    <span className="text-sm">Active</span>
                  </div>
                  <Badge variant={overlay.isVisible ? "default" : "secondary"}>
                    {overlay.isVisible ? "Visible" : "Hidden"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Created: {new Date(overlay.createdAt).toLocaleDateString()}</span>
                  <Badge variant="outline">
                    {overlay.isVisible ? "LIVE" : "OFFLINE"}
                  </Badge>
                </div>

                {/* OBS URL */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">OBS URL:</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 text-xs"
                      onClick={() => navigator.clipboard.writeText(getOverlayUrl(overlay.id))}
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </Button>
                  </div>
                  <div className="bg-muted p-2 rounded text-xs font-mono break-all">
                    {getOverlayUrl(overlay.id)}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1" asChild>
                    <a href={getOverlayUrl(overlay.id)} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Preview
                    </a>
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => setSelectedOverlay(overlay)}>
                        <Settings className="h-4 w-4 mr-2" />
                        Control
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Overlay Control: {overlay.name}</DialogTitle>
                        <DialogDescription>
                          Real-time control for OBS Studio overlay
                        </DialogDescription>
                      </DialogHeader>
                      {selectedOverlay && (
                        <OverlayControl
                          overlayId={selectedOverlay.id}
                          templateType={selectedOverlay.templateType || 'LOWER_THIRD'}
                          overlayName={selectedOverlay.name}
                        />
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredOverlays.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No overlays found matching your filters.</p>
        </div>
      )}

      {/* OBS Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>OBS Studio Integration</CardTitle>
          <CardDescription>
            How to add overlays to OBS Studio
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">1</div>
                <span className="font-medium">Add Browser Source</span>
              </div>
              <p className="text-sm text-muted-foreground">
                In OBS, right-click in your scene and select "Add" → "Browser"
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">2</div>
                <span className="font-medium">Enter URL</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Copy the overlay URL and paste it into the URL field
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">3</div>
                <span className="font-medium">Configure Size</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Set width and height (typically 1920x1080 for full screen)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}