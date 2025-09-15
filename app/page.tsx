"use client";

import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Upload, Sparkles, ShoppingCart, Image as ImageIcon, Loader2, Check } from 'lucide-react';
import Link from 'next/link';

// Store product data in localStorage for checkout
const saveProductToStorage = (productData: ProductData, generatedContent: GeneratedContent) => {
  const checkoutData = {
    ...productData,
    ...generatedContent,
    timestamp: Date.now()
  };
  localStorage.setItem('checkoutProduct', JSON.stringify(checkoutData));
};

interface ProductData {
  name: string;
  category: string;
  price: string;
  imageUrl: string;
}

interface GeneratedContent {
  description: string;
  tags: string[];
  variants: Array<{
    color: string;
    size: string;
    price: string;
  }>;
  colors: string[];
}

export default function Home() {
  const [productData, setProductData] = useState<ProductData>({
    name: '',
    category: '',
    price: '',
    imageUrl: ''
  });
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // Save to localStorage whenever we have both product data and generated content
  useEffect(() => {
    if (generatedContent && productData.name) {
      saveProductToStorage(productData, generatedContent);
    }
  }, [productData, generatedContent]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setProductData(prev => ({
          ...prev,
          imageUrl: e.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    multiple: false
  });

  const categories = [
    'Clothing',
    'Electronics',
    'Home & Garden',
    'Sports & Fitness',
    'Books & Media',
    'Beauty & Health',
    'Automotive',
    'Toys & Games'
  ];

  const handleGenerate = async () => {
    if (!productData.name || !productData.category || !productData.price || !productData.imageUrl) {
      return;
    }

    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        const content = await response.json();
        setGeneratedContent(content);
      }
    } catch (error) {
      console.error('Error generating content:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const isFormValid = productData.name && productData.category && productData.price && productData.imageUrl;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent mb-4">
            Product Description Generator
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload your product image and details to generate SEO-optimized descriptions, tags, and variants instantly
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <Card className="shadow-xl border-0 bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5 text-blue-600" />
                  Product Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Image Upload */}
                <div>
                  <Label htmlFor="image" className="text-sm font-medium mb-2 block">
                    Product Image
                  </Label>
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
                      isDragActive
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                    }`}
                  >
                    <input {...getInputProps()} />
                    {productData.imageUrl ? (
                      <div className="space-y-2">
                        <img
                          src={productData.imageUrl}
                          alt="Product preview"
                          className="mx-auto h-32 w-32 object-cover rounded-lg shadow-md"
                        />
                        <p className="text-sm text-gray-600">Click or drag to change image</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <ImageIcon className="h-12 w-12 text-gray-400 mx-auto" />
                        <p className="text-gray-600">
                          {isDragActive ? 'Drop the image here' : 'Drag & drop an image here, or click to select'}
                        </p>
                        <p className="text-sm text-gray-500">PNG, JPG, WEBP up to 10MB</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Product Name */}
                <div>
                  <Label htmlFor="name" className="text-sm font-medium mb-2 block">
                    Product Name
                  </Label>
                  <Input
                    id="name"
                    placeholder="e.g., Wireless Bluetooth Headphones"
                    value={productData.name}
                    onChange={(e) => setProductData(prev => ({ ...prev, name: e.target.value }))}
                    className="transition-all focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Category */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">
                    Category
                  </Label>
                  <Select onValueChange={(value) => setProductData(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger className="transition-all focus:ring-2 focus:ring-blue-500">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Price */}
                <div>
                  <Label htmlFor="price" className="text-sm font-medium mb-2 block">
                    Price
                  </Label>
                  <Input
                    id="price"
                    placeholder="e.g., $99.99"
                    value={productData.price}
                    onChange={(e) => setProductData(prev => ({ ...prev, price: e.target.value }))}
                    className="transition-all focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Generate Button */}
                <Button
                  onClick={handleGenerate}
                  disabled={!isFormValid || isGenerating}
                  className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white transition-all transform hover:scale-[1.02] disabled:scale-100"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Content
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {generatedContent ? (
              <>
                {/* Generated Description */}
                <Card className="shadow-xl border-0 bg-white/70 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-emerald-600" />
                      Generated Description
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={generatedContent.description}
                      readOnly
                      className="min-h-[120px] resize-none bg-gray-50"
                    />
                  </CardContent>
                </Card>

                {/* SEO Tags */}
                <Card className="shadow-xl border-0 bg-white/70 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>SEO Tags</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {generatedContent.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Product Variants */}
                <Card className="shadow-xl border-0 bg-white/70 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Product Variants</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {generatedContent.variants.map((variant, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-6 h-6 rounded-full border border-gray-300"
                              style={{ backgroundColor: variant.color }}
                            />
                            <span className="font-medium text-gray-800 capitalize">
                              {variant.color} - {variant.size}
                            </span>
                          </div>
                          <span className="font-bold text-blue-600">{variant.price}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Checkout Button */}
                <Link href="/checkout" className="block">
                  <Button className="w-full bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white transition-all transform hover:scale-[1.02]" size="lg">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Proceed to Checkout
                  </Button>
                </Link>
              </>
            ) : (
              <Card className="shadow-xl border-0 bg-white/70 backdrop-blur-sm">
                <CardContent className="py-12">
                  <div className="text-center text-gray-500">
                    <Sparkles className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-lg font-medium mb-2">Ready to Generate</p>
                    <p>Fill in the product details and upload an image to generate optimized content</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}