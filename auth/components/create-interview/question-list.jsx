import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Loader2, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut'
    }
  }
};

function QuestionList({ formData, onCreateLink, GoToNextStep }) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState(null);
  
  const handleFinish = async () => {
    try {
      setSaving(true);
      const newInterviewId = uuidv4();
      const response = await axios.post('/api/save-questions', {
        questions: questions.map(q => ({
          question: q.question,
          type: q.type || 'CODING',
          difficulty: q.difficulty || 'MEDIUM'
        })),
        title: formData?.position || 'Untitled Interview',
        description: formData?.description || ''
      });
      
      toast.success('Questions saved successfully!');
      
      // Only proceed to next step if onCreateLink was successful
      GoToNextStep();
    } catch (err) {
      console.error('Error saving questions:', err);
      toast.error(
        err.response?.data?.error || 'Failed to save questions. Please try again.'
      );
    }
  };

  const generateQuestionList = async (data) => {
    if (!data?.position || !data?.description) {
      setQuestions([]);
      return;
    }
    
    setLoading(true);
    setError(null);
    setQuestions([]);
  
    try {
      const response = await axios.post('/api/ai-model', data);

      // Parse the outer string first
      const parsed = JSON.parse(response.data.questions);

      // Access the inner 'questions' array
      const finalQuestions = parsed.questions || [];

      setQuestions(finalQuestions);
    } catch (err) {
      console.error('API Error:', err);
      setError('Failed to generate questions. Please try again.');
      toast.error('Server Error, Try Again!');
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  // Trigger whenever formData changes
  useEffect(() => {
    generateQuestionList(formData);
  }, [formData]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <h2 className="text-xl font-semibold mb-2">Generating Questions...</h2>
        <p className="text-muted-foreground">
          Our AI is crafting personalized questions based on your job position
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 text-destructive">
        <p>{error}</p>
      </div>
    );
  }
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold tracking-tight">Generated Questions</h2>
        <Button 
          onClick={handleFinish}
          disabled={questions.length === 0 || saving}
          className="gap-2"
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              Finish Setup
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div 
            key="loading"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={fadeIn}
            className="flex flex-col items-center justify-center p-12 space-y-4 text-center"
          >
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-muted-foreground">Generating questions...</p>
          </motion.div>
        ) : error ? (
          <motion.div 
            key="error"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={fadeIn}
            className="flex flex-col items-center p-6 space-y-4 text-center"
          >
            <div className="p-3 rounded-full bg-red-100 text-red-600">
              <AlertCircle className="h-8 w-8" />
            </div>
            <div>
              <h3 className="text-lg font-medium">Something went wrong</h3>
              <p className="text-muted-foreground">{error}</p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => generateQuestionList(formData)}
              className="mt-2"
            >
              Try Again
            </Button>
          </motion.div>
        ) : questions.length > 0 ? (
          <motion.div 
            key="questions"
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.05
                }
              }
            }}
            className="space-y-4"
          >
            {questions.map((question, index) => (
              <motion.div 
                key={index} 
                variants={fadeIn}
                className="transition-all hover:shadow-md"
              >
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-2">
                      <div className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary">
                        <span className="text-sm font-medium">{index + 1}</span>
                      </div>
                      <CardTitle className="text-lg">{question.question}</CardTitle>
                    </div>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            key="empty"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={fadeIn}
            className="flex flex-col items-center p-12 text-center space-y-4"
          >
            <div className="p-4 rounded-full bg-muted">
              <CheckCircle className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">No questions generated yet</h3>
            <p className="text-muted-foreground max-w-md">
              Fill out the form above and click "Generate Questions" to create interview questions.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default QuestionList;
