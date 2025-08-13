'use client'

import { useState } from 'react'
import { X, Brain, Users, FileText, AlertCircle } from 'lucide-react'

interface NewTicketFormProps {
  isOpen: boolean
  onClose: () => void
  onTicketCreated: (ticket: any) => void
}

interface KBSuggestion {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  relevanceScore: number
}

export default function NewTicketForm({ isOpen, onClose, onTicketCreated }: NewTicketFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    category: '',
    reportedBy: ''
  })
  const [kbSuggestions, setKbSuggestions] = useState<KBSuggestion[]>([])
  const [suggestedTeam, setSuggestedTeam] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const categories = [
    'Email',
    'Network',
    'Application',
    'Hardware',
    'Security',
    'Database',
    'Server',
    'Other'
  ]

  const priorities = [
    { value: 'low', label: 'Low', color: 'text-green-600' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-600' },
    { value: 'high', label: 'High', color: 'text-orange-600' },
    { value: 'critical', label: 'Critical', color: 'text-red-600' }
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Trigger AI analysis when title or description changes and is substantial
    if ((field === 'title' || field === 'description') && 
        formData.title.length > 5 && formData.description.length > 10) {
      debounceAnalysis()
    }
  }

  let analysisTimeout: NodeJS.Timeout
  const debounceAnalysis = () => {
    clearTimeout(analysisTimeout)
    analysisTimeout = setTimeout(analyzeTicket, 1000)
  }

  const analyzeTicket = async () => {
    if (!formData.title || !formData.description) return
    
    setIsAnalyzing(true)
    try {
      const response = await fetch('/api/kb-suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticketTitle: formData.title,
          ticketDescription: formData.description,
          category: formData.category
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        setKbSuggestions(data.suggestions || [])
        setSuggestedTeam(data.recommendedTeam || '')
      }
    } catch (error) {
      console.error('Error analyzing ticket:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (response.ok) {
        const data = await response.json()
        onTicketCreated(data.ticket)
        resetForm()
        onClose()
      } else {
        const error = await response.json()
        alert(`Error creating ticket: ${error.error}`)
      }
    } catch (error) {
      console.error('Error creating ticket:', error)
      alert('Error creating ticket. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      category: '',
      reportedBy: ''
    })
    setKbSuggestions([])
    setSuggestedTeam('')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Create New Ticket</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex max-h-[calc(90vh-80px)]">
          {/* Form Section */}
          <div className="flex-1 p-6 overflow-y-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ticket Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Brief description of the issue"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Detailed description of the issue, steps to reproduce, and any error messages"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority *
                  </label>
                  <select
                    required
                    value={formData.priority}
                    onChange={(e) => handleInputChange('priority', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {priorities.map(priority => (
                      <option key={priority.value} value={priority.value}>
                        {priority.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reported By *
                </label>
                <input
                  type="text"
                  required
                  value={formData.reportedBy}
                  onChange={(e) => handleInputChange('reportedBy', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Your name or email"
                />
              </div>

              {suggestedTeam && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Users className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-blue-800">AI Team Suggestion</span>
                  </div>
                  <p className="text-sm text-blue-700">
                    Based on the ticket details, this should be routed to the{' '}
                    <span className="font-medium">{suggestedTeam}</span> team.
                  </p>
                </div>
              )}

              <div className="flex justify-end space-x-4 pt-4 border-t">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? 'Creating...' : 'Create Ticket'}
                </button>
              </div>
            </form>
          </div>

          {/* AI Suggestions Panel */}
          <div className="w-80 bg-gray-50 border-l overflow-y-auto">
            <div className="p-4 border-b bg-white">
              <div className="flex items-center space-x-2">
                <Brain className="w-5 h-5 text-blue-600" />
                <h3 className="font-medium text-gray-900">AI Assistant</h3>
              </div>
              {isAnalyzing && (
                <div className="mt-2 flex items-center space-x-2 text-sm text-blue-600">
                  <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                  <span>Analyzing ticket...</span>
                </div>
              )}
            </div>

            <div className="p-4">
              {kbSuggestions.length > 0 ? (
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <FileText className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">
                      Related KB Articles Found
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mb-4">
                    These articles might help resolve this issue before creating a ticket:
                  </p>
                  
                  <div className="space-y-3">
                    {kbSuggestions.slice(0, 3).map((doc) => (
                      <div
                        key={doc.id}
                        className="p-3 bg-white border border-gray-200 rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-blue-600">
                            {Math.round(doc.relevanceScore * 100)}% match
                          </span>
                        </div>
                        <h4 className="text-sm font-medium text-gray-900 mb-1">
                          {doc.title}
                        </h4>
                        <p className="text-xs text-gray-600 line-clamp-2">
                          {doc.content.slice(0, 120)}...
                        </p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {doc.tags.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : formData.title && formData.description ? (
                <div className="text-center py-8">
                  <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">No related articles found</p>
                  <p className="text-xs text-gray-500 mt-1">
                    This might be a new issue that requires investigation
                  </p>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Brain className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Start typing to get AI suggestions</p>
                  <p className="text-xs text-gray-500 mt-1">
                    I&apos;ll help find relevant KB articles as you describe the issue
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
