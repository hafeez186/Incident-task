import { NextRequest, NextResponse } from 'next/server'

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
  reportedBy: string
}

// In a real application, this would be stored in a database
let tickets: Ticket[] = [
  {
    id: 'INC-001',
    title: 'Email server not responding',
    description: 'Users unable to access email. Server appears to be down.',
    priority: 'high',
    status: 'open',
    team: 'Infrastructure',
    createdAt: new Date('2025-01-31T09:00:00'),
    updatedAt: new Date('2025-01-31T09:00:00'),
    category: 'Email',
    reportedBy: 'System Admin'
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
    category: 'Network',
    reportedBy: 'Jane Smith'
  }
]

function generateTicketId(): string {
  const count = tickets.length + 1
  return `INC-${count.toString().padStart(3, '0')}`
}

function determineTeamFromCategory(category: string, kbSuggestions?: any[]): string {
  // Use KB suggestions to help determine team
  if (kbSuggestions && kbSuggestions.length > 0) {
    const topCategory = kbSuggestions[0].category
    switch (topCategory) {
      case 'Email':
        return 'Infrastructure'
      case 'Network':
        return 'Network'
      case 'Application':
        return 'Application Support'
      default:
        return 'General Support'
    }
  }
  
  // Fallback to simple category mapping
  switch (category.toLowerCase()) {
    case 'email':
    case 'server':
      return 'Infrastructure'
    case 'network':
    case 'vpn':
    case 'connectivity':
      return 'Network'
    case 'application':
    case 'software':
      return 'Application Support'
    case 'hardware':
      return 'Hardware Support'
    case 'security':
      return 'Security'
    default:
      return 'General Support'
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, description, priority, category, reportedBy } = await request.json()
    
    if (!title || !description || !priority || !category || !reportedBy) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Get KB suggestions for team routing
    let kbSuggestions = []
    try {
      const kbResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/kb-suggestions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticketTitle: title,
          ticketDescription: description,
          category
        })
      })
      
      if (kbResponse.ok) {
        const kbData = await kbResponse.json()
        kbSuggestions = kbData.suggestions || []
      }
    } catch (error) {
      console.error('Error fetching KB suggestions:', error)
      // Continue without KB suggestions
    }
    
    const newTicket: Ticket = {
      id: generateTicketId(),
      title,
      description,
      priority,
      status: 'open',
      team: determineTeamFromCategory(category, kbSuggestions),
      category,
      reportedBy,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    tickets.push(newTicket)
    
    return NextResponse.json({
      success: true,
      ticket: newTicket,
      kbSuggestions,
      message: 'Ticket created successfully'
    })
    
  } catch (error) {
    console.error('Error creating ticket:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const team = searchParams.get('team')
    const priority = searchParams.get('priority')
    
    let filteredTickets = tickets
    
    if (status && status !== 'all') {
      filteredTickets = filteredTickets.filter(ticket => ticket.status === status)
    }
    
    if (team && team !== 'all') {
      filteredTickets = filteredTickets.filter(ticket => ticket.team === team)
    }
    
    if (priority && priority !== 'all') {
      filteredTickets = filteredTickets.filter(ticket => ticket.priority === priority)
    }
    
    // Sort by creation date (newest first)
    filteredTickets.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    
    return NextResponse.json({
      success: true,
      tickets: filteredTickets,
      total: filteredTickets.length
    })
    
  } catch (error) {
    console.error('Error fetching tickets:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, ...updates } = await request.json()
    
    if (!id) {
      return NextResponse.json(
        { error: 'Ticket ID is required' },
        { status: 400 }
      )
    }
    
    const ticketIndex = tickets.findIndex(ticket => ticket.id === id)
    
    if (ticketIndex === -1) {
      return NextResponse.json(
        { error: 'Ticket not found' },
        { status: 404 }
      )
    }
    
    // Update ticket
    tickets[ticketIndex] = {
      ...tickets[ticketIndex],
      ...updates,
      updatedAt: new Date()
    }
    
    return NextResponse.json({
      success: true,
      ticket: tickets[ticketIndex],
      message: 'Ticket updated successfully'
    })
    
  } catch (error) {
    console.error('Error updating ticket:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
