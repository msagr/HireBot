'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Loader2, Maximize2, Minimize2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import { saveResponse } from '@/utils/interviewDb';

// Dynamically import the code editor to avoid SSR issues
const CodeEditor = dynamic(
  () => import('@/components/ui/code-editor'),
  { ssr: false }
);

interface Example {
  input: string;
  output: string;
  explanation?: string;
}

interface Question {
  id: string;
  difficulty: string;
  title: string;
  description: string;
  examples?: Example[];
  constraints?: string[];
  starterCode?: string;
  language?: string;
}

interface InterviewSessionProps {
  questions: Question[];
  onComplete?: (data: {
    questionId: string;
    code: string;
    submittedAt: string;
    timeRemaining: number;
  }) => void | Promise<void>;
  onNextQuestion?: () => void;
  currentQuestionIndex?: number;
  totalQuestions?: number;
}

const InterviewSession: React.FC<InterviewSessionProps> = ({ 
  questions = [], 
  onComplete,
  onNextQuestion,
  currentQuestionIndex = 0,
  totalQuestions = 1
}) => {
  const [question, setQuestion] = useState<Question | null>(null);
  const [code, setCode] = useState<string>('// Write your code here\n');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const fullscreenRef = useRef<HTMLDivElement>(null);

  // Set time limit based on difficulty in milliseconds
  const getTimeLimit = useCallback((difficulty: string): number => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 20 * 1000; // 20 seconds
      case 'medium':
        return 60 * 1000; // 60 seconds (1 minute)
      case 'hard':
        return 120 * 1000; // 120 seconds (2 minutes)
      default:
        return 60 * 1000; // Default to 60 seconds
    }
  }, []);

  // Format time as MM:SS
  const formatTime = (milliseconds: number): string => {
    const totalSeconds = Math.ceil(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Initialize timer when question loads
  useEffect(() => {
    if (question) {
      setTimeLeft(getTimeLimit(question.difficulty));
    }
  }, [question, getTimeLimit]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0 || !question) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1000) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, question]);

  // Load question when currentQuestionIndex changes
  useEffect(() => {
    if (questions.length > 0) {
      if (currentQuestionIndex < questions.length) {
        const currentQuestion = questions[currentQuestionIndex];
        setQuestion(currentQuestion);
        setCode(currentQuestion?.starterCode || '// Write your code here\n');
        setTimeLeft(getTimeLimit(currentQuestion.difficulty));
        setIsLoading(false);
        setError(null);
      } else {
        // All questions completed
        setIsCompleted(true);
        setIsLoading(false);
      }
    }
  }, [questions, currentQuestionIndex, getTimeLimit]);

  // Handle fullscreen toggle - always force fullscreen in this mode
  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      }
      // Don't allow exiting fullscreen through the button
    } catch (err) {
      console.error('Error entering fullscreen:', err);
    }
  }, []);

  // Prevent context menu, keyboard shortcuts, and window resizing in fullscreen
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault(); // Always prevent context menu
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent F5, F11, Ctrl+R, and other window manipulation shortcuts
      if (
        e.key === 'F5' || 
        e.key === 'F11' || 
        e.key === 'F12' ||
        (e.ctrlKey && (e.key === 'r' || e.key === 'R')) ||
        (e.altKey && e.key === 'Tab')
      ) {
        e.preventDefault();
      }
    };

    // Prevent window resizing
    const handleResize = () => {
      if (document.fullscreenElement) {
        // Force fullscreen if someone tries to resize
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(console.error);
        }
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize);
    
    // Enter fullscreen when component mounts
    const enterFullscreen = async () => {
      try {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } catch (err) {
        console.error('Error entering fullscreen:', err);
      }
    };
    
    enterFullscreen();

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch((err) => {
          // Ignore error if the document is not in fullscreen
          if (err.name !== 'InvalidStateError') {
            console.error('Error exiting fullscreen:', err);
          }
        });
      }
    };
  }, []);

  // Handle code changes in the editor
  const handleCodeChange = useCallback((newCode: string = '') => {
    setCode(newCode);
  }, []);

  // Handle code submission
  const handleSubmit = useCallback(async (): Promise<void> => {
    if (!question) return;
    
    try {
      setIsSubmitting(true);
      
      // Save to IndexedDB
      await saveResponse({
        questionId: question.id,
        questionTitle: question.title,
        difficulty: question.difficulty,
        code,
        submittedAt: new Date().toISOString(),
        timeRemaining: Math.ceil(timeLeft / 1000)
      });
      
      if (onComplete) {
        await onComplete({
          questionId: question.id,
          code,
          submittedAt: new Date().toISOString(),
          timeRemaining: Math.ceil(timeLeft / 1000)
        });
      }
      
      if (onNextQuestion) {
        onNextQuestion();
      }
    } catch (err) {
      console.error('Error submitting code:', err);
      setError('Failed to submit code. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [code, onComplete, onNextQuestion, question, timeLeft]);
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50 p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
        <p className="text-gray-600">Preparing your interview session...</p>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Interview Completed!</h2>
          <p className="text-gray-600 mb-6">Thank you for completing the interview. Your responses have been recorded.</p>
          <button
            onClick={() => window.location.href = '/interview/results'}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            View Results
          </button>
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Question Found</h2>
          <p className="text-gray-600">There was an error loading the question. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={fullscreenRef} className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8 flex justify-between items-center">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </h1>
            <p className="text-sm text-gray-500">{question.title}</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
              Time: {formatTime(timeLeft)}
            </div>
            <button
              onClick={toggleFullscreen}
              className="p-2 text-gray-400 cursor-default"
              title="Fullscreen mode is required"
              disabled
            >
              <Maximize2 size={20} className="text-gray-400" />
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex overflow-hidden">
        {/* Question panel */}
        <div className="w-1/2 p-6 overflow-y-auto">
          <div className="prose max-w-none">
            <div dangerouslySetInnerHTML={{ __html: question.description }} />
          </div>
          
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

        {/* Code editor */}
        <div className="w-1/2 flex flex-col border-l border-gray-200 bg-white">
          <div className="flex-1 overflow-hidden">
            <CodeEditor
              code={code}
              onChange={handleCodeChange}
              language={question.language || 'javascript'}
              theme="vs-dark"
              height="100%"
              options={{
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                fontSize: 14,
                wordWrap: 'on',
              }}
            />
          </div>
          
          {/* Submit button */}
          <div className="p-4 bg-white border-t border-gray-200 flex justify-between items-center">
            {error && (
              <div className="text-red-600 text-sm">
                {error}
              </div>
            )}
            <div className="ml-auto">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`px-4 py-2 rounded-md text-white font-medium ${
                  isSubmitting
                    ? 'bg-indigo-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700'
                } transition-colors`}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {currentQuestionIndex < (totalQuestions || 1) - 1 ? 'Submitting...' : 'Finishing...'}
                  </span>
                ) : (
                  currentQuestionIndex < (totalQuestions || 1) - 1 ? 'Submit & Next' : 'Submit & Finish'
                )}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InterviewSession;
