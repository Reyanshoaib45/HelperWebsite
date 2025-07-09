"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, Search, Check, ExternalLink, Star } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface CDNResource {
  name: string
  description: string
  url: string
  category: string
  version?: string
  popular?: boolean
}

const cdnResources: CDNResource[] = [
  // CSS Frameworks
  {
    name: "Tailwind CSS",
    description: "Utility-first CSS framework",
    url: "https://cdn.tailwindcss.com",
    category: "css",
    popular: true,
  },
  {
    name: "Bootstrap",
    description: "Popular CSS framework",
    url: "https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css",
    category: "css",
    version: "5.3.2",
    popular: true,
  },
  {
    name: "Bulma",
    description: "Modern CSS framework based on Flexbox",
    url: "https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css",
    category: "css",
    version: "0.9.4",
  },

  // JavaScript Libraries
  {
    name: "jQuery",
    description: "Fast, small, and feature-rich JavaScript library",
    url: "https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js",
    category: "javascript",
    version: "3.7.1",
    popular: true,
  },
  {
    name: "React",
    description: "JavaScript library for building user interfaces",
    url: "https://unpkg.com/react@18/umd/react.production.min.js",
    category: "javascript",
    version: "18",
    popular: true,
  },
  {
    name: "Vue.js",
    description: "Progressive JavaScript framework",
    url: "https://cdn.jsdelivr.net/npm/vue@3.3.8/dist/vue.global.prod.js",
    category: "javascript",
    version: "3.3.8",
    popular: true,
  },

  // Animation Libraries
  {
    name: "AOS (Animate On Scroll)",
    description: "Animate elements on scroll",
    url: "https://cdn.jsdelivr.net/npm/aos@2.3.4/dist/aos.css",
    category: "animation",
    version: "2.3.4",
    popular: true,
  },
  {
    name: "Animate.css",
    description: "Cross-browser CSS animations",
    url: "https://cdn.jsdelivr.net/npm/animate.css@4.1.1/animate.min.css",
    category: "animation",
    version: "4.1.1",
    popular: true,
  },
  {
    name: "GSAP",
    description: "Professional-grade animation library",
    url: "https://cdn.jsdelivr.net/npm/gsap@3.12.2/dist/gsap.min.js",
    category: "animation",
    version: "3.12.2",
    popular: true,
  },

  // Helpful Websites
  {
    name: "Animista",
    description: "CSS animations on demand",
    url: "https://animista.net",
    category: "animation-help",
    popular: true,
  },
  {
    name: "CSS-Tricks",
    description: "Tips, tricks, and techniques on CSS",
    url: "https://css-tricks.com",
    category: "css-help",
    popular: true,
  },
  {
    name: "HTML5 UP",
    description: "Responsive HTML5 and CSS3 site templates",
    url: "https://html5up.net",
    category: "themes",
    popular: true,
  },
  {
    name: "shadcn/ui",
    description: "Beautifully designed components",
    url: "https://ui.shadcn.com",
    category: "components",
    popular: true,
  },
]

const categories = [
  { id: "all", name: "All Resources", count: cdnResources.length },
  { id: "css", name: "CSS Frameworks", count: cdnResources.filter((r) => r.category === "css").length },
  { id: "javascript", name: "JavaScript", count: cdnResources.filter((r) => r.category === "javascript").length },
  { id: "animation", name: "Animation", count: cdnResources.filter((r) => r.category === "animation").length },
  {
    id: "animation-help",
    name: "Animation Help",
    count: cdnResources.filter((r) => r.category === "animation-help").length,
  },
  { id: "css-help", name: "CSS Help", count: cdnResources.filter((r) => r.category === "css-help").length },
  { id: "themes", name: "Free Themes", count: cdnResources.filter((r) => r.category === "themes").length },
  { id: "components", name: "Components", count: cdnResources.filter((r) => r.category === "components").length },
]

export function CDNResources() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null)
  const { toast } = useToast()

  const filteredResources = cdnResources.filter((resource) => {
    const matchesSearch =
      resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = activeCategory === "all" || resource.category === activeCategory
    return matchesSearch && matchesCategory
  })

  const copyToClipboard = async (url: string, name: string) => {
    try {
      await navigator.clipboard.writeText(url)
      setCopiedUrl(url)
      toast({
        title: "Copied!",
        description: `${name} CDN link copied to clipboard`,
      })
      setTimeout(() => setCopiedUrl(null), 2000)
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      })
    }
  }

  return (
    <div>
      {/* Search */}
      <div className="max-w-md mx-auto mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search resources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder-slate-400 focus:border-purple-500"
          />
        </div>
      </div>

      {/* Categories */}
      <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 mb-8 bg-slate-800/50 border-slate-700 h-auto flex-wrap">
          {categories.map((category) => (
            <TabsTrigger
              key={category.id}
              value={category.id}
              className="text-xs lg:text-sm data-[state=active]:bg-purple-600 data-[state=active]:text-white whitespace-nowrap"
            >
              {category.name}
              <Badge variant="secondary" className="ml-1 text-xs">
                {category.count}
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeCategory} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredResources.map((resource, index) => (
              <Card
                key={index}
                className="bg-slate-800/50 border-slate-700 hover:border-purple-500 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-white flex items-center gap-2">
                        {resource.name}
                        {resource.popular && <Star className="w-4 h-4 text-yellow-400 fill-current" />}
                      </CardTitle>
                      <CardDescription className="text-slate-400 mt-1">{resource.description}</CardDescription>
                    </div>
                  </div>
                  {resource.version && (
                    <Badge variant="outline" className="w-fit text-xs border-slate-600 text-slate-300">
                      v{resource.version}
                    </Badge>
                  )}
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="bg-slate-900/50 rounded-lg p-3 mb-4">
                    <code className="text-sm text-green-400 break-all">{resource.url}</code>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => copyToClipboard(resource.url, resource.name)}
                      className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                      size="sm"
                    >
                      {copiedUrl === resource.url ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-2" />
                          Copy
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={() => window.open(resource.url, "_blank")}
                      variant="outline"
                      size="sm"
                      className="border-slate-600 text-slate-300 hover:bg-slate-700"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredResources.length === 0 && (
            <div className="text-center py-12">
              <div className="text-slate-400 text-lg mb-2">No resources found</div>
              <div className="text-slate-500">Try adjusting your search or category filter</div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
