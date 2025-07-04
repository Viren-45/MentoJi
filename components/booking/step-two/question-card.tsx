// components/booking/step-two/question-card.tsx
"use client";

import React, { useState } from 'react';
import { HelpCircle, CheckCircle2 } from 'lucide-react';

interface QuestionCardProps {
  questionNumber: number;
  label: string;
  placeholder: string;
  helpText?: string;
  value: string;
  onChange: (value: string) => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  questionNumber,
  label,
  placeholder,
  helpText,
  value,
  onChange,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const isAnswered = value.trim().length > 0;
  const characterCount = value.length;
  const maxCharacters = 500; // Optional character limit

  return (
    <div className={`
      relative border-2 rounded-xl p-6 transition-all duration-200
      ${isFocused 
        ? 'border-blue-300 bg-blue-50/30 shadow-lg' 
        : isAnswered 
          ? 'border-green-200 bg-green-50/30' 
          : 'border-gray-200 hover:border-gray-300'
      }
    `}>
      {/* Question Header */}
      <div className="flex items-start gap-3 mb-4">
        <div className={`
          flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors
          ${isAnswered 
            ? 'bg-green-100 text-green-700' 
            : isFocused 
              ? 'bg-blue-100 text-blue-700' 
              : 'bg-gray-100 text-gray-600'
          }
        `}>
          {isAnswered ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : (
            questionNumber
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex items-start gap-2">
            <h3 className="text-base font-semibold text-gray-900 leading-relaxed">
              {label}
            </h3>
            {helpText && (
              <button
                onClick={() => setShowHelp(!showHelp)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                title="Show help"
              >
                <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
          
          {/* Help Text */}
          {showHelp && helpText && (
            <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">{helpText}</p>
            </div>
          )}
        </div>
      </div>

      {/* Textarea */}
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          rows={4}
          maxLength={maxCharacters}
          className={`
            w-full px-4 py-3 border rounded-lg resize-none text-base leading-relaxed transition-all duration-200
            placeholder:text-gray-400 focus:outline-none
            ${isFocused 
              ? 'border-blue-300 bg-white shadow-sm' 
              : 'border-gray-200 bg-gray-50 focus:bg-white'
            }
          `}
        />
        
        {/* Character Counter */}
        <div className="absolute bottom-2 right-2 text-xs text-gray-400">
          {characterCount}/{maxCharacters}
        </div>
      </div>

      {/* Status Indicator */}
      {isAnswered && (
        <div className="mt-3 flex items-center gap-2 text-sm text-green-700">
          <CheckCircle2 className="w-4 h-4" />
          <span className="font-medium">Question answered</span>
        </div>
      )}
    </div>
  );
};

export default QuestionCard;