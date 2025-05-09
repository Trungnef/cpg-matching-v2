# AI Web Crawler - Admin Guide

## Overview

The AI Web Crawler feature allows administrators to extract product information from external websites and import them into the CPG Matching platform's catalog. This tool combines web crawling technology with AI processing to automatically extract structured data from product pages.

## Key Features

1. **URL Crawling**: Extract data from any product page URL
2. **Multiple AI Providers**: Process data with OpenAI, Google Gemini, or AWS Claude
3. **Data Visualization**: View extracted product information with a clean UI
4. **Custom Selectors**: Specify CSS selectors for more accurate extraction
5. **Catalog Integration**: Add products directly to your catalog
6. **Time Estimation**: Get real-time estimates of crawling duration
7. **Auto-Save Option**: Automatically save processed results to the catalog

## How to Use

### Creating a New Crawl Task

1. Navigate to the **Admin Dashboard**
2. Click on **Web Crawler** in the sidebar
3. On the "New Crawl Task" tab, enter a product URL to crawl
4. Configure crawl options:
   - **Depth**: How many links deep to crawl (1-5)
   - **Max Pages**: Maximum number of pages to crawl (1-50)
   - **AI Provider**: Choose between Default (system configuration), OpenAI, Google Gemini, or AWS Claude
   - **Auto-Save**: Toggle to automatically save results to catalog
5. Toggle "Use Custom CSS Selectors" if you need precise control over extraction
6. View the **Estimated Time** badge to see how long the crawl will take
7. Click "Start Crawling" to begin the process

### Managing Crawl Tasks

1. Click on the "Manage Tasks" tab to view all crawl tasks
2. The table shows:
   - URL
   - Status (Pending, Processing, Completed, Failed)
   - Depth and Max Pages configuration
   - Estimated crawling time
   - Creation date
   - Available actions
3. Use the dropdown menu to:
   - View Results (for completed tasks)
   - Delete a task

### Viewing and Processing Results

1. Click "View Results" for a completed task
2. If the data hasn't been processed with AI yet, click "Process with AI"
3. When processing with AI, you can select which provider to use:
   - **OpenAI GPT-4o**: Best for detailed analysis and complex products
   - **Google Gemini Pro**: Good balance of performance and cost
   - **AWS Claude 3 Sonnet**: Excellent for nuanced product descriptions and ingredients analysis
4. The system will analyze the data and:
   - Extract structured product information
   - Generate categorizations and keywords
   - Provide sentiment analysis
   - Create a product summary
5. Review the results in the tabbed interface:
   - **Details**: Basic product information and description
   - **Ingredients**: List of ingredients in the product
   - **AI Analysis**: Categories, keywords, and sentiment analysis
   - **Raw Data**: The original JSON data and HTML

### Adding Products to Catalog

1. After processing the data with AI, click "Add to Catalog"
2. The structured product data will be added to your catalog
3. You can then navigate to the Products section to manage it further
4. If you enabled Auto-Save when creating the task, this happens automatically

## Understanding Time Estimates

The crawler provides time estimates based on several factors:

- **Base Time**: Each page takes approximately 5 seconds to crawl
- **Depth**: Deeper crawling increases time (not linearly)
- **Max Pages**: More pages to crawl means longer processing time
- **Custom Selectors**: Using custom selectors adds processing time
- **AI Provider**: Different AI providers have slightly different processing times

Time estimates help you plan your crawling tasks efficiently, especially for larger websites.

## AI Provider Comparison

### OpenAI GPT-4o
- **Strengths**: Excellent at understanding complex product descriptions, high accuracy for nutritional data
- **Best For**: Detailed product analysis, extracting structured data from complex text
- **Note**: Requires valid OpenAI API key with sufficient credits

### Google Gemini Pro
- **Strengths**: Good performance for common CPG products, efficient processing
- **Best For**: General product information extraction, everyday crawling tasks
- **Note**: Most cost-effective option for regular use

### AWS Claude 3 Sonnet
- **Strengths**: Exceptional at understanding ingredient lists and product categories
- **Best For**: Health products, detailed ingredient analysis, regulatory compliance data
- **Note**: Requires AWS account with Bedrock access to Claude models

## Best Practices

1. **Start with Specific Product Pages**: Crawl individual product pages rather than category pages for best results
2. **Use Custom Selectors**: For frequently visited sites, configure custom CSS selectors for more accurate data extraction
3. **Review AI Results**: Always review AI-processed data before adding to catalog
4. **Choose the Right AI Provider**: Select the AI provider based on your specific needs:
   - Use OpenAI for complex or highly technical products
   - Use Gemini for everyday crawling and general products
   - Use Claude for detailed ingredient analysis or nutritional information
5. **Crawl Responsibly**: Limit crawl depth and frequency to avoid overloading external websites

## Troubleshooting

### Common Issues

1. **Crawl Failed**:
   - Check if the URL is accessible and valid
   - Verify the website doesn't block web crawlers
   - Try using custom selectors if the site has a complex structure

2. **Incomplete Data**:
   - Use custom selectors to target specific elements
   - Try different CSS selectors if the default extraction misses information

3. **AI Processing Issues**:
   - Verify your API keys are valid and have sufficient credits/permissions
   - For AWS Claude, check your AWS credentials and Bedrock service access
   - Try a different AI provider if one is experiencing temporary issues
   - For best results, ensure you've configured all providers in server settings

### Getting Help

For additional assistance, contact the system administrator or development team for support with the AI Web Crawler feature. 