"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Plus, Settings, Users, LayoutTemplate, Broadcast, Eye, Edit, Trash2 } from "lucide-react"
import { ClientForm } from "@/components/client-form"
import { TemplateManager } from "@/components/template-manager"
import { OverlayManager } from "@/components/overlay-manager"
import { BroadcastManager } from "@/components/broadcast-manager"

interface Client {
  id: string
  name: string
  description?: string
  logo?: string
  color?: string
  isActive: boolean
  createdAt: string
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("clients")
  const [showClientForm, setShowClientForm] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  
  // Mock data for demonstration
  const [clients, setClients] = useState<Client[]>([
    {
      id: "1",
      name: "News Channel 24",
      description: "24/7 News Broadcasting",
      color: "#ef4444",
      isActive: true,
      createdAt: "2024-01-15"
    },
    {
      id: "2", 
      name: "Sports Network",
      description: "Live Sports Coverage",
      color: "#3b82f6",
      isActive: true,
      createdAt: "2024-01-20"
    },
    {
      id: "3",
      name: "Weather Service",
      description: "Weather Updates & Forecasts", 
      color: "#10b981",
      isActive: false,
      createdAt: "2024-02-01"
    }
  ])

  const handleCreateClient = () => {
    setEditingClient(null)
    setShowClientForm(true)
  }

  const handleEditClient = (client: Client) => {
    setEditingClient(client)
    setShowClientForm(true)
  }

  const handleDeleteClient = (clientId: string) => {
    setClients(clients.filter(c => c.id !== clientId))
  }

  const handleSaveClient = (clientData: Partial<Client>) => {
    if (editingClient) {
      // Update existing client
      setClients(clients.map(c => 
        c.id === editingClient.id ? { ...c, ...clientData } : c
      ))
    } else {
      // Create new client
      const newClient: Client = {
        id: Date.now().toString(),
        name: clientData.name || "",
        description: clientData.description,
        color: clientData.color,
        isActive: true,
        createdAt: new Date().toISOString()
      }
      setClients([...clients, newClient])
    }
    setShowClientForm(false)
    setEditingClient(null)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="flex h-16 items-center px-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Broadcast className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-semibold">CG Overlay Studio</h1>
            </div>
            <Badge variant="secondary">Professional Broadcasting</Badge>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 border-r bg-card/50">
          <nav className="p-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} orientation="vertical" className="w-full">
              <TabsList className="grid grid-cols-1 h-auto bg-transparent p-0 space-y-1">
                <TabsTrigger 
                  value="clients" 
                  className="w-full justify-start data-[state=active]:bg-accent"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Clients
                </TabsTrigger>
                <TabsTrigger 
                  value="templates" 
                  className="w-full justify-start data-[state=active]:bg-accent"
                >
                  <LayoutTemplate className="h-4 w-4 mr-2" />
                  Templates
                </TabsTrigger>
                <TabsTrigger 
                  value="overlays" 
                  className="w-full justify-start data-[state=active]:bg-accent"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Overlays
                </TabsTrigger>
                <TabsTrigger 
                  value="broadcasts" 
                  className="w-full justify-start data-[state=active]:bg-accent"
                >
                  <Broadcast className="h-4 w-4 mr-2" />
                  Broadcasts
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <Tabs value={activeTab} className="w-full">
            {/* Clients Tab */}
            <TabsContent value="clients" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">Client Management</h2>
                  <p className="text-muted-foreground">
                    Manage your broadcasting clients and their branding
                  </p>
                </div>
                <Button onClick={handleCreateClient}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Client
                </Button>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {clients.map((client) => (
                  <Card key={client.id} className="relative">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback style={{ backgroundColor: client.color }}>
                              {client.name.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-lg">{client.name}</CardTitle>
                            <CardDescription>{client.description}</CardDescription>
                          </div>
                        </div>
                        <div className="flex space-x-1">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleEditClient(client)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDeleteClient(client.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <Badge variant={client.isActive ? "default" : "secondary"}>
                          {client.isActive ? "Active" : "Inactive"}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          Created: {new Date(client.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Templates Tab */}
            <TabsContent value="templates">
              <TemplateManager />
            </TabsContent>

            {/* Overlays Tab */}
            <TabsContent value="overlays">
              <OverlayManager clients={clients} />
            </TabsContent>

            {/* Broadcasts Tab */}
            <TabsContent value="broadcasts">
              <BroadcastManager clients={clients} />
            </TabsContent>
          </Tabs>
        </main>
      </div>

      {/* Client Form Dialog */}
      {showClientForm && (
        <ClientForm
          client={editingClient}
          onSave={handleSaveClient}
          onCancel={() => {
            setShowClientForm(false)
            setEditingClient(null)
          }}
        />
      )}
    </div>
  )
}