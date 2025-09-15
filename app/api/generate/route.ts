import { NextResponse } from 'next/server';

// Enhanced e-commerce product description templates
const descriptions = {
  clothing: '[name] - Premium Men\'s Cotton Casual Shirt Long Sleeve Button Down. Crafted from 100% premium cotton with superior stitching and attention to detail. Features classic collar design, comfortable regular fit, and versatile styling perfect for casual wear, office, or weekend outings. Machine washable, wrinkle-resistant fabric ensures easy care. Available in multiple sizes and colors. Premium quality at [price] with free shipping and easy returns.',
  electronics: '[name] - Advanced Wireless Technology Device with Premium Build Quality. Features latest chipset technology, long-lasting battery life, and ergonomic design for optimal user experience. Compatible with all major devices and operating systems. Includes premium accessories, user manual, and 1-year manufacturer warranty. Perfect for professionals, students, and tech enthusiasts. Get yours today for [price] with fast delivery.',
  'home & garden': '[name] - Premium Home Decor Collection Piece for Modern Living Spaces. Crafted from high-quality materials with elegant design and superior craftsmanship. Features durable construction, easy installation, and timeless style that complements any interior. Perfect for living rooms, bedrooms, or office spaces. Available for [price] with satisfaction guarantee and free shipping.',
  'sports & fitness': '[name] - Professional Grade Athletic Equipment for Peak Performance Training. Engineered with premium materials and ergonomic design for maximum comfort and durability. Suitable for all fitness levels from beginner to professional athlete. Features non-slip grip, adjustable settings, and compact storage design. Includes workout guide and exercise tips. Order now for [price] with fast delivery.',
  'books & media': '[name] - Bestselling Educational and Entertainment Content Collection. Features engaging storylines, high-quality production, and excellent customer reviews worldwide. Perfect for personal enjoyment, learning, or as thoughtful gifts. Available in multiple formats including hardcover, paperback, and digital editions. Get your copy today for [price] with fast shipping.',
  'beauty & health': '[name] - Premium Skincare and Beauty Product with Natural Ingredients. Formulated with carefully selected organic compounds and dermatologist-tested formula. Suitable for all skin types, cruelty-free, and environmentally conscious packaging. Features anti-aging properties, deep moisturizing, and long-lasting results. Join thousands of satisfied customers. Available for [price] with money-back guarantee.',
  automotive: '[name] - Premium Automotive Accessories and Parts for Enhanced Performance. Designed for easy installation with professional-grade materials and superior durability. Compatible with most vehicle models and backed by manufacturer warranty. Features weather-resistant coating, precision engineering, and expert customer support. Upgrade your vehicle today for [price] with fast shipping.',
  'toys & games': '[name] - Educational and Fun Toy Collection for Creative Learning and Entertainment. Made with safe, non-toxic materials and rigorous quality testing standards. Features interactive design, skill development benefits, and hours of engaging play. Perfect for family time, birthday gifts, or educational activities. Suitable for various age groups. Available for [price] with fast shipping.'
};

const categoryTags = {
  clothing: ['mens-fashion', 'cotton-shirt', 'casual-wear', 'button-down', 'long-sleeve', 'premium-quality', 'comfortable-fit', 'machine-washable'],
  electronics: ['wireless-technology', 'premium-build', 'long-battery', 'ergonomic-design', 'warranty-included', 'fast-charging', 'compatible', 'professional-grade'],
  'home & garden': ['home-decor', 'premium-materials', 'modern-design', 'easy-installation', 'durable-construction', 'elegant-style', 'interior-design', 'quality-craftsmanship'],
  'sports & fitness': ['athletic-equipment', 'professional-grade', 'ergonomic-design', 'durable-materials', 'fitness-training', 'adjustable-settings', 'non-slip-grip', 'workout-guide'],
  'books & media': ['bestselling-content', 'educational-material', 'entertainment-value', 'high-quality-production', 'multiple-formats', 'engaging-storyline', 'customer-reviews', 'gift-worthy'],
  'beauty & health': ['premium-skincare', 'natural-ingredients', 'dermatologist-tested', 'anti-aging', 'deep-moisturizing', 'cruelty-free', 'organic-formula', 'all-skin-types'],
  automotive: ['automotive-parts', 'premium-accessories', 'easy-installation', 'weather-resistant', 'precision-engineering', 'manufacturer-warranty', 'vehicle-compatible', 'performance-upgrade'],
  'toys & games': ['educational-toys', 'safe-materials', 'creative-learning', 'skill-development', 'family-entertainment', 'interactive-design', 'quality-tested', 'age-appropriate']
};

const generateVariants = (price: string) => {
  const sizes = ['S', 'M', 'L', 'XL'];
  const colors = ['Black', 'White', 'Navy', 'Gray', 'Blue'];
  const variants = [];
  
  // Extract numeric price
  const numericPrice = parseFloat(price.replace(/[^0-9.]/g, '')) || 99.99;
  
  // Generate 6 variants with different size/color combinations
  for (let i = 0; i < 6; i++) {
    const size = sizes[i % sizes.length];
    const color = colors[i % colors.length];
    const priceVariation = Math.floor(i / sizes.length) * 5; // Add $5 for different colors
    const variantPrice = numericPrice + priceVariation;
    
    variants.push({
      color: color,
      size: size,
      price: `$${variantPrice.toFixed(2)}`
    });
  }
  
  return variants;
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, category, price, imageUrl } = body;
    
    if (!name || !category || !price) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate description using templates
    const categoryKey = category.toLowerCase();
    const template = descriptions[categoryKey] || descriptions.clothing;
    const description = template
      .replace(/\[name\]/g, name)
      .replace(/\[category\]/g, category.toLowerCase())
      .replace(/\[price\]/g, price);

    // Generate tags based on category
    const baseTags = categoryTags[categoryKey] || categoryTags.clothing;
    const tags = [...baseTags.slice(0, 6), 'free-shipping', 'easy-returns'];
    
    // Generate variants based on colors
    const variants = generateVariants(price);

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json({
      description,
      tags,
      variants
    });

  } catch (error) {
    console.error('Error in generate API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}