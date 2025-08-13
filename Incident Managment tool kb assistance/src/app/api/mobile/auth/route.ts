import { NextRequest, NextResponse } from 'next/server'

// Mobile app authentication endpoint
export async function POST(request: NextRequest) {
  try {
    const { username, password, deviceId, appVersion } = await request.json()

    // Validate credentials (replace with your auth logic)
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password required' },
        { status: 400 }
      )
    }

    // Mock authentication - replace with real auth
    const user = {
      id: 'user_123',
      username,
      email: `${username}@company.com`,
      role: 'technician',
      permissions: ['create_ticket', 'view_analytics', 'update_status']
    }

    // Generate mobile session token
    const token = generateMobileToken(user.id, deviceId)

    return NextResponse.json({
      success: true,
      token,
      user,
      serverTime: new Date().toISOString(),
      apiVersion: '1.0.0'
    })

  } catch (error) {
    console.error('Mobile auth error:', error)
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    )
  }
}

function generateMobileToken(userId: string, deviceId: string): string {
  // In production, use JWT or secure token generation
  return `mobile_${userId}_${deviceId}_${Date.now()}`
}
