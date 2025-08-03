'use client'

import { useState, useEffect } from 'react'
import { 
  Plus, 
  Search, 
  Filter, 
  FileText, 
  Clock, 
  Users, 
  AlertCircle,
  CheckCircle,
  XCircle,
  Brain,
  ArrowRight,
  BarChart3,
  Network,
  Zap,
  TrendingUp,
  MessageSquare,
  Shield,
  FileBarChart,
  Settings,
  Bot
} from 'lucide-react'
import NewTicketForm from '@/components/NewTicketForm'
import AnalyticsDashboard from '@/components/AnalyticsDashboard'
import NetworkTopologyVisualizer from '@/components/NetworkTopologyVisualizer'
import AIInsightsDashboard from '@/components/AIInsightsDashboard'
import CollaborationHub from '@/components/CollaborationHub'
import AutomationWorkflows from '@/components/AutomationWorkflows'
import ExecutiveReporting from '@/components/ExecutiveReporting'
import SecurityCompliance from '@/components/SecurityCompliance'

// Types
interface Ticket {
  id: string
  title: string
  description: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  status: 'open' | 'in-progress' | 'resolved' | 'closed'
  assignedTo?: string
  team: string
  createdAt: Date
  updatedAt: Date
  category: string
}

interface KBDocument {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  relevanceScore: number
  lastUpdated: Date
}

// Sample data
const sampleTickets: Ticket[] = [
  {
    id: 'INC-001',
    title: 'Email server not responding',
    description: 'Users unable to access email. Server appears to be down.',
    priority: 'high',
    status: 'open',
    team: 'Infrastructure',
    createdAt: new Date('2025-01-31T09:00:00'),
    updatedAt: new Date('2025-01-31T09:00:00'),
    category: 'Email'
  },
  {
    id: 'INC-002', 
    title: 'VPN connection issues',
    description: 'Multiple users reporting inability to connect to VPN',
    priority: 'medium',
    status: 'in-progress',
    assignedTo: 'John Doe',
    team: 'Network',
    createdAt: new Date('2025-01-31T08:30:00'),
    updatedAt: new Date('2025-01-31T10:15:00'),
    category: 'Network'
  }
]

const sampleKBDocs: KBDocument[] = [
  {
    id: 'KB-001',
    title: 'Email Server Troubleshooting Guide',
    content: 'Step-by-step guide to diagnose and resolve email server issues...',
    category: 'Email',
    tags: ['email', 'server', 'troubleshooting', 'exchange'],
    relevanceScore: 0.95,
    lastUpdated: new Date('2025-01-20')
  },
  {
    id: 'KB-002',
    title: 'VPN Configuration and Common Issues',
    content: 'Comprehensive guide for VPN setup and troubleshooting...',
    category: 'Network',
    tags: ['vpn', 'network', 'connectivity', 'remote'],
    relevanceScore: 0.88,
    lastUpdated: new Date('2025-01-15')
  },
  {
    id: 'KB-003',
    title: 'Email Authentication Problems',
    content: 'Resolving authentication issues with email clients...',
    category: 'Email',
    tags: ['email', 'authentication', 'outlook', 'credentials'],
    relevanceScore: 0.82,
    lastUpdated: new Date('2025-01-10')
  }
]

export default function HomePage() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [suggestedKB, setSuggestedKB] = useState<KBDocument[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [showNewTicketForm, setShowNewTicketForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [activeView, setActiveView] = useState<'dashboard' | 'analytics' | 'network' | 'ai-insights' | 'collaboration' | 'automation' | 'reporting' | 'security'>('dashboard')

  // Load tickets on component mount
  useEffect(() => {
    loadTickets()
  }, [])

  const loadTickets = async () => {
    try {
      const response = await fetch('/api/tickets')
      if (response.ok) {
        const data = await response.json()
        setTickets(data.tickets || sampleTickets) // Fallback to sample data
      } else {
        setTickets(sampleTickets) // Fallback to sample data
      }
    } catch (error) {
      console.error('Error loading tickets:', error)
      setTickets(sampleTickets) // Fallback to sample data
    } finally {
      setLoading(false)
    }
  }

  // Use AI-powered KB suggestion API
  const getSuggestedKB = async (ticket: Ticket) => {
    try {
      const response = await fetch('/api/kb-suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticketTitle: ticket.title,
          ticketDescription: ticket.description,
          category: ticket.category
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        return data.suggestions || []
      }
    } catch (error) {
      console.error('Error getting KB suggestions:', error)
    }
    
    // Fallback to simple matching
    const keywords = ticket.title.toLowerCase().split(' ').concat(
      ticket.description.toLowerCase().split(' ')
    )
    
    const scored = sampleKBDocs.map(doc => {
      let score = 0
      keywords.forEach(keyword => {
        if (doc.title.toLowerCase().includes(keyword) || 
            doc.content.toLowerCase().includes(keyword) ||
            doc.tags.some(tag => tag.toLowerCase().includes(keyword))) {
          score += 0.1
        }
      })
      return { ...doc, relevanceScore: Math.min(score, 1) }
    })
    
    return scored
      .filter(doc => doc.relevanceScore > 0.1)
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 3)
  }

  const handleTicketSelect = async (ticket: Ticket) => {
    setSelectedTicket(ticket)
    const suggestions = await getSuggestedKB(ticket)
    setSuggestedKB(suggestions)
  }

  const handleTicketCreated = (newTicket: Ticket) => {
    setTickets(prev => [newTicket, ...prev])
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-50'
      case 'high': return 'text-orange-600 bg-orange-50'
      case 'medium': return 'text-yellow-600 bg-yellow-50'
      case 'low': return 'text-green-600 bg-green-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <AlertCircle className="w-4 h-4 text-red-500" />
      case 'in-progress': return <Clock className="w-4 h-4 text-yellow-500" />
      case 'resolved': return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'closed': return <XCircle className="w-4 h-4 text-gray-500" />
      default: return <AlertCircle className="w-4 h-4 text-gray-500" />
    }
  }

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || ticket.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const renderDashboard = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Tickets List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search tickets..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="open">Open</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>

            <div className="divide-y">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"></div>
                  <p className="text-gray-600">Loading tickets...</p>
                </div>
              ) : filteredTickets.length > 0 ? (
                filteredTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    onClick={() => handleTicketSelect(ticket)}
                    className={`p-6 cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedTicket?.id === ticket.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="font-medium text-gray-900">{ticket.id}</span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(ticket.priority)}`}>
                            {ticket.priority.toUpperCase()}
                          </span>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(ticket.status)}
                            <span className="text-sm text-gray-600 capitalize">{ticket.status.replace('-', ' ')}</span>
                          </div>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">{ticket.title}</h3>
                        <p className="text-gray-600 text-sm line-clamp-2">{ticket.description}</p>
                        <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>{ticket.team}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center">
                  <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No tickets found</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Try adjusting your search or filter criteria
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* KB Suggestions Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b">
              <div className="flex items-center space-x-2">
                <Brain className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900">AI KB Assistant</h2>
              </div>
              {selectedTicket ? (
                <p className="text-sm text-gray-600 mt-2">
                  Suggested articles for: <span className="font-medium">{selectedTicket.id}</span>
                </p>
              ) : (
                <p className="text-sm text-gray-600 mt-2">
                  Select a ticket to see relevant KB articles
                </p>
              )}
            </div>

            {selectedTicket && suggestedKB.length > 0 ? (
              <div className="p-6">
                <div className="space-y-4">
                  {suggestedKB.map((doc) => (
                    <div
                      key={doc.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors cursor-pointer"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <FileText className="w-4 h-4 text-blue-600" />
                            <span className="text-xs font-medium text-blue-600">
                              {Math.round(doc.relevanceScore * 100)}% match
                            </span>
                          </div>
                          <h3 className="font-medium text-gray-900 mb-2">{doc.title}</h3>
                          <p className="text-sm text-gray-600 line-clamp-2">{doc.content}</p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {doc.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400 ml-2" />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Team Routing Suggestion */}
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Users className="w-4 h-4 text-green-600" />
                    <span className="font-medium text-green-800">Team Routing</span>
                  </div>
                  <p className="text-sm text-green-700">
                    Based on the ticket category and KB analysis, this ticket is correctly routed to the{' '}
                    <span className="font-medium">{selectedTicket.team}</span> team.
                  </p>
                </div>
              </div>
            ) : selectedTicket ? (
              <div className="p-6">
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No relevant KB articles found</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Consider creating a new KB article for this issue
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-6">
                <div className="text-center py-8">
                  <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Select a ticket to get started</p>
                  <p className="text-sm text-gray-500 mt-1">
                    AI will suggest relevant KB articles to help resolve the issue
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Incident Management System
                </h1>
                <p className="text-sm text-gray-500">AI-Powered KB Assistant</p>
              </div>
            </div>
            
            {/* Navigation */}
            <nav className="flex space-x-1 overflow-x-auto">
              <button
                onClick={() => setActiveView('dashboard')}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  activeView === 'dashboard'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <FileText className="w-4 h-4 mr-2" />
                Dashboard
              </button>
              <button
                onClick={() => setActiveView('ai-insights')}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  activeView === 'ai-insights'
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Bot className="w-4 h-4 mr-2" />
                AI Insights
              </button>
              <button
                onClick={() => setActiveView('analytics')}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  activeView === 'analytics'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </button>
              <button
                onClick={() => setActiveView('collaboration')}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  activeView === 'collaboration'
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Collaboration
              </button>
              <button
                onClick={() => setActiveView('automation')}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  activeView === 'automation'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Zap className="w-4 h-4 mr-2" />
                Automation
              </button>
              <button
                onClick={() => setActiveView('network')}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  activeView === 'network'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Network className="w-4 h-4 mr-2" />
                Network
              </button>
              <button
                onClick={() => setActiveView('reporting')}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  activeView === 'reporting'
                    ? 'bg-orange-100 text-orange-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <FileBarChart className="w-4 h-4 mr-2" />
                Reports
              </button>
              <button
                onClick={() => setActiveView('security')}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  activeView === 'security'
                    ? 'bg-red-100 text-red-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Shield className="w-4 h-4 mr-2" />
                Security
              </button>
            </nav>

            <button
              onClick={() => setShowNewTicketForm(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Ticket
            </button>
          </div>
        </div>
      </header>

      {/* Content based on active view */}
      {activeView === 'dashboard' && renderDashboard()}
      {activeView === 'ai-insights' && <AIInsightsDashboard />}
      {activeView === 'analytics' && <AnalyticsDashboard />}
      {activeView === 'collaboration' && <CollaborationHub />}
      {activeView === 'automation' && <AutomationWorkflows />}
      {activeView === 'network' && <NetworkTopologyVisualizer />}
      {activeView === 'reporting' && <ExecutiveReporting />}
      {activeView === 'security' && <SecurityCompliance />}

      {/* New Ticket Form Modal */}
      <NewTicketForm
        isOpen={showNewTicketForm}
        onClose={() => setShowNewTicketForm(false)}
        onTicketCreated={handleTicketCreated}
      />
    </div>
  )
}
