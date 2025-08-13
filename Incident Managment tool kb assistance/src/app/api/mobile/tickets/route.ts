import { NextRequest, NextResponse } from 'next/server'

// Mobile tickets API - optimized for mobile apps
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const page = parseInt(searchParams.get('page') || '1')
    const status = searchParams.get('status')
    const priority = searchParams.get('priority')

    // Mock mobile-optimized ticket data
    const tickets = [
      {
        id: 'TKT-001',
        title: 'Email server down',
        status: 'open',
        priority: 'high',
        createdAt: '2025-08-13T10:30:00Z',
        assignee: 'John Doe',
        summary: 'Email services are unavailable for all users',
        affectedUsers: 150,
        estimatedResolution: '2 hours',
        mobileActions: ['update_status', 'add_comment', 'escalate']
      },
      {
        id: 'TKT-002',
        title: 'VPN connection issues',
        status: 'in_progress',
        priority: 'medium',
        createdAt: '2025-08-13T09:15:00Z',
        assignee: 'Jane Smith',
        summary: 'Users unable to connect to corporate VPN',
        affectedUsers: 45,
        estimatedResolution: '1 hour',
        mobileActions: ['update_status', 'add_comment']
      }
    ]

    // Filter by status and priority if provided
    let filteredTickets = tickets
    if (status) {
      filteredTickets = filteredTickets.filter(t => t.status === status)
    }
    if (priority) {
      filteredTickets = filteredTickets.filter(t => t.priority === priority)
    }

    // Pagination
    const startIndex = (page - 1) * limit
    const paginatedTickets = filteredTickets.slice(startIndex, startIndex + limit)

    return NextResponse.json({
      tickets: paginatedTickets,
      pagination: {
        page,
        limit,
        total: filteredTickets.length,
        hasMore: startIndex + limit < filteredTickets.length
      },
      filters: {
        availableStatuses: ['open', 'in_progress', 'resolved', 'closed'],
        availablePriorities: ['low', 'medium', 'high', 'critical']
      }
    })

  } catch (error) {
    console.error('Mobile tickets API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tickets' },
      { status: 500 }
    )
  }
}

// Create new ticket from mobile app
export async function POST(request: NextRequest) {
  try {
    const ticket = await request.json()
    
    // Validate required fields
    if (!ticket.title || !ticket.description) {
      return NextResponse.json(
        { error: 'Title and description are required' },
        { status: 400 }
      )
    }

    // Create new ticket (mock)
    const newTicket = {
      id: `TKT-${Date.now()}`,
      title: ticket.title,
      description: ticket.description,
      priority: ticket.priority || 'medium',
      status: 'open',
      createdAt: new Date().toISOString(),
      createdBy: ticket.createdBy || 'mobile_user',
      assignee: null,
      mobileCreated: true
    }

    return NextResponse.json({
      success: true,
      ticket: newTicket,
      message: 'Ticket created successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Mobile ticket creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create ticket' },
      { status: 500 }
    )
  }
}
