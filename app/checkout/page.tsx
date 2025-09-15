"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, CreditCard, Lock, ShieldCheck, CheckCircle, ShoppingCart } from 'lucide-react';
import Link from 'next/link';

interface CheckoutProduct {
  name: string;
  category: string;
  price: string;
  imageUrl: string;
  description: string;
  tags: string[];
}

export default function Checkout() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [product, setProduct] = useState<CheckoutProduct | null>(null);

  useEffect(() => {
    // Load product data from localStorage
    const savedProduct = localStorage.getItem('checkoutProduct');
    console.log('Saved product data:', savedProduct); // Debug log
    if (savedProduct) {
      try {
        const productData = JSON.parse(savedProduct);
        console.log('Parsed product data:', productData); // Debug log
        setProduct(productData);
      } catch (error) {
        console.error('Error parsing product data:', error);
      }
    }
  }, []);

  // If no product data, redirect to home
  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
          <CardContent className="pt-8 pb-8 text-center">
            <div className="mb-6">
              <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">No Product Found</h2>
              <p className="text-gray-600">Please generate a product description first.</p>
            </div>
            <Button className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700" asChild>
              <Link href="/">Go to Generator</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setIsProcessing(false);
    setPaymentComplete(true);
  };

  if (paymentComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
          <CardContent className="pt-8 pb-8 text-center">
            <div className="mb-6">
              <CheckCircle className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
              <p className="text-gray-600">Thank you for your purchase. Your order has been confirmed.</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="text-sm text-gray-600 mb-2">Order #12345</div>
              <div className="font-semibold">{product.name}</div>
              <div className="text-sm text-gray-500 mb-2">{product.category}</div>
              <div className="text-emerald-600 font-bold">{product.price}</div>
            </div>

            <div className="space-y-3">
              <Button className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700" asChild>
                <Link href="/">Create Another Product</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link href="/" className="flex items-center text-blue-600 hover:text-blue-700 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Generator
          </Link>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Secure Checkout</h1>
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <Lock className="h-4 w-4" />
            <span className="text-sm">SSL Secured Payment</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="lg:order-2">
            <Card className="shadow-xl border-0 bg-white/70 backdrop-blur-sm sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{product.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{product.category}</p>
                    {product.tags && product.tags.length > 0 && (
                      <div className="flex gap-2 mt-1">
                        {product.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">{tag}</Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg">{product.price}</div>
                  </div>
                </div>

                {/* Product Description */}
                {product.description && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <h4 className="font-medium text-gray-900 mb-2">Product Description</h4>
                    <p className="text-sm text-gray-700 line-clamp-3">{product.description}</p>
                  </div>
                )}

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>{product.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-emerald-600">Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span>${(parseFloat(product.price.replace(/[^0-9.]/g, '')) * 0.08).toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${(parseFloat(product.price.replace(/[^0-9.]/g, '')) * 1.08).toFixed(2)}</span>
                  </div>
                </div>

                <div className="bg-emerald-50 rounded-lg p-3 flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-emerald-600" />
                  <span className="text-sm text-emerald-800">30-day money-back guarantee</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Form */}
          <div className="lg:order-1">
            <Card className="shadow-xl border-0 bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Email */}
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    className="mt-1"
                  />
                </div>

                {/* Card Information */}
                <div>
                  <Label>Card Information</Label>
                  <div className="space-y-3 mt-2">
                    <Input
                      placeholder="4242 4242 4242 4242"
                      className="font-mono"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <Input placeholder="MM / YY" />
                      <Input placeholder="CVC" className="font-mono" />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Use test card: 4242 4242 4242 4242 with any future date and CVC
                  </p>
                </div>

                {/* Billing Address */}
                <div>
                  <Label>Billing Address</Label>
                  <div className="space-y-3 mt-2">
                    <Input placeholder="Full Name" />
                    <Input placeholder="Address Line 1" />
                    <Input placeholder="Address Line 2 (Optional)" />
                    <div className="grid grid-cols-2 gap-3">
                      <Input placeholder="City" />
                      <Input placeholder="State" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Input placeholder="ZIP Code" />
                      <Input placeholder="Country" />
                    </div>
                  </div>
                </div>

                {/* Security Notice */}
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-start gap-3">
                    <Lock className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-blue-900 text-sm">Secure Payment</h4>
                      <p className="text-sm text-blue-800 mt-1">
                        Your payment information is encrypted and secure. This is a test environment using Stripe's test mode.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Payment Button */}
                <Button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white transition-all transform hover:scale-[1.02] disabled:scale-100"
                  size="lg"
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing Payment...
                    </div>
                  ) : (
                    <>
                      <Lock className="mr-2 h-4 w-4" />
                      Complete Purchase - ${(parseFloat(product.price.replace(/[^0-9.]/g, '')) * 1.08).toFixed(2)}
                    </>
                  )}
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  By completing your purchase, you agree to our Terms of Service and Privacy Policy
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}