<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Incident Management Tool with AI-Powered KB Assistant

This project is a modern incident management system built with Next.js, TypeScript, and Tailwind CSS. The system features AI-powered knowledge base suggestions to help technical engineers resolve tickets efficiently.

## Project Structure

- **Frontend**: Next.js 15 with TypeScript and Tailwind CSS
- **API Routes**: Built using Next.js App Router API routes
- **AI Integration**: Knowledge base matching and team routing suggestions
- **Components**: Reusable React components for ticket management

## Key Features

1. **Ticket Management**: Create, view, and manage incident tickets
2. **AI-Powered KB Suggestions**: Automatically suggest relevant knowledge base articles based on ticket content
3. **Smart Team Routing**: AI-assisted routing to appropriate support teams
4. **Real-time Analysis**: Live KB suggestions as users type ticket descriptions
5. **Modern UI**: Clean, responsive interface with proper accessibility

## Code Style Guidelines

- Use TypeScript for all components and API routes
- Follow React functional component patterns with hooks
- Implement proper error handling and loading states
- Use Tailwind CSS for styling with responsive design
- Maintain clean separation between UI and business logic
- Include proper TypeScript interfaces for all data structures

## API Endpoints

- `/api/tickets` - CRUD operations for tickets
- `/api/kb-suggestions` - AI-powered knowledge base matching

## Component Guidelines

- Use proper TypeScript interfaces for props and state
- Implement loading and error states
- Follow accessibility best practices
- Use semantic HTML elements
- Implement proper form validation

## AI Features

The system includes AI-powered features for:
- Knowledge base article matching based on ticket content
- Team routing suggestions based on ticket category and content analysis
- Real-time suggestions during ticket creation

When working with AI features, ensure proper error handling and fallback mechanisms.
