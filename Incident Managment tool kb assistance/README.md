# Incident Management Tool with AI-Powered KB Assistant

A modern, intelligent incident management system that helps technical engineers resolve tickets efficiently using AI-powered knowledge base suggestions and smart team routing.

## 🚀 Features

### Core Functionality
- **Ticket Management**: Create, view, filter, and manage incident tickets with comprehensive CRUD operations
- **AI-Powered KB Matching**: Automatically suggests relevant knowledge base articles based on ticket content analysis
- **Smart Team Routing**: AI-assisted routing to appropriate support teams with confidence scoring
- **Real-time Analysis**: Live suggestions as users type ticket descriptions during creation
- **Advanced Search**: Filter tickets by status, priority, team, and search across all content
- **Modern UI**: Clean, responsive interface built with Tailwind CSS and optimized for all devices

### AI Capabilities
- **Content Analysis**: Analyzes ticket titles and descriptions using advanced keyword matching
- **Relevance Scoring**: Ranks KB articles by relevance percentage (0-100%)
- **Team Assignment**: Suggests optimal team routing based on ticket category and content analysis
- **Proactive Suggestions**: Shows KB articles during ticket creation to prevent unnecessary tickets
- **Fallback Mechanisms**: Graceful degradation when AI services are unavailable

## 🛠 Technology Stack

- **Frontend**: Next.js 15 with TypeScript and App Router
- **Styling**: Tailwind CSS with custom design system
- **Icons**: Lucide React for consistent iconography
- **API**: RESTful API routes using Next.js App Router
- **AI Integration**: Custom relevance algorithm (extensible to OpenAI/other AI services)
- **State Management**: React hooks with optimistic updates

## 📦 Installation & Setup

1. **Navigate to the project directory**
2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser** and navigate to `http://localhost:3000`

```
src/
├── app/
│   ├── api/
│   │   ├── tickets/          # Ticket CRUD operations
│   │   └── kb-suggestions/   # AI-powered KB matching
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Main dashboard
├── components/
│   └── NewTicketForm.tsx    # Ticket creation form with AI
└── .github/
    └── copilot-instructions.md  # GitHub Copilot configuration
```

## � How It Works

### 1. Ticket Creation Process
- User clicks "New Ticket" to open the creation form
- Form includes fields for title, description, category, priority, and reporter
- **AI Analysis**: As user types, system analyzes content in real-time
- **KB Suggestions**: Relevant knowledge base articles appear in the sidebar
- **Team Routing**: AI suggests optimal team assignment based on content analysis
- User reviews suggestions before submitting the ticket

### 2. AI-Powered Knowledge Base Matching
- **Content Analysis**: Parses ticket text for keywords and context using advanced algorithms
- **Relevance Scoring**: Calculates match percentage (0-100%) for each KB article
- **Smart Filtering**: Shows only highly relevant suggestions (>10% relevance threshold)
- **Real-time Updates**: Suggestions update as user modifies ticket content

### 3. Dashboard & Ticket Management
- **Ticket Overview**: Dashboard displays all tickets with status indicators
- **Advanced Filtering**: Filter by status, priority, team, or search across content
- **KB Assistant Panel**: Click any ticket to see relevant KB articles
- **Team Insights**: AI-powered team routing suggestions for each ticket

## 📊 API Endpoints

### Tickets API (`/api/tickets`)
- **GET**: Retrieve tickets with optional filtering (`?status=open&team=network`)
- **POST**: Create new ticket with AI-powered team routing
- **PUT**: Update existing ticket status, assignment, or details

**Example POST Request:**
```json
{
  "title": "Email server not responding",
  "description": "Users unable to access email. Server appears to be down.",
  "priority": "high",
  "category": "Email",
  "reportedBy": "admin@company.com"
}
```

### KB Suggestions API (`/api/kb-suggestions`)
- **POST**: Get AI-powered KB recommendations for ticket content
- Returns relevance scores, suggested articles, and team routing recommendations

**Example POST Request:**
```json
{
  "ticketTitle": "VPN connection issues",
  "ticketDescription": "Users cannot connect to VPN",
  "category": "Network"
}
```

**Example Response:**
```json
{
  "success": true,
  "suggestions": [
    {
      "id": "KB-002",
      "title": "VPN Configuration and Common Issues",
      "relevanceScore": 0.88,
      "category": "Network",
      "tags": ["vpn", "network", "connectivity"]
    }
  ],
  "recommendedTeam": "Network",
  "confidence": 0.88
}
```

## 🔧 Customization Guide

### Adding New Knowledge Base Articles
Edit the `kbDocuments` array in `/src/app/api/kb-suggestions/route.ts`:

```typescript
{
  id: 'KB-XXX',
  title: 'Your KB Article Title',
  content: 'Detailed troubleshooting steps and solutions...',
  category: 'Category',
  tags: ['tag1', 'tag2', 'tag3'],
  lastUpdated: new Date()
}
```

### Customizing Team Routing Logic
Modify the `determineTeamFromCategory` function in `/src/app/api/tickets/route.ts`:

```typescript
switch (category.toLowerCase()) {
  case 'email':
  case 'server':
    return 'Infrastructure'
  case 'network':
  case 'vpn':
    return 'Network'
  // Add your custom routing logic
}
```

### Enhancing AI Algorithm
The relevance scoring in `/src/app/api/kb-suggestions/route.ts` can be enhanced with:
- **OpenAI Integration**: Replace custom algorithm with GPT-based semantic analysis
- **Machine Learning**: Implement ML models for better pattern recognition  
- **User Feedback**: Add rating system to improve suggestions over time
- **Context Awareness**: Consider user role, previous tickets, and resolution history

## 🎨 Key UI Components

### NewTicketForm Component
- **Real-time AI Analysis**: Live suggestions as user types
- **KB Article Preview**: Shows relevant articles in sidebar
- **Team Routing Display**: Visual indication of suggested team assignment
- **Responsive Design**: Mobile-optimized with touch-friendly interface
- **Form Validation**: Client-side validation with error messaging

### Main Dashboard
- **Ticket Grid**: Card-based layout with status indicators
- **Advanced Search**: Real-time filtering and search capabilities
- **AI Suggestions Panel**: Context-aware KB article recommendations
- **Priority Indicators**: Color-coded priority system
- **Status Tracking**: Visual workflow status indicators

## 🚀 Getting Started

1. **Access the Application**: Navigate to `http://localhost:3001` after starting the dev server
2. **View Sample Tickets**: The dashboard loads with sample incident tickets
3. **Create a New Ticket**: Click "New Ticket" to experience AI-powered suggestions
4. **Explore KB Suggestions**: Click on any ticket to see relevant knowledge base articles
5. **Test the AI**: Try creating tickets with different categories to see team routing

## 📈 Performance Features

- **Fast Loading**: Optimized with Next.js 15 and static generation
- **Real-time Updates**: Efficient state management with React hooks
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Lightweight Bundle**: Optimized bundle size with tree shaking

## 🔐 Security & Best Practices

- **Input Validation**: All forms include client and server-side validation
- **API Security**: Proper error handling and response sanitization
- **XSS Protection**: React's built-in XSS protection
- **Type Safety**: Full TypeScript implementation for runtime safety

## 🛠 Development

### Project Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Adding New Features
1. **Components**: Add reusable components in `/src/components/`
2. **API Routes**: Create new endpoints in `/src/app/api/`
3. **Styling**: Use Tailwind CSS classes for consistent design
4. **Types**: Define TypeScript interfaces for data structures

## 🤝 Contributing

1. Follow TypeScript and React best practices
2. Use Tailwind CSS for styling consistency
3. Implement proper error handling and loading states
4. Add comprehensive TypeScript interfaces
5. Test on multiple screen sizes and devices

## 🎯 Future Enhancements

- **Advanced AI**: OpenAI integration for semantic analysis
- **User Authentication**: Role-based access control
- **Database Integration**: PostgreSQL/MongoDB for persistent storage
- **Email Notifications**: Automated ticket update notifications
- **Analytics Dashboard**: Performance metrics and insights
- **Mobile App**: React Native mobile application
- **Multi-language Support**: Internationalization (i18n)
- **Advanced Reporting**: Custom reports and data visualization

---

**🎉 Your AI-powered incident management system is now ready!**

Visit `http://localhost:3001` to start managing incidents with intelligent KB assistance.

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── kb-suggestions/     # AI-powered KB matching API
│   │   └── tickets/           # Ticket CRUD operations
│   ├── globals.css           # Global styles
│   ├── layout.tsx           # Root layout component
│   └── page.tsx             # Main dashboard page
├── components/
│   └── NewTicketForm.tsx    # Ticket creation form with AI suggestions
└── types/                   # TypeScript type definitions
```

## 🤖 AI Features Explained

### Knowledge Base Matching
The system analyzes ticket content using:
- **Keyword Extraction**: Identifies key terms from title and description
- **Content Scoring**: Matches against KB article titles, content, and tags
- **Relevance Ranking**: Scores articles from 0-100% relevance
- **Smart Filtering**: Only shows articles above relevance threshold

### Team Routing Intelligence
AI suggests appropriate teams based on:
- **Category Analysis**: Maps ticket categories to team expertise
- **Content Analysis**: Analyzes ticket description for technical keywords
- **KB Article Correlation**: Uses matched KB articles to infer correct team
- **Historical Patterns**: Learns from previous similar tickets

## 📝 Usage Guide

### Creating a New Ticket
1. Click the "New Ticket" button
2. Fill in the ticket details (title, description, category, priority)
3. Watch as AI suggests relevant KB articles in real-time
4. Review suggested team routing
5. Submit the ticket

### Managing Existing Tickets
1. Browse tickets in the main dashboard
2. Use search and filters to find specific tickets
3. Click on any ticket to see AI-suggested KB articles
4. View team routing recommendations

### Understanding AI Suggestions
- **Green indicators**: High relevance KB articles (>80% match)
- **Yellow indicators**: Medium relevance (50-80% match)
- **Blue indicators**: Team routing suggestions
- **Percentage scores**: Show how well each KB article matches the ticket

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file for configuration:
```env
NEXT_PUBLIC_BASE_URL=http://localhost:3000
OPENAI_API_KEY=your_openai_key_here  # Optional: for enhanced AI features
```

### Customizing KB Articles
Edit the KB documents in `/src/app/api/kb-suggestions/route.ts` to add your organization's knowledge base content.

### Team Configuration
Modify team routing logic in `/src/app/api/tickets/route.ts` to match your organization's team structure.

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Deploy to Vercel
```bash
npm i -g vercel
vercel --prod
```

## 📊 API Endpoints

### Tickets API (`/api/tickets`)
- **GET**: Retrieve tickets with optional filtering
- **POST**: Create new tickets with AI team routing
- **PUT**: Update existing tickets

### KB Suggestions API (`/api/kb-suggestions`)
- **POST**: Get AI-powered KB article suggestions for ticket content

## 🎨 Customization

### Styling
The project uses Tailwind CSS. Customize the design by:
- Modifying `tailwind.config.ts` for theme customization
- Editing component classes for specific styling
- Adding custom CSS in `globals.css`

### AI Algorithm
Enhance the AI capabilities by:
- Integrating with OpenAI GPT models
- Adding machine learning models for better classification
- Implementing feedback loops for continuous improvement

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
1. Check the existing tickets in the system for similar issues
2. Review the KB articles for troubleshooting guides
3. Create a new ticket using the system itself
4. Contact the development team

## 🔮 Future Enhancements

- **Integration with real AI services** (OpenAI, Azure Cognitive Services)
- **Advanced analytics and reporting**
- **Email notifications and alerts**
- **Integration with external ticketing systems**
- **Mobile application**
- **Advanced workflow automation**
- **Machine learning for predictive routing**

---

Built with ❤️ for efficient incident management and knowledge sharing.
