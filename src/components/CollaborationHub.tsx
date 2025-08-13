'use client'

import { useState, useEffect } from 'react'
import { MessageCircle, Users, Phone, Video, Send, Paperclip, Smile, Hash, AtSign, Bell, Volume2 } from 'lucide-react'

interface ChatMessage {
  id: string
  user: string
  avatar: string
  message: string
  timestamp: Date
  type: 'text' | 'file' | 'system' | 'ai'
  ticketId?: string
}

interface CollaborationRoom {
  id: string
  name: string
  type: 'incident' | 'team' | 'emergency'
  participants: number
  lastActivity: Date
  priority: 'low' | 'medium' | 'high' | 'critical'
}

export default function CollaborationHub() {
  const [activeRoom, setActiveRoom] = useState('INC-001')
  const [message, setMessage] = useState('')
  const [rooms] = useState<CollaborationRoom[]>([
    {
      id: 'INC-001',
      name: 'Email Server Outage',
      type: 'incident',
      participants: 5,
      lastActivity: new Date(),
      priority: 'critical'
    },
    {
      id: 'TEAM-INFRA',
      name: 'Infrastructure Team',
      type: 'team',
      participants: 12,
      lastActivity: new Date(Date.now() - 300000),
      priority: 'medium'
    },
    {
      id: 'EMERGENCY',
      name: 'Emergency Response',
      type: 'emergency',
      participants: 3,
      lastActivity: new Date(Date.now() - 900000),
      priority: 'high'
    }
  ])

  const [messages] = useState<ChatMessage[]>([
    {
      id: '1',
      user: 'Sarah Chen (DevOps)',
      avatar: '👩‍💻',
      message: 'Email server is showing 503 errors. Checking load balancer status now.',
      timestamp: new Date(Date.now() - 120000),
      type: 'text'
    },
    {
      id: '2',
      user: 'AI Assistant',
      avatar: '🤖',
      message: 'Based on similar incidents, check the following: 1) Disk space on /var/mail 2) MySQL connection pool 3) SSL certificate expiry',
      timestamp: new Date(Date.now() - 90000),
      type: 'ai'
    },
    {
      id: '3',
      user: 'Mike Rodriguez (SysAdmin)',
      avatar: '👨‍🔧',
      message: 'Disk space looks good. MySQL connections are at 95% capacity. This might be the issue.',
      timestamp: new Date(Date.now() - 60000),
      type: 'text'
    }
  ])

  const sendMessage = () => {
    if (message.trim()) {
      // In real implementation, this would send via WebSocket
      console.log('Sending message:', message)
      setMessage('')
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 border-red-300 text-red-800'
      case 'high': return 'bg-orange-100 border-orange-300 text-orange-800'
      case 'medium': return 'bg-yellow-100 border-yellow-300 text-yellow-800'
      default: return 'bg-green-100 border-green-300 text-green-800'
    }
  }

  const getRoomIcon = (type: string) => {
    switch (type) {
      case 'incident': return '🚨'
      case 'team': return '👥'
      case 'emergency': return '⚡'
      default: return '💬'
    }
  }

  return (
    <div className="h-full flex">
      {/* Rooms Sidebar */}
      <div className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Collaboration Rooms</h2>
          <div className="flex space-x-2">
            <button className="flex items-center space-x-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm">
              <Hash className="w-4 h-4" />
              <span>Incidents</span>
            </button>
            <button className="flex items-center space-x-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm">
              <Users className="w-4 h-4" />
              <span>Teams</span>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {rooms.map((room) => (
            <div
              key={room.id}
              className={`p-3 rounded-lg mb-2 cursor-pointer transition-colors ${
                activeRoom === room.id ? 'bg-blue-100 border border-blue-200' : 'hover:bg-gray-100'
              }`}
              onClick={() => setActiveRoom(room.id)}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center space-x-2">
                  <span className="text-sm">{getRoomIcon(room.type)}</span>
                  <span className="font-medium text-gray-900 text-sm">{room.name}</span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs border ${getPriorityColor(room.priority)}`}>
                  {room.priority}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{room.participants} participants</span>
                <span>{room.lastActivity.toLocaleTimeString()}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="p-4 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-2">
            <button className="flex items-center justify-center space-x-2 p-2 bg-green-100 text-green-700 rounded-lg text-sm hover:bg-green-200">
              <Phone className="w-4 h-4" />
              <span>Call</span>
            </button>
            <button className="flex items-center justify-center space-x-2 p-2 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200">
              <Video className="w-4 h-4" />
              <span>Meet</span>
            </button>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-xl">{getRoomIcon(rooms.find(r => r.id === activeRoom)?.type || 'incident')}</span>
              <div>
                <h3 className="font-semibold text-gray-900">
                  {rooms.find(r => r.id === activeRoom)?.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {rooms.find(r => r.id === activeRoom)?.participants} participants • Active now
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Bell className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Volume2 className="w-5 h-5 text-gray-600" />
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                Start Video Call
              </button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className="flex space-x-3">
              <div className="text-2xl">{msg.avatar}</div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-medium text-gray-900 text-sm">{msg.user}</span>
                  <span className="text-xs text-gray-500">
                    {msg.timestamp.toLocaleTimeString()}
                  </span>
                  {msg.type === 'ai' && (
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                      AI
                    </span>
                  )}
                </div>
                <div className={`p-3 rounded-lg text-sm ${
                  msg.type === 'ai' 
                    ? 'bg-purple-50 border border-purple-200' 
                    : 'bg-gray-100'
                }`}>
                  {msg.message}
                </div>
              </div>
            </div>
          ))}

          {/* AI Typing Indicator */}
          <div className="flex space-x-3">
            <div className="text-2xl">🤖</div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <span className="font-medium text-gray-900 text-sm">AI Assistant</span>
                <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                  AI
                </span>
              </div>
              <div className="bg-purple-50 border border-purple-200 p-3 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center space-x-3">
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <Paperclip className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex-1 relative">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message... Use @mention or #incident-id"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded">
                <Smile className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <button
              onClick={sendMessage}
              className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              disabled={!message.trim()}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          
          {/* Quick Actions Bar */}
          <div className="flex items-center space-x-2 mt-2">
            <button className="flex items-center space-x-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs hover:bg-gray-200">
              <AtSign className="w-3 h-3" />
              <span>Mention AI</span>
            </button>
            <button className="flex items-center space-x-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs hover:bg-gray-200">
              <Hash className="w-3 h-3" />
              <span>Link Ticket</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
