// components/booking/step-three/questionnaire-summary.tsx
"use client";

import React from 'react';
import { MessageSquare, FileText } from 'lucide-react';
import { QuestionnaireAnswers } from '../step-two/questionnaire';

interface QuestionnaireSummaryProps {
  questionnaireAnswers: QuestionnaireAnswers;
  expertName: string;
}

const QuestionnaireSummary: React.FC<QuestionnaireSummaryProps> = ({
  questionnaireAnswers,
  expertName,
}) => {
  // Check if any questionnaire answers exist
  const hasQuestionnaireAnswers = Object.values(questionnaireAnswers).some(
    answer => answer && answer.trim().length > 0
  );

  const questions = [
    {
      key: 'question1' as keyof QuestionnaireAnswers,
      label: 'What specific challenge or question would you like to discuss?',
      answer: questionnaireAnswers.question1,
    },
    {
      key: 'question2' as keyof QuestionnaireAnswers,
      label: 'What context or background information should the expert know?',
      answer: questionnaireAnswers.question2,
    },
    {
      key: 'question3' as keyof QuestionnaireAnswers,
      label: 'What outcome or advice are you hoping to get from this session?',
      answer: questionnaireAnswers.question3,
    },
  ];

  const answeredQuestions = questions.filter(q => q.answer && q.answer.trim().length > 0);

  if (!hasQuestionnaireAnswers) {
    return (
      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
        <div className="text-center">
          <div className="bg-white p-3 rounded-lg w-fit mx-auto mb-3">
            <MessageSquare className="w-6 h-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No preparation notes</h3>
          <p className="text-gray-600 text-sm">
            You chose to skip the preparation questions. You can still have a great session with {expertName}!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-green-50 rounded-xl p-6 border border-green-200">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-white p-2 rounded-lg">
          <FileText className="w-5 h-5 text-green-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Your preparation notes</h3>
          <p className="text-sm text-green-800">
            {answeredQuestions.length} of 3 questions answered
          </p>
        </div>
      </div>
      
      <div className="space-y-4">
        {answeredQuestions.map((question, index) => (
          <div key={question.key} className="bg-white rounded-lg p-4 border border-green-200">
            <p className="text-sm font-medium text-gray-700 mb-2">
              {question.label}
            </p>
            <p className="text-gray-800 leading-relaxed text-sm">
              {question.answer}
            </p>
          </div>
        ))}
      </div>
      
      <div className="mt-4 p-3 bg-green-100 rounded-lg">
        <p className="text-sm text-green-800">
          <strong>Note:</strong> These details will be shared with {expertName} before your session to help them prepare.
        </p>
      </div>
    </div>
  );
};

export default QuestionnaireSummary;