"use client";

import { notFound, useRouter } from "next/navigation";
import { auth } from "@/auth";
import { getQuestionSetById } from "@/actions/question-set";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Plus, Pencil, Trash2, ArrowLeft, Clock } from "lucide-react";
import React, { useState, useEffect } from "react";
import dynamic from 'next/dynamic';

// Simple Monaco Editor component with client-side only rendering
const CodeEditor = dynamic(
  () => import('@monaco-editor/react'),
  { 
    ssr: false,
    loading: () => <div className="h-full w-full bg-gray-100 flex items-center justify-center">
      <div className="animate-pulse">Loading editor...</div>
    </div>
  }
);

interface Question {
  id: string;
  question: string;
  type: string;
  difficulty: string;
}

interface QuestionSet {
  id: string;
  title: string;
  description?: string;
  createdAt: Date;
  questions: Question[];
}

const TestDetailPage = ({ params }: { params: { id: string } }) => {
  const [questionSet, setQuestionSet] = React.useState<QuestionSet | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(60 * 60); // 60 minutes in seconds
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [code, setCode] = useState('// Start coding here...');
  const [language, setLanguage] = useState('javascript');
  
  const router = useRouter();
  
  // Timer effect
  useEffect(() => {
    if (timeLeft <= 0) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeLeft]);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const session = await auth();
        if (!session?.user) {
          router.push("/login");
          return;
        }

        const data = await getQuestionSetById(params.id, session.user.id);
        if (!data) {
          notFound();
          return;
        }
        setQuestionSet(data as QuestionSet);
      } catch (err) {
        console.error("Error fetching test:", err);
        setError("Failed to load test. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  if (!questionSet) {
    return null;
  }

  if (!questionSet || questionSet.questions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="mb-4">No questions available for this test.</p>
          <Button asChild>
            <Link href="/dashboard/tests">
              Back to Tests
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const currentQuestion = questionSet.questions[currentQuestionIndex];
  
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header with Timer */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Button variant="ghost" asChild>
            <Link href="/dashboard/tests" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Tests
            </Link>
          </Button>
          
          <div className="flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-full">
            <Clock className="h-5 w-5 text-gray-600" />
            <span className="font-mono font-medium text-lg">
              {formatTime(timeLeft)}
            </span>
          </div>
          
          <div className="text-sm text-muted-foreground">
            Question {currentQuestionIndex + 1} of {questionSet.questions.length}
          </div>
        </div>
      </header>
      
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">
            {questionSet.title}
          </h1>
          {questionSet.description && (
            <p className="text-muted-foreground">{questionSet.description}</p>
          )}
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {questionSet.title}
            </h1>
            {questionSet.description && (
              <p className="text-muted-foreground">{questionSet.description}</p>
            )}
            <div className="mt-2 text-sm text-muted-foreground">
              Created on{" "}
              {format(new Date(questionSet.createdAt), "MMMM d, yyyy")}
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/dashboard/tests/${questionSet.id}/edit`}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/dashboard/tests/${questionSet.id}/questions/new`}>
                <Plus className="mr-2 h-4 w-4" />
                Add Question
              </Link>
            </Button>
            {questionSet.questions.length > 0 && (
              <Button
                size="sm"
                onClick={() => {
                  const testId = questionSet.id;
                  console.log('Starting interview with testId:', testId);
                  
                  // Store in localStorage
                  localStorage.setItem("currentTestId", testId);
                  
                  // Navigate to interview page with testId in both path and query params
                  const interviewUrl = `/interview/${encodeURIComponent(testId)}?testId=${encodeURIComponent(testId)}`;
                  console.log('Navigating to:', interviewUrl);
                  router.push(interviewUrl);
                }}
              >
                Start Interview
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Question Panel */}
        <div className="w-1/2 p-6 overflow-y-auto">
          <Card className="h-full">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">Question</CardTitle>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline">
                      {currentQuestion.type === "CODING"
                        ? "Coding"
                        : currentQuestion.type === "THEORY"
                        ? "Theory"
                        : "System Design"}
                    </Badge>
                    <Badge
                      variant={
                        currentQuestion.difficulty === "HARD"
                          ? "destructive"
                          : "outline"
                      }
                    >
                      {currentQuestion.difficulty}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <h3 className="text-lg font-medium mb-4">
                  {currentQuestion.question}
                </h3>
                {/* Add any additional question details here */}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Code Editor Panel */}
        <div className="w-1/2 border-l bg-white">
          <div className="h-full flex flex-col">
            <div className="border-b p-2 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="bg-gray-100 rounded px-2 py-1 text-sm"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="cpp">C++</option>
                </select>
              </div>
              <Button variant="ghost" size="sm">
                Run Code
              </Button>
            </div>
            <div className="flex-1 h-full">
              <div className="h-full w-full flex flex-col">
                <div className="flex-1 min-h-0">
                  <CodeEditor
                    height="100%"
                    defaultLanguage={language}
                    language={language}
                    theme="vs-light"
                    value={code}
                    onChange={(value) => value !== undefined && setCode(value)}
                    options={{
                      minimap: { enabled: false },
                      scrollBeyondLastLine: false,
                      fontSize: 14,
                      wordWrap: 'on',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer with Submit Button */}
      <footer className="border-t bg-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Button size="lg">
            Submit
          </Button>
          
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              disabled={currentQuestionIndex === 0}
              onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
            >
              Previous
            </Button>
            <Button 
              variant="default"
              disabled={currentQuestionIndex === questionSet.questions.length - 1}
              onClick={() => setCurrentQuestionIndex(prev => Math.min(questionSet.questions.length - 1, prev + 1))}
            >
              Next
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TestDetailPage;
