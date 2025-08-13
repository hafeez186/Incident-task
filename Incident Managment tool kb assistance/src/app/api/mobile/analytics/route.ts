import { NextRequest, NextResponse } from 'next/server'

// Mobile analytics API - lightweight data for mobile dashboards
export async function GET(request: NextRequest) {
  try {
    // Mobile-optimized analytics data
    const mobileAnalytics = {
      overview: {
        totalTickets: 156,
        openTickets: 23,
        inProgress: 8,
        resolvedToday: 12,
        avgResolutionTime: '4.2 hours'
      },
      quickStats: {
        myTickets: 5,
        highPriority: 3,
        overdueTickets: 2,
        teamLoad: '75%'
      },
      charts: {
        ticketsByPriority: [
          { name: 'Low', value: 45, color: '#10B981' },
          { name: 'Medium', value: 67, color: '#F59E0B' },
          { name: 'High', value: 32, color: '#EF4444' },
          { name: 'Critical', value: 12, color: '#DC2626' }
        ],
        resolutionTrend: [
          { date: '2025-08-09', resolved: 15 },
          { date: '2025-08-10', resolved: 18 },
          { date: '2025-08-11', resolved: 12 },
          { date: '2025-08-12', resolved: 20 },
          { date: '2025-08-13', resolved: 12 }
        ]
      },
      alerts: [
        {
          id: 'alert_1',
          type: 'warning',
          message: 'Server response time increased by 25%',
          priority: 'medium',
          timestamp: '2025-08-13T11:30:00Z'
        },
        {
          id: 'alert_2',
          type: 'info',
          message: 'Scheduled maintenance in 2 hours',
          priority: 'low',
          timestamp: '2025-08-13T10:45:00Z'
        }
      ],
      recommendations: [
        'Consider escalating TKT-001 - Email server issue',
        'Schedule preventive maintenance for backup servers',
        'Review team workload distribution'
      ]
    }

    return NextResponse.json({
      data: mobileAnalytics,
      lastUpdated: new Date().toISOString(),
      cacheFor: 300 // 5 minutes
    })

  } catch (error) {
    console.error('Mobile analytics API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}
