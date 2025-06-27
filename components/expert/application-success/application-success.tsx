// components/expert/application-success/application-success.tsx
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, Mail, ArrowRight, Users, Zap, Heart } from 'lucide-react';
import Link from 'next/link';

const ApplicationSuccess = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
            <CheckCircle className="w-12 h-12 text-blue-600" />
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Application Submitted Successfully! 🎉
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Thank you for applying to become a Mentoji expert. We're excited to potentially welcome you to our community of professionals!
          </p>
        </div>

        {/* Main Content Card */}
        <Card className="bg-white shadow-xl border-0 mb-8">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Left Column - What's Next */}
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  What happens next?
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-sm">1</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Application Review</h3>
                      <p className="text-gray-600 text-sm">Our team will carefully review your application and credentials</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-sm">2</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Decision Notification</h3>
                      <p className="text-gray-600 text-sm">You'll receive an email with our decision within 1-2 business days</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-sm">3</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Welcome & Setup</h3>
                      <p className="text-gray-600 text-sm">If approved, we'll guide you through profile setup and onboarding</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Timeline Visual */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6">
                <div className="text-center space-y-4">
                  <Clock className="w-16 h-16 text-blue-600 mx-auto" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Review Timeline</h3>
                    <p className="text-blue-600 font-medium text-2xl">1-2 Business Days</p>
                    <p className="text-gray-600 text-sm">We'll review your application thoroughly</p>
                  </div>
                  
                  <div className="flex items-center justify-center space-x-2 text-blue-600">
                    <Mail className="w-5 h-5" />
                    <span className="text-sm font-medium">Email notification coming soon</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Why Mentoji Section */}
        <Card className="bg-gradient-to-r from-blue-600 to-blue-700 border-0 mb-8">
          <CardContent className="p-8 text-white">
            <h2 className="text-2xl font-semibold mb-6 text-center">
              Why experts love Mentoji
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-medium">Quick Sessions</h3>
                <p className="text-blue-100 text-sm">15-30 minute consultations that fit your schedule</p>
              </div>
              
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-medium">Quality Clients</h3>
                <p className="text-blue-100 text-sm">Connect with serious professionals seeking your expertise</p>
              </div>
              
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-medium">Make Impact</h3>
                <p className="text-blue-100 text-sm">Help professionals solve real challenges and grow</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="text-center space-y-4">
          <Link href="/">
            <Button 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-medium"
            >
              Return to Mentoji.com
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          
          <p className="text-gray-500 text-sm">
            Have questions? Contact us at{' '}
            <a href="mailto:support@mentoji.com" className="text-blue-600 hover:underline">
              support@mentoji.com
            </a>
          </p>
        </div>

        {/* Application Reference */}
        <div className="mt-12 text-center">
          <div className="inline-block bg-gray-50 rounded-lg px-6 py-3">
            <p className="text-sm text-gray-600">
              Application ID: <span className="font-mono text-gray-800">#APP-{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Save this reference for your records
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationSuccess;