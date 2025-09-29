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
import { InterviewType } from "@/constants";
import { ArrowRight, Info, Clock, Briefcase, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Form({ formData, onHandleInputChange }) {
    const [selectedTypes, setSelectedTypes] = useState([]);

    const toggleTypeSelection = (typeName) => {
        setSelectedTypes(prev => {
            if (prev.includes(typeName)) {
                return prev.filter(t => t !== typeName);
            } else {
                return [...prev, typeName];
            }
        });
        
        // Update form data with the new array of selected types
        onHandleInputChange('interviewTypes', selectedTypes.includes(typeName) 
            ? selectedTypes.filter(t => t !== typeName)
            : [...selectedTypes, typeName]
        );
    };

    return (
        <div className="max-w-4xl mx-auto p-10 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 mb-12 transition-all duration-300 hover:shadow-2xl">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Create New Interview</h1>
                <p className="text-gray-500 dark:text-gray-400">Fill in the details to create a personalized interview</p>
            </div>
            
            <div className="space-y-6">
                {/* Job Position */}
                <div className="space-y-2 group">
                    <div className="flex items-center gap-2">
                        <Briefcase className="h-5 w-5 text-gray-900 dark:text-gray-200" />
                        <label htmlFor="position" className="text-base font-medium">Job Position</label>
                    </div>
                    <Input 
                        id="position"
                        placeholder="e.g. Senior Frontend Developer" 
                        value={formData.position || ''}
                        onChange={(e) => onHandleInputChange('position', e.target.value)}
                    />
                </div>

                {/* Job Description */}
                <div className="space-y-2 group">
                    <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-gray-900 dark:text-gray-200" />
                        <label htmlFor="description" className="text-base font-medium">Job Description</label>
                    </div>
                    <Textarea 
                        id="description"
                        placeholder="Enter the job requirements, responsibilities, and any specific skills..." 
                        value={formData.description || ''}
                        onChange={(e) => onHandleInputChange('description', e.target.value)}
                    />
                </div>

                {/* Interview Duration */}
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

                {/* Interview Type */}
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
                </div>

                {/* Submit */}
                <div className="pt-6">
                    <Button 
                        className="w-full h-12 text-base font-medium"
                        size="lg"
                        onClick={() => console.log("Final Form Data:", formData)}
                    >
                        Generate Questions
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
