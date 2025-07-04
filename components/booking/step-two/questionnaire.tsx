// components/booking/step-two/questionnaire.tsx
"use client";

import React, { useState } from 'react';
import { MessageSquare, ArrowLeft, SkipForward } from 'lucide-react';
import QuestionCard from './question-card';

interface QuestionnaireProps {
  onSkip: () => void;
  onNext: (answers: QuestionnaireAnswers) => void;
  onBack: () => void;
  expertName: string;
}

export interface QuestionnaireAnswers {
  question1: string;
  question2: string;
  question3: string;
}

const Questionnaire: React.FC<QuestionnaireProps> = ({
  onSkip,
  onNext,
  onBack,
  expertName,
}) => {
  const [answers, setAnswers] = useState<QuestionnaireAnswers>({
    question1: '',
    question2: '',
    question3: '',
  });

  const handleAnswerChange = (questionKey: keyof QuestionnaireAnswers, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionKey]: value,
    }));
  };

  // Check if any question has content to enable Next button
  const hasAnyAnswer = Object.values(answers).some(answer => answer.trim().length > 0);
  const answeredCount = Object.values(answers).filter(answer => answer.trim().length > 0).length;

  const handleContinue = () => {
    console.log('Questionnaire handleContinue called with answers:', answers);
    onNext(answers);
  };

  const handleSkip = () => {
    console.log('Questionnaire handleSkip called');
    onSkip();
  };

  const questions = [
    {
      key: 'question1' as keyof QuestionnaireAnswers,
      label: 'What specific challenge or question would you like to discuss?',
      placeholder: 'Describe your main challenge or objective for this session...',
      helpText: 'Be as specific as possible to help your expert prepare targeted advice.',
    },
    {
      key: 'question2' as keyof QuestionnaireAnswers,
      label: 'What context or background information should the expert know?',
      placeholder: 'Share relevant details about your situation, company, project, etc...',
      helpText: 'Include any relevant background that will help the expert understand your situation better.',
    },
    {
      key: 'question3' as keyof QuestionnaireAnswers,
      label: 'What outcome or advice are you hoping to get from this session?',
      placeholder: 'What would make this session successful for you?',
      helpText: 'Define success for this session - what specific outcomes are you looking for?',
    },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex items-center gap-3">
            <MessageSquare className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Help us prepare for your session</h2>
          </div>
        </div>
        
        <p className="text-gray-600 leading-relaxed ml-11">
          Answer a few quick questions so <strong>{expertName}</strong> can provide the most valuable advice. 
          This helps them come prepared and maximize your session time.
        </p>
        
        {/* Progress indicator */}
        <div className="ml-11 mt-4 flex items-center gap-2">
          <div className="text-sm text-gray-500">
            Questions answered: <span className="font-medium text-blue-600">{answeredCount} of {questions.length}</span>
          </div>
          {hasAnyAnswer && (
            <div className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
              Looking good!
            </div>
          )}
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-6 mb-8">
        {questions.map((question, index) => (
          <QuestionCard
            key={question.key}
            questionNumber={index + 1}
            label={question.label}
            placeholder={question.placeholder}
            helpText={question.helpText}
            value={answers[question.key]}
            onChange={(value) => handleAnswerChange(question.key, value)}
          />
        ))}
      </div>

      {/* Skip Notice */}
      <div className="mb-8 p-4 bg-amber-50 rounded-lg border border-amber-200">
        <div className="flex items-start gap-3">
          <SkipForward className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-amber-900 mb-1">Optional but recommended</h4>
            <p className="text-sm text-amber-800 leading-relaxed">
              While these questions are optional, providing context helps your expert deliver more targeted 
              and valuable advice during your session. You can always skip and have a great conversation anyway!
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={handleSkip}
          className="flex-1 py-4 px-6 rounded-xl font-semibold transition-all duration-200 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 flex items-center justify-center gap-2"
        >
          <SkipForward className="w-4 h-4" />
          Skip for now
        </button>
        
        <button
          onClick={handleContinue}
          disabled={!hasAnyAnswer}
          className={`
            flex-1 py-4 px-6 rounded-xl font-semibold transition-all duration-200
            ${hasAnyAnswer 
              ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg' 
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          {hasAnyAnswer ? 'Continue to Review' : 'Answer at least one question to continue'}
        </button>
      </div>
    </div>
  );
};

export default Questionnaire;