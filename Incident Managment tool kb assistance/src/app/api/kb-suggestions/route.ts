import { NextRequest, NextResponse } from 'next/server'

// This would typically use OpenAI or another AI service
// For demo purposes, we'll use a simple keyword matching algorithm

interface KBDocument {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  lastUpdated: Date
}

// Sample KB documents
const kbDocuments: KBDocument[] = [
  {
    id: 'KB-001',
    title: 'Email Server Troubleshooting Guide',
    content: `
      Complete guide for diagnosing and resolving email server issues:
      
      1. Check server status and connectivity
      2. Verify DNS records (MX, A, CNAME)
      3. Test SMTP/IMAP/POP3 ports
      4. Review server logs for errors
      5. Check disk space and memory usage
      6. Verify SSL certificates
      7. Test email flow with telnet
      8. Review anti-spam and firewall settings
      
      Common solutions:
      - Restart email services
      - Clear mail queues
      - Update SSL certificates
      - Check authentication settings
    `,
    category: 'Email',
    tags: ['email', 'server', 'troubleshooting', 'exchange', 'smtp', 'imap', 'connectivity'],
    lastUpdated: new Date('2025-01-20')
  },
  {
    id: 'KB-002',
    title: 'VPN Configuration and Common Issues',
    content: `
      Comprehensive VPN troubleshooting guide:
      
      1. Verify client configuration
      2. Check network connectivity
      3. Test authentication credentials
      4. Review firewall rules
      5. Check certificate validity
      6. Verify routing tables
      7. Test DNS resolution
      8. Review bandwidth limitations
      
      Common fixes:
      - Reset network adapters
      - Update VPN client software
      - Reconfigure firewall exceptions
      - Renew certificates
      - Clear DNS cache
    `,
    category: 'Network',
    tags: ['vpn', 'network', 'connectivity', 'remote', 'authentication', 'firewall'],
    lastUpdated: new Date('2025-01-15')
  },
  {
    id: 'KB-003',
    title: 'Email Authentication Problems',
    content: `
      Resolving email authentication issues:
      
      1. Check user credentials
      2. Verify account permissions
      3. Test with different email clients
      4. Review multi-factor authentication
      5. Check for account lockouts
      6. Verify domain authentication
      7. Test LDAP/AD connectivity
      8. Review OAuth settings
      
      Solutions:
      - Reset user passwords
      - Clear credential cache
      - Update authentication protocols
      - Configure app passwords
      - Review security policies
    `,
    category: 'Email',
    tags: ['email', 'authentication', 'outlook', 'credentials', 'oauth', 'ldap'],
    lastUpdated: new Date('2025-01-10')
  },
  {
    id: 'KB-004',
    title: 'Network Connectivity Issues',
    content: `
      Network troubleshooting methodology:
      
      1. Test basic connectivity (ping)
      2. Check physical connections
      3. Verify IP configuration
      4. Test DNS resolution
      5. Check routing tables
      6. Review switch/router logs
      7. Test different protocols
      8. Monitor bandwidth usage
      
      Common fixes:
      - Restart network equipment
      - Update network drivers
      - Configure static IP
      - Flush DNS cache
      - Reset TCP/IP stack
    `,
    category: 'Network',
    tags: ['network', 'connectivity', 'ping', 'dns', 'routing', 'switch', 'router'],
    lastUpdated: new Date('2025-01-12')
  },
  {
    id: 'KB-005',
    title: 'Application Performance Issues',
    content: `
      Application performance troubleshooting:
      
      1. Monitor CPU and memory usage
      2. Check database performance
      3. Review application logs
      4. Test network latency
      5. Analyze disk I/O
      6. Check for memory leaks
      7. Review configuration settings
      8. Test under different loads
      
      Optimization techniques:
      - Update application versions
      - Optimize database queries
      - Increase memory allocation
      - Configure caching
      - Load balancing
    `,
    category: 'Application',
    tags: ['performance', 'application', 'cpu', 'memory', 'database', 'optimization'],
    lastUpdated: new Date('2025-01-08')
  }
]

function calculateRelevanceScore(ticketText: string, kbDoc: KBDocument): number {
  const ticketWords = ticketText.toLowerCase().split(/\s+/)
  const docText = (kbDoc.title + ' ' + kbDoc.content + ' ' + kbDoc.tags.join(' ')).toLowerCase()
  
  let score = 0
  let matches = 0
  
  // Check for exact word matches
  ticketWords.forEach(word => {
    if (word.length > 2) { // Ignore small words
      if (docText.includes(word)) {
        matches++
        // Higher score for title matches
        if (kbDoc.title.toLowerCase().includes(word)) score += 0.3
        // Medium score for tag matches
        else if (kbDoc.tags.some(tag => tag.toLowerCase().includes(word))) score += 0.2
        // Lower score for content matches
        else score += 0.1
      }
    }
  })
  
  // Normalize score based on ticket length and add match ratio
  const matchRatio = matches / Math.max(ticketWords.length, 1)
  score = (score + matchRatio * 0.5) / 2
  
  return Math.min(score, 1) // Cap at 1.0
}

export async function POST(request: NextRequest) {
  try {
    const { ticketTitle, ticketDescription, category } = await request.json()
    
    if (!ticketTitle || !ticketDescription) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    const ticketText = `${ticketTitle} ${ticketDescription} ${category || ''}`
    
    // Calculate relevance scores for all KB documents
    const scoredDocs = kbDocuments.map(doc => ({
      ...doc,
      relevanceScore: calculateRelevanceScore(ticketText, doc)
    }))
    
    // Filter and sort by relevance
    const relevantDocs = scoredDocs
      .filter(doc => doc.relevanceScore > 0.1) // Minimum threshold
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 5) // Top 5 results
    
    // Team routing suggestion based on category and KB matches
    let suggestedTeam = 'General Support'
    if (relevantDocs.length > 0) {
      const topCategory = relevantDocs[0].category
      switch (topCategory) {
        case 'Email':
          suggestedTeam = 'Infrastructure'
          break
        case 'Network':
          suggestedTeam = 'Network'
          break
        case 'Application':
          suggestedTeam = 'Application Support'
          break
        default:
          suggestedTeam = 'General Support'
      }
    }
    
    return NextResponse.json({
      success: true,
      suggestions: relevantDocs,
      recommendedTeam: suggestedTeam,
      confidence: relevantDocs.length > 0 ? relevantDocs[0].relevanceScore : 0
    })
    
  } catch (error) {
    console.error('Error in KB suggestion API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'KB Suggestion API',
    endpoints: {
      POST: 'Submit ticket data to get KB suggestions',
    },
    samplePayload: {
      ticketTitle: 'Email server not responding',
      ticketDescription: 'Users unable to access email. Server appears to be down.',
      category: 'Email'
    }
  })
}
