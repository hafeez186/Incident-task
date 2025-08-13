'use client'

import { useState, useEffect } from 'react'
import { Brain, TrendingUp, AlertTriangle, Target, Lightbulb, Clock, Users, Activity } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, RadialBarChart, RadialBar } from 'recharts'

// AI Insights component for competition edge
export default function AIInsightsDashboard() {
  const [insights, setInsights] = useState({
    predictiveAnalytics: {
      riskScore: 75,
      nextIncidentPrediction: '2 hours 15 minutes',
      trendDirection: 'increasing'
    },
    patternRecognition: [
      { pattern: 'Email server issues spike every Monday 9 AM', confidence: 92, action: 'Schedule proactive checks' },
      { pattern: 'VPN issues correlate with weather alerts', confidence: 78, action: 'Monitor weather forecasts' },
      { pattern: 'Database slowdowns precede memory alerts by 30min', confidence: 85, action: 'Implement early warning system' }
    ],
    sentimentAnalysis: {
      userFrustration: 65,
      urgencyLevel: 'High',
      satisfactionTrend: [
        { day: 'Mon', score: 7.2 },
        { day: 'Tue', score: 6.8 },
        { day: 'Wed', score: 7.5 },
        { day: 'Thu', score: 6.9 },
        { day: 'Fri', score: 8.1 }
      ]
    },
    rootCauseAnalysis: {
      primaryCauses: [
        { cause: 'Infrastructure', incidents: 45, percentage: 35 },
        { cause: 'Software bugs', incidents: 38, percentage: 30 },
        { cause: 'User error', incidents: 25, percentage: 20 },
        { cause: 'External services', incidents: 19, percentage: 15 }
      ]
    }
  })

  const COLORS = ['#3B82F6', '#EF4444', '#F59E0B', '#10B981']

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Brain className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">AI Insights Dashboard</h2>
            <p className="text-gray-600">Advanced analytics and predictive intelligence</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 px-4 py-2 bg-purple-50 rounded-lg">
          <Activity className="w-4 h-4 text-purple-600" />
          <span className="text-sm font-medium text-purple-600">AI Engine Active</span>
        </div>
      </div>

      {/* Predictive Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-red-50 to-orange-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Risk Assessment</h3>
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600 mb-2">{insights.predictiveAnalytics.riskScore}%</div>
            <p className="text-sm text-gray-600">System Risk Score</p>
            <div className="mt-4 p-3 bg-white rounded-lg">
              <p className="text-xs text-gray-500">Next predicted incident</p>
              <p className="font-medium text-gray-900">{insights.predictiveAnalytics.nextIncidentPrediction}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Sentiment Analysis</h3>
            <Users className="w-5 h-5 text-blue-500" />
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">User Frustration</span>
                <span className="text-sm font-medium">{insights.sentimentAnalysis.userFrustration}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-yellow-400 to-red-500 h-2 rounded-full"
                  style={{ width: `${insights.sentimentAnalysis.userFrustration}%` }}
                ></div>
              </div>
            </div>
            <div className="p-3 bg-white rounded-lg">
              <p className="text-xs text-gray-500">Urgency Level</p>
              <p className="font-medium text-red-600">{insights.sentimentAnalysis.urgencyLevel}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Pattern Detection</h3>
            <Target className="w-5 h-5 text-green-500" />
          </div>
          <div className="space-y-3">
            {insights.patternRecognition.slice(0, 2).map((pattern, index) => (
              <div key={index} className="p-3 bg-white rounded-lg">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs font-medium text-green-600">{pattern.confidence}% confidence</span>
                </div>
                <p className="text-sm text-gray-900 mb-1">{pattern.pattern}</p>
                <p className="text-xs text-gray-500">{pattern.action}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Advanced Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Satisfaction Trend */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Satisfaction Trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={insights.sentimentAnalysis.satisfactionTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis domain={[0, 10]} />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="#3B82F6" 
                strokeWidth={3}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Root Cause Analysis */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Root Cause Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={insights.rootCauseAnalysis.primaryCauses}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ cause, percentage }) => `${cause}: ${percentage}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="incidents"
              >
                {insights.rootCauseAnalysis.primaryCauses.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Lightbulb className="w-6 h-6 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">AI Recommendations</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Proactive Maintenance</h4>
            <p className="text-sm text-gray-600">Schedule email server maintenance every Sunday at 2 AM to prevent Monday morning issues.</p>
            <button className="mt-3 text-sm text-purple-600 hover:text-purple-700 font-medium">Implement →</button>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Resource Optimization</h4>
            <p className="text-sm text-gray-600">Increase database memory allocation by 20% to prevent performance degradation.</p>
            <button className="mt-3 text-sm text-purple-600 hover:text-purple-700 font-medium">Implement →</button>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Training Focus</h4>
            <p className="text-sm text-gray-600">Provide additional VPN troubleshooting training to reduce user-reported connectivity issues.</p>
            <button className="mt-3 text-sm text-purple-600 hover:text-purple-700 font-medium">Implement →</button>
          </div>
        </div>
      </div>
    </div>
  )
}
