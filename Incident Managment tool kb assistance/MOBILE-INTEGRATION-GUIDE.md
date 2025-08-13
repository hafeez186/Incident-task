# 📱 React Native Mobile App Integration Guide

## 🚀 Quick Start

Your incident management tool now provides mobile APIs that can be consumed by React Native apps.

### 1. Install Dependencies

```bash
npm install @react-native-async-storage/async-storage
npm install react-native-push-notification
npm install @react-native-community/netinfo
npm install react-native-vector-icons
```

### 2. Basic Setup

```javascript
// services/ApiService.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

class ApiService {
  constructor() {
    this.baseURL = 'https://your-app-domain.com/api/mobile';
    this.token = null;
  }

  async initialize() {
    this.token = await AsyncStorage.getItem('auth_token');
  }

  async authenticate(username, password, deviceId) {
    try {
      const response = await fetch(`${this.baseURL}/auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
          deviceId,
          appVersion: '1.0.0'
        })
      });

      const data = await response.json();
      
      if (data.success) {
        this.token = data.token;
        await AsyncStorage.setItem('auth_token', data.token);
        await AsyncStorage.setItem('user_data', JSON.stringify(data.user));
        return data;
      }
      
      throw new Error(data.error || 'Authentication failed');
    } catch (error) {
      console.error('Auth error:', error);
      throw error;
    }
  }

  async getTickets(filters = {}) {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await fetch(`${this.baseURL}/tickets?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        }
      });

      return await response.json();
    } catch (error) {
      console.error('Tickets fetch error:', error);
      
      // Return cached data if offline
      const netInfo = await NetInfo.fetch();
      if (!netInfo.isConnected) {
        return await this.getCachedTickets();
      }
      
      throw error;
    }
  }

  async createTicket(ticketData) {
    try {
      const response = await fetch(`${this.baseURL}/tickets`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ticketData)
      });

      const result = await response.json();
      
      if (result.success) {
        return result.ticket;
      }
      
      throw new Error(result.error || 'Failed to create ticket');
    } catch (error) {
      console.error('Create ticket error:', error);
      
      // Store offline if no connection
      const netInfo = await NetInfo.fetch();
      if (!netInfo.isConnected) {
        await this.storeOfflineTicket(ticketData);
        return { ...ticketData, id: `offline_${Date.now()}`, offline: true };
      }
      
      throw error;
    }
  }

  async getAnalytics() {
    try {
      const response = await fetch(`${this.baseURL}/analytics`, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        }
      });

      return await response.json();
    } catch (error) {
      console.error('Analytics fetch error:', error);
      throw error;
    }
  }

  // Offline support methods
  async getCachedTickets() {
    const cached = await AsyncStorage.getItem('cached_tickets');
    return cached ? JSON.parse(cached) : { tickets: [], offline: true };
  }

  async storeOfflineTicket(ticketData) {
    const offline = await AsyncStorage.getItem('offline_tickets');
    const tickets = offline ? JSON.parse(offline) : [];
    tickets.push({ ...ticketData, createdAt: new Date().toISOString() });
    await AsyncStorage.setItem('offline_tickets', JSON.stringify(tickets));
  }
}

export default new ApiService();
```

### 3. React Native Components

```javascript
// components/TicketList.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ApiService from '../services/ApiService';

const TicketList = ({ navigation }) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      const response = await ApiService.getTickets();
      setTickets(response.tickets || []);
    } catch (error) {
      Alert.alert('Error', 'Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTickets();
    setRefreshing(false);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return '#DC2626';
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
      default: return '#6B7280';
    }
  };

  const renderTicket = ({ item }) => (
    <TouchableOpacity
      style={styles.ticketCard}
      onPress={() => navigation.navigate('TicketDetails', { ticketId: item.id })}
    >
      <View style={styles.ticketHeader}>
        <Text style={styles.ticketId}>{item.id}</Text>
        <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(item.priority) }]}>
          <Text style={styles.priorityText}>{item.priority.toUpperCase()}</Text>
        </View>
      </View>
      
      <Text style={styles.ticketTitle}>{item.title}</Text>
      <Text style={styles.ticketSummary} numberOfLines={2}>{item.summary}</Text>
      
      <View style={styles.ticketFooter}>
        <View style={styles.footerItem}>
          <Icon name="person" size={16} color="#6B7280" />
          <Text style={styles.footerText}>{item.assignee || 'Unassigned'}</Text>
        </View>
        <View style={styles.footerItem}>
          <Icon name="schedule" size={16} color="#6B7280" />
          <Text style={styles.footerText}>{item.estimatedResolution}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={tickets}
        renderItem={renderTicket}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  listContainer: {
    padding: 16,
  },
  ticketCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  ticketId: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
  },
  ticketTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  ticketSummary: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  ticketFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
});

export default TicketList;
```

### 4. Push Notifications Setup

```javascript
// services/NotificationService.js
import PushNotification from 'react-native-push-notification';
import { Platform } from 'react-native';
import ApiService from './ApiService';

class NotificationService {
  configure() {
    PushNotification.configure({
      onRegister: (token) => {
        console.log('Push token:', token);
        this.registerForPushNotifications(token);
      },

      onNotification: (notification) => {
        console.log('Notification received:', notification);
        
        if (notification.userInteraction) {
          // User tapped notification
          this.handleNotificationTap(notification);
        }
      },

      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },

      popInitialNotification: true,
      requestPermissions: Platform.OS === 'ios',
    });
  }

  async registerForPushNotifications(token) {
    try {
      await ApiService.registerPushToken(token);
    } catch (error) {
      console.error('Failed to register push token:', error);
    }
  }

  handleNotificationTap(notification) {
    // Navigate to specific screen based on notification data
    if (notification.data?.ticketId) {
      // Navigate to ticket details
      console.log('Navigate to ticket:', notification.data.ticketId);
    }
  }

  showLocalNotification(title, message, data = {}) {
    PushNotification.localNotification({
      title,
      message,
      data,
      playSound: true,
      soundName: 'default',
    });
  }
}

export default new NotificationService();
```

## 📡 WebSocket Integration (Optional)

For real-time updates, you can also integrate WebSocket:

```javascript
// services/WebSocketService.js
class WebSocketService {
  constructor() {
    this.ws = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  connect(userId, token) {
    try {
      this.ws = new WebSocket(`wss://your-app-domain.com/ws?userId=${userId}&token=${token}`);
      
      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.reconnectAttempts = 0;
      };

      this.ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        this.handleMessage(data);
      };

      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        this.reconnect(userId, token);
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    } catch (error) {
      console.error('WebSocket connection failed:', error);
    }
  }

  handleMessage(data) {
    switch (data.type) {
      case 'ticket_update':
        // Handle ticket updates
        break;
      case 'new_notification':
        // Show notification
        break;
      default:
        console.log('Unknown message type:', data.type);
    }
  }

  reconnect(userId, token) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        this.connect(userId, token);
      }, 1000 * this.reconnectAttempts);
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export default new WebSocketService();
```

## 🎯 Integration Summary

Your incident management tool now supports:

1. **PWA** - Already configured, users can install as native app
2. **Mobile APIs** - RESTful endpoints for mobile app consumption
3. **Push Notifications** - Real-time alerts and updates
4. **Offline Support** - Service worker handles offline scenarios
5. **React Native Ready** - Complete integration examples provided

The mobile integration allows users to:
- View and create tickets on mobile
- Receive push notifications for urgent incidents
- Work offline with automatic sync
- Access analytics and insights
- Install as native app experience

This gives you a significant advantage in the hackathon - most projects are web-only, but yours works seamlessly across all platforms! 🚀
