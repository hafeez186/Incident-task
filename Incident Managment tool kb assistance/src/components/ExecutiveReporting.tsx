'use client'

import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, ComposedChart, Area, AreaChart } from 'recharts'
import { Download, Share, Calendar, Filter, TrendingUp, Clock, Users, AlertTriangle, CheckCircle } from 'lucide-react'

interface ReportData {
  mttrData: Array<{ month: string; mttr: number; target: number }>
  incidentsByTeam: Array<{ team: string; incidents: number; resolved: number; color: string }>
  resolutionTrends: Array<{ date: string; resolved: number; created: number; backlog: number }>
  severityDistribution: Array<{ severity: string; count: number; color: string }>
  customerImpact: Array<{ week: string; affected: number; satisfaction: number }>
}

export default function ExecutiveReporting() {
  const [dateRange, setDateRange] = useState('last-30-days')
  const [reportType, setReportType] = useState('executive')

  const reportData: ReportData = {
    mttrData: [
      { month: 'Jan', mttr: 4.2, target: 4.0 },
      { month: 'Feb', mttr: 3.8, target: 4.0 },
      { month: 'Mar', mttr: 4.5, target: 4.0 },
      { month: 'Apr', mttr: 3.2, target: 4.0 },
      { month: 'May', mttr: 2.9, target: 4.0 },
      { month: 'Jun', mttr: 3.1, target: 4.0 }
    ],
    incidentsByTeam: [
      { team: 'Infrastructure', incidents: 45, resolved: 42, color: '#3B82F6' },
      { team: 'Network', incidents: 32, resolved: 30, color: '#EF4444' },
      { team: 'Security', incidents: 18, resolved: 17, color: '#F59E0B' },
      { team: 'Database', incidents: 25, resolved: 23, color: '#10B981' },
      { team: 'Application', incidents: 38, resolved: 35, color: '#8B5CF6' }
    ],
    resolutionTrends: [
      { date: 'Week 1', resolved: 28, created: 32, backlog: 4 },
      { date: 'Week 2', resolved: 35, created: 30, backlog: -1 },
      { date: 'Week 3', resolved: 42, created: 38, backlog: -3 },
      { date: 'Week 4', resolved: 39, created: 41, backlog: 2 }
    ],
    severityDistribution: [
      { severity: 'Critical', count: 8, color: '#DC2626' },
      { severity: 'High', count: 23, color: '#EA580C' },
      { severity: 'Medium', count: 67, color: '#D97706' },
      { severity: 'Low', count: 45, color: '#16A34A' }
    ],
    customerImpact: [
      { week: 'W1', affected: 1200, satisfaction: 7.2 },
      { week: 'W2', affected: 850, satisfaction: 7.8 },
      { week: 'W3', affected: 600, satisfaction: 8.1 },
      { week: 'W4', affected: 400, satisfaction: 8.5 }
    ]
  }

  const kpiCards = [
    {
      title: 'Mean Time to Resolution',
      value: '3.1 hours',
      change: '-12%',
      changeType: 'positive',
      icon: Clock,
      color: 'blue'
    },
    {
      title: 'First Call Resolution',
      value: '78%',
      change: '+5%',
      changeType: 'positive',
      icon: CheckCircle,
      color: 'green'
    },
    {
      title: 'Customer Satisfaction',
      value: '8.5/10',
      change: '+0.3',
      changeType: 'positive',
      icon: Users,
      color: 'purple'
    },
    {
      title: 'Critical Incidents',
      value: '8',
      change: '-2',
      changeType: 'positive',
      icon: AlertTriangle,
      color: 'red'
    }
  ]

  const getKpiCardStyle = (color: string) => {
    const styles = {
      blue: 'bg-blue-50 border-blue-200',
      green: 'bg-green-50 border-green-200',
      purple: 'bg-purple-50 border-purple-200',
      red: 'bg-red-50 border-red-200'
    }
    return styles[color as keyof typeof styles] || styles.blue
  }

  const getIconStyle = (color: string) => {
    const styles = {
      blue: 'text-blue-600',
      green: 'text-green-600',
      purple: 'text-purple-600',
      red: 'text-red-600'
    }
    return styles[color as keyof typeof styles] || styles.blue
  }

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Executive Dashboard</h2>
          <p className="text-gray-600">Comprehensive incident management insights</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="last-7-days">Last 7 days</option>
            <option value="last-30-days">Last 30 days</option>
            <option value="last-quarter">Last quarter</option>
            <option value="last-year">Last year</option>
          </select>
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((kpi, index) => (
          <div key={index} className={`border rounded-lg p-6 ${getKpiCardStyle(kpi.color)}`}>
            <div className="flex items-center justify-between mb-4">
              <kpi.icon className={`w-6 h-6 ${getIconStyle(kpi.color)}`} />
              <span className={`text-sm font-medium ${
                kpi.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
              }`}>
                {kpi.change}
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{kpi.value}</div>
            <div className="text-sm text-gray-600">{kpi.title}</div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* MTTR Trend */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Mean Time to Resolution Trend</h3>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <ComposedChart data={reportData.mttrData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="mttr" fill="#3B82F6" name="Actual MTTR" />
              <Line type="monotone" dataKey="target" stroke="#EF4444" strokeWidth={2} name="Target" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Incident Distribution by Team */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Incidents by Team</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={reportData.incidentsByTeam}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="team" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="incidents" fill="#3B82F6" name="Total Incidents" />
              <Bar dataKey="resolved" fill="#10B981" name="Resolved" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Resolution Trends */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Resolution vs Creation Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={reportData.resolutionTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="created" stackId="1" stroke="#EF4444" fill="#FEE2E2" name="Created" />
              <Area type="monotone" dataKey="resolved" stackId="2" stroke="#10B981" fill="#D1FAE5" name="Resolved" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Severity Distribution */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Incident Severity Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={reportData.severityDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ severity, count }) => `${severity}: ${count}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {reportData.severityDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Customer Impact Analysis */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Impact & Satisfaction</h3>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={reportData.customerImpact}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Bar yAxisId="left" dataKey="affected" fill="#EF4444" name="Customers Affected" />
            <Line yAxisId="right" type="monotone" dataKey="satisfaction" stroke="#10B981" strokeWidth={3} name="Satisfaction Score" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Action Items & Recommendations */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Strategic Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">🎯 Focus Area</h4>
            <p className="text-sm text-gray-600 mb-2">Infrastructure team shows highest incident volume</p>
            <p className="text-xs text-gray-500">Recommend additional resources or training</p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">📈 Improvement</h4>
            <p className="text-sm text-gray-600 mb-2">MTTR improved by 12% this month</p>
            <p className="text-xs text-gray-500">Continue automation initiatives</p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">⚠️ Risk Alert</h4>
            <p className="text-sm text-gray-600 mb-2">Critical incidents trending upward</p>
            <p className="text-xs text-gray-500">Implement proactive monitoring</p>
          </div>
        </div>
      </div>
    </div>
  )
}
