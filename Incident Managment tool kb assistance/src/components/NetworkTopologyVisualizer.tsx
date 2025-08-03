'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Wifi,
  Server,
  Monitor,
  Smartphone,
  Router,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Activity,
  Zap
} from 'lucide-react'

interface NetworkNode {
  id: string
  type: 'server' | 'router' | 'switch' | 'client' | 'firewall' | 'database'
  name: string
  status: 'healthy' | 'warning' | 'critical' | 'offline'
  x: number
  y: number
  connections: string[]
  metrics: {
    cpu: number
    memory: number
    network: number
    uptime: string
  }
  incidents: number
}

interface NetworkConnection {
  from: string
  to: string
  status: 'active' | 'slow' | 'failed'
  bandwidth: string
  latency: string
}

const getNodeIcon = (type: string) => {
  switch (type) {
    case 'server': return Server
    case 'router': return Router
    case 'client': return Monitor
    case 'database': return Activity
    default: return Wifi
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'healthy': return 'text-green-500 bg-green-100'
    case 'warning': return 'text-yellow-500 bg-yellow-100'
    case 'critical': return 'text-red-500 bg-red-100'
    case 'offline': return 'text-gray-500 bg-gray-100'
    default: return 'text-gray-500 bg-gray-100'
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'healthy': return CheckCircle
    case 'warning': return AlertTriangle
    case 'critical': return XCircle
    case 'offline': return XCircle
    default: return CheckCircle
  }
}

export default function NetworkTopologyVisualizer() {
  const [nodes, setNodes] = useState<NetworkNode[]>([
    {
      id: 'firewall-1',
      type: 'firewall',
      name: 'Main Firewall',
      status: 'healthy',
      x: 400,
      y: 100,
      connections: ['router-1'],
      metrics: { cpu: 45, memory: 67, network: 78, uptime: '45 days' },
      incidents: 0
    },
    {
      id: 'router-1',
      type: 'router',
      name: 'Core Router',
      status: 'warning',
      x: 400,
      y: 200,
      connections: ['switch-1', 'switch-2', 'server-1'],
      metrics: { cpu: 72, memory: 85, network: 92, uptime: '123 days' },
      incidents: 2
    },
    {
      id: 'switch-1',
      type: 'switch',
      name: 'Floor 1 Switch',
      status: 'healthy',
      x: 200,
      y: 350,
      connections: ['client-1', 'client-2'],
      metrics: { cpu: 23, memory: 45, network: 67, uptime: '87 days' },
      incidents: 0
    },
    {
      id: 'switch-2',
      type: 'switch',
      name: 'Floor 2 Switch',
      status: 'critical',
      x: 600,
      y: 350,
      connections: ['client-3', 'client-4'],
      metrics: { cpu: 89, memory: 94, network: 45, uptime: '12 days' },
      incidents: 5
    },
    {
      id: 'server-1',
      type: 'server',
      name: 'Mail Server',
      status: 'critical',
      x: 400,
      y: 350,
      connections: ['database-1'],
      metrics: { cpu: 95, memory: 87, network: 23, uptime: '2 days' },
      incidents: 8
    },
    {
      id: 'database-1',
      type: 'database',
      name: 'Primary DB',
      status: 'healthy',
      x: 400,
      y: 450,
      connections: [],
      metrics: { cpu: 56, memory: 67, network: 78, uptime: '156 days' },
      incidents: 1
    },
    {
      id: 'client-1',
      type: 'client',
      name: 'Workstation 1',
      status: 'healthy',
      x: 100,
      y: 450,
      connections: [],
      metrics: { cpu: 34, memory: 56, network: 89, uptime: '7 days' },
      incidents: 0
    },
    {
      id: 'client-2',
      type: 'client',
      name: 'Workstation 2',
      status: 'offline',
      x: 300,
      y: 450,
      connections: [],
      metrics: { cpu: 0, memory: 0, network: 0, uptime: '0 days' },
      incidents: 3
    },
    {
      id: 'client-3',
      type: 'client',
      name: 'Workstation 3',
      status: 'healthy',
      x: 500,
      y: 450,
      connections: [],
      metrics: { cpu: 45, memory: 67, network: 78, uptime: '23 days' },
      incidents: 0
    },
    {
      id: 'client-4',
      type: 'client',
      name: 'Workstation 4',
      status: 'warning',
      x: 700,
      y: 450,
      connections: [],
      metrics: { cpu: 78, memory: 89, network: 34, uptime: '45 days' },
      incidents: 1
    }
  ])

  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null)
  const [isLiveMode, setIsLiveMode] = useState(false)

  // Simulate real-time updates
  useEffect(() => {
    if (!isLiveMode) return

    const interval = setInterval(() => {
      setNodes(prevNodes => 
        prevNodes.map(node => ({
          ...node,
          metrics: {
            ...node.metrics,
            cpu: Math.max(0, Math.min(100, node.metrics.cpu + (Math.random() - 0.5) * 10)),
            memory: Math.max(0, Math.min(100, node.metrics.memory + (Math.random() - 0.5) * 8)),
            network: Math.max(0, Math.min(100, node.metrics.network + (Math.random() - 0.5) * 15))
          },
          status: node.metrics.cpu > 90 ? 'critical' : 
                  node.metrics.cpu > 70 ? 'warning' : 'healthy'
        }))
      )
    }, 2000)

    return () => clearInterval(interval)
  }, [isLiveMode])

  const renderConnections = useCallback(() => {
    const connections: JSX.Element[] = []
    
    nodes.forEach(node => {
      node.connections.forEach(targetId => {
        const target = nodes.find(n => n.id === targetId)
        if (target) {
          const isHealthy = node.status === 'healthy' && target.status === 'healthy'
          const strokeColor = isHealthy ? '#22c55e' : 
                             node.status === 'critical' || target.status === 'critical' ? '#ef4444' : '#f59e0b'
          
          connections.push(
            <motion.line
              key={`${node.id}-${targetId}`}
              x1={node.x}
              y1={node.y}
              x2={target.x}
              y2={target.y}
              stroke={strokeColor}
              strokeWidth="2"
              strokeDasharray={isHealthy ? "none" : "5,5"}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5 }}
            />
          )
        }
      })
    })
    
    return connections
  }, [nodes])

  const NodeComponent = ({ node }: { node: NetworkNode }) => {
    const Icon = getNodeIcon(node.type)
    const StatusIcon = getStatusIcon(node.status)
    
    return (
      <motion.g
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        onClick={() => setSelectedNode(node)}
        style={{ cursor: 'pointer' }}
      >
        <motion.circle
          cx={node.x}
          cy={node.y}
          r="25"
          className={`${getStatusColor(node.status)} stroke-2`}
          stroke="currentColor"
          animate={{
            scale: node.status === 'critical' ? [1, 1.2, 1] : 1
          }}
          transition={{
            repeat: node.status === 'critical' ? Infinity : 0,
            duration: 1
          }}
        />
        <foreignObject
          x={node.x - 12}
          y={node.y - 12}
          width="24"
          height="24"
        >
          <Icon className="w-6 h-6" />
        </foreignObject>
        {node.incidents > 0 && (
          <motion.circle
            cx={node.x + 15}
            cy={node.y - 15}
            r="8"
            fill="#ef4444"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          />
        )}
        {node.incidents > 0 && (
          <text
            x={node.x + 15}
            y={node.y - 11}
            textAnchor="middle"
            className="text-xs fill-white font-bold"
          >
            {node.incidents}
          </text>
        )}
        <text
          x={node.x}
          y={node.y + 40}
          textAnchor="middle"
          className="text-sm font-medium"
        >
          {node.name}
        </text>
      </motion.g>
    )
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Network Topology</h1>
          <p className="text-gray-600 mt-1">Real-time network status and incident visualization</p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsLiveMode(!isLiveMode)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              isLiveMode 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {isLiveMode ? '🟢 Live' : '⚪ Static'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Network Visualization */}
        <div className="lg:col-span-3 bg-white rounded-lg p-6 shadow-sm border">
          <svg
            width="100%"
            height="500"
            viewBox="0 0 800 500"
            className="border rounded-lg bg-gray-50"
          >
            {/* Render connections */}
            {renderConnections()}
            
            {/* Render nodes */}
            {nodes.map(node => (
              <NodeComponent key={node.id} node={node} />
            ))}
          </svg>
          
          {/* Legend */}
          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-100 text-green-500 rounded-full mr-2 flex items-center justify-center">
                <CheckCircle className="w-3 h-3" />
              </div>
              <span>Healthy</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-yellow-100 text-yellow-500 rounded-full mr-2 flex items-center justify-center">
                <AlertTriangle className="w-3 h-3" />
              </div>
              <span>Warning</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-100 text-red-500 rounded-full mr-2 flex items-center justify-center">
                <XCircle className="w-3 h-3" />
              </div>
              <span>Critical</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gray-100 text-gray-500 rounded-full mr-2 flex items-center justify-center">
                <XCircle className="w-3 h-3" />
              </div>
              <span>Offline</span>
            </div>
          </div>
        </div>

        {/* Node Details Panel */}
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {selectedNode ? 'Node Details' : 'Network Overview'}
          </h3>
          
          <AnimatePresence mode="wait">
            {selectedNode ? (
              <motion.div
                key="node-details"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                <div className="p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900">{selectedNode.name}</h4>
                  <p className="text-sm text-gray-600 capitalize">{selectedNode.type}</p>
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-2 ${getStatusColor(selectedNode.status)}`}>
                    {selectedNode.status.toUpperCase()}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>CPU Usage</span>
                      <span>{selectedNode.metrics.cpu}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div 
                        className={`h-2 rounded-full ${
                          selectedNode.metrics.cpu > 80 ? 'bg-red-500' :
                          selectedNode.metrics.cpu > 60 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${selectedNode.metrics.cpu}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Memory</span>
                      <span>{selectedNode.metrics.memory}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div 
                        className={`h-2 rounded-full ${
                          selectedNode.metrics.memory > 80 ? 'bg-red-500' :
                          selectedNode.metrics.memory > 60 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${selectedNode.metrics.memory}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Network</span>
                      <span>{selectedNode.metrics.network}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div 
                        className="bg-blue-500 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${selectedNode.metrics.network}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="pt-3 border-t border-gray-200">
                  <div className="flex justify-between text-sm">
                    <span>Uptime</span>
                    <span className="font-medium">{selectedNode.metrics.uptime}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span>Active Incidents</span>
                    <span className={`font-medium ${selectedNode.incidents > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {selectedNode.incidents}
                    </span>
                  </div>
                </div>
                
                {selectedNode.incidents > 0 && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center">
                      <AlertTriangle className="w-4 h-4 text-red-500 mr-2" />
                      <span className="text-sm font-medium text-red-800">
                        {selectedNode.incidents} active incident(s)
                      </span>
                    </div>
                    <p className="text-xs text-red-600 mt-1">
                      Click to view related tickets
                    </p>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-green-50 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {nodes.filter(n => n.status === 'healthy').length}
                    </div>
                    <div className="text-xs text-green-700">Healthy</div>
                  </div>
                  <div className="p-3 bg-red-50 rounded-lg text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {nodes.filter(n => n.status === 'critical').length}
                    </div>
                    <div className="text-xs text-red-700">Critical</div>
                  </div>
                </div>
                
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="text-lg font-bold text-blue-600">
                    {nodes.reduce((sum, node) => sum + node.incidents, 0)}
                  </div>
                  <div className="text-sm text-blue-700">Total Active Incidents</div>
                </div>
                
                <p className="text-sm text-gray-600">
                  Click on any node to view detailed metrics and incident information.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
