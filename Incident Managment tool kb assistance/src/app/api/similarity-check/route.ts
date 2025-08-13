import { NextRequest, NextResponse } from 'next/server'

// Configure for static export
export const dynamic = 'force-static'

interface SimilarityCheck {
  ticketId: string
  title: string
  description: string
  category: string
  createdAt: Date
}

interface ClusterResult {
  clusterId: string
  tickets: string[]
  commonKeywords: string[]
  suggestedAction: 'merge' | 'escalate' | 'create_kb' | 'monitor'
  confidence: number
}

// Calculate text similarity using Jaccard index
function calculateSimilarity(text1: string, text2: string): number {
  const words1 = new Set(text1.toLowerCase().split(/\s+/).filter(word => word.length > 2))
  const words2 = new Set(text2.toLowerCase().split(/\s+/).filter(word => word.length > 2))
  
  const intersection = new Set([...words1].filter(word => words2.has(word)))
  const union = new Set([...words1, ...words2])
  
  return intersection.size / union.size
}

// Sample tickets for clustering
const sampleTickets: SimilarityCheck[] = [
  {
    ticketId: 'INC-001',
    title: 'Email server not responding',
    description: 'Users unable to access email. Server appears to be down.',
    category: 'Email',
    createdAt: new Date('2025-01-31T09:00:00')
  },
  {
    ticketId: 'INC-003',
    title: 'Email service outage',
    description: 'Cannot connect to email server. Multiple users affected.',
    category: 'Email',
    createdAt: new Date('2025-01-31T09:30:00')
  },
  {
    ticketId: 'INC-004',
    title: 'VPN connectivity problems',
    description: 'Users reporting VPN connection failures across multiple locations.',
    category: 'Network',
    createdAt: new Date('2025-01-31T10:00:00')
  },
  {
    ticketId: 'INC-005',
    title: 'Application crashes on startup',
    description: 'CRM application failing to start. Error message displayed.',
    category: 'Application',
    createdAt: new Date('2025-01-31T10:30:00')
  }
]

function findSimilarTickets(newTicket: SimilarityCheck, existingTickets: SimilarityCheck[]): {
  similarTickets: Array<{ticket: SimilarityCheck, similarity: number}>
  clusters: ClusterResult[]
  duplicateProbability: number
} {
  const similarities = existingTickets.map(ticket => ({
    ticket,
    similarity: calculateSimilarity(
      `${newTicket.title} ${newTicket.description}`,
      `${ticket.title} ${ticket.description}`
    )
  })).filter(item => item.similarity > 0.3) // Minimum similarity threshold
  
  const similarTickets = similarities.sort((a, b) => b.similarity - a.similarity)
  
  // Create clusters of similar tickets
  const clusters: ClusterResult[] = []
  const processed = new Set<string>()
  
  similarTickets.forEach(({ ticket, similarity }) => {
    if (processed.has(ticket.ticketId) || similarity < 0.5) return
    
    // Find all tickets similar to this one
    const clusterTickets = [newTicket.ticketId, ticket.ticketId]
    const keywords = extractCommonKeywords(newTicket, ticket)
    
    // Determine suggested action
    let suggestedAction: ClusterResult['suggestedAction'] = 'monitor'
    if (similarity > 0.8) suggestedAction = 'merge'
    else if (similarity > 0.7) suggestedAction = 'escalate'
    else if (clusterTickets.length > 3) suggestedAction = 'create_kb'
    
    clusters.push({
      clusterId: `CLUSTER-${clusters.length + 1}`,
      tickets: clusterTickets,
      commonKeywords: keywords,
      suggestedAction,
      confidence: similarity
    })
    
    processed.add(ticket.ticketId)
  })
  
  const duplicateProbability = similarTickets.length > 0 ? 
    Math.max(...similarTickets.map(s => s.similarity)) : 0
  
  return { similarTickets, clusters, duplicateProbability }
}

function extractCommonKeywords(ticket1: SimilarityCheck, ticket2: SimilarityCheck): string[] {
  const text1 = `${ticket1.title} ${ticket1.description}`.toLowerCase()
  const text2 = `${ticket2.title} ${ticket2.description}`.toLowerCase()
  
  const words1 = text1.split(/\s+/).filter(word => word.length > 3)
  const words2 = text2.split(/\s+/).filter(word => word.length > 3)
  
  const commonWords = words1.filter(word => words2.includes(word))
  return [...new Set(commonWords)].slice(0, 5) // Top 5 common keywords
}

export async function POST(request: NextRequest) {
  try {
    const { title, description, category } = await request.json()
    
    if (!title || !description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    const newTicket: SimilarityCheck = {
      ticketId: 'NEW',
      title,
      description,
      category: category || 'General',
      createdAt: new Date()
    }
    
    const analysis = findSimilarTickets(newTicket, sampleTickets)
    
    // Generate insights
    const insights = []
    if (analysis.duplicateProbability > 0.8) {
      insights.push('⚠️ High probability of duplicate ticket detected')
    } else if (analysis.duplicateProbability > 0.6) {
      insights.push('🔍 Similar tickets found - consider merging or escalating')
    }
    
    if (analysis.clusters.length > 0) {
      insights.push(`📊 Found ${analysis.clusters.length} related ticket cluster(s)`)
    }
    
    if (analysis.similarTickets.length === 0) {
      insights.push('✨ New unique issue - consider creating KB article after resolution')
    }
    
    return NextResponse.json({
      success: true,
      duplicateProbability: analysis.duplicateProbability,
      similarTickets: analysis.similarTickets.slice(0, 5), // Top 5 similar tickets
      clusters: analysis.clusters,
      insights,
      recommendations: generateRecommendations(analysis),
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Error in similarity detection:', error)
    return NextResponse.json(
      { error: 'Similarity analysis failed' },
      { status: 500 }
    )
  }
}

function generateRecommendations(analysis: any): string[] {
  const recommendations = []
  
  if (analysis.duplicateProbability > 0.8) {
    recommendations.push('Consider closing as duplicate and linking to existing ticket')
  }
  
  if (analysis.clusters.some((c: ClusterResult) => c.suggestedAction === 'escalate')) {
    recommendations.push('Escalate to senior team - pattern indicates systemic issue')
  }
  
  if (analysis.clusters.some((c: ClusterResult) => c.suggestedAction === 'create_kb')) {
    recommendations.push('Create knowledge base article - recurring issue detected')
  }
  
  if (analysis.similarTickets.length > 2) {
    recommendations.push('Review historical resolution patterns for faster resolution')
  }
  
  return recommendations
}

export async function GET() {
  return NextResponse.json({
    message: 'Smart Ticket Clustering API',
    features: [
      'Duplicate Detection',
      'Similarity Analysis',
      'Ticket Clustering',
      'Pattern Recognition',
      'Automated Recommendations'
    ],
    algorithms: ['Jaccard Similarity', 'Keyword Extraction', 'Clustering Analysis']
  })
}
