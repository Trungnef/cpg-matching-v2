import { OpenAI } from 'openai';
import config from '../../config';
import logger from '../../utils/logger';
import { ProductData, AIAnalysis } from '../../models/crawler/crawlResult';
import axios from 'axios';
import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';

class AIService {
  private openai: OpenAI;
  private bedrockClient: BedrockRuntimeClient | null = null;

  constructor() {
    this.openai = new OpenAI({
      apiKey: config.openaiApiKey,
    });

    // Initialize AWS Bedrock client if configured
    if (config.aws.useAwsClaude && config.aws.accessKeyId && config.aws.secretAccessKey) {
      this.bedrockClient = new BedrockRuntimeClient({
        region: config.aws.region,
        credentials: {
          accessKeyId: config.aws.accessKeyId,
          secretAccessKey: config.aws.secretAccessKey,
        },
      });
      logger.info('AWS Bedrock client initialized for Claude');
    }
  }

  /**
   * Process product data using AI (OpenAI, Gemini, or AWS Claude)
   */
  async processProductData(
    rawData: ProductData, 
    rawHtml?: string, 
    aiProvider: string = 'default'
  ): Promise<{processedData: ProductData, aiAnalysis: AIAnalysis}> {
    try {
      // Determine which AI provider to use
      if (aiProvider === 'claude' || (aiProvider === 'default' && config.aws.useAwsClaude && this.bedrockClient)) {
        logger.info('Using AWS Claude for AI processing');
        return this.processWithAwsClaude(rawData, rawHtml);
      } else if (aiProvider === 'openai' || (aiProvider === 'default' && config.aiProvider === 'openai')) {
        return this.processWithOpenAI(rawData, rawHtml);
      } else if (aiProvider === 'gemini' || (aiProvider === 'default' && config.aiProvider === 'gemini')) {
        return this.processWithGemini(rawData, rawHtml);
      } else {
        logger.warn(`Unknown AI provider: ${aiProvider}. Falling back to Gemini.`);
        return this.processWithGemini(rawData, rawHtml);
      }
    } catch (error) {
      logger.error(`Error in AI processing: ${error}`);
      return { 
        processedData: rawData, 
        aiAnalysis: {
          confidenceScore: 0,
          summary: `Error in AI processing: ${error instanceof Error ? error.message : String(error)}`
        } 
      };
    }
  }

  /**
   * Process product data using AWS Claude
   * @param rawData Raw product data from crawler
   * @param rawHtml Raw HTML content (optional)
   */
  private async processWithAwsClaude(
    rawData: ProductData,
    rawHtml?: string
  ): Promise<{ processedData: ProductData; aiAnalysis: AIAnalysis }> {
    try {
      if (!this.bedrockClient) {
        throw new Error('AWS Bedrock client not initialized');
      }

      const prompt = this.buildPrompt(rawData, rawHtml);
      logger.info(`Sending request to AWS Claude with ${rawData.url}`);

      const bedrockRequest = {
        modelId: config.aws.claudeModel,
        contentType: 'application/json',
        accept: 'application/json',
        body: JSON.stringify({
          anthropic_version: "bedrock-2023-05-31",
          max_tokens: 4096,
          temperature: 0.2,
          messages: [
            {
              role: "user",
              content: prompt
            }
          ]
        })
      };

      const command = new InvokeModelCommand(bedrockRequest);
      const response = await this.bedrockClient.send(command);

      // Parse the response
      const responseBody = new TextDecoder().decode(response.body);
      const parsedResponse = JSON.parse(responseBody);
      const responseText = parsedResponse.content[0].text;

      // Process the response
      const { processedData, confidenceScore, summary } = this.parseAIResponse(responseText, rawData);

      return {
        processedData,
        aiAnalysis: {
          confidenceScore,
          summary
        }
      };
    } catch (error) {
      logger.error(`Error in AWS Claude processing: ${error}`);
      return {
        processedData: rawData,
        aiAnalysis: {
          confidenceScore: 0,
          summary: `Error in AWS Claude processing: ${error instanceof Error ? error.message : String(error)}`
        }
      };
    }
  }

  /**
   * Process product data using OpenAI
   */
  private async processWithOpenAI(rawData: ProductData, rawHtml?: string): Promise<{processedData: ProductData, aiAnalysis: AIAnalysis}> {
    if (!config.openaiApiKey) {
      logger.warn('OpenAI API key not configured. Falling back to Gemini.');
      return this.processWithGemini(rawData, rawHtml);
    }

    logger.info('Processing product data with OpenAI');

    // Extract structured information
    const extractionPrompt = this.createExtractionPrompt(rawData, rawHtml);
    const extractionResponse = await this.openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are a product data extraction assistant. Your task is to extract structured information from product data and HTML content. Return data in the exact JSON format requested.'
        },
        {
          role: 'user',
          content: extractionPrompt
        }
      ],
      response_format: { type: 'json_object' }
    });

    const extractedData = JSON.parse(extractionResponse.choices[0].message.content || '{}') as ProductData;
    
    // Analyze product data
    const analysisPrompt = this.createAnalysisPrompt({ ...rawData, ...extractedData });
    const analysisResponse = await this.openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are a product analysis assistant. Analyze the CPG product data provided and generate insights. Return data in the exact JSON format requested.'
        },
        {
          role: 'user',
          content: analysisPrompt
        }
      ],
      response_format: { type: 'json_object' }
    });

    const aiAnalysis = JSON.parse(analysisResponse.choices[0].message.content || '{}') as AIAnalysis;

    return {
      processedData: {
        ...rawData,
        ...extractedData
      },
      aiAnalysis
    };
  }

  /**
   * Process product data using Google Gemini API
   */
  private async processWithGemini(rawData: ProductData, rawHtml?: string): Promise<{processedData: ProductData, aiAnalysis: AIAnalysis}> {
    if (!config.geminiApiKey) {
      logger.warn('Gemini API key not configured. Skipping AI processing.');
      return { 
        processedData: rawData, 
        aiAnalysis: { confidenceScore: 0 } 
      };
    }

    logger.info('Processing product data with Gemini');
    
    try {
      // Extract structured information
      const extractionPrompt = this.createExtractionPrompt(rawData, rawHtml);
      const extractedData = await this.callGeminiAPI(extractionPrompt, 'You are a product data extraction assistant. Extract structured information in JSON format.');
      
      // Analyze product data
      const analysisPrompt = this.createAnalysisPrompt({ ...rawData, ...extractedData });
      const aiAnalysis = await this.callGeminiAPI(analysisPrompt, 'You are a product analysis assistant. Analyze the product data and return JSON.');

      return {
        processedData: {
          ...rawData,
          ...extractedData
        },
        aiAnalysis
      };
    } catch (error) {
      logger.error(`Error in Gemini processing: ${error}`);
      return { 
        processedData: rawData, 
        aiAnalysis: {
          confidenceScore: 0,
          summary: `Error in Gemini processing: ${error instanceof Error ? error.message : String(error)}`
        } 
      };
    }
  }

  /**
   * Call Gemini API
   */
  private async callGeminiAPI(prompt: string, systemInstruction: string): Promise<any> {
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${config.geminiApiKey}`;
    
    const response = await axios.post(apiUrl, {
      contents: [
        {
          parts: [
            { text: systemInstruction + "\n\n" + prompt }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.2,
        topP: 0.8,
        topK: 40
      }
    });

    // Extract the generated text
    const textContent = response.data.candidates[0].content.parts[0].text;
    
    // Find JSON content in the response (handling where the model might include markdown code blocks)
    const jsonMatch = textContent.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || [null, textContent];
    const jsonText = jsonMatch[1].trim();
    
    try {
      return JSON.parse(jsonText);
    } catch (e) {
      // If parsing fails, try to extract JSON by finding bracket pairs
      const jsonStart = jsonText.indexOf('{');
      const jsonEnd = jsonText.lastIndexOf('}') + 1;
      if (jsonStart >= 0 && jsonEnd > jsonStart) {
        const extractedJson = jsonText.substring(jsonStart, jsonEnd);
        return JSON.parse(extractedJson);
      }
      logger.error(`Failed to parse Gemini response as JSON: ${e}`);
      throw new Error('Failed to parse Gemini response as JSON');
    }
  }

  /**
   * Create prompt for data extraction
   */
  private createExtractionPrompt(data: ProductData, rawHtml?: string): string {
    const html = rawHtml ? `\nHere is the raw HTML of the product page (limited excerpt):\n${rawHtml.substring(0, 5000)}...` : '';
    
    return `
I need to extract structured information about a CPG (Consumer Packaged Goods) product from the following data:

Product URL: ${data.url || 'Not available'}
Product Name: ${data.productName || 'Not available'}
Description: ${data.description || 'Not available'}
${html}

Please extract the following information and return it as a JSON object:
1. Accurate product name
2. Brand name
3. Price (numeric value only)
4. Cleaned product description
5. List of ingredients (as an array)
6. Nutrition facts (as key-value pairs)
7. Any additional metadata that might be relevant

Return the data in the following JSON format:
{
  "productName": "...",
  "brand": "...",
  "price": number,
  "description": "...",
  "ingredients": ["ingredient1", "ingredient2", ...],
  "nutritionFacts": {
    "calories": "...",
    "fat": "...",
    "protein": "...",
    "carbohydrates": "..."
  },
  "metadata": {
    "packageSize": "...",
    "packageType": "...",
    "allergens": ["...", "..."],
    "dietaryInfo": ["...", "..."]
  }
}

If you can't extract some information, leave those fields empty or null.
`;
  }

  /**
   * Create prompt for product analysis
   */
  private createAnalysisPrompt(data: ProductData): string {
    return `
Please analyze the following CPG (Consumer Packaged Goods) product information:

Product Name: ${data.productName || 'Not available'}
Brand: ${data.brand || 'Not available'}
Description: ${data.description || 'Not available'}
Ingredients: ${data.ingredients ? data.ingredients.join(', ') : 'Not available'}
Nutrition Facts: ${data.nutritionFacts ? JSON.stringify(data.nutritionFacts) : 'Not available'}

Based on this information, please provide:
1. Product categories (as specific as possible)
2. Key product keywords/tags
3. Sentiment analysis (numeric score from -1 to 1)
4. Confidence score for your analysis (0 to 1)
5. Brief summary of the product (2-3 sentences max)

Return the analysis in the following JSON format:
{
  "categories": ["category1", "category2", ...],
  "keywords": ["keyword1", "keyword2", ...],
  "sentiment": number,
  "confidenceScore": number,
  "summary": "..."
}
`;
  }

  /**
   * Build a prompt for AI processing
   * @param rawData Raw product data from crawler
   * @param rawHtml Raw HTML content (optional)
   */
  private buildPrompt(rawData: ProductData, rawHtml?: string): string {
    let prompt = `You are a product data extraction assistant. Extract and analyze the following product information from an e-commerce site.
    
Product URL: ${rawData.url}
Product Name: ${rawData.name || 'Unknown'}
`;

    if (rawData.description) {
      prompt += `\nProduct Description: ${rawData.description}`;
    }
    
    if (rawData.price) {
      prompt += `\nProduct Price: ${rawData.price}`;
    }
    
    if (rawData.sku) {
      prompt += `\nProduct SKU: ${rawData.sku}`;
    }
    
    if (rawData.images && rawData.images.length > 0) {
      prompt += `\nProduct Images: ${rawData.images.slice(0, 5).join(', ')}`;
    }
    
    if (rawHtml) {
      prompt += `\n\nHere is the HTML content of the product page:\n\n${rawHtml.substring(0, 5000)}`;
      if (rawHtml.length > 5000) {
        prompt += `\n[HTML truncated, showing first 5000 characters of ${rawHtml.length} total]`;
      }
    }
    
    prompt += `\n\nPlease extract and provide the following information in JSON format:
1. Product name
2. Brand name
3. Product description
4. Price
5. Currency
6. SKU/Product ID
7. Category
8. Main ingredients or components
9. Size/Weight/Volume
10. Manufacturer
11. UPC/EAN/Barcode if available
12. Country of origin

Also, provide a confidence score between 0 and 1 indicating how confident you are in the extracted information.
Finally, provide a brief summary of the product in 2-3 sentences.

Respond with a JSON object having the following structure:
{
  "productData": {
    "name": "string",
    "brand": "string",
    "description": "string",
    "price": "string",
    "currency": "string",
    "sku": "string",
    "category": "string",
    "ingredients": "string",
    "size": "string",
    "manufacturer": "string",
    "barcode": "string",
    "origin": "string"
  },
  "confidenceScore": number,
  "summary": "string"
}`;

    return prompt;
  }

  /**
   * Parse the AI response and extract processed data
   * @param responseText The text response from the AI
   * @param originalData The original product data
   */
  private parseAIResponse(responseText: string, originalData: ProductData): { 
    processedData: ProductData; 
    confidenceScore: number; 
    summary: string 
  } {
    try {
      // First try direct JSON parsing
      let parsedData: any;
      try {
        parsedData = JSON.parse(responseText);
      } catch (e) {
        // If direct parsing fails, try to extract JSON using regex
        const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || [null, responseText];
        let jsonText = jsonMatch[1].trim();
        
        // Try to find JSON object bounds if still not valid
        if (!jsonText.startsWith('{')) {
          const jsonStart = jsonText.indexOf('{');
          const jsonEnd = jsonText.lastIndexOf('}') + 1;
          if (jsonStart >= 0 && jsonEnd > jsonStart) {
            jsonText = jsonText.substring(jsonStart, jsonEnd);
          }
        }
        
        parsedData = JSON.parse(jsonText);
      }

      // Extract product data from response
      const productData = parsedData.productData || {};
      const confidenceScore = parsedData.confidenceScore || 0;
      const summary = parsedData.summary || 'No summary provided';

      // Merge with original data
      const processedData: ProductData = {
        ...originalData,
        name: productData.name || originalData.name,
        description: productData.description || originalData.description,
        price: productData.price || originalData.price,
        currency: productData.currency || originalData.currency,
        sku: productData.sku || originalData.sku,
        brand: productData.brand || originalData.brand,
        category: productData.category || originalData.category,
        ingredients: productData.ingredients || originalData.ingredients,
        size: productData.size || originalData.size,
        manufacturer: productData.manufacturer || originalData.manufacturer,
        barcode: productData.barcode || originalData.barcode,
        origin: productData.origin || originalData.origin
      };

      // Apply additional data cleaning and enhancement
      const enhancedData = this.enhanceProductData(processedData);

      return {
        processedData: enhancedData,
        confidenceScore,
        summary
      };
    } catch (error) {
      logger.error(`Error parsing AI response: ${error}`);
      return {
        processedData: originalData,
        confidenceScore: 0,
        summary: `Error parsing AI response: ${error instanceof Error ? error.message : String(error)}`
      };
    }
  }
  
  /**
   * Enhance and clean product data after AI processing
   * @param data Product data processed by AI
   * @returns Enhanced and cleaned product data
   */
  private enhanceProductData(data: ProductData): ProductData {
    const enhanced: ProductData = {...data};
    
    // Ensure product name is properly cleaned
    if (enhanced.productName) {
      // Clean product name - remove website suffixes and other common text
      const websitePatterns = [
        /\s*[-|]\s*Amazon\.com/i,
        /\s*[-|]\s*Walmart\.com/i,
        /\s*[-|]\s*Target\.com/i,
        /\s*[-|]\s*eBay/i,
        /\s*[-|]\s*Etsy/i,
        /\s+- Online Shopping/i,
        /\s*[-|]\s*Shop Online/i,
        /\s*[-|]\s*Official Site/i,
        /\s*[-|]\s*Official Website/i,
      ];
      
      let cleanName = enhanced.productName;
      websitePatterns.forEach(pattern => {
        cleanName = cleanName.replace(pattern, '');
      });
      enhanced.productName = cleanName.trim();
      
      // Truncate extremely long product names
      if (enhanced.productName && enhanced.productName.length > 200) {
        enhanced.productName = enhanced.productName.substring(0, 197) + '...';
      }
    }
    
    // Ensure brand doesn't duplicate product name
    if (enhanced.brand && enhanced.productName) {
      // If brand is fully contained in product name, that's fine
      // If product name is fully contained in brand, we might want to adjust
      if (enhanced.productName.toLowerCase().includes(enhanced.brand.toLowerCase())) {
        // This is normal, no change needed
      } else if (enhanced.brand.toLowerCase().includes(enhanced.productName.toLowerCase())) {
        // Product name is part of the brand, which is unusual
        enhanced.productName = enhanced.brand + ' ' + enhanced.productName;
      }
    }
    
    // Ensure price is a valid number
    if (enhanced.price && typeof enhanced.price === 'string') {
      const priceStr = enhanced.price as string;
      enhanced.price = parseFloat(priceStr.replace(/[^\d.,]/g, ''));
    }
    
    // Ensure currency is a valid 3-letter code if present
    if (enhanced.currency) {
      if (enhanced.currency.length > 3) {
        // Try to convert currency names to codes
        const currencyMap: {[key: string]: string} = {
          'dollars': 'USD',
          'dollar': 'USD',
          'usd': 'USD',
          'euros': 'EUR',
          'euro': 'EUR',
          'eur': 'EUR',
          'pounds': 'GBP',
          'pound': 'GBP',
          'gbp': 'GBP',
          'canadian': 'CAD',
          'cad': 'CAD',
          'yen': 'JPY',
          'jpy': 'JPY'
        };
        
        const currencyKey = enhanced.currency.toLowerCase().trim();
        if (currencyMap[currencyKey]) {
          enhanced.currency = currencyMap[currencyKey];
        } else {
          // Default to USD if unknown
          enhanced.currency = 'USD';
        }
      } else {
        // Ensure uppercase
        enhanced.currency = enhanced.currency.toUpperCase();
      }
    }
    
    // Clean up ingredients array if present
    if (enhanced.ingredients) {
      if (typeof enhanced.ingredients === 'string') {
        // If ingredients were returned as a string, convert to array
        const ingredientsStr = enhanced.ingredients as string;
        // Split by commas, semicolons, or bullet points
        enhanced.ingredients = ingredientsStr
          .split(/,|;|•|·|\*|\n/)
          .map(item => item.trim())
          .filter(Boolean);
      }
      
      // Filter out duplicate ingredients and empty strings
      if (Array.isArray(enhanced.ingredients)) {
        const uniqueIngredients = new Set<string>();
        enhanced.ingredients = enhanced.ingredients
          .map(item => item.trim())
          .filter(item => {
            if (!item || uniqueIngredients.has(item.toLowerCase())) return false;
            uniqueIngredients.add(item.toLowerCase());
            return true;
          });
      }
    }
    
    // Ensure description isn't too long
    if (enhanced.description && enhanced.description.length > 2000) {
      enhanced.description = enhanced.description.substring(0, 1997) + '...';
    }
    
    // If nutrition facts exist but as string, try to parse it
    if (enhanced.nutritionFacts && typeof enhanced.nutritionFacts === 'string') {
      const nutritionStr = enhanced.nutritionFacts as string;
      // Parse to object format
      const facts: Record<string, string> = {};
      
      // Match patterns like "Protein: 10g" or "Calories 120"
      const patterns = [
        /(\w+(?:\s+\w+)*)\s*[:]\s*([\d.,]+\s*(?:g|mg|kcal|cal|%|kJ|IU|mcg|oz|ml|g\/ml|cups|tbsp|tsp|servings|grams))/gi,
        /(\w+(?:\s+\w+)*)\s+([\d.,]+\s*(?:g|mg|kcal|cal|%|kJ|IU|mcg|oz|ml|g\/ml|cups|tbsp|tsp|servings|grams))/gi
      ];
      
      for (const pattern of patterns) {
        let match;
        while ((match = pattern.exec(nutritionStr)) !== null) {
          const nutrient = match[1].trim().toLowerCase();
          const value = match[2].trim();
          
          if (nutrient && value && !facts[nutrient]) {
            facts[nutrient] = value;
          }
        }
      }
      
      enhanced.nutritionFacts = facts;
    }
    
    // Initialize metadata if it doesn't exist
    if (!enhanced.metadata) {
      enhanced.metadata = {};
    }
    
    // Extract size into metadata if available
    if (enhanced.size && !enhanced.metadata.size) {
      enhanced.metadata.size = enhanced.size;
    }
    
    return enhanced;
  }
}

// Singleton instance
let instance: AIService | null = null;

// Export a function to get the instance (lazy initialization)
export default function getAIService(): AIService {
  if (!instance) {
    instance = new AIService();
  }
  return instance;
} 