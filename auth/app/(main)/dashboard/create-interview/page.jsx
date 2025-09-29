"use client";

import { ArrowLeft } from 'lucide-react';
import React from 'react';
import { useRouter } from 'next/navigation';
import { Progress } from '@/components/ui/progress';
import { useState } from 'react';
import Form from '@/components/create-interview/form';

export default function CreateInterview() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        position: "",
        description: "",
        interviewDuration: "",
        interviewTypes: []
      });
    
    const onHandleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    }

    return (
        <div className="mt-10 px-10 md:px-24 lg:px-44 xl:px-56">
            <div className="flex gap-5 items-center">
                <ArrowLeft onClick={() => router.back()} />
                <h2 className="text-2xl font-bold">Create Interview</h2>
            </div>
            <Progress value={step*33.33} className="my-5" />
            <Form 
                formData={formData}
                onHandleInputChange={onHandleInputChange}
            />
        </div>
    )
}
