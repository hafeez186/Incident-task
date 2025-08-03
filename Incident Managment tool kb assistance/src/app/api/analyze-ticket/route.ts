import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

interface AnalysisRequest {
  ticketTitle: string
  ticketDescription: string
  category: string
  reportedBy?: string
}

interface AnalysisResult {
  sentiment: 'positive' | 'neutral' | 'negative' | 'urgent'
  suggestedPriority: 'low' | 'medium' | 'high' | 'critical'
  urgencyScore: number
  suggestedTeam: string
  keyInsights: string[]
  estimatedResolutionTime: string
  similarIncidents: number
}

// Initialize OpenAI (if API key is provided)
const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null

// Fallback analysis without OpenAI
function performBasicAnalysis(data: AnalysisRequest): AnalysisResult {
  const { ticketTitle, ticketDescription, category } = data
  const text = `${ticketTitle} ${ticketDescription}`.toLowerCase()
  
  // Sentiment analysis based on keywords
  const urgentKeywords = ['critical', 'urgent', 'down', 'failed', 'error', 'broken', 'emergency']
  const negativeKeywords = ['problem', 'issue', 'cannot', 'unable', 'not working', 'crash']
  
  let sentiment: AnalysisResult['sentiment'] = 'neutral'
  let urgencyScore = 0.3
  
  if (urgentKeywords.some(keyword => text.includes(keyword))) {
    sentiment = 'urgent'
    urgencyScore = 0.9
  } else if (negativeKeywords.some(keyword => text.includes(keyword))) {
    sentiment = 'negative'
    urgencyScore = 0.6
  }
  
  // Priority mapping
  let suggestedPriority: AnalysisResult['suggestedPriority'] = 'medium'
  if (urgencyScore > 0.8) suggestedPriority = 'critical'
  else if (urgencyScore > 0.6) suggestedPriority = 'high'
  else if (urgencyScore < 0.4) suggestedPriority = 'low'
  
  // Team assignment
  let suggestedTeam = 'General Support'
  switch (category.toLowerCase()) {
    case 'email':
      suggestedTeam = 'Infrastructure'
      break
    case 'network':
      suggestedTeam = 'Network'
      break
    case 'application':
      suggestedTeam = 'Application Support'
      break
    case 'security':
      suggestedTeam = 'Security'
      break
    case 'hardware':
      suggestedTeam = 'Hardware Support'
      break
  }
  
  // Generate insights
  const keyInsights = [
    `Category: ${category} suggests ${suggestedTeam} team involvement`,
    `Urgency level: ${Math.round(urgencyScore * 100)}% based on content analysis`,
    sentiment === 'urgent' ? 'Contains urgent keywords - immediate attention needed' : 'Standard resolution process applicable'
  ]
  
  // Estimated resolution time
  const estimatedResolutionTime = urgencyScore > 0.8 ? '2-4 hours' : 
                                 urgencyScore > 0.6 ? '4-8 hours' : 
                                 urgencyScore > 0.4 ? '1-2 days' : '2-5 days'
  
  return {
    sentiment,
    suggestedPriority,
    urgencyScore,
    suggestedTeam,
    keyInsights,
    estimatedResolutionTime,
    similarIncidents: Math.floor(Math.random() * 15) + 1 // Simulated
  }
}

async function performAdvancedAnalysis(data: AnalysisRequest): Promise<AnalysisResult> {
  if (!openai) {
    return performBasicAnalysis(data)
  }
  
  try {
    const prompt = `
    Analyze this IT incident ticket and provide structured insights:
    
    Title: ${data.ticketTitle}
    Description: ${data.ticketDescription}
    Category: ${data.category}
    Reported By: ${data.reportedBy || 'Unknown'}
    
    Please analyze and return a JSON response with:
    1. sentiment (positive/neutral/negative/urgent)
    2. suggestedPriority (low/medium/high/critical)
    3. urgencyScore (0.0 to 1.0)
    4. suggestedTeam (Infrastructure/Network/Application Support/Security/Hardware Support/General Support)
    5. keyInsights (array of 3-5 important observations)
    6. estimatedResolutionTime (realistic time estimate)
    7. potentialCauses (array of likely root causes)
    
    Focus on technical accuracy and business impact assessment.
    `
    
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert IT incident analyst. Provide accurate, structured analysis of IT tickets in JSON format."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 1000
    })
    
    const response = completion.choices[0]?.message?.content
    if (!response) {
      throw new Error('No response from OpenAI')
    }
    
    const analysis = JSON.parse(response)
    
    return {
      sentiment: analysis.sentiment || 'neutral',
      suggestedPriority: analysis.suggestedPriority || 'medium',
      urgencyScore: analysis.urgencyScore || 0.5,
      suggestedTeam: analysis.suggestedTeam || 'General Support',
      keyInsights: analysis.keyInsights || ['Analysis completed'],
      estimatedResolutionTime: analysis.estimatedResolutionTime || '1-2 days',
      similarIncidents: Math.floor(Math.random() * 15) + 1
    }
    
  } catch (error) {
    console.error('OpenAI analysis failed, falling back to basic analysis:', error)
    return performBasicAnalysis(data)
  }
}

export async function POST(request: NextRequest) {
  try {
    const data: AnalysisRequest = await request.json()
    
    if (!data.ticketTitle || !data.ticketDescription) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    const analysis = await performAdvancedAnalysis(data)
    
    return NextResponse.json({
      success: true,
      analysis,
      aiPowered: !!openai,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Error in ticket analysis:', error)
    return NextResponse.json(
      { error: 'Analysis failed' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Advanced Ticket Analysis API',
    features: [
      'Sentiment Analysis',
      'Priority Suggestion',
      'Team Routing',
      'Resolution Time Estimation',
      'Key Insights Extraction'
    ],
    aiEnabled: !!openai
  })
}
