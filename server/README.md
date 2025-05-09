# CPG Matching AI Web Crawler - Backend

This is the backend service for the AI Web Crawler feature of the CPG Matching platform. It provides APIs for crawling product data from websites, processing the data with AI, and integrating it into the CPG Matching platform.

## Features

- Web crawling using Puppeteer
- AI processing with multiple providers:
  - OpenAI GPT-4o
  - Google Gemini Pro
  - AWS Claude 3 Sonnet (via Amazon Bedrock)
- RESTful API for managing crawl tasks and results
- MongoDB database for data storage

## Prerequisites

- Node.js (v16+)
- MongoDB
- One or more of the following API keys:
  - OpenAI API key
  - Google Gemini API key
  - AWS Access Keys with Bedrock permissions

## Installation

1. Clone the repository
2. Navigate to the server directory:
   ```
   cd cpg-matching-v2/server
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Configure environment variables by creating a `.env` file in the root directory:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/cpg_crawler
   NODE_ENV=development
   
   # AI Providers (configure at least one)
   OPENAI_API_KEY=your_openai_api_key_here
   GEMINI_API_KEY=your_gemini_api_key_here
   AI_PROVIDER=gemini  # default provider: openai, gemini, or use AWS Claude
   
   # AWS Claude Configuration (optional)
   AWS_REGION=us-east-1
   AWS_ACCESS_KEY_ID=your_aws_access_key
   AWS_SECRET_ACCESS_KEY=your_aws_secret_key
   AWS_CLAUDE_MODEL=anthropic.claude-3-sonnet-20240229-v1:0
   USE_AWS_CLAUDE=false  # set to true to use AWS Claude as default
   ```

## Running the server

### Development mode
```
npm run dev
```

### Production mode
```
npm run build
npm start
```

## API Endpoints

### Crawler API

- **POST /api/crawler/tasks**: Create a new crawl task
  - Request body: 
    ```json
    {
      "url": "https://example.com/product",
      "config": {
        "depth": 1,
        "maxPages": 1,
        "selectors": {
          "name": ".product-name",
          "price": ".product-price",
          "description": ".product-description",
          "image": ".product-image img",
          "ingredients": ".product-ingredients"
        }
      },
      "userId": "user123",
      "autoSave": false,
      "aiProvider": "default" // Options: "default", "openai", "gemini", "claude"
    }
    ```

- **GET /api/crawler/tasks**: Get all crawl tasks
  - Query parameters:
    - `status`: Filter by status (pending, processing, completed, failed)
    - `page`: Page number (default: 1)
    - `limit`: Items per page (default: 10)

- **GET /api/crawler/tasks/:id**: Get a specific crawl task

- **GET /api/crawler/results/:taskId**: Get crawl results for a task

- **POST /api/crawler/process/:resultId**: Process a crawl result with AI
  - Request body:
    ```json
    {
      "aiProvider": "claude" // Optional: specify which AI to use
    }
    ```

- **DELETE /api/crawler/tasks/:id**: Delete a crawl task and its results

## AI Provider Configuration

The application supports three AI providers for processing product data:

### OpenAI GPT-4o
- Set `OPENAI_API_KEY` in your `.env` file
- To use as default, set `AI_PROVIDER=openai`

### Google Gemini Pro
- Set `GEMINI_API_KEY` in your `.env` file
- To use as default, set `AI_PROVIDER=gemini`

### AWS Claude 3 Sonnet (via Amazon Bedrock)
- Configure AWS credentials in your `.env` file:
  ```
  AWS_REGION=us-east-1
  AWS_ACCESS_KEY_ID=your_aws_access_key
  AWS_SECRET_ACCESS_KEY=your_aws_secret_key
  AWS_CLAUDE_MODEL=anthropic.claude-3-sonnet-20240229-v1:0
  ```
- Your AWS account must have access to the Claude model in Amazon Bedrock
- To use as default, set `USE_AWS_CLAUDE=true`

## Project Structure

```
server/
├── src/
│   ├── config/               # Configuration files
│   ├── controllers/          # API controllers
│   │   └── crawler/          # Crawler-specific controllers
│   ├── models/               # Mongoose models
│   │   └── crawler/          # Crawler-specific models
│   ├── routes/               # API routes
│   │   └── crawler/          # Crawler-specific routes
│   ├── services/             # Business logic
│   │   └── crawler/          # Crawler-specific services
│   │       ├── aiService.ts  # AI processing with multiple providers
│   │       └── crawlerService.ts # Web crawling functionality
│   ├── utils/                # Utility functions
│   └── index.ts              # Entry point
├── logs/                     # Log files
├── .env                      # Environment variables
├── package.json              # Dependencies and scripts
└── tsconfig.json             # TypeScript configuration
```

## Technologies Used

- Express.js: Web framework
- Mongoose: MongoDB ODM
- Puppeteer: Headless browser for web crawling
- AI Providers:
  - OpenAI API: GPT-4o model
  - Google Gemini API: Gemini Pro model
  - AWS Bedrock: Claude 3 Sonnet model
- TypeScript: Type-safe JavaScript
- Winston: Logging library 

## Crawler Configuration

The web crawler can be configured with several options in the `.env` file:

### Basic Configuration
```
# Crawler Configuration
SAVE_SCREENSHOTS=true                 # Enable/disable screenshot capture
SCREENSHOT_PATH=logs/screenshots      # Path to save screenshots
NAVIGATION_TIMEOUT=90000              # Navigation timeout in milliseconds
MAX_RETRIES=3                         # Maximum number of navigation retries
```

### Proxy Support
The crawler supports using HTTP/HTTPS proxies, which can be helpful for accessing websites that might block regular automated requests:

```
USE_PROXY=true                      # Enable/disable proxy
PROXY_URL=http://proxy.example.com:8080  # Proxy server URL
PROXY_USERNAME=user                 # Proxy authentication username (if required)
PROXY_PASSWORD=pass                 # Proxy authentication password (if required)
```

### User Agent
You can customize the browser's user agent:

```
USER_AGENT=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36
```

## Crawler Features

- **Bot Detection Avoidance**: The crawler detects and reports when a site is using bot protection
- **Resource Blocking**: Images, fonts, and stylesheets are blocked to improve performance
- **Retry Logic**: Automatically retries failed navigation attempts
- **Screenshot Capture**: Takes screenshots of the crawled pages for debugging
- **Proxy Support**: Can route requests through a proxy server
- **Custom Selectors**: Supports custom CSS selectors for precise data extraction
- **Currency Detection**: Automatically detects and extracts currency information
- **Flexible Error Handling**: Robust error handling throughout the crawling process 