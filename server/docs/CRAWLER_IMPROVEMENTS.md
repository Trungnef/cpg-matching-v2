# Crawler Service Improvements

This document outlines the improvements made to the CPG Crawler Service for more accurate and robust product data extraction.

## Key Improvements

### 1. Price Extraction Enhancements

- Improved handling of different currency formats (Vietnamese Dong, Japanese Yen, Thai Baht, etc.)
- Added better detection for discount prices and price ranges
- Implemented currency-specific normalization for accurate price values
- Added intelligent price adjustment for extremely high numbers (common with currencies like VND)
- Enhanced regex patterns for extracting prices from text with various formats

### 2. Product Name and Brand Extraction

- Extended selectors to support more e-commerce platforms, including Vietnamese sites (Tiki, Shopee, Lazada)
- Improved brand name extraction from product titles and URLs
- Enhanced cleaning of product names to remove site-specific text
- Better handling of international character sets

### 3. Product Description Extraction

- More comprehensive approach to extract descriptions from multiple sections
- Added support for various description formats across different platforms
- Improved HTML cleaning while preserving meaningful structure
- Better handling of bullet points and technical specifications

### 4. Image Extraction

- Enhanced image extraction from structured data, meta tags, and DOM elements
- Added support for extracting images from CSS background properties
- Better deduplication and quality assessment of images
- Filtering of non-product images (logos, icons, etc.)
- Support for various image lazy-loading techniques

### 5. Reliability Improvements

- Added better error handling throughout the crawler
- Fixed type issues to improve code stability
- Enhanced bot detection avoidance
- Added more robust CAPTCHA detection
- Improved handling of cookie consent dialogs

## Key Files Modified

- `crawlerService.ts`: Main crawler service with extraction logic
- Related configuration and model files

## Maintenance Guide

### Adding Support for New E-commerce Platforms

To add support for a new e-commerce platform, you should:

1. Identify the common selectors for product data (name, price, description, images)
2. Add these selectors to the corresponding extraction methods
3. Test with a few sample URLs from the platform

### Extending Price Handling

When adding support for a new currency:

1. Update the `extractPriceValue` method with the currency symbol and specific formatting rules
2. Add any price normalization logic required for the currency

### Troubleshooting Common Issues

- **Bot Detection**: If you're seeing increased bot detection, review the `setupStealthBrowser` and `performRandomUserBehavior` methods
- **Missing Product Data**: Check the selectors for the specific data type and add more general selectors
- **Incorrect Prices**: Review the price extraction logic for the specific currency or format

## Future Improvements

Here are some potential areas for future enhancement:

1. Machine learning-based selector discovery for automatic adaptation to new sites
2. Enhanced image recognition to identify primary product images
3. More sophisticated bot avoidance techniques
4. Improved parallel processing for faster crawling
5. Better handling of product variants and options 