"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Plus, Play, Pause, Square, Settings, Users, Clock, Calendar, Radio } from "lucide-react"

interface Client {
  id: string
  name: string
  description?: string
  color?: string
  isActive: boolean
  createdAt: string
}

interface Broadcast {
  id: string
  clientId: string
  name: string
  description?: string
  isActive: boolean
  startTime?: string
  endTime?: string
  createdAt: string
  client?: Client
}

interface BroadcastManagerProps {
  clients: Client[]
}

export function BroadcastManager({ clients }: BroadcastManagerProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedClient, setSelectedClient] = useState("all")
  const [showActiveOnly, setShowActiveOnly] = useState(false)

  // Mock broadcasts data
  const broadcasts: Broadcast[] = [
    {
      id: "1",
      clientId: "1",
      name: "Morning News Broadcast",
      description: "Daily morning news show",
      isActive: true,
      startTime: "2024-01-20T08:00:00Z",
      endTime: "2024-01-20T10:00:00Z",
      createdAt: "2024-01-19",
      client: clients.find(c => c.id === "1")
    },
    {
      id: "2",
      clientId: "2",
      name: "Live Sports Coverage",
      description: "Championship game live coverage",
      isActive: true,
      startTime: "2024-01-20T19:00:00Z",
      endTime: "2024-01-20T22:00:00Z",
      createdAt: "2024-01-19",
      client: clients.find(c => c.id === "2")
    },
    {
      id: "3",
      clientId: "1",
      name: "Evening News",
      description: "Prime time news broadcast",
      isActive: false,
      startTime: "2024-01-20T18:00:00Z",
      endTime: "2024-01-20T19:00:00Z",
      createdAt: "2024-01-19",
      client: clients.find(c => c.id === "1")
    },
    {
      id: "4",
      clientId: "3",
      name: "Weather Update",
      description: "Hourly weather forecast",
      isActive: false,
      startTime: "2024-01-20T12:00:00Z",
      endTime: "2024-01-20T12:15:00Z",
      createdAt: "2024-01-20",
      client: clients.find(c => c.id === "3")
    }
  ]

  const filteredBroadcasts = broadcasts.filter(broadcast => {
    const matchesSearch = broadcast.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         broadcast.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesClient = selectedClient === "all" || broadcast.clientId === selectedClient
    const matchesActive = !showActiveOnly || broadcast.isActive
    
    return matchesSearch && matchesClient && matchesActive
  })

  const handleToggleBroadcast = (broadcastId: string) => {
    // In a real app, this would start/stop the broadcast via API
    console.log(`Toggling broadcast ${broadcastId}`)
  }

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return "Not scheduled"
    return new Date(dateString).toLocaleString()
  }

  const getBroadcastStatus = (broadcast: Broadcast) => {
    if (!broadcast.isActive) return "Scheduled"
    
    const now = new Date()
    const startTime = broadcast.startTime ? new Date(broadcast.startTime) : null
    const endTime = broadcast.endTime ? new Date(broadcast.endTime) : null
    
    if (!startTime || !endTime) return "Active"
    
    if (now < startTime) return "Scheduled"
    if (now > endTime) return "Ended"
    return "Live"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Live": return "default"
      case "Scheduled": return "secondary"
      case "Ended": return "outline"
      default: return "secondary"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Broadcast Management</h2>
          <p className="text-muted-foreground">
            Manage your broadcast sessions and schedules
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Broadcast
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search broadcasts..."
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
            <input
              type="checkbox"
              id="activeOnly"
              checked={showActiveOnly}
              onChange={(e) => setShowActiveOnly(e.target.checked)}
              className="rounded"
            />
            <label htmlFor="activeOnly" className="text-sm">Active only</label>
          </div>
        </div>
      </div>

      {/* Broadcast Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {filteredBroadcasts.map((broadcast) => {
          const status = getBroadcastStatus(broadcast)
          return (
            <Card key={broadcast.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      {broadcast.client && (
                        <Avatar className="h-6 w-6">
                          <AvatarFallback style={{ backgroundColor: broadcast.client.color }}>
                            {broadcast.client.name.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <CardTitle className="text-lg">{broadcast.name}</CardTitle>
                    </div>
                    <CardDescription>{broadcast.description}</CardDescription>
                  </div>
                  <div className="flex space-x-1">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleToggleBroadcast(broadcast.id)}
                    >
                      {broadcast.isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge variant={getStatusColor(status)}>
                      {status}
                    </Badge>
                    <Badge variant={broadcast.isActive ? "default" : "secondary"}>
                      {broadcast.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Start:</span>
                      <span>{formatDateTime(broadcast.startTime)}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">End:</span>
                      <span>{formatDateTime(broadcast.endTime)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Created: {new Date(broadcast.createdAt).toLocaleDateString()}</span>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>0 overlays</span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button 
                      variant={broadcast.isActive ? "destructive" : "default"} 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleToggleBroadcast(broadcast.id)}
                    >
                      {broadcast.isActive ? (
                        <>
                          <Square className="h-4 w-4 mr-2" />
                          Stop
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          Start
                        </>
                      )}
                    </Button>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-2" />
                      Configure
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredBroadcasts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No broadcasts found matching your filters.</p>
        </div>
      )}

      {/* Broadcast Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Play className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {broadcasts.filter(b => b.isActive).length}
                </p>
                <p className="text-xs text-muted-foreground">Active Broadcasts</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{clients.length}</p>
                <p className="text-xs text-muted-foreground">Total Clients</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Radio className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {broadcasts.filter(b => getBroadcastStatus(b) === "Live").length}
                </p>
                <p className="text-xs text-muted-foreground">Live Now</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="h-4 w-4 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {broadcasts.filter(b => getBroadcastStatus(b) === "Scheduled").length}
                </p>
                <p className="text-xs text-muted-foreground">Scheduled</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}