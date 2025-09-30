"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Code, FileText, Loader2, AlertCircle } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';

type Question = {
  id: string;
  question: string;
  type: string;
  difficulty: string;
  answer?: string;
  code?: string;
};

type ReportDetails = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  questions: Question[];
};

export default function ReportDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [report, setReport] = useState<ReportDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReportDetails = async () => {
      try {
        const response = await fetch(`/api/reports/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch report details');
        }
        const data = await response.json();
        setReport(data.report);
      } catch (err) {
        console.error('Error fetching report details:', err);
        setError('Failed to load report details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchReportDetails();
    }
  }, [id]);

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Easy</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">Medium</Badge>;
      case 'hard':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">Hard</Badge>;
      default:
        return <Badge>{difficulty}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading report details...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-md flex items-start">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Error loading report</h3>
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            <Button 
              variant="outline" 
              className="mt-2"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="p-6">
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-md flex items-start">
          <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Report not found</h3>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">The requested report could not be found.</p>
            <Button 
              variant="outline" 
              className="mt-2"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Reports
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mr-4"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{report.title}</h1>
          <p className="text-muted-foreground">
            {report.description || 'No description provided'}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {report.questions.map((question, index) => (
          <Card key={question.id} className="overflow-hidden">
            <CardHeader className="bg-gray-50 dark:bg-gray-800/50 border-b">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm text-muted-foreground">Question {index + 1}</span>
                    {getDifficultyBadge(question.difficulty)}
                    <Badge variant="outline" className="ml-1">
                      {question.type}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{question.question}</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {question.type.toLowerCase() === 'coding' ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2 flex items-center">
                      <Code className="h-4 w-4 mr-2" />
                      Your Solution
                    </h4>
                    {question.code ? (
                      <div className="rounded-md overflow-hidden border dark:border-gray-700">
                        <SyntaxHighlighter
                          language="javascript"
                          style={atomDark}
                          customStyle={{
                            margin: 0,
                            borderRadius: 0,
                            fontSize: '0.875rem',
                            lineHeight: '1.5',
                          }}
                          showLineNumbers
                        >
                          {question.code}
                        </SyntaxHighlighter>
                      </div>
                    ) : (
                      <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-md text-sm text-muted-foreground">
                        No code submitted for this question.
                      </div>
                    )}
                  </div>
                  {question.answer && (
                    <div>
                      <h4 className="text-sm font-medium mb-2 flex items-center">
                        <FileText className="h-4 w-4 mr-2" />
                        Explanation
                      </h4>
                      <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-md text-sm whitespace-pre-line">
                        {question.answer}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <h4 className="text-sm font-medium mb-2 flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    Your Answer
                  </h4>
                  {question.answer ? (
                    <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-md whitespace-pre-line">
                      {question.answer}
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      No answer provided for this question.
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
