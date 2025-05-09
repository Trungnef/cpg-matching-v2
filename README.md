# CPG Matching Platform

A platform connecting Consumer Packaged Goods (CPG) manufacturers, brands, and retailers.

## New Feature: AI Web Crawler

The AI Web Crawler allows you to easily extract product information from websites and process it using AI.

### Features

- Web crawling with Puppeteer for efficient web navigation and data extraction
- AI processing with OpenAI and support for multiple AI providers (OpenAI, Claude, Gemini)
- Automatic extraction of product details including name, price, description, images, and more
- Support for Vietnamese e-commerce platforms like Tiki, Shopee, and Lazada
- AI-powered categorization and analysis with smart attribute extraction
- Product catalog integration with automatic metadata generation
- Multi-URL batch processing for efficient crawling of multiple product pages
- File import functionality for bulk URL processing
- Advanced crawler configuration options

### How to Use the Web Crawler

1. Navigate to the admin section and access the Web Crawler page at `/admin/crawler`
2. Add product URLs to crawl using one of these methods:
   - Enter individual URLs in the input field
   - Use the "Bulk Add" feature to paste multiple URLs
   - Import URLs from a text file (one URL per line)
3. Configure crawling options:
   - **Crawl Depth**: Controls how many links deep the crawler will follow from the starting URL
     - Depth 1: Only crawls the specified URLs without following links
     - Depth 2: Crawls the specified URLs and follows one level of links found on those pages
     - Higher depths: Follows links recursively up to the specified depth level
     - Higher depth values require more processing time but can discover related products
   - **Max Pages**: Limits the total number of pages the crawler will process
     - Prevents the crawler from processing too many pages when crawling at higher depths
     - Helps control resource usage and crawling time
     - Recommended to start with lower values (10-20) for testing
   - **Auto-Save to Catalog**: Automatically saves extracted products to your catalog
   - **AI Provider**: Select which AI model to use for processing (Default, OpenAI, Gemini, Claude)
   - **Custom CSS Selectors**: Optionally specify custom CSS selectors for more precise data extraction
4. Start the crawling process
5. View the extracted data and AI analysis in real-time
6. Add products to your catalog with one click or allow auto-save to handle it

### Advanced Crawler Features

#### Multiple URL Processing
The crawler supports batch processing of multiple URLs, allowing you to:
- Extract data from multiple product pages in a single operation
- Process entire product categories or collections
- Compare products across different e-commerce platforms

#### Intelligent Error Handling
- Automatic detection of CAPTCHA and bot protection pages
- Stealth mode navigation to avoid detection
- Retry mechanisms with exponential backoff
- Detailed error logging for troubleshooting

#### Performance Optimization
- Estimated time calculation based on crawl settings
- Progress tracking for multiple URL processing
- Resource usage monitoring to prevent overloading

## Setup and Installation

### Prerequisites

- Node.js (v16+)
- MongoDB
- OpenAI API key (for AI features)

### Frontend Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Configure environment variables by creating a .env file
echo "PORT=5000
MONGODB_URI=mongodb://localhost:27017/cpg_crawler
NODE_ENV=development
OPENAI_API_KEY=your_openai_api_key_here" > .env

# Start development server
npm run dev
```

## Development

### Frontend (`src`) Directory Structure

The `src` directory contains all the frontend code for the React application, built with Vite and TypeScript.

```
src/
├── App.tsx                 # Main application component, routing setup
├── main.tsx                # Entry point of the application
├── index.css               # Global CSS styles
├── App.css                 # Specific styles for App component
├── vite-env.d.ts           # TypeScript definitions for Vite environment variables
|
├── components/             # Reusable UI components
│   ├── ui/                 # Base UI elements (like buttons, inputs - likely Shadcn/UI components)
│   ├── crawler/            # Components specific to the web crawler feature
│   ├── profile/            # Components related to user profiles
│   ├── layouts/            # Layout components (e.g., Header, Footer, Sidebar)
│   ├── dashboard/          # Components for the user dashboard
│   ├── charts/             # Charting components
│   ├── admin/              # Components for the admin section
│   ├── SignInForm.tsx      # Specific component for sign-in
│   ├── RegisterForm.tsx    # Specific component for registration
│   └── ...                 # Other specific or shared components
|
├── constants/              # Application-wide constants (e.g., API endpoints, config)
│   └── app.environment.ts  # Environment-specific constants
|
├── contexts/               # React Context API providers for global state management
│   ├── UserContext.tsx     # Manages user authentication state
│   ├── ThemeContext.tsx    # Manages application theme (light/dark)
│   ├── LanguageContext.tsx # Manages application language
│   └── ...                 # Contexts for favorites, comparisons, etc.
|
├── hooks/                  # Custom React Hooks for reusable logic
│   ├── use-media-query.ts  # Hook for handling responsive design based on media queries
│   ├── useClickOutside.ts  # Hook to detect clicks outside a specific element
│   └── ...                 # Other custom hooks
|
├── lib/                    # Utility functions and library initializations
│   ├── api.ts              # Functions for making API calls to the backend
│   ├── i18n.ts             # Internationalization setup (likely i18next)
│   └── utils.ts            # General utility functions (maybe Shadcn/UI related)
|
├── pages/                  # Top-level components representing application pages/routes
│   ├── admin/              # Admin-specific pages
│   ├── brand/              # Pages related to brands
│   ├── manufacturer/       # Pages related to manufacturers
│   ├── retailer/           # Pages related to retailers
│   ├── Index.tsx           # Home page
│   ├── Products.tsx        # Product listing/search page
│   ├── Auth.tsx            # Authentication page (login/register wrapper)
│   └── ...                 # Other application pages
|
├── styles/                 # Global styles and styling configurations
│   └── globals.css         # Base global styles (often used with TailwindCSS)
|
└── utils/                  # General utility functions (currently empty, maybe deprecated or unused)
```

This structure promotes modularity and separation of concerns, making the codebase easier to navigate and maintain.

## License

Trune
