// components/pages/client/dashboard/home/faq-section.tsx
"use client";
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    id: "1",
    question: "How does a consultation session work?",
    answer: "Once you book a session, you'll receive a brief questionnaire to help the expert understand your challenge. The expert comes prepared, and you'll have a focused 15-30 minute video call where they provide tailored advice. After the session, you'll receive an AI-generated PDF summary with key insights and action items."
  },
  {
    id: "2", 
    question: "How are experts vetted and verified?",
    answer: "All experts go through a rigorous verification process. We check their credentials, work experience, and professional background. Only qualified professionals with proven expertise in their field are approved to join our platform. Each expert also maintains a rating based on client feedback."
  },
  {
    id: "3",
    question: "What if I'm not satisfied with my session?",
    answer: "We offer a satisfaction guarantee. If you're not happy with your session, contact our support team within 24 hours and we'll either provide a full refund or connect you with another expert at no additional cost. Your success is our priority."
  },
  {
    id: "4",
    question: "How quickly can I book a session?",
    answer: "Many experts have same-day availability. You can see real-time availability when browsing experts and book a session that fits your schedule. Most sessions can be booked within 24-48 hours, and urgent consultations are often available within a few hours."
  },
  {
    id: "5",
    question: "What types of business challenges can experts help with?",
    answer: "Our experts cover a wide range of areas including business strategy, marketing & sales, technology & product development, finance & investment, legal & compliance, design & creativity, and more. Whether you need help with pricing strategy, technical architecture, legal questions, or growth planning, we have qualified experts ready to help."
  },
  {
    id: "6",
    question: "Do I get a summary after the session?",
    answer: "Yes! Within a few hours after your session, you'll receive an AI-generated PDF summary that includes key insights, specific recommendations, action items, and next steps discussed during your consultation. This summary is searchable and stored in your dashboard for future reference."
  }
];

const FAQSection = () => {
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const isOpen = (id: string) => openItems.includes(id);

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-blue-100 rounded-full px-4 py-2 mb-4">
            <HelpCircle className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">
              Got Questions?
            </span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to know about getting expert advice on Mentoji
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqData.map((faq) => (
            <Card 
              key={faq.id} 
              className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <CardContent className="p-0">
                <button
                  onClick={() => toggleItem(faq.id)}
                  className="w-full text-left p-6 focus:outline-none cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 pr-4">
                      {faq.question}
                    </h3>
                    <div className="flex-shrink-0">
                      {isOpen(faq.id) ? (
                        <ChevronUp className="w-5 h-5 text-gray-500 transition-transform duration-200" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-500 transition-transform duration-200" />
                      )}
                    </div>
                  </div>
                </button>
                
                {/* Collapsible Content */}
                <div 
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen(faq.id) 
                      ? 'max-h-96 opacity-100' 
                      : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-6 pb-6">
                    <div className="border-t border-gray-100 pt-4">
                      <p className="text-gray-700 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Help */}
        <div className="mt-12 text-center">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Still have questions?
            </h3>
            <p className="text-gray-600 mb-6">
              Our support team is here to help you get the most out of your Mentoji experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:support@mentoji.com"
                className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Contact Support
              </a>
              <a
                href="/help"
                className="inline-flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                Help Center
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;