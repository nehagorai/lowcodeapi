# LowCodeAPI Server

A backend that provides a unified API gateway for third-party service integrations.

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ 
- **npm** or **yarn**
- **MySQL**
- **Redis** (for sessions and caching)

### Installation

1. **Install dependencies:**
```bash
cd lowcodeapi/server
npm install
# or
yarn install
```

2. **Environment configuration:**
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Database setup:**
```bash
# For MySQL

```

4. **Start development server:**
```bash
npm run dev
```

The server will start on `http://localhost:3001` (or your configured port).

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server with hot reload
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run format       # Format code with Prettier
npm run format:check # Check code formatting

# Testing
npm run test         # Run tests with coverage
```

### Environment Variables

Create a `.env` file in the server directory:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=lowcodeapi
DB_USER=root
DB_PASSWORD=your_password

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT Configuration
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=24h

# OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# AWS Configuration (optional)
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
```

## 🔧 Configuration

### Database Setup

The server supports both MySQL and SQLite databases:

- **MySQL**: Recommended for production environments

## 🚀 Deployment

### Production Build

```bash
# Build the application
npm run build

# Start production server
npm run start
```

### Docker Deployment

```bash
# Build Docker image
docker build -t lowcodeapi-server .

# Run container
docker run -p 3001:3001 lowcodeapi-server
```

### PM2 Process Manager

```bash
# Start with PM2
pm2 start dist/bin/www --name lowcodeapi-server

# Monitor processes
pm2 status
pm2 logs lowcodeapi-server
```
