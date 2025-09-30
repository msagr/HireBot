import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ArrowRight, Briefcase, FileText, Sparkles, UserPlus, Target, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5 }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

const Form = ({ formData, onHandleInputChange, GoToNextStep }) => {
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      GoToNextStep();
      setIsLoading(false);
    }, 1000);
  };

  const toggleTypeSelection = (typeName) => {
    setSelectedTypes(prev => {
      if (prev.includes(typeName)) {
        return prev.filter(t => t !== typeName);
      } else {
        return [...prev, typeName];
      }
    });
    
    onHandleInputChange('interviewTypes', selectedTypes.includes(typeName) 
      ? selectedTypes.filter(t => t !== typeName)
      : [...selectedTypes, typeName]
    );
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="relative max-w-4xl mx-auto p-8 sm:p-10 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm rounded-3xl border border-border/50 shadow-2xl overflow-hidden group"
    >
      {/* Animated background elements */}
      <div className="absolute -inset-1 bg-gradient-to-r from-primary/5 via-blue-500/5 to-purple-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/5 rounded-full filter blur-3xl" />
      <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-blue-500/5 rounded-full filter blur-3xl" />
      
      <motion.div 
        variants={fadeIn}
        className="relative z-10 text-center mb-12"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
          <UserPlus className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80 mb-3">
          Create New Interview
        </h1>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Let's craft the perfect interview experience. Fill in the details below to get started.
        </p>
      </motion.div>
      
      <form onSubmit={handleSubmit} className="relative z-10 space-y-8">
        {/* Job Position */}
        <motion.div 
          variants={fadeIn}
          className="space-y-3 group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-600/10">
              <Briefcase className="h-5 w-5 text-blue-500" />
            </div>
            <label htmlFor="position" className="text-sm font-medium text-muted-foreground">
              Job Position
            </label>
          </div>
          <div className="relative">
            <Input 
              id="position"
              className="h-14 px-5 text-base bg-background/50 backdrop-blur-sm border-border/50 focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary/50 transition-all duration-300"
              placeholder="e.g. Senior Frontend Developer" 
              value={formData.position || ''}
              onChange={(e) => onHandleInputChange('position', e.target.value)}
              required
            />
            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          </div>
        </motion.div>

        {/* Job Description */}
        <motion.div 
          variants={fadeIn}
          className="space-y-3 group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/10 to-purple-600/10">
              <FileText className="h-5 w-5 text-purple-500" />
            </div>
            <label htmlFor="description" className="text-sm font-medium text-muted-foreground">
              Job Description
            </label>
          </div>
          <div className="relative">
            <Textarea 
              id="description"
              className="min-h-[120px] px-5 py-4 text-base bg-background/50 backdrop-blur-sm border-border/50 focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary/50 transition-all duration-300"
              placeholder="Enter the job requirements, responsibilities, and any specific skills..." 
              value={formData.description || ''}
              onChange={(e) => onHandleInputChange('description', e.target.value)}
              required
            />
            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          </div>
        </motion.div>

                {/* Interview Duration
                <div className="space-y-2 group">
                    <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-gray-900 dark:text-gray-200" />
                        <label className="text-base font-medium">Interview Duration</label>
                    </div>
                    <Select 
                        value={formData.interviewDuration || ''}
                        onValueChange={(value) => onHandleInputChange('interviewDuration', value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select interview duration" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="2 minutes">Quick Screen (2 minutes)</SelectItem>
                            <SelectItem value="30 minutes">Standard (30 minutes)</SelectItem>
                            <SelectItem value="45 minutes">In-depth (45 minutes)</SelectItem>
                            <SelectItem value="60 minutes">Comprehensive (1 hour)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Interview Type
                <div className="space-y-3 group">
                    <div className="flex items-center gap-2">
                        <Info className="h-5 w-5 text-gray-900 dark:text-gray-200" />
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {InterviewType.map((type, index) => (
                            <div 
                                key={index} 
                                onClick={() => toggleTypeSelection(type.name)}
                                className={cn(
                                    "flex items-center justify-center gap-2 p-3 border rounded-lg cursor-pointer transition-all",
                                    selectedTypes.includes(type.name)
                                        ? "border-primary bg-primary/5 ring-2 ring-primary/20" 
                                        : "hover:border-gray-300 hover:bg-gray-50"
                                )}>
                                <type.icon className={cn(
                                    "h-5 w-5",
                                    selectedTypes.includes(type.name) ? "text-primary" : "text-gray-500"
                                )} />
                                <span className="text-sm font-medium">{type.name}</span>
                            </div>
                        ))}
                    </div>
                </div> */}

        {/* Additional Fields
        <motion.div 
          variants={fadeIn}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6"
        >
          {/* Experience Level 
          <div className="space-y-3 group">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500/10 to-amber-600/10">
                <Zap className="h-5 w-5 text-amber-500" />
              </div>
              <label className="text-sm font-medium text-muted-foreground">
                Experience Level
              </label>
            </div>
            <Select 
              value={formData.experienceLevel || ''}
              onValueChange={(value) => onHandleInputChange('experienceLevel', value)}
            >
              <SelectTrigger className="h-14 bg-background/50 backdrop-blur-sm border-border/50 focus:ring-2 focus:ring-primary/20 focus:ring-offset-0">
                <SelectValue placeholder="Select experience level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="entry">Entry Level</SelectItem>
                <SelectItem value="mid">Mid Level</SelectItem>
                <SelectItem value="senior">Senior Level</SelectItem>
                <SelectItem value="lead">Lead/Staff</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Interview Type 
          <div className="space-y-3 group">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500/10 to-emerald-600/10">
                <Target className="h-5 w-5 text-emerald-500" />
              </div>
              <label className="text-sm font-medium text-muted-foreground">
                Interview Type
              </label>
            </div>
            <Select 
              value={formData.interviewType || ''}
              onValueChange={(value) => onHandleInputChange('interviewType', value)}
            >
              <SelectTrigger className="h-14 bg-background/50 backdrop-blur-sm border-border/50 focus:ring-2 focus:ring-primary/20 focus:ring-offset-0">
                <SelectValue placeholder="Select interview type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="technical">Technical</SelectItem>
                <SelectItem value="behavioral">Behavioral</SelectItem>
                <SelectItem value="system-design">System Design</SelectItem>
                <SelectItem value="case-study">Case Study</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </motion.div> */}

        {/* Submit Button */}
        <motion.div 
          variants={fadeIn}
          className="pt-4"
        >
          <Button 
            type="submit"
            className="w-full h-14 text-base font-medium relative overflow-hidden group/btn"
            size="lg"
            disabled={isLoading}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-blue-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10 flex items-center justify-center">
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  uestions
                  <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform duration-200" />
                </>
              )}
            </span>
          </Button>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            Our AI will analyze the job description and generate relevant questions
          </p>
        </motion.div>
      </form>
    </motion.div>
  );
};

export default Form;
