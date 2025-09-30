"use client";

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import Monaco Editor to avoid SSR issues
const MonacoEditor = dynamic(
  () => import('@monaco-editor/react'),
  { ssr: false }
);
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface Question {
  id: string;
  question: string;
  type: string;
  difficulty: string;
}

const InterviewPage = ({ params }: { params: { interview_id: string } }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [testId, setTestId] = useState<string | null>(null);
  const [code, setCode] = useState<string>('');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const editorRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  function handleEditorDidMount(editor: any) {
    editorRef.current = editor;
  }

  function handleEditorChange(value: string | undefined) {
    if (value !== undefined) {
      setCode(value);
    }
  }

  useEffect(() => {
    const getTestId = () => {
      // Get testId from URL path, then query params, then localStorage
      const testIdFromPath = params.interview_id;
      const testIdFromParams = searchParams.get('testId');
      const testIdFromStorage = localStorage.getItem('currentTestId');
      
      console.log('Test ID from path:', testIdFromPath);
      console.log('Test ID from params:', testIdFromParams);
      console.log('Test ID from storage:', testIdFromStorage);
      
      // Priority: Path param > Query param > LocalStorage
      return testIdFromPath || testIdFromParams || testIdFromStorage;
    };

    const currentTestId = getTestId();
    
    if (!currentTestId) {
      console.error('No test ID found in URL or localStorage');
      setError('Test ID not found. Please go back and try again.');
      setLoading(false);
      return;
    }
    
    // Decode and clean the test ID
    const cleanTestId = decodeURIComponent(currentTestId).trim();
    console.log('Using test ID:', cleanTestId);
    
    // Update localStorage with the found test ID
    localStorage.setItem('currentTestId', cleanTestId);
    setTestId(cleanTestId);
  }, [params.interview_id, searchParams]);

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!testId) return;
      
      try {
        setLoading(true);
        console.log('Fetching questions for testId:', testId);

        // Fetch questions for this test
        const apiUrl = `/api/tests/${encodeURIComponent(testId)}/questions`;
        console.log('Fetching questions from:', apiUrl);
        
        const response = await fetch(apiUrl, {
          cache: 'no-store' // Prevent caching
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response:', errorText);
          throw new Error(`Failed to fetch questions: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Questions data received:', data);
        setQuestions(data.questions || []);
      } catch (err) {
        console.error('Error fetching questions:', err);
        setError('Failed to load interview questions. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (testId) {
      fetchQuestions();
    }
  }, [testId]);

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-red-500">{error}</div>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>No Questions Available</CardTitle>
          </CardHeader>
          <CardContent>
            <p>This interview doesn't have any questions yet.</p>
            <Button onClick={() => router.back()} className="mt-4">
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div 
      ref={containerRef}
      className={`${isFullscreen ? 'fixed inset-0 bg-white z-50 flex items-center justify-center' : 'min-h-screen bg-gradient-to-br from-gray-50 to-gray-100'} p-4 md:p-6`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 bg-white border-b border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {currentQuestion.type === 'CODING' ? 'Coding Interview' : 
                   currentQuestion.type === 'THEORY' ? 'Technical Assessment' : 'System Design Challenge'}
                </h1>
                <div className="flex items-center mt-1 space-x-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    {currentQuestion.difficulty}
                  </span>
                  <span className="text-sm text-gray-500">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900">
                  <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  45:00
                </button>
                <button 
                  onClick={toggleFullscreen}
                  className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                  title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {isFullscreen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 16L4 20h4v4l2-2m1-16h2m8 0h2m-8 0a4 4 0 00-4 4v1a1 1 0 01-1 1H4m16 0h-3a1 1 0 01-1-1v-1a4 4 0 00-4-4m0 16h-2m-8 0H4m8 0a4 4 0 004-4v-1a1 1 0 011-1h3a1 1 0 011 1v1a4 4 0 01-4 4z" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    )}
                  </svg>
                </button>
              </div>
            </div>
          </div>
      
          
          {/* Main Content */}
          <div className={`flex flex-col lg:flex-row ${isFullscreen ? 'w-full max-w-7xl max-h-[90vh] shadow-xl' : 'w-full'}`}>
            {/* Question Panel */}
            <div className="w-full lg:w-1/2 p-6 overflow-y-auto border-r border-gray-100" style={{ height: isFullscreen ? 'calc(90vh - 4rem)' : 'auto' }}>
              <div className="prose max-w-none">
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-r">
                  <h3 className="text-gray-800 font-medium">Problem Statement</h3>
                  <p className="mt-2 text-gray-700 whitespace-pre-wrap">{currentQuestion.question}</p>
                </div>
                
                {currentQuestion.type === 'CODING' && (
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Example:</h4>
                    <div className="bg-gray-800 text-gray-100 p-4 rounded-md font-mono text-sm overflow-x-auto">
                      <pre>{
`Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].`}</pre>
                    </div>
                  </div>
                )}
                
                <div className="mt-8 pt-4 border-t border-gray-100">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Hints</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <span>Think about the brute force approach first</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <span>Can you optimize the solution further?</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <span>Consider edge cases like empty input or no solution</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Editor Panel */}
<div 
  className="w-full lg:w-1/2 flex flex-col border-t lg:border-t-0 border-gray-100"
  style={{ height: isFullscreen ? 'calc(90vh - 4rem)' : 'auto' }}
>
  {/* Top Bar */}
  <div className="p-4 border-b border-gray-100 bg-gray-50">
    <div className="flex items-center justify-between">
      <h3 className="text-sm font-medium text-gray-700">Your Solution</h3>
      <div className="flex items-center space-x-2">
        <button className="text-xs px-2.5 py-1 rounded-md bg-white border border-gray-200 text-gray-600 hover:bg-gray-50">
          Run Code (Ctrl+Enter)
        </button>
        <button className="text-gray-500 hover:text-gray-700">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37 1 .608 2.296.07 2.572-1.065z" />
          </svg>
        </button>
      </div>
    </div>
  </div>

  {/* Editor */}
  <div className="flex-1 relative overflow-hidden">
    <div className="absolute inset-0">
      <MonacoEditor
        height="100%"
        defaultLanguage={currentQuestion.type === 'CODING' ? 'javascript' : 'plaintext'}
        theme="vs-dark"
        value={code}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        options={{
          minimap: { enabled: false },
          scrollBeyondLastLine: true,
          fontSize: 14,
          wordWrap: 'on',
          automaticLayout: true,
          padding: { top: 16 },
          lineNumbers: 'on',
          renderWhitespace: 'selection',
          tabSize: 2,
          fontFamily: 'Fira Code, Menlo, Monaco, Consolas, monospace',
          renderLineHighlight: 'all',
          scrollbar: { vertical: 'auto', horizontal: 'auto' },
        }}
      />
    </div>
  </div>

  {/* Action Buttons pinned at bottom */}
  <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end shrink-0">
    {currentQuestionIndex < questions.length - 1 ? (
      <button 
        onClick={handleNext}
        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm transition-colors duration-150"
      >
        Next Question <span className="ml-1">→</span>
      </button>
    ) : (
      <button 
        className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md shadow-sm transition-colors duration-150 flex items-center"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        Submit Interview
      </button>
    )}
  </div>
</div>

          </div>
        </div>
      </div>
      </div>
  );
};

export default InterviewPage;
