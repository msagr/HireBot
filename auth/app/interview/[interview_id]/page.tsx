"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Loader2, Maximize2, Minimize2, ArrowLeft, ArrowRight, Check, Video, VideoOff, Mic, CheckCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

// Dynamically import Monaco Editor to avoid SSR issues
const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

interface Question {
  id: string;
  question: string;
  type: string;
  difficulty: string;
}

const getTimeForDifficulty = (difficulty: string) => {
  switch (difficulty?.toLowerCase()) {
    case "easy":
      return 30;
    case "medium":
      return 60;
    case "hard":
      return 120;
    default:
      return 60;
  }
};

type FormData = {
  name: string;
  email: string;
  phone: string;
  resume: File | null;
};

type Step = 'form' | 'proctored' | 'test';

const InterviewPage = ({ params }: { params: { interview_id: string } }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState<Step>('form');
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    resume: null,
  });
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [testId, setTestId] = useState<string | null>(null);
  const [code, setCode] = useState<string>("");
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const editorRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [micReady, setMicReady] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch((err) => {
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
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
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

  // Extract testId
  useEffect(() => {
    const getTestId = () => {
      const testIdFromPath = params.interview_id;
      const testIdFromParams = searchParams.get("testId");
      const testIdFromStorage = localStorage.getItem("currentTestId");
      return testIdFromPath || testIdFromParams || testIdFromStorage;
    };
    const currentTestId = getTestId();
    if (!currentTestId) {
      setError("Test ID not found. Please go back and try again.");
      setLoading(false);
      return;
    }
    const cleanTestId = decodeURIComponent(currentTestId).trim();
    localStorage.setItem("currentTestId", cleanTestId);
    setTestId(cleanTestId);
  }, [params.interview_id, searchParams]);

  // Fetch questions
  useEffect(() => {
    const fetchQuestions = async () => {
      if (!testId) return;
      try {
        setLoading(true);
        const apiUrl = `/api/tests/${encodeURIComponent(testId)}/questions`;
        const response = await fetch(apiUrl, { cache: "no-store" });
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText);
        }
        const data = await response.json();
        setQuestions(data.questions || []);
      } catch (err) {
        setError("Failed to load interview questions. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    if (testId) fetchQuestions();
  }, [testId]);

  // Timer effect
  useEffect(() => {
    if (questions.length === 0) return;

    const currentDifficulty = questions[currentQuestionIndex]?.difficulty;
    const timeForQuestion = getTimeForDifficulty(currentDifficulty);
    setTimeLeft(timeForQuestion);

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleNext(); // move to next automatically
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentQuestionIndex, questions]);

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    router.push("/thank-you");
  };

  // Handle form submission
  const handleFormSubmit = (data: FormData) => {
    setFormData(data);
    setCurrentStep('proctored');
  };

  // Handle proctored setup completion
  const handleProctoredComplete = () => {
    setCurrentStep('test');
  };

  // Handle test submission
  const handleTestComplete = () => {
    router.push('/thank-you');
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

  // Render form step
  if (currentStep === 'form') {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Candidate Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleFormSubmit(formData);
            }} className="space-y-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                  placeholder="john@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label>Phone Number</Label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  required
                  placeholder="+1234567890"
                />
              </div>
              <div className="space-y-2">
                <Label>Resume (PDF)</Label>
                <Input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setFormData({...formData, resume: e.target.files?.[0] || null})}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Continue to Proctored Setup
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render proctored setup step
  if (currentStep === 'proctored') {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Proctored Setup</CardTitle>
            <CardDescription>
              Please allow camera and microphone access to continue with the interview.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-gray-100 rounded-lg overflow-hidden aspect-video relative">
              <video
                ref={(ref) => {
                  if (ref && streamRef.current) {
                    ref.srcObject = streamRef.current;
                  }
                }}
                className="w-full h-full object-cover"
                playsInline
                muted
                autoPlay
              />
              {!cameraReady && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                  <div className="text-center p-4">
                    <VideoOff className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                    <p className="text-gray-600">Camera feed will appear here</p>
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-4">
              <div className="flex items-center">
                {cameraReady ? (
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                ) : (
                  <Video className="h-5 w-5 text-gray-400 mr-2" />
                )}
                <span>Camera {cameraReady ? 'ready' : 'not detected'}</span>
              </div>
              <div className="flex items-center">
                {micReady ? (
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                ) : (
                  <Mic className="h-5 w-5 text-gray-400 mr-2" />
                )}
                <span>Microphone {micReady ? 'ready' : 'not detected'}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button 
              onClick={async () => {
                try {
                  const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true,
                  });
                  streamRef.current = stream;
                  setCameraReady(true);
                  setMicReady(true);
                } catch (err) {
                  console.error('Error accessing media devices:', err);
                  setError('Could not access camera or microphone. Please check your permissions.');
                }
              }}
              className="mr-2"
            >
              Allow Access
            </Button>
            <Button 
              onClick={handleProctoredComplete}
              disabled={!cameraReady || !micReady}
            >
              Start Test
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Check if we have questions before rendering test
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
      className={`min-h-screen bg-gray-50 p-4 md:p-8 transition-all duration-300 ${
        isFullscreen ? 'fixed inset-0 z-50 bg-white p-0' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh-4rem)]">
          {/* Question Panel */}
          <div className="md:w-1/3 bg-white rounded-lg shadow-sm border p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Question {currentQuestionIndex + 1} of {questions.length}
              </h2>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="capitalize">
                  {currentQuestion.difficulty}
                </Badge>
                <div className="text-sm font-medium text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                  {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                </div>
              </div>
            </div>
            
            <div className="prose prose-slate max-w-none">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {currentQuestion.question}
              </h3>
              <div className="mt-6 space-y-4">
                <Button
                  onClick={handleNext}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={currentQuestionIndex === questions.length - 1}
                >
                  Next Question
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                {currentQuestionIndex === questions.length - 1 && (
                  <Button
                    onClick={handleSubmit}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    Submit Interview
                    <Check className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Code Editor */}
          <div className="flex-1 flex flex-col bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="border-b border-gray-200 bg-gray-50 px-4 py-3 flex justify-between items-center">
              <div className="text-sm font-medium text-gray-700">
                {currentQuestion.type} - {currentQuestion.difficulty}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleFullscreen}
                className="text-gray-500 hover:text-gray-700"
              >
                {isFullscreen ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </Button>
            </div>
            <div className="flex-1 overflow-hidden">
              <MonacoEditor
                height="100%"
                defaultLanguage="javascript"
                theme="vs"
                value={code}
                onChange={handleEditorChange}
                onMount={handleEditorDidMount}
                options={{
                  minimap: { enabled: true },
                  scrollBeyondLastLine: false,
                  fontSize: 14,
                  wordWrap: 'on',
                  automaticLayout: true,
                }}
              />
            </div>
            <div className="border-t border-gray-200 bg-gray-50 px-4 py-3">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  {currentQuestionIndex + 1} of {questions.length} questions
                </div>
                <div className="w-1/2">
                  <Progress 
                    value={((currentQuestionIndex + 1) / questions.length) * 100} 
                    className="h-2"
                  />
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleNext}
                  >
                    {currentQuestionIndex === questions.length - 1 ? 'Submit' : 'Next'}
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewPage;
