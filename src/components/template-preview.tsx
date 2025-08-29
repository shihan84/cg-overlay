"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Copy, Download, Edit, Play, X } from "lucide-react"

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

interface TemplatePreviewProps {
  template: Template
  onClose: () => void
}

export function TemplatePreview({ template, onClose }: TemplatePreviewProps) {
  const getTypeLabel = (type: string) => {
    const types = {
      "LOWER_THIRD": "Lower Third",
      "TICKER": "News Ticker",
      "FULLSCREEN": "Fullscreen Graphic",
      "SCOREBUG": "Score Bug",
      "WEATHER": "Weather Widget",
      "BREAKING_NEWS": "Breaking News",
      "SOCIAL_MEDIA": "Social Media",
      "LOGO_BUG": "Logo Bug",
    }
    return types[type as keyof typeof types] || type
  }

  const renderTemplatePreview = () => {
    switch (template.type) {
      case "LOWER_THIRD":
        return (
          <div className="relative bg-black rounded-lg overflow-hidden" style={{ height: "200px" }}>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-red-600 to-red-800 text-white p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold">John Doe</h3>
                  <p className="text-sm opacity-90">Senior Correspondent</p>
                </div>
                <div className="text-right">
                  <p className="text-xs opacity-75">LIVE</p>
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse ml-auto"></div>
                </div>
              </div>
            </div>
          </div>
        )

      case "BREAKING_NEWS":
        return (
          <div className="relative bg-black rounded-lg overflow-hidden" style={{ height: "200px" }}>
            <div className="absolute inset-0 bg-red-600 flex items-center justify-center">
              <div className="text-white text-center">
                <div className="flex items-center justify-center mb-2">
                  <div className="w-3 h-3 bg-white rounded-full animate-pulse mr-2"></div>
                  <span className="text-sm font-bold">BREAKING NEWS</span>
                  <div className="w-3 h-3 bg-white rounded-full animate-pulse ml-2"></div>
                </div>
                <h2 className="text-xl font-bold">Major Event Unfolding</h2>
                <p className="text-sm opacity-90 mt-1">Stay tuned for updates</p>
              </div>
            </div>
          </div>
        )

      case "TICKER":
        return (
          <div className="relative bg-black rounded-lg overflow-hidden" style={{ height: "200px" }}>
            <div className="absolute bottom-0 left-0 right-0 bg-blue-900 text-white p-2">
              <div className="flex items-center">
                <span className="bg-red-600 text-white px-2 py-1 text-xs font-bold mr-3">
                  NEWS
                </span>
                <div className="flex-1 overflow-hidden">
                  <div className="animate-marquee whitespace-nowrap">
                    • Latest headlines from around the world • Breaking news updates • 
                    Sports results • Weather forecast • Market updates • 
                    Technology news • Entertainment headlines • Political developments •
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case "SCOREBUG":
        return (
          <div className="relative bg-black rounded-lg overflow-hidden" style={{ height: "200px" }}>
            <div className="absolute top-4 right-4 bg-gray-900 bg-opacity-90 rounded-lg p-3 text-white">
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="w-8 h-8 bg-blue-500 rounded mb-1"></div>
                  <p className="text-xs font-bold">TEAM A</p>
                  <p className="text-lg font-bold">2</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-400">VS</p>
                  <p className="text-xs text-gray-400">45:00</p>
                </div>
                <div className="text-center">
                  <div className="w-8 h-8 bg-red-500 rounded mb-1"></div>
                  <p className="text-xs font-bold">TEAM B</p>
                  <p className="text-lg font-bold">1</p>
                </div>
              </div>
            </div>
          </div>
        )

      case "WEATHER":
        return (
          <div className="relative bg-black rounded-lg overflow-hidden" style={{ height: "200px" }}>
            <div className="absolute top-4 left-4 bg-blue-600 bg-opacity-90 rounded-lg p-3 text-white">
              <div className="flex items-center space-x-3">
                <div className="text-3xl">☀️</div>
                <div>
                  <p className="text-xs opacity-75">CURRENT WEATHER</p>
                  <p className="text-2xl font-bold">72°F</p>
                  <p className="text-xs">Partly Cloudy</p>
                </div>
              </div>
            </div>
          </div>
        )

      case "FULLSCREEN":
        return (
          <div className="relative bg-black rounded-lg overflow-hidden" style={{ height: "200px" }}>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-purple-900">
              <div className="flex items-center justify-center h-full text-white text-center p-4">
                <div>
                  <h1 className="text-2xl font-bold mb-2">MAJOR ANNOUNCEMENT</h1>
                  <p className="text-lg opacity-90">Important Headline Here</p>
                  <p className="text-sm opacity-75 mt-2">Additional details and information</p>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return (
          <div className="relative bg-black rounded-lg overflow-hidden" style={{ height: "200px" }}>
            <div className="flex items-center justify-center h-full text-white">
              <p>Template Preview</p>
            </div>
          </div>
        )
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>{template.name}</DialogTitle>
              <DialogDescription>{template.description}</DialogDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Template Info */}
          <div className="flex items-center space-x-2">
            <Badge variant="outline">
              {getTypeLabel(template.type)}
            </Badge>
            <Badge variant={template.isSystem ? "secondary" : "default"}>
              {template.isSystem ? "System" : "Custom"}
            </Badge>
            <Badge variant={template.isActive ? "default" : "secondary"}>
              {template.isActive ? "Active" : "Inactive"}
            </Badge>
            <span className="text-sm text-muted-foreground">
              Category: {template.category}
            </span>
          </div>

          {/* Preview */}
          <div className="border rounded-lg overflow-hidden">
            {renderTemplatePreview()}
          </div>

          {/* Actions */}
          <div className="flex space-x-2">
            <Button className="flex-1">
              <Play className="h-4 w-4 mr-2" />
              Use Template
            </Button>
            <Button variant="outline">
              <Copy className="h-4 w-4 mr-2" />
              Duplicate
            </Button>
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}