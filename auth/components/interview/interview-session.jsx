'use client';

import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Loader2, CheckCircle } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamically import the code editor to avoid SSR issues
const CodeEditor = dynamic(
  () => import('@/components/ui/code-editor'),
  { ssr: false }
);

const InterviewSession = ({
  questions = [],
  onComplete = () => {},
  onNextQuestion = () => {},
  onPreviousQuestion = () => {},
  currentQuestionIndex = 0,
  totalQuestions = 0,
  question: initialQuestion = null,
  setQuestion: setQuestionProp = () => {}
}) => {
  // Component state
  const [question, setQuestion] = useState(initialQuestion);
  const [code, setCode] = useState(initialQuestion?.starterCode || '// Write your code here\n');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);

  // Set time limit based on difficulty in milliseconds
  const getTimeLimit = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 20 * 1000; // 20 seconds in milliseconds
      case 'medium':
        return 60 * 1000; // 60 seconds in milliseconds
      case 'hard':
        return 120 * 1000; // 120 seconds in milliseconds
      default:
        return 60 * 1000; // Default to 60 seconds
    }
  };
  
  // Initialize timer when question loads
  useEffect(() => {
    if (question) {
      setTimeLeft(getTimeLimit(question.difficulty));
    }
  }, [question]);

  // Load question when currentQuestionIndex changes
  useEffect(() => {
    if (questions && questions.length > 0 && currentQuestionIndex < questions.length) {
      const currentQ = questions[currentQuestionIndex];
      setQuestion(currentQ);
      setCode(currentQ.starterCode || '// Write your code here\n');
      setTimeLeft(getTimeLimit(currentQ.difficulty));
      setIsLoading(false);
      setIsSubmitting(false);
    } else if (questions && currentQuestionIndex >= questions.length) {
      // All questions completed
      setIsCompleted(true);
      setIsLoading(false);
    }
  }, [currentQuestionIndex, questions]);

  const handleCodeChange = (value) => {
    setCode(value);
  };

  // Handle timer countdown and auto-submit
  useEffect(() => {
    const handleAutoSubmit = async () => {
      if (onComplete && question) {
        await onComplete({
          questionId: question.id,
          code,
          submittedAt: new Date().toISOString(),
          timeRemaining: 0
        });
      }
      if (onNextQuestion) {
        onNextQuestion();
      }
    };

    // Don't start the timer if there's no question or time is up
    if (!question || timeLeft <= 0) {
      if (!isSubmitting && question) { // Only auto-submit if we have a question
        setIsSubmitting(true);
        handleAutoSubmit();
      }
      return;
    }

    // Start the countdown
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        const newTime = Math.max(0, prevTime - 1000);
        return newTime;
      });
    }, 1000);

    // Clean up the interval when component unmounts or dependencies change
    return () => clearInterval(timer);
  }, [timeLeft, isSubmitting, question, code, onComplete, onNextQuestion]);

  // Format time as MM:SS
  const formatTime = (milliseconds) => {
    // Ensure we have a valid number
    const time = Math.max(0, milliseconds);
    const totalSeconds = Math.ceil(time / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Get timer color based on time left percentage
  const getTimerColor = () => {
    if (!question) return 'text-gray-600';
    const totalTime = getTimeLimit(question.difficulty);
    const percentageLeft = (timeLeft / totalTime) * 100;
    
    if (percentageLeft < 25) return 'text-red-600 font-bold';
    if (percentageLeft < 50) return 'text-yellow-600';
    return 'text-green-600';
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    
    try {
      setIsLoading(true);
      setIsSubmitting(true);
      
      // In a real app, you would submit to your API here
      // const response = await fetch('/api/submissions', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ questionId: question.id, code }),
      // });
      // if (!response.ok) throw new Error('Submission failed');
      // const result = await response.json();
      
      // Call the onComplete callback with the submission data
      if (onComplete) {
        onComplete({
          questionId: question.id,
          code,
          submittedAt: new Date().toISOString(),
          timeRemaining: Math.ceil(timeLeft / 1000)
        });
      }

      // Move to next question or complete
      if (onNextQuestion) {
        onNextQuestion();
      }
    } catch (err) {
      console.error('Error submitting code:', err);
      setError('Failed to submit code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Load question when currentQuestionIndex changes
  useEffect(() => {
    if (questions && questions.length > 0 && currentQuestionIndex < questions.length) {
      const currentQ = questions[currentQuestionIndex];
      setQuestion(currentQ);
      setCode(currentQ.starterCode || '// Write your code here\n');
      setTimeLeft(getTimeLimit(currentQ.difficulty));
      setIsLoading(false);
      setIsSubmitting(false);
    } else if (questions && currentQuestionIndex >= questions.length) {
      // All questions completed
      setIsCompleted(true);
      setIsLoading(false);
    }
  }, [currentQuestionIndex, questions]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        <span className="ml-2">Loading question {currentQuestionIndex + 1} of {totalQuestions}...</span>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center p-6">
        <div className="bg-green-100 p-6 rounded-full mb-6">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Interview Complete!</h2>
        <p className="text-gray-600 mb-6">You've answered all the questions. Thank you for your time!</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          Start New Interview
        </button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        {error}
      </div>
    );
  }

  if (!question) {
    return (
      <div className="flex items-center justify-center h-screen">
        Question not found
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-900">Interview Questions</h1>
            {question && (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  Difficulty: <span className="font-medium capitalize">{question.difficulty?.toLowerCase()}</span>
                </span>
                <div className={`text-2xl font-mono font-bold px-4 py-1 rounded-md ${getTimerColor()} bg-gray-50`}>
                  {formatTime(timeLeft)}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
        {/* Question Panel */}
        <div className="w-1/2 p-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold">{question.title}</h2>
              <p className="text-sm text-gray-500">
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </p>
            </div>
            <div className={`text-lg font-medium ${getTimerColor()}`}>
              {formatTime(timeLeft)}
            </div>
          </div>
          
          <div 
            className="prose max-w-none" 
            dangerouslySetInnerHTML={{ __html: question.description }} 
          />
          
          {question.examples && question.examples.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Examples:</h3>
              <div className="space-y-4">
                {question.examples.map((example, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-md">
                    <p className="font-medium">Example {index + 1}:</p>
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="font-medium">Input:</span> {example.input}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Output:</span> {example.output}
                    </p>
                    {example.explanation && (
                      <p className="text-sm text-gray-500 mt-1 italic">
                        {example.explanation}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {question.constraints && question.constraints.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Constraints:</h3>
              <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                {question.constraints.map((constraint, i) => (
                  <li key={i}>{constraint}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Code Editor */}
        <div className="w-1/2 flex flex-col border-l border-gray-200">
          <div className="flex-1 overflow-hidden">
            <CodeEditor
              code={code}
              onChange={handleCodeChange}
              language={question.language || 'javascript'}
              theme="vs-dark"
            />
          </div>
          
          {/* Submit Button */}
          <div className="p-4 bg-white border-t border-gray-200 flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={isLoading || isSubmitting}
              className={`px-4 py-2 rounded-md text-white font-medium ${
                (isLoading || isSubmitting)
                  ? 'bg-indigo-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              } transition-colors`}
            >
              {isLoading || isSubmitting ? (
                <span className="flex items-center">
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {currentQuestionIndex < totalQuestions - 1 ? 'Submitting...' : 'Finishing...'}
                </span>
              ) : (
                currentQuestionIndex < totalQuestions - 1 ? 'Submit & Next' : 'Submit & Finish'
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

// Add PropTypes
InterviewSession.propTypes = {
  questions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      difficulty: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      examples: PropTypes.arrayOf(
        PropTypes.shape({
          input: PropTypes.string.isRequired,
          output: PropTypes.string.isRequired,
          explanation: PropTypes.string
        })
      ),
      constraints: PropTypes.arrayOf(PropTypes.string),
      starterCode: PropTypes.string,
      language: PropTypes.string
    })
  ),
  onComplete: PropTypes.func,
  onNextQuestion: PropTypes.func,
  onPreviousQuestion: PropTypes.func,
  currentQuestionIndex: PropTypes.number,
  totalQuestions: PropTypes.number,
  question: PropTypes.object,
  setQuestion: PropTypes.func
};

export default InterviewSession;
