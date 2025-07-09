"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
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
import { Plus, Search, Edit, Trash2, Tag, List, Grid, Save, BookOpen } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Note {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  createdAt: string
  updatedAt: string
}

export function KnowledgeHub() {
  const [notes, setNotes] = useState<Note[]>([])
  const [noteSearchTerm, setNoteSearchTerm] = useState("")
  const [noteCategory, setNoteCategory] = useState("all")
  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [noteViewMode, setNoteViewMode] = useState<"card" | "list">("card")
  const [noteForm, setNoteForm] = useState({
    title: "",
    content: "",
    category: "",
    tags: "",
  })
  const { toast } = useToast()

  // Load data from localStorage
  useEffect(() => {
    const savedNotes = localStorage.getItem("notes")
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes))
    }
  }, [])

  // Save notes to localStorage
  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes))
  }, [notes])

  const addNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: noteForm.title,
      content: noteForm.content,
      category: noteForm.category,
      tags: noteForm.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setNotes([...notes, newNote])
    setNoteForm({ title: "", content: "", category: "", tags: "" })
    setIsNoteDialogOpen(false)
    toast({ title: "Note added successfully!" })
  }

  const updateNote = () => {
    if (!editingNote) return

    const updatedNotes = notes.map((note) =>
      note.id === editingNote.id
        ? {
            ...note,
            ...noteForm,
            tags: noteForm.tags
              .split(",")
              .map((tag) => tag.trim())
              .filter((tag) => tag),
            updatedAt: new Date().toISOString(),
          }
        : note,
    )
    setNotes(updatedNotes)
    setEditingNote(null)
    setNoteForm({ title: "", content: "", category: "", tags: "" })
    setIsNoteDialogOpen(false)
    toast({ title: "Note updated successfully!" })
  }

  const deleteNote = (id: string) => {
    setNotes(notes.filter((note) => note.id !== id))
    toast({ title: "Note deleted successfully!" })
  }

  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(noteSearchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(noteSearchTerm.toLowerCase()) ||
      note.tags.some((tag) => tag.toLowerCase().includes(noteSearchTerm.toLowerCase()))

    const matchesCategory = noteCategory === "all" || note.category === noteCategory

    return matchesSearch && matchesCategory
  })

  const noteCategories = ["all", ...Array.from(new Set(notes.map((note) => note.category)))]

  const openNoteDialog = (note?: Note) => {
    if (note) {
      setEditingNote(note)
      setNoteForm({
        title: note.title,
        content: note.content,
        category: note.category,
        tags: note.tags.join(", "),
      })
    } else {
      setEditingNote(null)
      setNoteForm({ title: "", content: "", category: "", tags: "" })
    }
    setIsNoteDialogOpen(true)
  }

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex gap-4 items-center flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search notes..."
              value={noteSearchTerm}
              onChange={(e) => setNoteSearchTerm(e.target.value)}
              className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder-slate-400 focus:border-purple-500 w-64"
            />
          </div>

          <Select value={noteCategory} onValueChange={setNoteCategory}>
            <SelectTrigger className="w-40 bg-slate-800/50 border-slate-700 text-white">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="bg-slate-700 border-slate-600">
              {noteCategories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category === "all" ? "All Categories" : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex gap-1 bg-slate-800/50 rounded-lg p-1">
            <Button
              variant={noteViewMode === "card" ? "default" : "ghost"}
              size="sm"
              onClick={() => setNoteViewMode("card")}
              className={noteViewMode === "card" ? "bg-purple-600" : "text-slate-400"}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={noteViewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setNoteViewMode("list")}
              className={noteViewMode === "list" ? "bg-purple-600" : "text-slate-400"}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <Dialog open={isNoteDialogOpen} onOpenChange={setIsNoteDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openNoteDialog()} className="bg-purple-600 hover:bg-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Note
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingNote ? "Edit Note" : "Add New Note"}</DialogTitle>
              <DialogDescription className="text-slate-400">
                {editingNote ? "Update your note" : "Create a new note with categories and tags"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="note-title">Title</Label>
                <Input
                  id="note-title"
                  value={noteForm.title}
                  onChange={(e) => setNoteForm({ ...noteForm, title: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Enter note title"
                />
              </div>
              <div>
                <Label htmlFor="note-category">Category</Label>
                <Input
                  id="note-category"
                  value={noteForm.category}
                  onChange={(e) => setNoteForm({ ...noteForm, category: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="e.g., Laravel, Git, CSS"
                />
              </div>
              <div>
                <Label htmlFor="note-tags">Tags (comma separated)</Label>
                <Input
                  id="note-tags"
                  value={noteForm.tags}
                  onChange={(e) => setNoteForm({ ...noteForm, tags: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="e.g., tutorial, reference, snippet"
                />
              </div>
              <div>
                <Label htmlFor="note-content">Content</Label>
                <Textarea
                  id="note-content"
                  value={noteForm.content}
                  onChange={(e) => setNoteForm({ ...noteForm, content: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white min-h-[200px]"
                  placeholder="Enter your note content (supports Markdown)"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsNoteDialogOpen(false)}
                className="border-slate-600 text-slate-300"
              >
                Cancel
              </Button>
              <Button onClick={editingNote ? updateNote : addNote} className="bg-purple-600 hover:bg-purple-700">
                <Save className="w-4 h-4 mr-2" />
                {editingNote ? "Update" : "Save"} Note
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className={noteViewMode === "card" ? "grid gap-6 md:grid-cols-2 lg:grid-cols-3" : "space-y-4"}>
        {filteredNotes.map((note) => (
          <Card
            key={note.id}
            className="bg-slate-800/50 border-slate-700 hover:border-purple-500 transition-all duration-300"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-white text-lg">{note.title}</CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="text-xs border-slate-600 text-slate-300">
                      {note.category}
                    </Badge>
                    <span className="text-xs text-slate-500">{new Date(note.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openNoteDialog(note)}
                    className="text-slate-400 hover:text-white"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteNote(note.id)}
                    className="text-slate-400 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="bg-slate-900/50 rounded-lg p-3 mb-4 max-h-32 overflow-y-auto">
                <pre className="text-sm text-slate-300 whitespace-pre-wrap">{note.content}</pre>
              </div>
              {note.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {note.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredNotes.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <div className="text-slate-400 text-lg mb-2">No notes found</div>
          <div className="text-slate-500">Create your first note to build your knowledge base</div>
        </div>
      )}
    </div>
  )
}
