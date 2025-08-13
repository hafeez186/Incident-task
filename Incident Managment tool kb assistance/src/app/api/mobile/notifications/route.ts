import { NextRequest, NextResponse } from 'next/server'

// Push notification subscription endpoint
export async function POST(request: NextRequest) {
  try {
    const { subscription, userId, deviceType } = await request.json()

    // Validate subscription object
    if (!subscription || !subscription.endpoint) {
      return NextResponse.json(
        { error: 'Invalid subscription data' },
        { status: 400 }
      )
    }

    // Store subscription in database (mock implementation)
    const savedSubscription = {
      id: `sub_${Date.now()}`,
      userId,
      deviceType,
      endpoint: subscription.endpoint,
      keys: subscription.keys,
      createdAt: new Date().toISOString(),
      active: true
    }

    // In production, save to database
    console.log('Saving push subscription:', savedSubscription)

    return NextResponse.json({
      success: true,
      subscriptionId: savedSubscription.id,
      message: 'Push notifications enabled'
    })

  } catch (error) {
    console.error('Push subscription error:', error)
    return NextResponse.json(
      { error: 'Failed to subscribe to push notifications' },
      { status: 500 }
    )
  }
}

// Send push notification (for admin/system use)
export async function PUT(request: NextRequest) {
  try {
    const { userId, title, body, data, urgency } = await request.json()

    // Mock push notification sending
    const notification = {
      title: title || 'Incident Management Alert',
      body,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/badge-72x72.png',
      data: {
        ...data,
        timestamp: new Date().toISOString(),
        urgency: urgency || 'normal'
      },
      actions: [
        {
          action: 'view',
          title: 'View Details'
        },
        {
          action: 'dismiss',
          title: 'Dismiss'
        }
      ]
    }

    // In production, use web-push library to send actual notifications
    console.log('Sending push notification:', notification)

    return NextResponse.json({
      success: true,
      notification,
      message: 'Notification sent successfully'
    })

  } catch (error) {
    console.error('Push notification send error:', error)
    return NextResponse.json(
      { error: 'Failed to send notification' },
      { status: 500 }
    )
  }
}
