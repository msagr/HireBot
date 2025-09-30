'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Code, Clock, CheckCircle } from 'lucide-react';
import dynamic from 'next/dynamic';

// Function to get time limit based on difficulty
const getTimeLimit = (difficulty) => {
  switch(difficulty?.toLowerCase()) {
    case 'easy':
      return 30 * 1000; // 30 seconds
    case 'medium':
      return 60 * 1000; // 1 minute
    case 'hard':
      return 120 * 1000; // 2 minutes
    default:
      return 60 * 1000; // Default to 1 minute
  }
};

// Function to format questions for the interview
const formatQuestions = (questions = []) => {
  return questions.map((q, index) => ({
    id: q.id || `q-${index}`,
    difficulty: q.difficulty || 'medium',
    title: q.question || `Question ${index + 1}`,
    description: q.description || q.question || '',
    timeLimit: getTimeLimit(q.difficulty),
    examples: q.examples || [],
    starterCode: q.starterCode || q.solution || '// Your code here\n',
    // Include any additional question data
    ...q
  }));
};

// Dynamically import the code editor to avoid SSR issues
const CodeEditor = dynamic(
  () => import('@/components/ui/code-editor'),
  { ssr: false }
);

function QuestionPanel({ question, timeLeft, onNext, onSubmit, isLastQuestion }) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{question.title}</h2>
        <div className="flex items-center text-gray-600">
          <Clock className="h-5 w-5 mr-1" />
          <span>{Math.ceil(timeLeft / 1000)}s remaining</span>
        </div>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-md mb-4 flex-1 overflow-y-auto">
        <p className="whitespace-pre-line mb-4">{question.description}</p>
        
        {question.examples && question.examples.length > 0 && (
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Examples:</h3>
            {question.examples.map((example, idx) => (
              <div key={idx} className="bg-gray-100 p-3 rounded-md mb-3">
                <div className="font-medium">Example {idx + 1}:</div>
                <div className="mt-1">
                  <div className="text-sm text-gray-700">Input: <code className="bg-gray-200 px-1 rounded">{example.input}</code></div>
                  <div className="text-sm text-gray-700">Output: <code className="bg-gray-200 px-1 rounded">{example.output}</code></div>
                  {example.explanation && (
                    <div className="text-sm text-gray-600 mt-1">Explanation: {example.explanation}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="mt-4 flex justify-end space-x-2">
        <button
          onClick={onSubmit}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <CheckCircle className="h-4 w-4 mr-2" />
          {isLastQuestion ? 'Submit Final Answer' : 'Submit & Next'}
        </button>
      </div>
    </div>
  );
}

export default function InterviewSessionPage() {
  const params = useParams();
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [code, setCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const timerRef = useRef(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [completedQuestions, setCompletedQuestions] = useState([]);

  // Load questions
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        // Get test data from localStorage (set by the interview setup page)
        const testData = JSON.parse(localStorage.getItem('interviewTestData'));
        
        if (!testData || !testData.questions || testData.questions.length === 0) {
          throw new Error('No questions found for this test');
        }

        // Format questions with proper timing based on difficulty
        const formattedQuestions = formatQuestions(testData.questions);
        setQuestions(formattedQuestions);
        setLoading(false);
      } catch (err) {
        console.error('Failed to load questions:', err);
        setError(err.message || 'Failed to load questions. Please try again.');
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  // Set up timer for current question
  useEffect(() => {
    if (questions.length === 0) return;
    
    const currentQuestion = questions[currentQuestionIndex];
    setTimeLeft(currentQuestion.timeLimit);
    setCode(currentQuestion.starterCode || '// Write your code here\n');
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1000) {
          clearInterval(timerRef.current);
          handleTimeUp();
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [currentQuestionIndex, questions]);

  const handleTimeUp = () => {
    // Auto-submit when time is up
    handleSubmit();
  };

  const handleCodeChange = (value) => {
    setCode(value);
  };

  const handleSubmit = () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    // Save the response
    const response = {
      questionId: currentQuestion.id,
      code,
      submittedAt: new Date().toISOString(),
      timeRemaining: timeLeft
    };
    
    setCompletedQuestions(prev => [...prev, response]);
    
    // Move to next question or complete interview
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Interview completed
      handleInterviewComplete();
      return;
    }
    
    setIsSubmitting(false);
  };

  const handleInterviewComplete = async () => {
    console.log('Interview completed with responses:', completedQuestions);
    // In a real app, you would save the interview results to your database
    router.push(`/interview/${params.interview_id}/complete`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error Loading Interview</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">No Questions Available</h2>
          <p className="text-gray-600 mb-4">There are no questions available for this interview.</p>
          <button
            onClick={() => router.back()}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 text-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Try Again
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md overflow-hidden h-[calc(100vh-2rem)] flex flex-col">
        <div className="bg-indigo-600 text-white px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">Coding Interview</h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Code className="h-5 w-5 mr-2" />
                <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
              </div>
              <div className="h-8 w-px bg-white/20"></div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                <span>{Math.ceil(timeLeft / 1000)}s remaining</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-1 overflow-hidden">
          {/* Left panel - Question */}
          <div className="w-1/2 border-r border-gray-200 p-6 overflow-y-auto">
            <QuestionPanel 
              question={currentQuestion}
              timeLeft={timeLeft}
              onNext={handleSubmit}
              onSubmit={handleSubmit}
              isLastQuestion={isLastQuestion}
            />
          </div>
          
          {/* Right panel - Code Editor */}
          <div className="w-1/2 flex flex-col">
            <div className="p-1 bg-gray-100 border-b border-gray-200 flex justify-between items-center">
              <div className="px-4 py-2 text-sm font-medium text-gray-700">
                {currentQuestion.title}
              </div>
              <div className="px-4 py-1 text-xs font-medium rounded-full" 
                   style={{
                     backgroundColor: 
                       currentQuestion.difficulty === 'easy' ? '#DCFCE7' : 
                       currentQuestion.difficulty === 'medium' ? '#FEF3C7' : '#FEE2E2',
                     color: 
                       currentQuestion.difficulty === 'easy' ? '#166534' : 
                       currentQuestion.difficulty === 'medium' ? '#92400E' : '#991B1B'
                   }}>
                {currentQuestion.difficulty.charAt(0).toUpperCase() + currentQuestion.difficulty.slice(1)}
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
              <CodeEditor
                value={code}
                onChange={handleCodeChange}
                language="javascript"
                height="100%"
                style={{ fontSize: '14px' }}
              />
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex justify-between items-center">
          <div className="flex space-x-2">
            {questions.map((_, idx) => (
              <div 
                key={idx}
                className={`h-2 w-8 rounded-full ${
                  completedQuestions.some(q => q.questionId === questions[idx].id)
                    ? 'bg-green-500'
                    : currentQuestionIndex === idx
                    ? 'bg-blue-500'
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`px-4 py-2 rounded-md text-white flex items-center ${
              isSubmitting 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {isLastQuestion ? 'Submitting...' : 'Submitting...'}
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                {isLastQuestion ? 'Submit Final Answer' : 'Submit & Next'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
