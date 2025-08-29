"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Eye, Edit, Copy, Download, Play } from "lucide-react"
import { TemplatePreview } from "@/components/template-preview"

interface Template {
  id: string
  name: string
  description?: string
  type: string
  category: string
  isSystem: boolean
  isActive: boolean
  createdAt: string
}

const templateTypes = [
  { value: "LOWER_THIRD", label: "Lower Third" },
  { value: "TICKER", label: "News Ticker" },
  { value: "FULLSCREEN", label: "Fullscreen Graphic" },
  { value: "SCOREBUG", label: "Score Bug" },
  { value: "WEATHER", label: "Weather Widget" },
  { value: "BREAKING_NEWS", label: "Breaking News" },
  { value: "SOCIAL_MEDIA", label: "Social Media" },
  { value: "LOGO_BUG", label: "Logo Bug" },
]

const categories = [
  "News",
  "Sports", 
  "Weather",
  "Business",
  "Entertainment",
  "Politics",
  "Technology",
]

export function TemplateManager() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [showPreview, setShowPreview] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)

  // Mock templates data
  const templates: Template[] = [
    {
      id: "1",
      name: "Classic Lower Third",
      description: "Clean and professional lower third for news broadcasts",
      type: "LOWER_THIRD",
      category: "News",
      isSystem: true,
      isActive: true,
      createdAt: "2024-01-15"
    },
    {
      id: "2",
      name: "Breaking News Banner",
      description: "Animated breaking news template with urgent styling",
      type: "BREAKING_NEWS",
      category: "News",
      isSystem: true,
      isActive: true,
      createdAt: "2024-01-16"
    },
    {
      id: "3",
      name: "News Ticker",
      description: "Scrolling news ticker for bottom of screen",
      type: "TICKER",
      category: "News",
      isSystem: true,
      isActive: true,
      createdAt: "2024-01-17"
    },
    {
      id: "4",
      name: "Sports Score Bug",
      description: "Live sports score with team logos and time",
      type: "SCOREBUG",
      category: "Sports",
      isSystem: true,
      isActive: true,
      createdAt: "2024-01-18"
    },
    {
      id: "5",
      name: "Weather Update",
      description: "Current weather conditions with forecast",
      type: "WEATHER",
      category: "Weather",
      isSystem: true,
      isActive: true,
      createdAt: "2024-01-19"
    },
    {
      id: "6",
      name: "Fullscreen Headline",
      description: "Full screen headline with background image",
      type: "FULLSCREEN",
      category: "News",
      isSystem: true,
      isActive: true,
      createdAt: "2024-01-20"
    }
  ]

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === "all" || template.type === selectedType
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory
    
    return matchesSearch && matchesType && matchesCategory
  })

  const handlePreview = (template: Template) => {
    setSelectedTemplate(template)
    setShowPreview(true)
  }

  const getTypeLabel = (type: string) => {
    return templateTypes.find(t => t.value === type)?.label || type
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Template Library</h2>
          <p className="text-muted-foreground">
            Manage and customize your broadcast graphics templates
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Template
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <div className="flex gap-2">
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {templateTypes.map(type => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Template Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="relative group">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </div>
                <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handlePreview(template)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="outline">
                    {getTypeLabel(template.type)}
                  </Badge>
                  <Badge variant={template.isSystem ? "secondary" : "default"}>
                    {template.isSystem ? "System" : "Custom"}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Category: {template.category}
                  </span>
                  <Badge variant={template.isActive ? "default" : "secondary"}>
                    {template.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>

                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Play className="h-4 w-4 mr-2" />
                    Use Template
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No templates found matching your filters.</p>
        </div>
      )}

      {/* Template Preview Modal */}
      {showPreview && selectedTemplate && (
        <TemplatePreview
          template={selectedTemplate}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  )
}