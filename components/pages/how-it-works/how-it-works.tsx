import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  Calendar, 
  Video, 
  FileText, 
  CheckCircle, 
  Clock, 
  Star, 
  Shield, 
  Zap,
  Users,
  ArrowRight,
  MessageSquare,
  Brain,
  DollarSign,
  Timer,
  Target,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Describe Your Challenge",
      description: "Tell us about your specific business question. No fluff - just the details that matter.",
      visual: <MessageSquare className="w-16 h-16 text-slate-400" />
    },
    {
      number: "02", 
      title: "Get Matched Instantly",
      description: "Our smart system finds the perfect expert for your exact situation and industry.",
      visual: <Target className="w-16 h-16 text-slate-400" />
    },
    {
      number: "03",
      title: "Book & Connect",
      description: "Choose your time slot and jump straight into a focused video consultation.",
      visual: <Video className="w-16 h-16 text-slate-400" />
    },
    {
      number: "04",
      title: "Get Actionable Insights",
      description: "Receive AI-generated summary with clear next steps and recommendations.",
      visual: <Sparkles className="w-16 h-16 text-slate-400" />
    }
  ];

  const features = [
    {
      icon: <Timer className="w-6 h-6" />,
      title: "15-30 Minute Sessions",
      description: "Quick, focused consultations that respect your time"
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: "AI-Powered Matching", 
      description: "Smart algorithms connect you with the right expert"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Verified Experts Only",
      description: "All professionals are vetted for expertise and quality"
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Detailed Summaries",
      description: "Get searchable PDFs with key insights and action items"
    }
  ];

  const testimonials = [
    {
      quote: "Got pricing strategy validation in 20 minutes. Would have taken weeks with traditional consulting.",
      author: "Sarah Chen",
      role: "Startup Founder",
      company: "TechFlow"
    },
    {
      quote: "The expert came prepared and gave me exactly what I needed. The AI summary was incredibly detailed.",
      author: "Marcus Rodriguez", 
      role: "Marketing Director",
      company: "GrowthCorp"
    },
    {
      quote: "Finally, expert advice that doesn't require a long-term contract. Perfect for specific questions.",
      author: "Emma Thompson",
      role: "Product Manager", 
      company: "InnovateLab"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-6xl md:text-7xl font-bold text-slate-900 mb-8 tracking-tight">
              Expert advice,
              <span className="block text-blue-600">when you need it</span>
            </h1>
            <p className="text-xl text-slate-600 mb-12 leading-relaxed">
              Skip the endless Google searches and expensive consulting contracts. 
              Get targeted advice from verified experts in minutes, not months.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg">
                Start Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="px-8 py-4 text-lg border-slate-300">
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Steps */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Four steps to expert insights
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Our streamlined process gets you from question to solution faster than ever
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                {/* Connection Line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-24 left-full w-full h-0.5 bg-slate-200 -translate-x-4 z-0" />
                )}
                
                <Card className="relative z-10 border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <CardContent className="p-8 text-center">
                    <div className="mb-6">
                      <span className="text-4xl font-bold text-slate-300 group-hover:text-blue-600 transition-colors">
                        {step.number}
                      </span>
                    </div>
                    
                    <div className="mb-6 flex justify-center group-hover:scale-110 transition-transform">
                      {step.visual}
                    </div>
                    
                    <h3 className="text-xl font-semibold text-slate-900 mb-4">
                      {step.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Built for modern professionals
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Every feature is designed to make getting expert advice as seamless as possible
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-all group">
                <CardContent className="p-8">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
                    <div className="text-blue-600 group-hover:text-white transition-colors">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Trusted by professionals worldwide
            </h2>
            <div className="flex justify-center items-center gap-8 text-slate-400 mb-12">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">4.9/5</span>
              </div>
              <div className="w-1 h-1 bg-slate-300 rounded-full" />
              <span>2,000+ sessions completed</span>
              <div className="w-1 h-1 bg-slate-300 rounded-full" />
              <span>500+ verified experts</span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    {[1,2,3,4,5].map((star) => (
                      <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <blockquote className="text-slate-700 mb-6 leading-relaxed">
                    "{testimonial.quote}"
                  </blockquote>
                  <div>
                    <div className="font-semibold text-slate-900">{testimonial.author}</div>
                    <div className="text-slate-500">{testimonial.role} at {testimonial.company}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* For Experts Section */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Share your expertise.
                <span className="block text-slate-400">Earn on your schedule.</span>
              </h2>
              <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                Join our community of verified experts and help professionals solve real challenges 
                while building your reputation and earning income.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-slate-300">Set your own rates and availability</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-slate-300">15-30 minute focused sessions</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-slate-300">Professional platform and tools</span>
                </div>
              </div>
              <Link href="/expert/apply">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg">
                  Become an Expert
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
            
            <div className="lg:text-right">
              <div className="inline-block">
                <div className="grid grid-cols-2 gap-8">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-white mb-2">$75-200</div>
                    <div className="text-slate-400">Average session</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-white mb-2">500+</div>
                    <div className="text-slate-400">Active experts</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-white mb-2">4.9★</div>
                    <div className="text-slate-400">Expert rating</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-white mb-2">85%</div>
                    <div className="text-slate-400">Repeat rate</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Ready to get started?
          </h2>
          <p className="text-xl text-slate-600 mb-12">
            Join thousands of professionals who've solved their challenges with expert advice
          </p>
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-4 text-lg">
            Book Your First Session
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;