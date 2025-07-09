"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Calendar, Edit, Trash2, Archive, AlertCircle, Clock, CheckCircle2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Task {
  id: string
  title: string
  description: string
  deadline: string
  priority: "low" | "medium" | "high"
  completed: boolean
  archived: boolean
  createdAt: string
}

export function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [taskFilter, setTaskFilter] = useState("all")
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    deadline: "",
    priority: "medium" as "low" | "medium" | "high",
  })
  const { toast } = useToast()

  // Load data from localStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks")
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks))
    }
  }, [])

  // Save tasks to localStorage
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks))
  }, [tasks])

  const addTask = () => {
    const newTask: Task = {
      id: Date.now().toString(),
      title: taskForm.title,
      description: taskForm.description,
      deadline: taskForm.deadline,
      priority: taskForm.priority,
      completed: false,
      archived: false,
      createdAt: new Date().toISOString(),
    }
    setTasks([...tasks, newTask])
    setTaskForm({ title: "", description: "", deadline: "", priority: "medium" })
    setIsTaskDialogOpen(false)
    toast({ title: "Task added successfully!" })
  }

  const updateTask = () => {
    if (!editingTask) return

    const updatedTasks = tasks.map((task) => (task.id === editingTask.id ? { ...task, ...taskForm } : task))
    setTasks(updatedTasks)
    setEditingTask(null)
    setTaskForm({ title: "", description: "", deadline: "", priority: "medium" })
    setIsTaskDialogOpen(false)
    toast({ title: "Task updated successfully!" })
  }

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id))
    toast({ title: "Task deleted successfully!" })
  }

  const toggleTaskComplete = (id: string) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
  }

  const archiveTask = (id: string) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, archived: true } : task)))
    toast({ title: "Task archived!" })
  }

  const filteredTasks = tasks.filter((task) => {
    if (task.archived) return false

    const today = new Date().toDateString()
    const taskDate = new Date(task.deadline).toDateString()
    const isOverdue = new Date(task.deadline) < new Date() && !task.completed

    switch (taskFilter) {
      case "today":
        return taskDate === today
      case "upcoming":
        return new Date(task.deadline) > new Date()
      case "overdue":
        return isOverdue
      case "completed":
        return task.completed
      default:
        return true
    }
  })

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-400 bg-red-400/10"
      case "medium":
        return "text-yellow-400 bg-yellow-400/10"
      case "low":
        return "text-green-400 bg-green-400/10"
      default:
        return "text-slate-400 bg-slate-400/10"
    }
  }

  const openTaskDialog = (task?: Task) => {
    if (task) {
      setEditingTask(task)
      setTaskForm({
        title: task.title,
        description: task.description,
        deadline: task.deadline,
        priority: task.priority,
      })
    } else {
      setEditingTask(null)
      setTaskForm({ title: "", description: "", deadline: "", priority: "medium" })
    }
    setIsTaskDialogOpen(true)
  }

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={taskFilter === "all" ? "default" : "outline"}
            onClick={() => setTaskFilter("all")}
            size="sm"
            className={taskFilter === "all" ? "bg-purple-600" : "border-slate-600 text-slate-300"}
          >
            All ({tasks.filter((t) => !t.archived).length})
          </Button>
          <Button
            variant={taskFilter === "today" ? "default" : "outline"}
            onClick={() => setTaskFilter("today")}
            size="sm"
            className={taskFilter === "today" ? "bg-purple-600" : "border-slate-600 text-slate-300"}
          >
            <Calendar className="w-4 h-4 mr-1" />
            Today
          </Button>
          <Button
            variant={taskFilter === "upcoming" ? "default" : "outline"}
            onClick={() => setTaskFilter("upcoming")}
            size="sm"
            className={taskFilter === "upcoming" ? "bg-purple-600" : "border-slate-600 text-slate-300"}
          >
            <Clock className="w-4 h-4 mr-1" />
            Upcoming
          </Button>
          <Button
            variant={taskFilter === "overdue" ? "default" : "outline"}
            onClick={() => setTaskFilter("overdue")}
            size="sm"
            className={taskFilter === "overdue" ? "bg-purple-600" : "border-slate-600 text-slate-300"}
          >
            <AlertCircle className="w-4 h-4 mr-1" />
            Overdue
          </Button>
          <Button
            variant={taskFilter === "completed" ? "default" : "outline"}
            onClick={() => setTaskFilter("completed")}
            size="sm"
            className={taskFilter === "completed" ? "bg-purple-600" : "border-slate-600 text-slate-300"}
          >
            <CheckCircle2 className="w-4 h-4 mr-1" />
            Completed
          </Button>
        </div>

        <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openTaskDialog()} className="bg-purple-600 hover:bg-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-800 border-slate-700 text-white">
            <DialogHeader>
              <DialogTitle>{editingTask ? "Edit Task" : "Add New Task"}</DialogTitle>
              <DialogDescription className="text-slate-400">
                {editingTask ? "Update your task details" : "Create a new task with deadline and priority"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Enter task title"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Enter task description"
                />
              </div>
              <div>
                <Label htmlFor="deadline">Deadline</Label>
                <Input
                  id="deadline"
                  type="datetime-local"
                  value={taskForm.deadline}
                  onChange={(e) => setTaskForm({ ...taskForm, deadline: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={taskForm.priority}
                  onValueChange={(value: "low" | "medium" | "high") => setTaskForm({ ...taskForm, priority: value })}
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsTaskDialogOpen(false)}
                className="border-slate-600 text-slate-300"
              >
                Cancel
              </Button>
              <Button onClick={editingTask ? updateTask : addTask} className="bg-purple-600 hover:bg-purple-700">
                {editingTask ? "Update" : "Add"} Task
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {filteredTasks.map((task) => (
          <Card key={task.id} className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={() => toggleTaskComplete(task.id)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className={`font-semibold ${task.completed ? "line-through text-slate-500" : "text-white"}`}>
                        {task.title}
                      </h3>
                      {task.description && (
                        <p
                          className={`text-sm mt-1 ${task.completed ? "line-through text-slate-600" : "text-slate-400"}`}
                        >
                          {task.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                        {task.deadline && (
                          <Badge variant="outline" className="text-xs border-slate-600 text-slate-300">
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(task.deadline).toLocaleDateString()}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openTaskDialog(task)}
                        className="text-slate-400 hover:text-white"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => archiveTask(task.id)}
                        className="text-slate-400 hover:text-white"
                      >
                        <Archive className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteTask(task.id)}
                        className="text-slate-400 hover:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <div className="text-center py-12">
          <div className="text-slate-400 text-lg mb-2">No tasks found</div>
          <div className="text-slate-500">Create your first task to get started</div>
        </div>
      )}
    </div>
  )
}
