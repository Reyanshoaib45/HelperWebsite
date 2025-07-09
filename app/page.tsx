"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CDNResources } from "@/components/cdn-resources"
import { TaskManager } from "@/components/task-manager"
import { KnowledgeHub } from "@/components/knowledge-hub"
import { DeveloperDashboard } from "@/components/developer-dashboard"

export default function DeveloperHubPage() {
  const [activeTab, setActiveTab] = useState("resources")

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Developer Hub
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Your complete toolkit for web development - CDN resources, task management, knowledge base, and developer
            tools.
          </p>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8 bg-slate-800/50 border-slate-700">
            <TabsTrigger value="resources" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              CDN Resources
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              Developer Dashboard
            </TabsTrigger>
            <TabsTrigger value="tasks" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              Task Manager
            </TabsTrigger>
            <TabsTrigger value="knowledge" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              Knowledge Hub
            </TabsTrigger>
          </TabsList>

          {/* CDN Resources Tab */}
          <TabsContent value="resources">
            <CDNResources />
          </TabsContent>

          {/* Developer Dashboard Tab */}
          <TabsContent value="dashboard">
            <DeveloperDashboard />
          </TabsContent>

          {/* Task Manager Tab */}
          <TabsContent value="tasks">
            <TaskManager />
          </TabsContent>

          {/* Knowledge Hub Tab */}
          <TabsContent value="knowledge">
            <KnowledgeHub />
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="mt-16 text-center">
          <div className="bg-slate-800/30 rounded-lg p-6 max-w-4xl mx-auto">
            <h3 className="text-white text-lg font-semibold mb-2">Complete Developer Toolkit</h3>
            <p className="text-slate-400 mb-4">
              Everything you need for modern web development - from CDN resources and helpful websites to personal task
              management, knowledge organization, and developer tools.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-slate-500 mb-6">
              <div>
                <strong className="text-slate-400">CDN Resources</strong>
                <br />
                Essential libraries, frameworks, and helpful websites
              </div>
              <div>
                <strong className="text-slate-400">Developer Dashboard</strong>
                <br />
                Shortcuts, Git commands, code snippets, and error solutions
              </div>
              <div>
                <strong className="text-slate-400">Task Manager</strong>
                <br />
                Organize your development tasks with priorities and deadlines
              </div>
              <div>
                <strong className="text-slate-400">Knowledge Hub</strong>
                <br />
                Store code snippets, notes, and learning resources
              </div>
            </div>
            <div className="border-t border-slate-700 pt-4">
              <p className="text-slate-500 text-sm">
                Developed by <span className="text-purple-400 font-semibold">M Reyan Shoaib</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
