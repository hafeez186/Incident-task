'use client'

import { useState } from 'react'
import { Shield, AlertTriangle, CheckCircle, Lock, Eye, FileText, Clock, Users, Activity } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'

interface SecurityMetrics {
  complianceScore: number
  securityIncidents: Array<{ month: string; incidents: number; resolved: number }>
  auditTrail: Array<{ action: string; user: string; timestamp: Date; risk: 'low' | 'medium' | 'high' }>
  accessPatterns: Array<{ role: string; sessions: number; color: string }>
  vulnerabilities: Array<{ category: string; count: number; severity: 'critical' | 'high' | 'medium' | 'low' }>
}

export default function SecurityCompliance() {
  const [activeTab, setActiveTab] = useState('overview')

  const securityData: SecurityMetrics = {
    complianceScore: 94.7,
    securityIncidents: [
      { month: 'Jan', incidents: 3, resolved: 3 },
      { month: 'Feb', incidents: 1, resolved: 1 },
      { month: 'Mar', incidents: 4, resolved: 4 },
      { month: 'Apr', incidents: 2, resolved: 2 },
      { month: 'May', incidents: 1, resolved: 1 },
      { month: 'Jun', incidents: 0, resolved: 0 }
    ],
    auditTrail: [
      { action: 'Admin access to critical incident INC-001', user: 'john.doe@company.com', timestamp: new Date(Date.now() - 3600000), risk: 'high' },
      { action: 'KB article modified: Email Server Guide', user: 'sarah.chen@company.com', timestamp: new Date(Date.now() - 7200000), risk: 'medium' },
      { action: 'Bulk ticket export', user: 'mike.rodriguez@company.com', timestamp: new Date(Date.now() - 10800000), risk: 'low' },
      { action: 'User role change: Analyst to Admin', user: 'system@company.com', timestamp: new Date(Date.now() - 14400000), risk: 'high' }
    ],
    accessPatterns: [
      { role: 'Admin', sessions: 45, color: '#DC2626' },
      { role: 'Team Lead', sessions: 78, color: '#EA580C' },
      { role: 'Analyst', sessions: 156, color: '#D97706' },
      { role: 'Viewer', sessions: 89, color: '#16A34A' }
    ],
    vulnerabilities: [
      { category: 'Authentication', count: 2, severity: 'high' },
      { category: 'Data Access', count: 1, severity: 'critical' },
      { category: 'API Security', count: 5, severity: 'medium' },
      { category: 'Encryption', count: 3, severity: 'low' }
    ]
  }

  const complianceFrameworks = [
    { name: 'SOC 2 Type II', status: 'compliant', score: 98, lastAudit: '2024-12-15' },
    { name: 'ISO 27001', status: 'compliant', score: 95, lastAudit: '2024-11-20' },
    { name: 'GDPR', status: 'compliant', score: 92, lastAudit: '2024-10-30' },
    { name: 'HIPAA', status: 'needs-attention', score: 87, lastAudit: '2024-09-15' }
  ]

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200'
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default: return 'bg-green-100 text-green-800 border-green-200'
    }
  }

  const getComplianceStatus = (status: string) => {
    switch (status) {
      case 'compliant': return { color: 'text-green-600', icon: CheckCircle }
      case 'needs-attention': return { color: 'text-orange-600', icon: AlertTriangle }
      default: return { color: 'text-red-600', icon: AlertTriangle }
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <Shield className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Security & Compliance</h2>
            <p className="text-gray-600">Monitor security posture and compliance status</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 px-4 py-2 bg-green-50 rounded-lg">
          <Shield className="w-4 h-4 text-green-600" />
          <span className="text-sm font-medium text-green-600">Security Status: Active</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {['overview', 'audit-trail', 'compliance'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.replace('-', ' ')}
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Security Score Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <Shield className="w-6 h-6 text-green-600" />
                <span className="text-2xl font-bold text-green-600">{securityData.complianceScore}%</span>
              </div>
              <h3 className="font-medium text-gray-900">Overall Security Score</h3>
              <p className="text-sm text-gray-600">Excellent security posture</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <AlertTriangle className="w-6 h-6 text-orange-500" />
                <span className="text-2xl font-bold text-gray-900">
                  {securityData.vulnerabilities.filter(v => v.severity === 'critical' || v.severity === 'high').length}
                </span>
              </div>
              <h3 className="font-medium text-gray-900">High Risk Issues</h3>
              <p className="text-sm text-gray-600">Require immediate attention</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <Eye className="w-6 h-6 text-blue-500" />
                <span className="text-2xl font-bold text-gray-900">
                  {securityData.accessPatterns.reduce((sum, pattern) => sum + pattern.sessions, 0)}
                </span>
              </div>
              <h3 className="font-medium text-gray-900">Active Sessions</h3>
              <p className="text-sm text-gray-600">Current user activity</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <Activity className="w-6 h-6 text-purple-500" />
                <span className="text-2xl font-bold text-gray-900">
                  {securityData.auditTrail.filter(a => a.risk === 'high').length}
                </span>
              </div>
              <h3 className="font-medium text-gray-900">High Risk Actions</h3>
              <p className="text-sm text-gray-600">Today</p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Security Incidents Trend */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Incidents Trend</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={securityData.securityIncidents}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="incidents" stroke="#EF4444" strokeWidth={2} name="Incidents" />
                  <Line type="monotone" dataKey="resolved" stroke="#10B981" strokeWidth={2} name="Resolved" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Access Patterns */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">User Access Patterns</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={securityData.accessPatterns}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ role, sessions }) => `${role}: ${sessions}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="sessions"
                  >
                    {securityData.accessPatterns.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Vulnerability Summary */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Vulnerabilities</h3>
            <div className="space-y-3">
              {securityData.vulnerabilities.map((vuln, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      vuln.severity === 'critical' ? 'bg-red-500' :
                      vuln.severity === 'high' ? 'bg-orange-500' :
                      vuln.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                    }`}></div>
                    <span className="font-medium text-gray-900">{vuln.category}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 rounded-full text-xs border ${getRiskBadgeColor(vuln.severity)}`}>
                      {vuln.severity}
                    </span>
                    <span className="text-sm text-gray-600">{vuln.count} issues</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Audit Trail Tab */}
      {activeTab === 'audit-trail' && (
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Security Audit Trail</h3>
              <p className="text-gray-600">Recent security-relevant activities</p>
            </div>
            <div className="divide-y divide-gray-200">
              {securityData.auditTrail.map((entry, index) => (
                <div key={index} className="p-6 flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-gray-900">{entry.action}</span>
                      <span className={`px-2 py-1 rounded-full text-xs border ${getRiskBadgeColor(entry.risk)}`}>
                        {entry.risk} risk
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>User: {entry.user}</span>
                      <span>Time: {entry.timestamp.toLocaleString()}</span>
                    </div>
                  </div>
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Compliance Tab */}
      {activeTab === 'compliance' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {complianceFrameworks.map((framework, index) => {
              const statusConfig = getComplianceStatus(framework.status)
              return (
                <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{framework.name}</h3>
                    <div className="flex items-center space-x-2">
                      <statusConfig.icon className={`w-5 h-5 ${statusConfig.color}`} />
                      <span className={`text-sm font-medium ${statusConfig.color}`}>
                        {framework.status.replace('-', ' ')}
                      </span>
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Compliance Score</span>
                      <span className="text-sm font-medium">{framework.score}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          framework.score >= 95 ? 'bg-green-500' :
                          framework.score >= 85 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${framework.score}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    Last audit: {new Date(framework.lastAudit).toLocaleDateString()}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Compliance Actions */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommended Actions</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Update HIPAA documentation</p>
                  <p className="text-sm text-gray-600">Compliance score below 90%. Review data handling procedures.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-orange-600 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Schedule SOC 2 audit</p>
                  <p className="text-sm text-gray-600">Next audit due in 45 days. Begin preparation checklist.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
