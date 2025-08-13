'use client'

import { useState } from 'react'
import { Play, Pause, Settings, Zap, Clock, CheckCircle, AlertCircle, ArrowRight, Plus, Edit, Trash2 } from 'lucide-react'

interface AutomationRule {
  id: string
  name: string
  description: string
  trigger: {
    type: 'ticket_created' | 'keyword_detected' | 'priority_changed' | 'time_based'
    conditions: string[]
  }
  actions: {
    type: 'assign_team' | 'send_notification' | 'create_subtask' | 'escalate' | 'run_script'
    config: any
  }[]
  isActive: boolean
  executions: number
  lastRun?: Date
  successRate: number
}

export default function AutomationWorkflows() {
  const [automations] = useState<AutomationRule[]>([
    {
      id: 'auto-1',
      name: 'Critical Email Issue Auto-Escalation',
      description: 'Automatically escalate email-related critical issues to Infrastructure team',
      trigger: {
        type: 'ticket_created',
        conditions: ['priority === "critical"', 'category === "Email"']
      },
      actions: [
        { type: 'assign_team', config: { team: 'Infrastructure', assignee: 'senior_engineer' } },
        { type: 'send_notification', config: { channels: ['slack', 'email'], recipients: ['team_lead'] } },
        { type: 'escalate', config: { level: 2, timeout: '15_minutes' } }
      ],
      isActive: true,
      executions: 23,
      lastRun: new Date(Date.now() - 3600000),
      successRate: 95.7
    },
    {
      id: 'auto-2',
      name: 'VPN Issues Knowledge Base Suggester',
      description: 'Suggest VPN troubleshooting guides when VPN keywords are detected',
      trigger: {
        type: 'keyword_detected',
        conditions: ['contains("VPN")', 'contains("connection")', 'contains("tunnel")']
      },
      actions: [
        { type: 'create_subtask', config: { title: 'Check VPN Server Status', assignee: 'auto' } },
        { type: 'run_script', config: { script: 'vpn_diagnostics.py', timeout: '5_minutes' } }
      ],
      isActive: true,
      executions: 45,
      lastRun: new Date(Date.now() - 1800000),
      successRate: 88.9
    },
    {
      id: 'auto-3',
      name: 'Weekend Incident Response',
      description: 'Special handling for incidents during off-hours',
      trigger: {
        type: 'time_based',
        conditions: ['weekday > 5', 'hour < 8 OR hour > 18']
      },
      actions: [
        { type: 'send_notification', config: { channels: ['sms', 'phone'], recipients: ['on_call_engineer'] } },
        { type: 'escalate', config: { level: 1, timeout: '10_minutes' } }
      ],
      isActive: true,
      executions: 12,
      lastRun: new Date(Date.now() - 7200000),
      successRate: 100
    }
  ])

  const [showCreateModal, setShowCreateModal] = useState(false)

  const getStatusColor = (isActive: boolean) => 
    isActive ? 'text-green-600' : 'text-gray-400'

  const getSuccessRateColor = (rate: number) => {
    if (rate >= 95) return 'text-green-600'
    if (rate >= 85) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Zap className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Automation Workflows</h2>
            <p className="text-gray-600">Smart rules to streamline incident management</p>
          </div>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          <span>Create Rule</span>
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-sm font-medium text-gray-600">Active Rules</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 mt-1">
            {automations.filter(a => a.isActive).length}
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Play className="w-5 h-5 text-blue-500" />
            <span className="text-sm font-medium text-gray-600">Total Executions</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 mt-1">
            {automations.reduce((sum, a) => sum + a.executions, 0)}
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-orange-500" />
            <span className="text-sm font-medium text-gray-600">Avg Success Rate</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 mt-1">
            {Math.round(automations.reduce((sum, a) => sum + a.successRate, 0) / automations.length)}%
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-purple-500" />
            <span className="text-sm font-medium text-gray-600">Time Saved</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 mt-1">24h</div>
        </div>
      </div>

      {/* Automation Rules */}
      <div className="space-y-4">
        {automations.map((automation) => (
          <div key={automation.id} className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{automation.name}</h3>
                  <div className="flex items-center space-x-1">
                    {automation.isActive ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <Pause className="w-4 h-4 text-gray-400" />
                    )}
                    <span className={`text-sm font-medium ${getStatusColor(automation.isActive)}`}>
                      {automation.isActive ? 'Active' : 'Paused'}
                    </span>
                  </div>
                </div>
                <p className="text-gray-600 mb-3">{automation.description}</p>
                
                {/* Trigger */}
                <div className="mb-3">
                  <span className="text-sm font-medium text-gray-700">Trigger: </span>
                  <span className="text-sm text-gray-600">
                    {automation.trigger.type.replace('_', ' ')} - {automation.trigger.conditions.join(', ')}
                  </span>
                </div>

                {/* Actions */}
                <div className="mb-4">
                  <span className="text-sm font-medium text-gray-700">Actions: </span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {automation.actions.map((action, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                        {action.type.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center space-x-6 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">{automation.executions}</span> executions
                  </div>
                  <div>
                    Success rate: <span className={`font-medium ${getSuccessRateColor(automation.successRate)}`}>
                      {automation.successRate}%
                    </span>
                  </div>
                  {automation.lastRun && (
                    <div>
                      Last run: {automation.lastRun.toLocaleString()}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Settings className="w-4 h-4 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Edit className="w-4 h-4 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Trash2 className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Workflow Visualization */}
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2 text-sm">
                <div className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                  {automation.trigger.type}
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400" />
                {automation.actions.map((action, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                      {action.type}
                    </div>
                    {index < automation.actions.length - 1 && (
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Templates */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Automation Templates</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg cursor-pointer hover:shadow-md transition-shadow">
            <h4 className="font-medium text-gray-900 mb-2">Security Incident Response</h4>
            <p className="text-sm text-gray-600 mb-3">Auto-escalate security issues and notify CISO team</p>
            <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">Use Template →</button>
          </div>
          <div className="bg-white p-4 rounded-lg cursor-pointer hover:shadow-md transition-shadow">
            <h4 className="font-medium text-gray-900 mb-2">Performance Degradation</h4>
            <p className="text-sm text-gray-600 mb-3">Auto-run diagnostics when performance issues detected</p>
            <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">Use Template →</button>
          </div>
          <div className="bg-white p-4 rounded-lg cursor-pointer hover:shadow-md transition-shadow">
            <h4 className="font-medium text-gray-900 mb-2">Customer Impact Alert</h4>
            <p className="text-sm text-gray-600 mb-3">Notify stakeholders when customer-facing issues occur</p>
            <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">Use Template →</button>
          </div>
        </div>
      </div>
    </div>
  )
}
