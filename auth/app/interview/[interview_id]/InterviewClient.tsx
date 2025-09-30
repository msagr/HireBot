'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const MonacoEditor = dynamic(
  () => import('@monaco-editor/react'),
  { ssr: false }
);

type Question = {
  id: string;
  question: string;
  type: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
};

export default function InterviewClient({ interviewId }: { interviewId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [testId, setTestId] = useState<string | null>(null);
  const [code, setCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const editorRef = useRef<any>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // ... rest of your component logic ...
  // Move all the existing logic from page.tsx here
  // Make sure to update any references to params.interview_id to use the interviewId prop

  // Example of how to use the interviewId
  useEffect(() => {
    const getTestId = () => {
      const testIdFromParams = searchParams.get('testId');
      const testIdFromStorage = localStorage.getItem('currentTestId');
      
      console.log('Test ID from path:', interviewId);
      console.log('Test ID from params:', testIdFromParams);
      console.log('Test ID from storage:', testIdFromStorage);
      
      // Priority: Path param > Query param > LocalStorage
      return interviewId || testIdFromParams || testIdFromStorage;
    };

    const currentTestId = getTestId();
    
    if (!currentTestId) {
      console.error('No test ID found');
      setError('Test ID not found');
      setLoading(false);
      return;
    }

    const cleanTestId = decodeURIComponent(currentTestId).trim();
    console.log('Using test ID:', cleanTestId);
    
    localStorage.setItem('currentTestId', cleanTestId);
    setTestId(cleanTestId);
  }, [interviewId, searchParams]);

  // ... rest of your component code ...

  // Return your JSX here
  return (
    <div>
      {/* Your existing JSX */}
    </div>
  );
}
