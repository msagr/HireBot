"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Clock, BarChart2, Loader2, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

type Report = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  questionCount: number;
  difficultyCount: {
    easy: number;
    medium: number;
    hard: number;
  };
};

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch('/api/reports');
        if (!response.ok) {
          throw new Error('Failed to fetch reports');
        }
        const data = await response.json();
        setReports(data.reports);
      } catch (err) {
        console.error('Error fetching reports:', err);
        setError('Failed to load reports. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const getDifficultyColor = (count: number, total: number) => {
    if (total === 0) return 'bg-gray-200 dark:bg-gray-700';
    const percentage = (count / total) * 100;
    if (percentage > 50) return 'bg-green-500';
    if (percentage > 25) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading reports...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-md flex items-start">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Error loading reports</h3>
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

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Interview Reports</h1>
          <p className="text-muted-foreground">View and analyze your interview performance</p>
        </div>
      </div>

      {reports.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
          <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">No reports yet</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">Complete an interview to see your reports here.</p>
          <Button asChild>
            <a href="/dashboard/create-interview">Start an Interview</a>
          </Button>
        </div>
      ) : (
        <div className="grid gap-6">
          {reports.map((report) => (
            <Card key={report.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{report.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {report.description || 'No description'}
                    </p>
                  </div>
                  <Badge variant="outline" className="flex items-center">
                    <Clock className="h-3.5 w-3.5 mr-1.5" />
                    {format(new Date(report.createdAt), 'MMM d, yyyy')}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium mb-2 flex items-center">
                      <BarChart2 className="h-4 w-4 mr-2" />
                      Question Statistics
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Total Questions</span>
                        <span className="font-medium">{report.questionCount}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Easy</span>
                        <span className="text-green-600 dark:text-green-400">
                          {report.difficultyCount.easy}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Medium</span>
                        <span className="text-yellow-600 dark:text-yellow-400">
                          {report.difficultyCount.medium}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Hard</span>
                        <span className="text-red-600 dark:text-red-400">
                          {report.difficultyCount.hard}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">Difficulty Distribution</h4>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className="flex h-full">
                        <div 
                          className={getDifficultyColor(report.difficultyCount.easy, report.questionCount)} 
                          style={{ width: `${(report.difficultyCount.easy / report.questionCount) * 100}%` }}
                          title={`${report.difficultyCount.easy} Easy`}
                        />
                        <div 
                          className={getDifficultyColor(report.difficultyCount.medium, report.questionCount)} 
                          style={{ width: `${(report.difficultyCount.medium / report.questionCount) * 100}%` }}
                          title={`${report.difficultyCount.medium} Medium`}
                        />
                        <div 
                          className={getDifficultyColor(report.difficultyCount.hard, report.questionCount)} 
                          style={{ width: `${(report.difficultyCount.hard / report.questionCount) * 100}%` }}
                          title={`${report.difficultyCount.hard} Hard`}
                        />
                      </div>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground mt-2">
                      <span>Easy</span>
                      <span>Medium</span>
                      <span>Hard</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <Button variant="outline" size="sm" asChild>
                  <a href={`/dashboard/reports/${report.id}`}>
                    View Details
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
