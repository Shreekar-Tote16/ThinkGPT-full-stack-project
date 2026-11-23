
# ThinkGPT – AI-Powered Multi-Model Conversational Platform

ThinkGPT is an advanced AI-powered conversational platform that integrates multiple language models into a unified interface. It provides intelligent, context-aware responses and introduces an Ensemble Mode, which combines outputs from multiple models to generate a more accurate and refined answer.

---

## Features

- Multi-Model AI Chat  
  Interact with multiple AI models within a single interface  

- Ensemble Mode  
  Combines responses from multiple models into one synthesized output  

- Real-Time Streaming  
  Fast and responsive token-based streaming replies  

- Chat History System  
  Stores and retrieves previous conversations  

- AI Resume Maker  
  Generates resumes using Google Gemini API  

- Dynamic Model Routing  
  Select and switch between models intelligently  

---

## Tech Stack

### Frontend
- React.js (Vite)

### Backend
- Node.js
- Express.js

### Database
- MongoDB (Mongoose)

### AI Integration
- Groq API

>>>>>>> 58c0ad1af6e829349ce6f6177509fe21b55a06ed

ThinkGPT is a full-stack AI conversational platform built using the MERN stack. It brings multiple AI models into one interface, allowing users to switch between models, maintain conversation context, and compare responses through a multi-model Ensemble Mode.

The project focuses on exploring multi-model AI integration, conversational context management, authentication, streaming responses, and full-stack application development.

## Features

### Multi-Model AI Chat
- Chat with multiple AI models from a single interface.
- Switch between AI models during a conversation.
- Automatic model routing for selecting a suitable model.
- Real-time streaming responses.
- Conversation context is passed to models to support follow-up questions.

### Ensemble Mode
- Generate responses using four different AI models.
- View model responses side by side.
- Compare the answers produced by different models.
- Use an AI judge to evaluate and synthesize the responses into a final answer.

### Available AI Models

| Model ID | Model | Provider |
|---|---|---|
| `groq-fast` | GPT-OSS 20B | Groq |
| `groq-large` | GPT-OSS 120B | Groq |
| `cloudflare-gemma` | Gemma 4 26B A4B | Cloudflare Workers AI |
| `cloudflare-glm` | GLM 4.7 Flash | Cloudflare Workers AI |
| `auto` | Smart Model Routing | Multiple |

### Authentication and User Accounts
- Guest access without requiring registration.
- User registration and login.
- Secure password hashing.
- HTTP-only authentication cookies.
- Persistent conversation history.
- Guest conversations can be associated with a registered account.
- Guest and authenticated user histories are kept separate.

### Chat Experience
- Conversation history and session management.
- Independent conversations.
- Copy AI responses.
- Markdown rendering for formatted responses.
- Responsive chat interface.
- Dark-themed user interface.

## Technology Stack

### Frontend
- React.js
- Vite
- JavaScript
- HTML5
- CSS3
- React Router
- React Markdown

### Backend
- Node.js
- Express.js
- REST APIs
- Mongoose
- MongoDB
- Cookie-based authentication
- Server-Sent Events / streaming responses

### AI Integration
- Groq API
- Cloudflare Workers AI
- GPT-OSS 20B
- GPT-OSS 120B
- Gemma 4 26B A4B
- GLM 4.7 Flash

### Database
- MongoDB Atlas

## Project Architecture

```text
ThinkGPT/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── server.js
│   └── package.json
│
├── .gitignore
└── README.md
