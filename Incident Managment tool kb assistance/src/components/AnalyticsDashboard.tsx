'use client'

import { useState, useEffect } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts'
import {
  TrendingUp,
  Clock,
  AlertTriangle,
  CheckCircle,
  Users,
  Zap,
  Activity,
  Target
} from 'lucide-react'

interface DashboardStats {
  totalTickets: number
  openTickets: number
  resolvedToday: number
  avgResolutionTime: string
  criticalTickets: number
  teamPerformance: { team: string; resolved: number; pending: number }[]
  priorityDistribution: { priority: string; count: number; color: string }[]
  resolutionTrend: { day: string; resolved: number; created: number }[]
  aiAccuracy: number
  kbUsageRate: number
}

const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e']

export default function AnalyticsDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalTickets: 156,
    openTickets: 23,
    resolvedToday: 12,
    avgResolutionTime: '4.2 hours',
    criticalTickets: 3,
    teamPerformance: [
      { team: 'Infrastructure', resolved: 45, pending: 8 },
      { team: 'Network', resolved: 32, pending: 6 },
      { team: 'Application', resolved: 28, pending: 5 },
      { team: 'Security', resolved: 15, pending: 2 },
      { team: 'Hardware', resolved: 21, pending: 2 }
    ],
    priorityDistribution: [
      { priority: 'Critical', count: 3, color: '#ef4444' },
      { priority: 'High', count: 12, color: '#f97316' },
      { priority: 'Medium', count: 28, color: '#eab308' },
      { priority: 'Low', count: 15, color: '#22c55e' }
    ],
    resolutionTrend: [
      { day: 'Mon', resolved: 8, created: 12 },
      { day: 'Tue', resolved: 12, created: 15 },
      { day: 'Wed', resolved: 15, created: 18 },
      { day: 'Thu', resolved: 10, created: 14 },
      { day: 'Fri', resolved: 18, created: 16 },
      { day: 'Sat', resolved: 6, created: 8 },
      { day: 'Sun', resolved: 4, created: 6 }
    ],
    aiAccuracy: 87,
    kbUsageRate: 73
  })

  const [isRealTime, setIsRealTime] = useState(false)

  // Simulate real-time updates
  useEffect(() => {
    if (!isRealTime) return

    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        resolvedToday: prev.resolvedToday + Math.floor(Math.random() * 2),
        openTickets: Math.max(0, prev.openTickets + (Math.random() > 0.6 ? 1 : -1)),
        aiAccuracy: Math.min(99, prev.aiAccuracy + (Math.random() - 0.5) * 2),
        kbUsageRate: Math.min(99, prev.kbUsageRate + (Math.random() - 0.5) * 3)
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [isRealTime])

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    color, 
    trend, 
    subtitle 
  }: {
    title: string
    value: string | number
    icon: any
    color: string
    trend?: string
    subtitle?: string
  }) => (
    <div className="bg-white rounded-lg p-6 shadow-sm border">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center">
          <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
          <span className="text-sm text-green-600">{trend}</span>
        </div>
      )}
    </div>
  )

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">Real-time insights and performance metrics</p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsRealTime(!isRealTime)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              isRealTime 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {isRealTime ? '🟢 Live' : '⚪ Static'}
          </button>
          <div className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Tickets"
          value={stats.totalTickets}
          icon={Activity}
          color="bg-blue-500"
          trend="+12% this week"
        />
        <StatCard
          title="Open Tickets"
          value={stats.openTickets}
          icon={AlertTriangle}
          color="bg-orange-500"
          subtitle="Requiring attention"
        />
        <StatCard
          title="Resolved Today"
          value={stats.resolvedToday}
          icon={CheckCircle}
          color="bg-green-500"
          trend="+8% vs yesterday"
        />
        <StatCard
          title="Avg Resolution"
          value={stats.avgResolutionTime}
          icon={Clock}
          color="bg-purple-500"
          trend="-15% improvement"
        />
      </div>

      {/* AI Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">AI Performance</h3>
            <Zap className="w-5 h-5 text-yellow-500" />
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>KB Matching Accuracy</span>
                <span>{stats.aiAccuracy}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${stats.aiAccuracy}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>KB Usage Rate</span>
                <span>{stats.kbUsageRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${stats.kbUsageRate}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Priority Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={stats.priorityDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="count"
              >
                {stats.priorityDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-2 mt-4">
            {stats.priorityDistribution.map((item) => (
              <div key={item.priority} className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-1"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-xs text-gray-600">{item.priority}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Critical Alerts</h3>
          <div className="space-y-3">
            <div className="flex items-center p-3 bg-red-50 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-red-800">
                  {stats.criticalTickets} Critical Tickets
                </p>
                <p className="text-xs text-red-600">Require immediate attention</p>
              </div>
            </div>
            <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-yellow-800">
                  SLA Risk: 2 tickets
                </p>
                <p className="text-xs text-yellow-600">Approaching deadline</p>
              </div>
            </div>
            <div className="flex items-center p-3 bg-green-50 rounded-lg">
              <Target className="w-5 h-5 text-green-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-green-800">
                  95% SLA Compliance
                </p>
                <p className="text-xs text-green-600">Above target threshold</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.teamPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="team" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="resolved" fill="#22c55e" name="Resolved" />
              <Bar dataKey="pending" fill="#f97316" name="Pending" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Resolution Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.resolutionTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="resolved" 
                stroke="#22c55e" 
                strokeWidth={2}
                name="Resolved"
              />
              <Line 
                type="monotone" 
                dataKey="created" 
                stroke="#3b82f6" 
                strokeWidth={2}
                name="Created"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
